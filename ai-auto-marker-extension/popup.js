document.addEventListener('DOMContentLoaded', function() {
  console.log('Popup DOM loaded');
  
  const closeBtn = document.getElementById('closeBtn');
  const statusDiv = document.getElementById('status');
  const extractedTextDiv = document.getElementById('extractedText');
  const copyStatusDiv = document.getElementById('copyStatus');

  // Close popup when close button is clicked
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      console.log('Close button clicked');
      window.close();
    });
  }

  // Auto-trigger capture when popup opens
  console.log('Setting timeout to capture page');
  setTimeout(() => {
    capturePage();
  }, 100);

  // Function to capture the page
  async function capturePage() {
    try {
      console.log('Starting page capture');
      
      // Show capturing status
      updateStatus('Analyzing page...', 'info');
      
      // Send message to background script to capture the page
      chrome.runtime.sendMessage({ type: 'CAPTURE_PAGE' }, async (response) => {
        console.log('Received response from background:', response);
        
        // Check for runtime errors
        if (chrome.runtime.lastError) {
          console.error('Runtime error:', chrome.runtime.lastError);
          updateStatus('Error occurred: ' + chrome.runtime.lastError.message, 'error');
          if (extractedTextDiv) {
            extractedTextDiv.textContent = 'Error: ' + chrome.runtime.lastError.message;
          }
          return;
        }

        // Check if response is valid
        if (!response) {
          console.error('No response received');
          updateStatus('No response from background script', 'error');
          if (extractedTextDiv) {
            extractedTextDiv.textContent = 'Error: No response from background script';
          }
          return;
        }

        if (response.error) {
          console.error('Error in response:', response.error);
          updateStatus('Failed to analyze page: ' + response.error, 'error');
          if (extractedTextDiv) {
            extractedTextDiv.textContent = 'Error: ' + response.error;
          }
          return;
        }

        // Display AI answers only
        if (response.aiAnswers && response.aiAnswers !== 'No AI answers available' && response.aiAnswers !== 'No relevant questions found.') {
          console.log('Displaying AI answers');
          if (extractedTextDiv) {
            extractedTextDiv.textContent = response.aiAnswers;
            // Scroll to top
            extractedTextDiv.scrollTop = 0;
          }
          updateStatus('AI analysis complete!', 'success');
          
          // Copy to clipboard
          copyTextToClipboard(response.aiAnswers)
            .then((result) => {
              console.log('Copy to clipboard result:', result);
              if (result) {
                showCopyStatus('Answers copied to clipboard');
              } else {
                showCopyStatus('Failed to copy answers');
              }
            })
            .catch((error) => {
              console.error('Error copying to clipboard:', error);
              showCopyStatus('Failed to copy answers');
            });
        } else {
          console.log('No AI answers found');
          if (extractedTextDiv) {
            extractedTextDiv.textContent = 'No relevant questions found in the content.';
          }
          updateStatus('No questions found', 'info');
        }
      });
    } catch (error) {
      console.error('Error in capturePage:', error);
      updateStatus('Error occurred: ' + error.message, 'error');
      if (extractedTextDiv) {
        extractedTextDiv.textContent = 'Error: ' + error.message;
      }
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

  // Function to show copy status
  function showCopyStatus(message) {
    console.log('Showing copy status:', message);
    if (copyStatusDiv) {
      copyStatusDiv.textContent = message;
      copyStatusDiv.style.display = 'block';
      
      // Hide copy status after 2 seconds
      setTimeout(() => {
        copyStatusDiv.style.display = 'none';
      }, 2000);
    }
  }

  // Function to copy text to clipboard
  async function copyTextToClipboard(text) {
    try {
      console.log('Attempting to copy text to clipboard');
      if (navigator.clipboard && window.isSecureContext) {
        console.log('Using Clipboard API');
        await navigator.clipboard.writeText(text);
        console.log('Text copied to clipboard using Clipboard API');
        return true;
      } else {
        console.log('Clipboard API not available, using fallback');
        // Fallback for older browsers or insecure contexts
        return fallbackCopyTextToClipboard(text);
      }
    } catch (error) {
      console.error('Failed to copy text to clipboard:', error);
      // Try fallback method
      return fallbackCopyTextToClipboard(text);
    }
  }

  // Fallback method for copying text to clipboard
  function fallbackCopyTextToClipboard(text) {
    console.log('Using fallback copy method');
    return new Promise((resolve, reject) => {
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
        
        try {
          const successful = document.execCommand('copy');
          document.body.removeChild(textArea);
          if (successful) {
            console.log('Text copied to clipboard (fallback method)');
            resolve(true);
          } else {
            console.error('Failed to copy text to clipboard (fallback method)');
            reject(new Error('Fallback copy command failed'));
          }
        } catch (err) {
          document.body.removeChild(textArea);
          console.error('Fallback copy failed:', err);
          reject(err);
        }
      } catch (error) {
        reject(error);
      }
    });
  }
});