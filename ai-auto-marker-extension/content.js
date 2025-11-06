// Content script to automatically detect and fill MCQs

// Variable to track if processing is already running
let isProcessing = false;

// Function to automatically process MCQs
async function processMCQs() {
  // Prevent multiple processing runs simultaneously
  if (isProcessing) {
    return;
  }
  
  isProcessing = true;
  
  try {
    // Send message to background script to capture and process the page
    chrome.runtime.sendMessage({ type: 'PROCESS_MCQS' }, (response) => {
      isProcessing = false;
      
      if (chrome.runtime.lastError) {
        console.error('Error sending process message:', chrome.runtime.lastError);
        return;
      }
      
      if (response && response.success) {
        console.log('MCQs processed successfully');
        // Automatically fill the answers if provided
        if (response.answers) {
          fillMCQAnswers(response.answers);
        }
      } else {
        console.error('Error processing MCQs:', response ? response.error : 'Unknown error');
      }
    });
  } catch (error) {
    isProcessing = false;
    console.error('Error in processMCQs:', error);
  }
}

// Function to fill MCQ answers automatically
function fillMCQAnswers(answers) {
  console.log('Filling MCQ answers:', answers);
  
  // Try different methods to find and fill answer inputs
  try {
    // Method 1: Look for radio buttons or checkboxes with common patterns
    const inputElements = document.querySelectorAll('input[type="radio"], input[type="checkbox"]');
    
    // Method 2: Look for select dropdowns
    const selectElements = document.querySelectorAll('select');
    
    // Method 3: Look for clickable elements that might be answers
    const clickableElements = document.querySelectorAll('div, span, li, td');
    
    // Parse answers (assuming they're in a format like "1. A, 2. B, 3. C")
    const answerLines = answers.split('\n');
    
    answerLines.forEach(line => {
      // Extract question number and answer
      const match = line.match(/^(\d+)\.\s*([A-Z])$/i);
      if (match) {
        const questionNumber = match[1];
        const answerLetter = match[2].toUpperCase();
        
        // Try to find and select the corresponding answer
        selectAnswer(questionNumber, answerLetter);
      }
    });
  } catch (error) {
    console.error('Error filling MCQ answers:', error);
  }
}

// Function to select an answer for a specific question
function selectAnswer(questionNumber, answerLetter) {
  console.log(`Selecting answer ${answerLetter} for question ${questionNumber}`);
  
  try {
    // Look for elements near the question number
    const questionElements = document.querySelectorAll('*');
    
    for (let i = 0; i < questionElements.length; i++) {
      const element = questionElements[i];
      const text = element.textContent || '';
      
      // Check if this element contains the question number
      if (text.includes(`${questionNumber}.`) || text.includes(`Question ${questionNumber}`)) {
        // Look for answer options near this element
        const parent = element.parentElement;
        const siblings = parent ? Array.from(parent.children) : [];
        
        // Try to find the answer option
        for (let j = 0; j < siblings.length; j++) {
          const sibling = siblings[j];
          const siblingText = sibling.textContent || '';
          
          // Check if this sibling contains the answer letter
          if (siblingText.includes(answerLetter) && siblingText.length < 10) {
            // Try to click or select this element
            try {
              sibling.click();
              console.log(`Clicked on answer ${answerLetter}`);
              return;
            } catch (clickError) {
              console.error('Error clicking element:', clickError);
            }
          }
        }
      }
    }
  } catch (error) {
    console.error('Error selecting answer:', error);
  }
}

// Automatically trigger processing when page loads
window.addEventListener('load', () => {
  // Wait a bit for the page to fully load
  setTimeout(() => {
    processMCQs();
  }, 2000);
});

// Also trigger processing periodically
setInterval(() => {
  processMCQs();
}, 10000); // Every 10 seconds

// Listen for messages from background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Content script received message:', message);
  if (message.type === 'FILL_ANSWERS') {
    try {
      fillMCQAnswers(message.answers);
      sendResponse({ success: true });
    } catch (error) {
      console.error('Error filling answers:', error);
      sendResponse({ success: false, error: error.message });
    }
  }
  return true; // Keep the message channel open for async response
});