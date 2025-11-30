import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createWorker } from 'tesseract.js';
import { ChatGroq } from "@langchain/groq";
import { PromptTemplate } from "@langchain/core/prompts";
import { createClient } from 'redis';
import { GoogleGenerativeAI } from "@google/generative-ai";

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

// Create upload directory if it doesn't exist
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'screenshot-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Function to create Tesseract worker with appropriate configuration
const createTesseractWorker = async () => {
  // Check if we're in a serverless environment
  const isServerless = !!process.env.VERCEL || !!process.env.NOW_REGION;
  
  if (isServerless) {
    // Use configuration that works in serverless environments
    return await createWorker('eng', 1, {
      cacheMethod: 'none',
      workerBlobURL: false,
    });
  } else {
    // Use default configuration for local environments
    return await createWorker('eng');
  }
};

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/uploads', express.static(uploadDir)); // Serve uploaded files
app.use('/marketing', express.static(path.join(__dirname, 'marketing'))); // Serve marketing pages
app.use('/fonts', express.static(path.join(__dirname, 'fonts'))); // Serve fonts
app.use('/', express.static(path.join(__dirname, 'marketing'))); // Serve marketing pages as homepage

// Route to handle screenshot file uploads
app.post('/solve-mcqs', upload.single('screenshot'), async (req, res) => {
  const endpointStartTime = Date.now();
  console.log('=== /solve-mcqs Endpoint Timing ===');
  
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ error: 'Screenshot file is required' });
    }
    
    // Get token from premium-token header
    const token = req.headers['premium-token'];
    
    // Determine model based on token
    const modelName = await getModelForToken(token);
    
    // Create model instance
    const model = new ChatGroq({
      model: modelName,
      temperature: 0.7,
      apiKey: process.env.GROQ_API_KEY,
    });
    
    // Extract text from the image using Tesseract.js
    const ocrStartTime = Date.now();
    const worker = await createTesseractWorker();
    
    const { data: { text } } = await worker.recognize(req.file.path);
    await worker.terminate();
    const ocrEndTime = Date.now();
    console.log(`OCR processing time: ${ocrEndTime - ocrStartTime}ms`);
    
    // Save the extracted text to a file
    const textFilename = req.file.filename.replace(path.extname(req.file.filename), '.txt');
    const textFilePath = path.join(uploadDir, textFilename);
    fs.writeFileSync(textFilePath, text);
    
    // Use AI to find and answer MCQ questions if any
    let aiAnswers = null;
    try {
      console.log('Calling Groq API...');
      const aiCallStartTime = Date.now();
      const response = await model.invoke([
        ["system", "You are an AI assistant that finds MCQ questions, programming questions, or other academic questions in text and provides detailed answers. For programming questions, provide ONLY the code solution without any explanations or additional text. For MCQ questions, provide ONLY the answers in the format '1. A, 2. B, 3. C' without any explanations or theory. For other questions, provide concise and accurate answers. If no relevant questions are found, respond with 'No relevant questions found.'"],
        ["user", text]
      ]);
      const aiCallEndTime = Date.now();
      console.log(`Groq API call time: ${aiCallEndTime - aiCallStartTime}ms`);
      
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
      message: 'File saved and text extracted successfully',
      fileId: req.file.filename,
      filePath: req.file.path,
      extractedText: text,
      textFileId: textFilename,
      textFilePath: textFilePath,
      aiAnswers: aiAnswers,
      modelUsed: modelName // Include model info in response
    };
    
    // Log token usage
    logTokenUsage(token, {
      modelUsed: modelName,
      extractedText: text,
      aiAnswers: aiAnswers,
      fileId: req.file.filename,
      filePath: req.file.path
    });
    
    const endpointEndTime = Date.now();
    console.log(`Total /solve-mcqs endpoint time: ${endpointEndTime - endpointStartTime}ms`);
    console.log('=====================================');
    
    // Send the response
    res.json(responseJson);
    
    // Delete the uploaded image file after sending the response
    try {
      fs.unlinkSync(req.file.path);
      console.log('Deleted uploaded image file:', req.file.path);
    } catch (deleteError) {
      console.error('Error deleting image file:', deleteError);
    }
    
  } catch (error) {
    console.error('Error processing file:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to process file: ' + error.message
    });
  }
});

// New endpoint to handle base64 image data directly
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
      temperature: 0.5,
      apiKey: process.env.GROQ_API_KEY,
    });
    
    // Generate a unique filename
    const filename = `screenshot-${Date.now()}-${Math.round(Math.random() * 1E9)}.png`;
    const filePath = path.join(uploadDir, filename);
    
    // If image is already a data URL, extract the base64 data
    // Otherwise, assume it's base64 data
    let base64Data;
    if (image.startsWith('data:image')) {
      base64Data = image.split(',')[1];
    } else {
      base64Data = image;
    }
    
    // Save the image file
    fs.writeFileSync(filePath, base64Data, "base64");
    
    // Extract text from the image using Tesseract.js
    const worker = await createTesseractWorker();
    
    const { data: { text } } = await worker.recognize(filePath);
    await worker.terminate();
    
    // Save the extracted text to a file
    // const textFilename = filename.replace(path.extname(filename), '.txt');
    // const textFilePath = path.join(uploadDir, textFilename);
    // fs.writeFileSync(textFilePath, text);
    
    // Use AI to find and answer MCQ questions if any
    let aiAnswers = null;
    try {
      const response = await model.invoke([
        ["system", "You are an AI assistant that finds MCQ questions, programming questions, or other academic questions in text and provides detailed answers. For programming questions, provide ONLY the code solution without any explanations or additional text. Format code to work with modern code editors that have smart indentation features - each new line should start at the appropriate indentation level. For MCQ questions, provide ONLY the answers in the format '1. A, 2. B, 3. C' without any explanations or theory. For other questions, provide concise and accurate answers. If no relevant questions are found, respond with 'No relevant questions found.'"],
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
      message: 'File saved and text extracted successfully',
      fileId: filename,
      filePath: filePath,
      extractedText: text,
      aiAnswers: aiAnswers,
      modelUsed: modelName // Include model info in response
    };
    
    console.log("Received and saved base64 image data");
    console.log(aiAnswers)
    
    // Log token usage
    logTokenUsage(token, {
      modelUsed: modelName,
      extractedText: text,
      aiAnswers: aiAnswers,
      fileId: filename,
      filePath: filePath
    });
    
    // Send the response
    res.json(responseJson);
    
    // Delete the uploaded image file after sending the response
    // try {
    //   fs.unlinkSync(filePath);
    //   console.log('Deleted uploaded image file:', filePath);
    // } catch (deleteError) {
    //   console.error('Error deleting image file:', deleteError);
    // }   
    
  } catch (error) {
    console.error('Error saving base64 image:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to save base64 image: ' + error.message
    });
  }
});

// New endpoint to handle base64 image data with Google Gemini AI
app.post('/solve-mcqs-base64-Gemini', async (req, res) => {
  const endpointStartTime = Date.now();
  console.log('=== /solve-mcqs-base64-Gemini Endpoint Timing ===');
  
  try {
    const { image } = req.body;
    
    if (!image) {
      return res.status(400).json({ 
        success: false, 
        error: 'Image data is required' 
      });
    }
    
    // Get token from premium-token header (required for this endpoint)
    const token = req.headers['premium-token'];
    
    // Check if token is provided
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        error: 'Premium token is required for this endpoint' 
      });
    }
    
    // Validate token exists and has remaining uses
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
    
    // If token not found or no remaining uses, deny access
    if (!tokenData) {
      return res.status(401).json({ 
        success: false, 
        error: 'Invalid or expired premium token' 
      });
    }
    
    const parsedData = useRedis ? JSON.parse(tokenData) : JSON.parse(tokenData);
    if (parsedData.count <= 0) {
      return res.status(401).json({ 
        success: false, 
        error: 'Premium token has no remaining uses' 
      });
    }
    
    // Create Google Generative AI instance
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY);
    
    // Get the generative model (using a valid model name)
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    // If image is already a data URL, extract the base64 data
    // Otherwise, assume it's base64 data
    let base64Data;
    if (image.startsWith('data:image')) {
      base64Data = image.split(',')[1];
    } else {
      base64Data = image;
    }
    
    // Prepare contents for Gemini API
    const contents = [
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: base64Data,
        },
      },
      { text: "Find any MCQ questions in this image and provide the answers in the format '1. A, 2. B, 3. C 4. E' without any explanations or theory. If no MCQ questions are found, respond with 'No MCQ questions found.'" },
    ];
    
    // Use AI to find and answer MCQ questions if any
    let aiAnswers = null;
    try {
      console.log('Calling Gemini API...');
      const aiCallStartTime = Date.now();
      const result = await model.generateContent(contents);
      const aiCallEndTime = Date.now();
      console.log(`Gemini API call time: ${aiCallEndTime - aiCallStartTime}ms`);
      
      const response = result.response;
      if (response && response.text) {
        aiAnswers = response.text();
      }
    } catch (aiError) {
      console.error('AI processing error:', aiError);
      aiAnswers = "AI processing failed: " + aiError.message;
    }
    
    // Prepare the response
    const responseJson = {
      success: true,
      message: 'Image processed successfully',
      aiAnswers: aiAnswers,
      modelUsed: "gemini-2.5-flash"
    };
    
    console.log("Processed base64 image with Google Gemini AI");
    console.log(aiAnswers);
    
    // Log token usage
    logTokenUsage(token, {
      modelUsed: "gemini-2.5-flash",
      aiAnswers: aiAnswers
    });
    
    const endpointEndTime = Date.now();
    console.log(`Total /solve-mcqs-base64-Gemini endpoint time: ${endpointEndTime - endpointStartTime}ms`);
    console.log('===================================================');
    
    // Send the response
    res.json(responseJson);
    
  } catch (error) {
    console.error('Error processing base64 image with Gemini:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to process image with Gemini: ' + error.message
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

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'marketing', 'index.html'));
});

app.get('/logs.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'marketing', 'logs.html'));
});

app.listen(port, () => {
  console.log(`MCQ Solver Server is running on port ${port}`);
  console.log(`Redis status: ${useRedis ? 'Connected' : 'Fallback to in-memory Map'}`);
});