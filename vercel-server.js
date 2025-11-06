import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { createWorker } from 'tesseract.js';
import { ChatGroq } from "@langchain/groq";

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Initialize the model
const model = new ChatGroq({
  model: "llama-3.3-70b-versatile",
  temperature: 0.7,
  apiKey: process.env.GROQ_API_KEY || "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",
});

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
    // Configure Tesseract.js for Vercel environment
    const worker = await createWorker('eng', 1, {
      workerPath: 'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/worker.min.js',
      langPath: 'https://tessdata.projectnaptha.com/4.0.0',
      corePath: 'https://cdn.jsdelivr.net/npm/tesseract.js-core@5/tesseract-core.wasm.js',
    });
    
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
      aiAnswers: aiAnswers
    };
    
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

app.get('/', (req, res) => {
  res.json({ 
    message: 'MCQ Screenshot Server is running on Vercel',
    endpoints: {
      'POST /solve-mcqs-base64': 'Submit base64 image data to extract text and solve MCQs'
    }
  });
});

// Vercel serverless function handler
export default (req, res) => {
  // Apply CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  // Pass the request to the express app
  return app(req, res);
};