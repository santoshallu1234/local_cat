document.addEventListener('DOMContentLoaded', function() {
  console.log('Popup DOM loaded');
  
  const closeBtn = document.getElementById('closeBtn');
  const statusDiv = document.getElementById('status');
  const extractedTextDiv = document.getElementById('extractedText');
  const copyStatusDiv = document.getElementById('copyStatus');
  const copyBtn = document.getElementById('copyBtn');

  // Close popup when close button is clicked
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      console.log('Close button clicked');
      window.close();
    });
  }

  // Copy text when copy button is clicked
  if (copyBtn && extractedTextDiv) {
    copyBtn.addEventListener('click', () => {
      const textToCopy = extractedTextDiv.textContent;
      copyTextToClipboard(textToCopy);
    });
  }

  // Get popup ID from URL parameter
  const urlParams = new URLSearchParams(window.location.search);
  const popupId = urlParams.get('popupId');
  
  if (popupId) {
    // Retrieve response from storage using popup ID
    const storageKey = 'popup_response_' + popupId;
    chrome.storage.local.get([storageKey], function(result) {
      if (result[storageKey] !== undefined) {
        const responseText = result[storageKey];
        // Display the response text
        if (extractedTextDiv) {
          console.log('Displaying response from storage:', responseText);
          
          // Check if the response text is empty or just whitespace
          if (responseText.trim() === '') {
            extractedTextDiv.textContent = 'Processing complete but no content found';
          } else {
            extractedTextDiv.textContent = responseText;
          }
          
          // Scroll to top left to ensure both vertical and horizontal scroll positions are reset
          extractedTextDiv.scrollTop = 0;
          extractedTextDiv.scrollLeft = 0;
        }
        
        // Show copy status as information only
        if (copyStatusDiv) {
          copyStatusDiv.textContent = 'Response displayed';
          copyStatusDiv.style.display = 'block';
          
          // Hide copy status after 2 seconds
          setTimeout(() => {
            copyStatusDiv.style.display = 'none';
          }, 2000);
        }
        
        // Clean up storage after displaying
        chrome.storage.local.remove(storageKey);
      } else {
        // If no response in storage, listen for server response
        listenForServerResponse();
      }
    });
  } else {
    // If no popup ID, listen for server response
    listenForServerResponse();
  }

  // Function to listen for server response
  function listenForServerResponse() {
    // Send message to background script to get latest response
    chrome.runtime.sendMessage({ type: 'GET_LATEST_RESPONSE' }, (response) => {
      if (chrome.runtime.lastError) {
        console.error('Runtime error:', chrome.runtime.lastError);
        updateStatus('Error occurred: ' + chrome.runtime.lastError.message, 'error');
        if (extractedTextDiv) {
          extractedTextDiv.textContent = 'Error: ' + chrome.runtime.lastError.message;
        }
        return;
      }

      // Check if we have a response with content
      if (response) {
        // Handle case where response has success but no content
        if (response.success && !(response.aiAnswers || response.extractedText)) {
          displayResponse({
            aiAnswers: 'Processing complete but no questions found in the image.',
            extractedText: response.extractedText || ''
          });
        } else if (response.aiAnswers || response.extractedText || response.error) {
          // Display response if it has content or an error
          displayResponse(response);
        } else {
          // If no response yet, wait a bit and try again
          setTimeout(listenForServerResponse, 500);
        }
      } else {
        // If no response yet, wait a bit and try again
        setTimeout(listenForServerResponse, 500);
      }
    });
  }

  // Function to display response
  function displayResponse(response) {
    console.log('Displaying response:', response);
    let textToDisplay = '';
    
    // Prefer AI answers if available, otherwise use extracted text
    if (response.aiAnswers && response.aiAnswers !== 'No AI answers available') {
      // Handle various cases of AI answers
      if (response.aiAnswers.startsWith('No relevant questions found.') && response.aiAnswers.length > 'No relevant questions found.'.length) {
        // Display the full response including the solution after "No relevant questions found."
        textToDisplay = response.aiAnswers;
      } else if (response.aiAnswers !== 'No relevant questions found.') {
        // Display the response if it doesn't start with "No relevant questions found."
        textToDisplay = response.aiAnswers;
      } else if (response.extractedText) {
        // If AI says no questions but we have extracted text, show that
        textToDisplay = response.extractedText;
      } else {
        // Only "No relevant questions found." and no extracted text
        textToDisplay = 'No relevant questions found in the image.';
      }
    } else if (response.extractedText) {
      // No AI answers but we have extracted text
      textToDisplay = response.extractedText;
    } else if (response.error) {
      // Display error message
      textToDisplay = 'Error: ' + response.error;
    } else {
      // No content available
      textToDisplay = 'Processing complete but no content found.';
    }
    
    // Ensure we always have some text to display
    if (!textToDisplay || textToDisplay.trim() === '') {
      textToDisplay = 'Processing complete but no content found.';
    }
    
    // Display in the popup
    if (extractedTextDiv) {
      extractedTextDiv.textContent = textToDisplay;
      // Scroll to top left to ensure both vertical and horizontal scroll positions are reset
      extractedTextDiv.scrollTop = 0;
      extractedTextDiv.scrollLeft = 0;
      
      // Add a small delay to ensure content is rendered before scrolling
      setTimeout(() => {
        extractedTextDiv.scrollTop = 0;
        extractedTextDiv.scrollLeft = 0;
      }, 10);
    }
    
    updateStatus('Analysis complete!', 'success');
    
    // Show copy status as information only
    if (copyStatusDiv) {
      copyStatusDiv.textContent = 'Response displayed';
      copyStatusDiv.style.display = 'block';
      
      // Hide copy status after 2 seconds
      setTimeout(() => {
        copyStatusDiv.style.display = 'none';
      }, 2000);
    }
  }

  // Function to update status message
  function updateStatus(message, type) {
    console.log('Updating status:', message, type);
    if (statusDiv) {
      statusDiv.textContent = message;
      statusDiv.className = type;
      statusDiv.style.display = 'block';
      
      // Hide status after 3 seconds
      setTimeout(() => {
        statusDiv.style.display = 'none';
      }, 3000);
    }
  }

  // Function to copy text to clipboard
  function copyTextToClipboard(text) {
    console.log('Copying text to clipboard:', text);
    
    // Try using the modern clipboard API first
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(() => {
        console.log('Text copied to clipboard using Clipboard API');
        showCopyStatus('Text copied to clipboard!');
      }).catch(err => {
        console.error('Failed to copy text using Clipboard API:', err);
        // Fallback to document.execCommand
        fallbackCopyTextToClipboard(text);
      });
    } else {
      // Fallback to document.execCommand
      fallbackCopyTextToClipboard(text);
    }
  }

  // Fallback method for copying text to clipboard
  function fallbackCopyTextToClipboard(text) {
    console.log('Using fallback method to copy text');
    try {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      
      // Avoid scrolling to bottom
      textArea.style.top = "0";
      textArea.style.left = "0";
      textArea.style.position = "fixed";
      textArea.style.opacity = "0";
      
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      
      if (successful) {
        console.log('Text copied to clipboard using fallback method');
        showCopyStatus('Text copied to clipboard!');
      } else {
        console.error('Failed to copy text using fallback method');
        showCopyStatus('Failed to copy text');
      }
    } catch (error) {
      console.error('Error in fallback copy method:', error);
      showCopyStatus('Failed to copy text');
    }
  }

  // Function to show copy status
  function showCopyStatus(message) {
    console.log('Showing copy status:', message);
    if (copyStatusDiv) {
      copyStatusDiv.textContent = message;
      copyStatusDiv.style.display = 'block';
      copyStatusDiv.style.backgroundColor = '#d4edda'; // Green background for success
      copyStatusDiv.style.color = '#155724'; // Dark green text
      
      // Hide copy status after 3 seconds
      setTimeout(() => {
        copyStatusDiv.style.display = 'none';
      }, 3000);
    }
  }
});