document.addEventListener('DOMContentLoaded', function() {
  const modelSelection = document.getElementById('modelSelection');
  const premiumTokenSection = document.getElementById('premiumTokenSection');
  const premiumTokenInput = document.getElementById('premiumTokenInput');
  const tokenStatus = document.getElementById('tokenStatus');
  const creditsValue = document.getElementById('creditsValue');
  const popupEnabledSelect = document.getElementById('popupEnabled');
  const closeTimingSelect = document.getElementById('closeTiming');
  const saveBtn = document.getElementById('saveBtn');
  const statusDiv = document.getElementById('status');

  // Load saved settings
  chrome.storage.sync.get(['selectedModel', 'premiumToken', 'popupEnabled', 'closeTiming'], function(result) {
    if (result.selectedModel !== undefined) {
      modelSelection.value = result.selectedModel;
      // Show/hide premium token section based on selected model
      if (result.selectedModel === 'chatgpt') {
        premiumTokenSection.style.display = 'block';
      }
    }
    
    if (result.premiumToken !== undefined) {
      premiumTokenInput.value = result.premiumToken;
      // Validate the token and show credits if it's a ChatGPT model
      if (result.selectedModel === 'chatgpt') {
        validatePremiumToken(result.premiumToken);
      }
    }
    
    if (result.closeTiming !== undefined) {
      closeTimingSelect.value = result.closeTiming;
    }
  });

  // Show/hide premium token input based on model selection
  modelSelection.addEventListener('change', function() {
    if (modelSelection.value === 'chatgpt') {
      premiumTokenSection.style.display = 'block';
      // Validate existing token if present
      if (premiumTokenInput.value) {
        validatePremiumToken(premiumTokenInput.value);
      }
    } else {
      premiumTokenSection.style.display = 'none';
      tokenStatus.style.display = 'none';
      creditsValue.textContent = '-';
    }
  });

  // Validate premium token when it changes
  premiumTokenInput.addEventListener('input', function() {
    const token = premiumTokenInput.value.trim();
    if (token) {
      // Debounce the validation to avoid too many requests
      clearTimeout(premiumTokenInput.validationTimeout);
      premiumTokenInput.validationTimeout = setTimeout(() => {
        validatePremiumToken(token);
      }, 500);
    } else {
      tokenStatus.style.display = 'none';
      creditsValue.textContent = '-';
    }
  });

  // Save settings
  saveBtn.addEventListener('click', function() {
    const selectedModel = modelSelection.value;
    const premiumToken = premiumTokenInput.value.trim();
    const popupEnabled = popupEnabledSelect.value === 'true';
    const closeTiming = parseInt(closeTimingSelect.value);
    
    // If ChatGPT model is selected, validate the token
    if (selectedModel === 'chatgpt') {
      if (!premiumToken) {
        showStatus('Please enter a premium token for ChatGPT model', 'error');
        return;
      }
      
      // Validate token before saving
      validateTokenAndSave(selectedModel, premiumToken, popupEnabled, closeTiming);
    } else {
      // For Llama model, just save the settings
      chrome.storage.sync.set({ 
        selectedModel: selectedModel,
        popupEnabled: popupEnabled,
        closeTiming: closeTiming 
      }, function() {
        showStatus('Settings saved successfully!', 'success');
      });
    }
  });

  // Function to validate premium token
  function validatePremiumToken(token) {
    if (!token) {
      tokenStatus.style.display = 'none';
      creditsValue.textContent = '-';
      return;
    }

    tokenStatus.textContent = 'Validating token...';
    tokenStatus.className = 'info';
    tokenStatus.style.display = 'block';
    creditsValue.textContent = '-';

    // In a real implementation, you would make a request to your server
    // For now, we'll simulate the validation with a mock API call
    simulateTokenValidation(token)
      .then(result => {
        if (result.valid) {
          tokenStatus.textContent = `Token validated successfully! (${result.model})`;
          tokenStatus.className = 'valid';
          tokenStatus.style.display = 'block';
          creditsValue.textContent = result.count;
        } else {
          tokenStatus.textContent = 'Invalid token. Please check and try again.';
          tokenStatus.className = 'invalid';
          tokenStatus.style.display = 'block';
          creditsValue.textContent = '0';
        }
      })
      .catch(error => {
        tokenStatus.textContent = 'Error validating token. Please try again.';
        tokenStatus.className = 'invalid';
        tokenStatus.style.display = 'block';
        creditsValue.textContent = '-';
      });
  }

  // Function to validate token against the server
  function simulateTokenValidation(token) {
    return new Promise((resolve, reject) => {
      // In a real implementation, you would call your server endpoint
      fetch('https://local-cat.vercel.app/admin/token-model/' + token)
        .then(response => {
          if (response.ok) {
            return response.json();
          } else if (response.status === 404) {
            // Token not found
            resolve({ valid: false });
            return;
          } else {
            // Other error
            throw new Error('Server error: ' + response.status);
          }
        })
        .then(data => {
          if (data && data.success) {
            resolve({ 
              valid: true, 
              count: data.count, 
              model: data.model 
            });
          } else {
            resolve({ valid: false });
          }
        })
        .catch(error => {
          console.error('Token validation error:', error);
          reject(error);
        });
    });
  }

  // Function to validate token and save settings
  function validateTokenAndSave(selectedModel, premiumToken, popupEnabled, closeTiming) {
    tokenStatus.textContent = 'Validating token...';
    tokenStatus.className = 'info';
    tokenStatus.style.display = 'block';

    // In a real implementation, you would call your server endpoint
    // For now, we'll simulate a successful validation
    simulateTokenValidation(premiumToken)
      .then(result => {
        if (result.valid) {
          chrome.storage.sync.set({ 
            selectedModel: selectedModel,
            premiumToken: premiumToken,
            popupEnabled: popupEnabled,
            closeTiming: closeTiming 
          }, function() {
            tokenStatus.textContent = `Token validated! You have ${result.count} credits remaining.`;
            tokenStatus.className = 'valid';
            creditsValue.textContent = result.count;
            showStatus('Settings saved successfully!', 'success');
          });
        } else {
          tokenStatus.textContent = 'Invalid token. Please check and try again.';
          tokenStatus.className = 'invalid';
          showStatus('Invalid premium token', 'error');
        }
      })
      .catch(error => {
        tokenStatus.textContent = 'Error validating token. Please try again.';
        tokenStatus.className = 'invalid';
        showStatus('Error validating token', 'error');
      });
  }

  // Function to show status message
  function showStatus(message, type) {
    statusDiv.textContent = message;
    statusDiv.className = 'status ' + type;
    statusDiv.style.display = 'block';
    
    // Hide message after 3 seconds
    setTimeout(() => {
      statusDiv.style.display = 'none';
    }, 3000);
  }
});