const { ipcRenderer } = require('electron');

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
      ipcRenderer.send('close-window');
    });
  }

  // Copy text when copy button is clicked
  if (copyBtn && extractedTextDiv) {
    copyBtn.addEventListener('click', () => {
      const textToCopy = extractedTextDiv.textContent;
      // In a real implementation, we would copy to clipboard
      showCopyStatus('Text copied to clipboard!');
    });
  }

  // Listen for status updates from main process
  ipcRenderer.on('update-status', (event, message) => {
    updateStatus(message, 'info');
    if (extractedTextDiv) {
      extractedTextDiv.textContent = message;
    }
  });

  // Listen for results from main process
  ipcRenderer.on('display-result', (event, result) => {
    if (result.success) {
      displayResponse(result);
    } else {
      updateStatus('Error: ' + result.error, 'error');
      if (extractedTextDiv) {
        extractedTextDiv.textContent = 'Error: ' + result.error;
      }
    }
  });

  // Function to display response
  function displayResponse(response) {
    console.log('Displaying response');
    
    if (extractedTextDiv) {
      extractedTextDiv.textContent = response.text;
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