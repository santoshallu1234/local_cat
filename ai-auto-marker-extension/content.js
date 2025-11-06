// Content script - minimal version without clipboard operations

// Listen for messages from background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Content script received message:', message);
  // No actions needed for now
  return false;
});

// Function to copy text to clipboard
function copyTextToClipboard(text, callback) {
  console.log('Content script copying text to clipboard:', text);
  
  // Try using the modern clipboard API first
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(() => {
      console.log('Text copied to clipboard using Clipboard API');
      if (callback) callback(true);
    }).catch(err => {
      console.error('Failed to copy text using Clipboard API:', err);
      // Fallback to document.execCommand
      fallbackCopyTextToClipboard(text, callback);
    });
  } else {
    // Fallback to document.execCommand
    fallbackCopyTextToClipboard(text, callback);
  }
}

// Fallback method for copying text to clipboard
function fallbackCopyTextToClipboard(text, callback) {
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
      if (callback) callback(true);
    } else {
      console.error('Failed to copy text using fallback method');
      if (callback) callback(false);
    }
  } catch (error) {
    console.error('Error in fallback copy method:', error);
    if (callback) callback(false);
  }
}