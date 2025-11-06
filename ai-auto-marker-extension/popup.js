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

  // Get response from URL parameter
  const urlParams = new URLSearchParams(window.location.search);
  const responseText = urlParams.get('response');
  
  if (responseText) {
    // Display the response text
    if (extractedTextDiv) {
      extractedTextDiv.textContent = decodeURIComponent(responseText);
      // Scroll to top
      extractedTextDiv.scrollTop = 0;
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
  } else {
    // If no response parameter, listen for server response
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

      if (response && (response.aiAnswers || response.extractedText)) {
        displayResponse(response);
      } else {
        // If no response yet, wait a bit and try again
        setTimeout(listenForServerResponse, 500);
      }
    });
  }

  // Function to display response
  function displayResponse(response) {
    console.log('Displaying response');
    let textToDisplay = '';
    
    // Prefer AI answers if available, otherwise use extracted text
    if (response.aiAnswers && response.aiAnswers !== 'No AI answers available' && response.aiAnswers !== 'No relevant questions found.') {
      textToDisplay = response.aiAnswers;
    } else if (response.extractedText) {
      textToDisplay = response.extractedText;
    } else {
      textToDisplay = 'No content available';
    }
    
    // Display in the popup
    if (extractedTextDiv) {
      extractedTextDiv.textContent = textToDisplay;
      // Scroll to top
      extractedTextDiv.scrollTop = 0;
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