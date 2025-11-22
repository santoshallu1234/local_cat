import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { createWorker } from 'tesseract.js';
import { ChatGroq } from "@langchain/groq";
import { createClient } from 'redis';

// Load environment variables
dotenv.config();

// Token-based model selection map (fallback when Redis is not available)
// Structure: { token: { model: 'model-name', count: number } }
const tokenModelMap = new Map();

// In-memory logs storage (in production, this should be replaced with a proper database)
// Structure: { token: [logEntry1, logEntry2, ...] }
const tokenLogs = new Map();

// Redis client initialization
let redisClient = null;
let useRedis = false;

// Try to initialize Redis client with environment variables
try {
  redisClient = createClient({
    username: process.env.REDIS_USERNAME || 'default',
    password: process.env.REDIS_PASSWORD,
    socket: {
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT || 6379
    }
  });

  redisClient.on('error', (err) => {
    console.log('Redis Client Error (continuing with fallback)', err);
    useRedis = false;
  });

  // Attempt to connect to Redis
  await redisClient.connect();
  useRedis = true;
  console.log('Successfully connected to Redis');
} catch (error) {
  console.log('Failed to connect to Redis, using in-memory Map as fallback');
  useRedis = false;
}

// Function to get model based on token
async function getModelForToken(token) {
  // If no token is provided, use the default llama model
  if (!token) {
    return "llama-3.3-70b-versatile";
  }
  
  if (useRedis && redisClient) {
    try {
      const tokenData = await redisClient.get(token);
      if (tokenData) {
        const parsedData = JSON.parse(tokenData);
        if (parsedData.count > 0) {
          // Decrease count by one
          parsedData.count -= 1;
          await redisClient.set(token, JSON.stringify(parsedData));
          return parsedData.model;
        }
      }
    } catch (error) {
      console.error('Redis error:', error);
    }
  } else {
    // Fallback to in-memory Map
    if (tokenModelMap.has(token)) {
      const tokenData = tokenModelMap.get(token);
      if (tokenData.count > 0) {
        // Decrease count by one
        tokenData.count -= 1;
        tokenModelMap.set(token, tokenData);
        return tokenData.model;
      }
    }
  }
  
  // If token is provided but not found or count is zero, use default llama model
  return "llama-3.3-70b-versatile";
}

// Function to log token usage
function logTokenUsage(token, logEntry) {
  if (!token) return;
  
  // Add timestamp to log entry
  const logWithTimestamp = {
    ...logEntry,
    timestamp: new Date().toISOString()
  };
  
  if (useRedis && redisClient) {
    // In a production environment, you might want to store logs in a separate Redis key
    // For now, we'll just keep them in memory
    if (!tokenLogs.has(token)) {
      tokenLogs.set(token, []);
    }
    tokenLogs.get(token).push(logWithTimestamp);
  } else {
    // Fallback to in-memory Map
    if (!tokenLogs.has(token)) {
      tokenLogs.set(token, []);
    }
    tokenLogs.get(token).push(logWithTimestamp);
  }
}

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve index.html explicitly
app.get('/', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'marketing', 'index.html'));
});

// Static file serving
app.use('/', express.static(path.join(process.cwd(), 'marketing')));
app.use('/fonts', express.static(path.join(process.cwd(), 'fonts')));

// Function to create Tesseract worker with environment-specific config
const createTesseractWorker = async () => {
  // For Vercel deployment, use simplified configuration
  // For local development, use default configuration
  const isVercel = !!process.env.VERCEL;
  
  if (isVercel) {
    // Use minimal configuration for Vercel to avoid path issues
    return await createWorker('eng', 1, {
      cacheMethod: 'none',
      workerBlobURL: false,
    });
  } else {
    return await createWorker('eng');
  }
};

// Endpoint to handle base64 image data directly (no file system operations)
app.post('/solve-mcqs-base64', async (req, res) => {
  try {
    const { image } = req.body;
    
    if (!image) {
      return res.status(400).json({ 
        success: false, 
        error: 'Image data is required' 
      });
    }
    
    // Get token from premium-token header
    const token = req.headers['premium-token'];
    
    // Determine model based on token
    const modelName = await getModelForToken(token);
    
    // Create model instance
    const model = new ChatGroq({
      model: modelName,
      temperature: 0.7,
      apiKey: process.env.GROQ_API_KEY, // Use environment variable only
    });
    
    // If image is already a data URL, extract the base64 data
    // Otherwise, assume it's base64 data
    let base64Data;
    if (image.startsWith('data:image')) {
      base64Data = image.split(',')[1];
    } else {
      base64Data = image;
    }
    
    // Convert base64 to buffer (no file saving needed)
    const imageBuffer = Buffer.from(base64Data, 'base64');
    
    // Extract text from the image buffer using Tesseract.js
    const worker = await createTesseractWorker();
    
    const { data: { text } } = await worker.recognize(imageBuffer);
    await worker.terminate();
    
    // Use AI to find and answer MCQ questions if any
    let aiAnswers = null;
    try {
      const response = await model.invoke([
        ["system", "You are an AI assistant that finds MCQ questions, programming questions, or other academic questions in text and provides detailed answers. For programming questions, provide complete code solutions with explanations. For MCQ questions, provide ONLY the answers without any explanations or theory. For other questions, provide concise and accurate answers. If no relevant questions are found, respond with 'No relevant questions found.'"],
        ["user", text]
      ]);
      
      if (response && response.content) {
        aiAnswers = response.content;
      }
    } catch (aiError) {
      console.error('AI processing error:', aiError);
      aiAnswers = "AI processing failed: " + aiError.message;
    }
    
    // Prepare the response
    const responseJson = {
      success: true,
      message: 'Text extracted successfully from base64 image',
      extractedText: text,
      aiAnswers: aiAnswers,
      modelUsed: modelName // Include model info in response
    };
    
    // Log token usage
    logTokenUsage(token, {
      modelUsed: modelName,
      extractedText: text,
      aiAnswers: aiAnswers
    });
    
    // Send the response
    res.json(responseJson);
    
  } catch (error) {
    console.error('Error processing base64 image:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to process base64 image',
      details: error.message 
    });
  }
});

// Endpoint to add/update token model mapping (for administration)
app.post('/admin/token-model', async (req, res) => {
  try {
    const { token, model, count } = req.body;
    
    if (!token || !model || count === undefined) {
      return res.status(400).json({ 
        success: false, 
        error: 'Token, model, and count are required' 
      });
    }
    
    if (useRedis && redisClient) {
      // Store token data in Redis
      await redisClient.set(token, JSON.stringify({ model, count: parseInt(count) }));
    } else {
      // Store token data in memory
      tokenModelMap.set(token, { model, count: parseInt(count) });
    }
    
    res.json({ 
      success: true, 
      message: 'Token model mapping updated successfully' 
    });
  } catch (error) {
    console.error('Error updating token model mapping:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to update token model mapping: ' + error.message
    });
  }
});

// New endpoint to add a premium token with ChatGPT model
app.post('/admin/add-premium-token', async (req, res) => {
  try {
    const { token, count } = req.body;
    
    if (!token || count === undefined) {
      return res.status(400).json({ 
        success: false, 
        error: 'Token and count are required' 
      });
    }
    
    const model = "openai/gpt-oss-20b";
    
    if (useRedis && redisClient) {
      // Store token data in Redis with ChatGPT model
      await redisClient.set(token, JSON.stringify({ model, count: parseInt(count) }));
    } else {
      // Store token data in memory
      tokenModelMap.set(token, { model, count: parseInt(count) });
    }
    
    res.json({ 
      success: true, 
      message: 'Premium token with ChatGPT model added successfully',
      token,
      model,
      count: parseInt(count)
    });
  } catch (error) {
    console.error('Error adding premium token:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to add premium token: ' + error.message
    });
  }
});

// Endpoint to get token model mapping info (for administration)
app.get('/admin/token-model/:token', async (req, res) => {
  try {
    const { token } = req.params;
    
    let tokenData = null;
    
    if (useRedis && redisClient) {
      // Retrieve token data from Redis
      tokenData = await redisClient.get(token);
    } else {
      // Retrieve token data from memory
      if (tokenModelMap.has(token)) {
        tokenData = JSON.stringify(tokenModelMap.get(token));
      }
    }
    
    if (!tokenData) {
      return res.status(404).json({ 
        success: false, 
        error: 'Token not found' 
      });
    }
    
    const parsedData = useRedis ? JSON.parse(tokenData) : JSON.parse(tokenData);
    
    res.json({ 
      success: true, 
      token,
      model: parsedData.model,
      count: parsedData.count
    });
  } catch (error) {
    console.error('Error retrieving token model mapping:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to retrieve token model mapping: ' + error.message
    });
  }
});

// Endpoint to get logs for a premium token
app.get('/getlogs/:token', async (req, res) => {
  try {
    const { token } = req.params;
    
    // Validate token exists
    let tokenData = null;
    
    if (useRedis && redisClient) {
      // Retrieve token data from Redis
      tokenData = await redisClient.get(token);
    } else {
      // Retrieve token data from memory
      if (tokenModelMap.has(token)) {
        tokenData = JSON.stringify(tokenModelMap.get(token));
      }
    }
    
    if (!tokenData) {
      return res.status(404).json({ 
        success: false, 
        error: 'Token not found' 
      });
    }
    
    // Get logs for this token
    let logs = [];
    if (tokenLogs.has(token)) {
      logs = tokenLogs.get(token);
    }
    
    res.json({ 
      success: true, 
      logs: logs
    });
  } catch (error) {
    console.error('Error retrieving token logs:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to retrieve token logs: ' + error.message
    });
  }
});

// Serve index.html explicitly (moved before static middleware to ensure proper routing)
app.get('/', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'marketing', 'index.html'));
});

// Vercel serverless function handler
export default (req, res) => {
  // Apply CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, premium-token');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  // Pass the request to the express app
  return app(req, res);
};