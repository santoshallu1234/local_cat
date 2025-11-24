const screenshot = require('screenshot-desktop');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Server URL - same as the Chrome extension
const SERVER_URL = 'http://localhost:3000/solve-mcqs-base64';

/**
 * Capture screen and send to server for processing
 */
async function captureAndProcess() {
  try {
    console.log('Starting screen capture...');
    
    // Capture the entire screen
    const imgBuffer = await screenshot({ format: 'png' });
    
    // Convert to base64
    const base64Image = imgBuffer.toString('base64');
    
    console.log('Sending image to server...');
    
    // Send to server
    const response = await axios.post(SERVER_URL, {
      image: base64Image
    }, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 30000 // 30 second timeout
    });
    
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

module.exports = captureAndProcess;