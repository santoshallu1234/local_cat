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

// Load environment variables
dotenv.config();

const model = new ChatGroq({
  model: "llama-3.3-70b-versatile",  // "openai/gpt-oss-20b", //" // Updated to a newer model
  temperature: 0.7,
  apiKey: "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",
});

const promptTemplate = new PromptTemplate({
  template: "if any mcq questions find in the passage then only give the answers back : {context}\nQuestion: {question}",
  inputVariables: ["context", "question"],
});

// Create upload directory if it doesn't exist
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Use RENDER_UPLOAD_DIR environment variable if set, otherwise default to 'uploads'
const uploadDir = process.env.RENDER_UPLOAD_DIR || path.join(__dirname, 'uploads');
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

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/uploads', express.static(uploadDir)); // Serve uploaded files

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

// Route to handle screenshot file uploads
app.post('/solve-mcqs', upload.single('screenshot'), async (req, res) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ error: 'Screenshot file is required' });
    }
    
    // Extract text from the image using Tesseract.js
    const worker = await createTesseractWorker();
    
    const { data: { text } } = await worker.recognize(req.file.path);
    await worker.terminate();
    
    // Save the extracted text to a file
    const textFilename = req.file.filename.replace(path.extname(req.file.filename), '.txt');
    const textFilePath = path.join(uploadDir, textFilename);
    fs.writeFileSync(textFilePath, text);
    
    // Use AI to find and answer MCQ questions if any
    let aiAnswers = null;
    try {
      const response = await model.invoke([
        ["system", "You are an AI assistant that finds MCQ questions, programming questions, or other academic questions in text and provides detailed answers. For programming questions, provide complete code solutions with explanations. For MCQ questions, provide ONLY the answers in the format '1. A, 2. B, 3. C' without any explanations or theory. For other questions, provide concise and accurate answers. If no relevant questions are found, respond with 'No relevant questions found.'"],
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
      fileId: req.file.filename,
      filePath: req.file.path,
      extractedText: text,
      textFileId: textFilename,
      textFilePath: textFilePath,
      aiAnswers: aiAnswers
    };
    
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
      error: 'Failed to process file',
      details: error.message 
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
      aiAnswers: aiAnswers
    };
    
    console.log("Processed base64 image data");
    console.log(aiAnswers)
    
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
    message: 'MCQ Screenshot Server is running',
    endpoints: {
      'POST /solve-mcqs': 'Submit screenshot to save and extract text',
      'POST /solve-mcqs-base64': 'Submit base64 image data to save and extract text',
      'GET /uploads/:filename': 'Access uploaded files'
    }
  });
});

app.listen(port, () => {
  console.log(`MCQ Solver Server is running on port ${port}`);
});