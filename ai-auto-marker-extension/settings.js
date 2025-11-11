document.addEventListener('DOMContentLoaded', function() {
  const closeTimingSelect = document.getElementById('closeTiming');
  const saveBtn = document.getElementById('saveBtn');
  const statusDiv = document.getElementById('status');

  // Load saved settings
  chrome.storage.sync.get(['closeTiming'], function(result) {
    if (result.closeTiming !== undefined) {
      closeTimingSelect.value = result.closeTiming;
    }
  });

  // Save settings
  saveBtn.addEventListener('click', function() {
    const closeTiming = parseInt(closeTimingSelect.value);
    
    chrome.storage.sync.set({ closeTiming: closeTiming }, function() {
      // Show success message
      statusDiv.textContent = 'Settings saved successfully!';
      statusDiv.className = 'status success';
      statusDiv.style.display = 'block';
      
      // Hide message after 2 seconds
      setTimeout(() => {
        statusDiv.style.display = 'none';
      }, 2000);
    });
  });
});