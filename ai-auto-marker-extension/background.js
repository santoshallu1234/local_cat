// Server URL - in a production extension, this should be configurable
const SERVER_URL = 'http://localhost:3000';

// Variable to store the last extracted text and AI answers
let lastExtractedText = '';
let lastAiAnswers = '';

// Listen for messages from popup and content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Background received message:', message);
  if (message.type === 'CAPTURE_PAGE') {
    // Get the active tab to capture
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
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
  } else if (message.type === 'COPY_TO_CLIPBOARD') {
    // Handle clipboard copy request from content script
    console.log('Copying text to clipboard:', message.text);
    copyTextToClipboard(message.text)
      .then((result) => {
        console.log('Clipboard copy result:', result);
        sendResponse({ success: result });
      })
      .catch((error) => {
        console.error('Error copying to clipboard:', error);
        sendResponse({ success: false, error: error.message });
      });
    return true; // Keep the message channel open for async response
  }
});

// Listen for keyboard shortcut
chrome.commands.onCommand.addListener((command) => {
  console.log('Keyboard command received:', command);
  if (command === "capture-page") {
    // Get the active tab to capture
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
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

// Listen for omnibox input
chrome.omnibox.onInputStarted.addListener(() => {
  // This event is fired when the user starts interacting with the omnibox
});

chrome.omnibox.onInputChanged.addListener((text, suggest) => {
  // Always provide suggestion with the last extracted text if available
  if (lastExtractedText) {
    // Provide suggestion with the last extracted text
    suggest([
      {
        content: lastExtractedText,
        description: `Extracted text: ${lastExtractedText.substring(0, 100)}${lastExtractedText.length > 100 ? '...' : ''}`
      }
    ]);
  } else {
    // Provide a default suggestion if no text is available
    suggest([
      {
        content: 'No extracted text available',
        description: 'No extracted text available - capture a page first'
      }
    ]);
  }
});

chrome.omnibox.onInputEntered.addListener((text, disposition) => {
  // When the user selects a suggestion or presses Enter
  if (text && text !== 'No extracted text available') {
    // Copy the text to clipboard
    copyTextToClipboard(text);
  }
});

// Function to copy text to clipboard (for use in omnibox and content script)
async function copyTextToClipboard(text) {
  try {
    console.log('Attempting to copy text to clipboard from background script');
    // Create a temporary tab to copy text (this gives us a focused document)
    const tab = await chrome.tabs.create({
      url: 'data:text/plain;charset=utf-8,' + encodeURIComponent(text),
      active: false
    });
    
    // Wait a bit for the tab to load
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Execute script in the tab to copy text
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: async (textToCopy) => {
        try {
          await navigator.clipboard.writeText(textToCopy);
          console.log('Text copied to clipboard from temporary tab');
          return true;
        } catch (error) {
          console.error('Failed to copy text in temporary tab:', error);
          return false;
        }
      },
      args: [text]
    });
    
    // Close the temporary tab
    await chrome.tabs.remove(tab.id);
    
    console.log('Text copied to clipboard successfully');
    return true;
  } catch (error) {
    console.error('Failed to copy text to clipboard using temporary tab:', error);
    
    // Fallback method
    try {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.top = "0";
      textArea.style.left = "0";
      textArea.style.position = "fixed";
      textArea.style.opacity = "0";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        if (successful) {
          console.log('Text copied to clipboard (fallback method)');
          return true;
        } else {
          console.error('Failed to copy text to clipboard (fallback method)');
          return false;
        }
      } catch (err) {
        document.body.removeChild(textArea);
        console.error('Fallback copy failed:', err);
        return false;
      }
    } catch (fallbackError) {
      console.error('All clipboard methods failed:', fallbackError);
      return false;
    }
  }
}

// Function to capture the visible tab
async function captureVisibleTab(tab, sendResponse) {
  try {
    console.log('Starting capture of tab:', tab);
    
    // Show capturing status if we have a response callback
    if (sendResponse) {
      // Update the extension tooltip with capturing status
      chrome.action.setTitle({ title: 'AI Auto Marker - Capturing...' });
    }
    
    // Capture the visible tab as an image
    chrome.tabs.captureVisibleTab(tab.windowId, { format: 'png' }, async (dataUrl) => {
      console.log('Capture completed, dataUrl exists:', !!dataUrl);
      
      if (chrome.runtime.lastError) {
        console.error('Capture error:', chrome.runtime.lastError);
        if (sendResponse) {
          sendResponse({ error: 'Failed to capture page: ' + chrome.runtime.lastError.message });
        }
        // Set error tooltip
        chrome.action.setTitle({ title: 'AI Auto Marker - Capture failed' });
        return;
      }

      if (!dataUrl) {
        console.error('No image data captured');
        if (sendResponse) {
          sendResponse({ error: 'Failed to capture page: No image data' });
        }
        chrome.action.setTitle({ title: 'AI Auto Marker - No image data' });
        return;
      }

      console.log('Sending image to server...');
      
      // Send the image data to the server
      try {
        const serverResponse = await sendImageToServer(dataUrl);
        console.log('Server response received:', serverResponse);
        
        // Store the extracted text and AI answers
        if (serverResponse.success && serverResponse.extractedText) {
          lastExtractedText = serverResponse.extractedText;
          lastAiAnswers = serverResponse.aiAnswers || '';
          
          // Update the extension tooltip with the extracted text
          const truncatedText = lastExtractedText.substring(0, 100) + (lastExtractedText.length > 100 ? '...' : '');
          chrome.action.setTitle({ title: `Extracted: ${truncatedText}` });
          
          // Automatically copy AI answers to clipboard if available
          if (serverResponse.aiAnswers) {
            console.log('Copying AI answers to clipboard:', serverResponse.aiAnswers);
            const copyResult = await copyTextToClipboard(serverResponse.aiAnswers);
            console.log('AI answers copy result:', copyResult);
          } else {
            // If no AI answers, copy the extracted text
            console.log('Copying extracted text to clipboard:', serverResponse.extractedText);
            const copyResult = await copyTextToClipboard(serverResponse.extractedText);
            console.log('Extracted text copy result:', copyResult);
          }
          
          // Send the AI answers to the content script to display on page (if available)
          if (serverResponse.aiAnswers) {
            console.log('Sending AI answers to content script');
            chrome.tabs.sendMessage(tab.id, {
              type: 'DISPLAY_EXTRACTED_TEXT',
              text: serverResponse.aiAnswers
            }, (response) => {
              // We don't need to do anything with the response, but we should catch any errors
              if (chrome.runtime.lastError) {
                // Content script is not ready or not injected, which is fine
                console.log('Content script not ready or not injected yet');
              } else {
                console.log('Content script response:', response);
              }
            });
          }
        } else {
          console.log('No text extracted from server response');
          // Set a default tooltip if no text was extracted
          chrome.action.setTitle({ title: 'AI Auto Marker - No text extracted' });
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
        // Set error tooltip
        chrome.action.setTitle({ title: 'AI Auto Marker - Server error occurred' });
        if (sendResponse) {
          sendResponse({ error: 'Server error: ' + error.message });
        }
      }
    });
  } catch (error) {
    console.error('Error capturing page:', error);
    // Set error tooltip
    chrome.action.setTitle({ title: 'AI Auto Marker - Capture failed' });
    if (sendResponse) {
      sendResponse({ error: 'Failed to capture page: ' + error.message });
    }
  }
}

// Function to send image to server
async function sendImageToServer(imageData) {
  try {
    console.log('Sending request to server...');
    const response = await fetch('http://localhost:3000/solve-mcqs-base64', {
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