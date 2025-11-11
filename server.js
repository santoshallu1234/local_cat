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
  apiKey: process.env.GROQ_API_KEY, // Use environment variable only
});

const promptTemplate = new PromptTemplate({
  template: "if any mcq questions find in the passage then only give the answers back : {context}\nQuestion: {question}",
  inputVariables: ["context", "question"],
});

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
//upload.single('screenshot'),
app.post('/solve-mcqs',  async (req, res) => {
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
        ["system", "You are an AI assistant that finds MCQ questions, programming questions, or other academic questions in text and provides detailed answers. For programming questions, provide complete code solutions with explanations. For MCQ questions, provide ONLY the answers  without any explanations or theory. For other questions, provide concise and accurate answers. If no relevant questions are found, respond with 'No relevant questions found.'"],
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
      aiAnswers: aiAnswers
    };
    
    console.log("Received and saved base64 image data");
    console.log(aiAnswers)
    
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
      error: 'Failed to save base64 image',
      details: error.message 
    });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'marketing', 'index.html'));
});

app.listen(port, () => {
  console.log(`MCQ Solver Server is running on port ${port}`);
});