const { ipcRenderer } = require('electron');

// Minimal popup script - no UI elements needed since window is hidden
document.addEventListener('DOMContentLoaded', function() {
  console.log('Hidden popup initialized');
  
  // Listen for status updates from main process
  ipcRenderer.on('update-status', (event, message) => {
    console.log('Status update:', message);
  });

  // Listen for results from main process
  ipcRenderer.on('display-result', (event, result) => {
    console.log('Result received:', result);
    if (result.success) {
      console.log('Success! Results:', result.text);
    } else {
      console.error('Error:', result.error);
    }
  });
});
