// Server URL - using the HTTPS endpoint
const SERVER_URL = 'https://local-cat.vercel.app/solve-mcqs-base64';

// Variable to store the last extracted text and AI answers
let lastExtractedText = '';
let lastAiAnswers = '';
let lastServerResponse = null;
let closeTimeoutId = null; // To store the timeout ID for clearing if needed

// Listen for extension icon click
if (chrome.action) {
  chrome.action.onClicked.addListener((tab) => {
    console.log('Extension icon clicked, starting capture');
    captureVisibleTab(tab);
  });
}

// Listen for messages from popup and content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Background received message:', message);
  if (message.type === 'CAPTURE_PAGE') {
    // Get the active tab to capture
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      // Check if extension context is still valid
      if (chrome.runtime.lastError) {
        console.error('Error getting active tab:', chrome.runtime.lastError);
        sendResponse({ error: 'Failed to get active tab: ' + chrome.runtime.lastError.message });
        return;
      }
      
      if (tabs.length === 0) {
        sendResponse({ error: 'No active tab found' });
        return;
      }
      
      const activeTab = tabs[0];
      console.log('Active tab:', activeTab);
      
      // Capture the visible tab
      captureVisibleTab(activeTab, sendResponse);
    });
    
    return true; // Keep the message channel open for async response
  } else if (message.type === 'GET_LATEST_RESPONSE') {
    // Send the latest server response to the popup
    if (lastServerResponse) {
      sendResponse(lastServerResponse);
    } else {
      sendResponse({ error: 'No response available yet' });
    }
    return true;
  }
});

// Listen for keyboard shortcut
chrome.commands.onCommand.addListener((command) => {
  console.log('Keyboard command received:', command);
  if (command === "capture-page") {
    // Get the active tab to capture
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      // Check if extension context is still valid
      if (chrome.runtime.lastError) {
        console.error('Error getting active tab:', chrome.runtime.lastError);
        return;
      }
      
      if (tabs.length === 0) {
        return;
      }
      
      const activeTab = tabs[0];
      console.log('Active tab for keyboard command:', activeTab);
      
      // Capture the visible tab
      captureVisibleTab(activeTab);
    });
  }
});

// Function to capture the visible tab
async function captureVisibleTab(tab, sendResponse) {
  try {
    console.log('Starting capture of tab:', tab);
    
    // Show capturing status if we have a response callback
    if (sendResponse) {
      // Update the extension tooltip with capturing status
      try {
        if (chrome.action && typeof chrome.action.setTitle === 'function') {
          chrome.action.setTitle({ title: 'AI Auto Marker - Capturing...' });
        }
      } catch (error) {
        console.error('Error setting title:', error);
      }
    }
    
    // Capture the visible tab as an image
    chrome.tabs.captureVisibleTab(tab.windowId, { format: 'png' }, async (dataUrl) => {
      console.log('Capture completed, dataUrl exists:', !!dataUrl);
      
      // Check if extension context is still valid
      if (chrome.runtime.lastError) {
        console.error('Capture error:', chrome.runtime.lastError);
        if (sendResponse) {
          sendResponse({ error: 'Failed to capture page: ' + chrome.runtime.lastError.message });
        }
        // Set error tooltip
        try {
          if (chrome.action && typeof chrome.action.setTitle === 'function') {
            chrome.action.setTitle({ title: 'AI Auto Marker - Capture failed' });
          }
        } catch (error) {
          console.error('Error setting title:', error);
        }
        return;
      }

      if (!dataUrl) {
        console.error('No image data captured');
        if (sendResponse) {
          sendResponse({ error: 'Failed to capture page: No image data' });
        }
        try {
          if (chrome.action && typeof chrome.action.setTitle === 'function') {
            chrome.action.setTitle({ title: 'AI Auto Marker - No image data' });
          }
        } catch (error) {
          console.error('Error setting title:', error);
        }
        return;
      }

      console.log('Sending image to server...');
      
      // Send the image data to the server
      try {
        const serverResponse = await sendImageToServer(dataUrl);
        console.log('Server response received:', serverResponse);
        
        // Store the extracted text and AI answers
        if (serverResponse.success && (serverResponse.extractedText || serverResponse.aiAnswers)) {
          lastExtractedText = serverResponse.extractedText || '';
          lastAiAnswers = serverResponse.aiAnswers || '';
          lastServerResponse = serverResponse;
          
          // Log the response to console
          console.log('AI Answers:', serverResponse.aiAnswers);
          console.log('Extracted Text:', serverResponse.extractedText);
          
          // Show the response in a popup window
          const displayText = serverResponse.aiAnswers || serverResponse.extractedText || '';
          showResponseInPopup(displayText);
          
          // Update the extension tooltip with the extracted text
          const truncatedText = displayText.substring(0, 100) + (displayText.length > 100 ? '...' : '');
          try {
            if (chrome.action && typeof chrome.action.setTitle === 'function') {
              chrome.action.setTitle({ title: `Response: ${truncatedText}` });
            }
          } catch (error) {
            console.error('Error setting title:', error);
          }
        } else {
          console.log('No text extracted from server response');
          lastServerResponse = serverResponse;
          // Set a default tooltip if no text was extracted
          try {
            if (chrome.action && typeof chrome.action.setTitle === 'function') {
              chrome.action.setTitle({ title: 'AI Auto Marker - No text extracted' });
            }
          } catch (error) {
            console.error('Error setting title:', error);
          }
        }
        
        // Send the response back to the popup if we have a callback
        if (sendResponse) {
          const responseToSend = {
            success: serverResponse.success,
            error: serverResponse.error,
            aiAnswers: serverResponse.aiAnswers || 'No AI answers available',
            extractedText: serverResponse.extractedText
          };
          console.log('Sending response to popup:', responseToSend);
          sendResponse(responseToSend);
        }
      } catch (error) {
        console.error('Server error:', error);
        lastServerResponse = { error: 'Server error: ' + error.message };
        // Set error tooltip
        try {
          if (chrome.action && typeof chrome.action.setTitle === 'function') {
            chrome.action.setTitle({ title: 'AI Auto Marker - Server error occurred' });
          }
        } catch (error) {
          console.error('Error setting title:', error);
        }
        if (sendResponse) {
          sendResponse({ error: 'Server error: ' + error.message });
        }
      }
    });
  } catch (error) {
    console.error('Error capturing page:', error);
    lastServerResponse = { error: 'Failed to capture page: ' + error.message };
    // Set error tooltip
    try {
      if (chrome.action && typeof chrome.action.setTitle === 'function') {
        chrome.action.setTitle({ title: 'AI Auto Marker - Capture failed' });
      }
    } catch (error) {
      console.error('Error setting title:', error);
    }
    if (sendResponse) {
      sendResponse({ error: 'Failed to capture page: ' + error.message });
    }
  }
}

// Function to show response in a popup window
function showResponseInPopup(responseText) {
  console.log('Showing response in popup:', responseText);
  
  // Get display information to position the window in the left bottom corner
  if (chrome.system && chrome.system.display) {
    chrome.system.display.getInfo((displays) => {
      if (chrome.runtime.lastError) {
        console.error('Error getting display info:', chrome.runtime.lastError);
        // Fallback to default positioning
        createPopupWindow(responseText, null);
        return;
      }
      
      if (displays && displays.length > 0) {
        const display = displays[0]; // Use the first display
        const workArea = display.workArea;
        
        // Position the window in the left bottom corner
        const windowOptions = {
          url: 'popup.html?response=' + encodeURIComponent(responseText),
          type: 'popup',
          width: 200,
          height: 100,
          left: workArea.left + 30, // 10 pixels from the left edge
          top: workArea.top + workArea.height - 100, // Exactly at the bottom (height = 200)
          //focused: true
        };
        
        createPopupWindow(responseText, windowOptions);
      } else {
        // Fallback to default positioning
        createPopupWindow(responseText, null);
      }
    });
  } else {
    // Fallback to default positioning if chrome.system.display is not available
    createPopupWindow(responseText, null);
  }
}

// Function to create the popup window
function createPopupWindow(responseText, windowOptions) {
  const defaultOptions = {
    url: 'popup.html?response=' + encodeURIComponent(responseText),
    type: 'popup',
    width: 200,
    height: 100,
    focused: true
  };
  
  const options = windowOptions || defaultOptions;
  
  chrome.windows.create(options, (window) => {
    if (chrome.runtime.lastError) {
      console.error('Error creating popup window:', chrome.runtime.lastError);
    } else {
      console.log('Popup window created:', window);
      // Get the user-configured close timing
      chrome.storage.sync.get(['closeTiming'], function(result) {
        // Default to 3 seconds if not set
        const closeTiming = result.closeTiming !== undefined ? result.closeTiming : 3000;
        
        // Only set timeout if closeTiming is not 0 (never close)
        if (closeTiming > 0) {
          // Clear any existing timeout
          if (closeTimeoutId) {
            clearTimeout(closeTimeoutId);
          }
          
          // Set new timeout to close the window
          closeTimeoutId = setTimeout(() => {
            chrome.windows.remove(window.id, () => {
              if (chrome.runtime.lastError) {
                console.error('Error closing popup window:', chrome.runtime.lastError);
              } else {
                console.log('Popup window closed successfully');
              }
            });
          }, closeTiming);
        }
      });
    }
  });
}

// Function to send image to server
async function sendImageToServer(imageData) {
  try {
    console.log('Sending request to server:', SERVER_URL);
    
    // Use the SERVER_URL constant which is already HTTPS
    const response = await fetch(SERVER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ image: imageData })
    });
    
    console.log('Server response status:', response.status);

    if (response.ok) {
      const result = await response.json();
      console.log('Server response JSON:', result);
      return result;
    } else {
      const errorText = await response.text();
      console.error('Server error response:', errorText);
      throw new Error(`Server error: ${response.status} - ${errorText}`);
    }
  } catch (error) {
    console.error('Network error:', error);
    throw error;
  }
}