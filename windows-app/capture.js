const screenshot = require('screenshot-desktop');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Server URL - same as the Chrome extension
//const SERVER_URL = 'https://local-cat.vercel.app/solve-mcqs-base64';
const SERVER_URL = 'http://localhost:3000/solve-mcqs-base64';

// Server URL for Gemini API
const GEMINI_SERVER_URL = 'http://localhost:3000/solve-mcqs-base64-Gemini';

/**
 * Capture screen and send to server for processing
 */
async function captureAndProcess() {
  const funcStartTime = Date.now();
  console.log('=== CaptureAndProcess Timing ===');
  
  try {
    console.log('Starting screen capture...');
    
    // Time screen capture
    const captureStartTime = Date.now();
    // Capture the entire screen
    const imgBuffer = await screenshot({ format: 'png' });
    const captureEndTime = Date.now();
    console.log(`Screen capture time: ${captureEndTime - captureStartTime}ms`);
    
    // Convert to base64
    const base64Image = imgBuffer.toString('base64');
    
    console.log('Sending image to server...');
    
    // Time API call
    const apiCallStartTime = Date.now();
    // Send to server with premium token header
    const response = await axios.post(SERVER_URL, {
      image: base64Image
    }, {
      headers: {
        'Content-Type': 'application/json',
        'premium-token': 'my-premium-token-123'
      },
      timeout: 30000 // 30 second timeout
    });
    const apiCallEndTime = Date.now();
    console.log(`API call time: ${apiCallEndTime - apiCallStartTime}ms`);
    
    console.log('Server response received');
    
    if (response.data && response.data.success) {
      // Prefer AI answers if available, otherwise use extracted text
      let resultText = '';
      
      if (response.data.aiAnswers && 
          response.data.aiAnswers !== 'No AI answers available' && 
          response.data.aiAnswers !== 'No relevant questions found.') {
        resultText = response.data.aiAnswers;
      } else if (response.data.extractedText) {
        resultText = response.data.extractedText;
      } else {
        resultText = 'No content available';
      }
      
      const funcEndTime = Date.now();
      console.log(`Total captureAndProcess time: ${funcEndTime - funcStartTime}ms`);
      console.log('================================');
      
      return {
        success: true,
        text: resultText,
        aiAnswers: response.data.aiAnswers,
        extractedText: response.data.extractedText
      };
    } else {
      throw new Error(response.data.error || 'Server processing failed');
    }
  } catch (error) {
    console.error('Error in capture and process:', error.message);
    throw error;
  }
}

/**
 * Capture screen and send to Gemini API for processing
 */
async function captureAndProcessWithGemini() {
  const funcStartTime = Date.now();
  console.log('=== CaptureAndProcessWithGemini Timing ===');
  
  try {
    console.log('Starting screen capture for Gemini processing...');
    
    // Time screen capture
    const captureStartTime = Date.now();
    // Capture the entire screen
    const imgBuffer = await screenshot({ format: 'png' });
    const captureEndTime = Date.now();
    console.log(`Screen capture time: ${captureEndTime - captureStartTime}ms`);
    
    // Convert to base64
    const base64Image = imgBuffer.toString('base64');
    
    console.log('Sending image to Gemini API...');
    
    // Time API call
    const apiCallStartTime = Date.now();
    // Send to Gemini API endpoint with premium token header
    const response = await axios.post(GEMINI_SERVER_URL, {
      image: base64Image
    }, {
      headers: {
        'Content-Type': 'application/json',
        'premium-token': 'my-premium-token-123'
      },
      timeout: 30000 // 30 second timeout
    });
    const apiCallEndTime = Date.now();
    console.log(`API call time: ${apiCallEndTime - apiCallStartTime}ms`);
    
    console.log('Gemini API response received');
    
    if (response.data && response.data.success) {
      // Get AI answers
      let resultText = '';
      
      if (response.data.aiAnswers && 
          response.data.aiAnswers !== 'No AI answers available' && 
          response.data.aiAnswers !== 'No relevant questions found.' &&
          response.data.aiAnswers !== 'No MCQ questions found.') {
        resultText = response.data.aiAnswers;
      } else {
        resultText = 'No MCQ questions found in the image';
      }
      
      const funcEndTime = Date.now();
      console.log(`Total captureAndProcessWithGemini time: ${funcEndTime - funcStartTime}ms`);
      console.log('========================================');
      
      return {
        success: true,
        text: resultText,
        aiAnswers: response.data.aiAnswers
      };
    } else {
      throw new Error(response.data.error || 'Gemini API processing failed');
    }
  } catch (error) {
    console.error('Error in Gemini capture and process:', error.message);
    throw error;
  }
}

module.exports = {
  captureAndProcess,
  captureAndProcessWithGemini
};