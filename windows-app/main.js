const { app, BrowserWindow, globalShortcut, ipcMain, Tray, Menu, screen, clipboard } = require('electron');
const path = require('path');
const fs = require('fs');
const captureAndProcess = require('./capture');

// Import nut-js for keyboard automation
const { keyboard, Key, listener } = require('@nut-tree-fork/nut-js');

let mainWindow = null;
let tray = null;
let lastAiAnswer = ''; // Store the last AI answer in memory
let isTyping = false; // Flag to track if typing is in progress
let stopTyping = false; // Flag to stop typing when backspace is pressed

// Create the main application window
function createWindow() {
  // Create a minimal hidden window
  mainWindow = new BrowserWindow({
    width: 1,
    height: 1,
    x: 3000,                     // Position off-screen
    y: 3000,                     // Position off-screen
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    resizable: false,
    movable: false,
    frame: false,
    show: false,                 // Hidden by default
    transparent: true,           // Transparent window
    fullscreenable: false,
    skipTaskbar: true,           // Don't show in taskbar
    alwaysOnTop: false,
    backgroundColor: '#00000000' // Transparent background
  });

  // Load the popup HTML
  mainWindow.loadFile('popup.html');

  // Handle window close
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Create popup window to display results
let popupWindow = null;
function createPopupWindow() {
  // Destroy existing popup window if it exists
  if (popupWindow) {
    popupWindow.destroy();
  }
  
  // Get primary display dimensions
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;
  
  // Create popup window
  popupWindow = new BrowserWindow({
    width: 400,
    height: 300,
    x: 40, // Position near left edge
    y: height - 340, // Position near bottom edge
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    resizable: true,
    movable: true,
    frame: true,
    show: true,
    transparent: false,
    fullscreenable: false,
    skipTaskbar: false,
    alwaysOnTop: true
  });

  // Load the popup HTML
  popupWindow.loadFile('popup.html');
  
  // Handle window close
  popupWindow.on('closed', () => {
    popupWindow = null;
  });
  
  return popupWindow;
}

// Create system tray icon
function createTray() {
  tray = new Tray(path.join(__dirname, 'icon.png'));
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Capture Screen',
      click: captureScreen
    },
    {
      label: 'View Results',
      click: showResults
    },
    {
      label: 'Quit',
      click: () => {
        app.quit();
      }
    }
  ]);
  
  tray.setContextMenu(contextMenu);
  tray.setToolTip('AI Auto Marker');
  
  // Add click event to tray icon
  tray.on('click', captureScreen);
}

// Show results in console
function showResults() {
  const { spawn } = require('child_process');
  const python = spawn('python', ['console_results.py']);
  
  python.stdout.on('data', (data) => {
    console.log(data.toString());
  });
  
  python.stderr.on('data', (data) => {
    console.error(data.toString());
  });
  
  python.on('close', (code) => {
    console.log(`Python script exited with code ${code}`);
  });
}

// Helper function to truncate text to last 50 characters if too long
function truncateTextForNotification(text) {
  if (text.length <= 50) {
    return text;
  }
  return '...' + text.substring(text.length - 50);
}

// Function to save data to a localStorage-like file
function saveToLocalStorage(key, data) {
  try {
    const storagePath = path.join(app.getPath('userData'), 'localStorage.json');
    let storage = {};
    
    // Read existing storage if it exists
    if (fs.existsSync(storagePath)) {
      const existingData = fs.readFileSync(storagePath, 'utf8');
      storage = JSON.parse(existingData);
    }
    
    // Save the data with a timestamp
    storage[key] = {
      data: data,
      timestamp: new Date().toISOString()
    };
    
    // Write back to file
    fs.writeFileSync(storagePath, JSON.stringify(storage, null, 2));
    console.log(`Data saved to localStorage-like storage with key: ${key}`);
  } catch (error) {
    console.error('Error saving to localStorage-like storage:', error);
  }
}

// Function to load data from localStorage-like file
function loadFromLocalStorage(key) {
  try {
    const storagePath = path.join(app.getPath('userData'), 'localStorage.json');
    
    if (fs.existsSync(storagePath)) {
      const storageData = fs.readFileSync(storagePath, 'utf8');
      const storage = JSON.parse(storageData);
      
      if (storage[key]) {
        return storage[key].data;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error loading from localStorage-like storage:', error);
    return null;
  }
}

// Function to simulate typing letter by letter using nut-js
async function simulateTyping() {
  // If already typing, don't start another process
  if (isTyping) {
    console.log('Typing already in progress');
    return;
  }
  
  // Read the stored AI answer
  let textToType = lastAiAnswer;
  
  // If we don't have a cached answer, try to read from storage file
  if (!textToType) {
    try {
      const storagePath = path.join(app.getPath('userData'), 'localStorage.json');
      if (fs.existsSync(storagePath)) {
        const storageData = JSON.parse(fs.readFileSync(storagePath, 'utf8'));
        if (storageData['lastAiAnswer']) {
          textToType = storageData['lastAiAnswer'].data || '';
        }
      }
    } catch (error) {
      console.error('Failed to read from storage:', error);
    }
  }
  
  if (!textToType) {
    console.log('No AI answer available to type');
    return;
  }
  
  // Set typing flags
  isTyping = true;
  stopTyping = false;
  
  console.log('Starting to type text letter by letter...');
  
  // Give user time to focus on the target application
  console.log('Please focus on the target application where you want the text to be typed.');
  console.log('The typing simulation will start in 3 seconds...');
  
  // Wait 3 seconds before starting to type
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  try {
    // Type each character with a delay
    for (let i = 0; i < textToType.length; i++) {
      // Check if we should stop typing (simple check without listener)
      // In a real implementation, we would need a more sophisticated approach
      // For now, we'll just type without the backspace stop feature
      
      const char = textToType[i];
      
      try {
        // Handle special characters
        if (char === '\n') {
          await keyboard.pressKey(Key.Enter);
          await keyboard.releaseKey(Key.Enter);
        } else if (char === '\t') {
          await keyboard.pressKey(Key.Tab);
          await keyboard.releaseKey(Key.Tab);
        } else if (char === ' ') {
          await keyboard.pressKey(Key.Space);
          await keyboard.releaseKey(Key.Space);
        } else {
          // Type the character
          await keyboard.type(char);
        }
        
        console.log(`Typed character: ${char} (index: ${i})`);
        
        // Random delay between 50-150ms to simulate human typing
        const delay = 50 + Math.random() * 100;
        await new Promise(resolve => setTimeout(resolve, delay));
      } catch (error) {
        console.error('Error typing character:', error);
      }
    }
    
    console.log('Finished typing');
  } finally {
    // Clean up
    isTyping = false;
    stopTyping = false;
  }
}

// New function to capture screen, get response, and start typing automatically
async function captureAndType() {
  try {
    // Show processing status in console only
    console.log('Capturing screen...');
    
    // Capture and process the screen
    const result = await captureAndProcess();
    
    // Handle result - copy to clipboard and save to file
    if (result.success) {
      // Save results to file
      fs.writeFileSync('results.txt', result.text);
      
      // Copy to clipboard
      clipboard.writeText(result.text);
      
      // Store AI answer in our variable and localStorage-like storage
      if (result.aiAnswers && result.aiAnswers !== 'No AI answers available') {
        lastAiAnswer = result.aiAnswers;
      } else {
        lastAiAnswer = result.extractedText || '';
      }
      
      // Save to localStorage-like storage
      saveToLocalStorage('lastAiAnswer', lastAiAnswer);
      
      // Automatically start typing the answer
      console.log('Starting automatic typing of AI answer...');
      await simulateTyping();
    } else {
      console.error('Error:', result.error);
      
      // Save error to file
      fs.writeFileSync('results.txt', 'Error: ' + result.error);
    }
  } catch (error) {
    console.error('Error capturing screen:', error);
    
    // Save error to file
    fs.writeFileSync('results.txt', 'Error capturing screen: ' + error.message);
  }
}

// Capture screen and process (keep this for backward compatibility)
async function captureScreen() {
  try {
    // Show processing status in console only
    console.log('Capturing screen...');
    
    // Capture and process the screen FIRST
    const result = await captureAndProcess();
    
    // ONLY create popup window after getting the response
    const popup = createPopupWindow();
    
    // Handle result - copy to clipboard and save to file
    if (result.success) {
      // Save results to file
      fs.writeFileSync('results.txt', result.text);
      
      // Copy to clipboard
      clipboard.writeText(result.text);
      
      // Store AI answer in our variable and localStorage-like storage
      if (result.aiAnswers && result.aiAnswers !== 'No AI answers available') {
        lastAiAnswer = result.aiAnswers;
      } else {
        lastAiAnswer = result.extractedText || '';
      }
      
      // Save to localStorage-like storage
      saveToLocalStorage('lastAiAnswer', lastAiAnswer);
      
      // Send result to popup window
      if (popup && !popup.isDestroyed()) {
        popup.webContents.send('display-result', {
          success: true,
          text: result.text,
          aiAnswers: result.aiAnswers,
          extractedText: result.extractedText
        });
      }
    } else {
      console.error('Error:', result.error);
      
      // Save error to file
      fs.writeFileSync('results.txt', 'Error: ' + result.error);
      
      // Send error to popup window
      if (popup && !popup.isDestroyed()) {
        popup.webContents.send('display-result', {
          success: false,
          error: result.error
        });
      }
    }
  } catch (error) {
    console.error('Error capturing screen:', error);
    
    // Save error to file
    fs.writeFileSync('results.txt', 'Error capturing screen: ' + error.message);
    
    // Create popup window only when there's an error
    const popup = createPopupWindow();
    
    // Send error to popup window
    setTimeout(() => {
      if (popup && !popup.isDestroyed()) {
        popup.webContents.send('display-result', {
          success: false,
          error: error.message
        });
      }
    }, 100);
  }
}

// Register global shortcuts
function registerGlobalShortcuts() {
  // Existing shortcut for capture
  const ret1 = globalShortcut.register('Control+Shift+U', captureScreen);
  
  // New shortcut for capture and automatic typing
  const ret2 = globalShortcut.register('Control+Shift+P', captureAndType);
  
  if (!ret1) {
    console.log('Failed to register global shortcut for capture');
  }
  
  if (!ret2) {
    console.log('Failed to register global shortcut for capture and type');
  }
  
  console.log('Global shortcuts registered:');
  console.log('- Control+Shift+U:', globalShortcut.isRegistered('Control+Shift+U'));
  console.log('- Control+Shift+P:', globalShortcut.isRegistered('Control+Shift+P'));
}

// App lifecycle events
app.whenReady().then(() => {
  createWindow();
  createTray();
  registerGlobalShortcuts(); // Updated function name
  
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('will-quit', () => {
  // Unregister the global shortcuts
  globalShortcut.unregister('Control+Shift+U');
  globalShortcut.unregister('Control+Shift+P');
  globalShortcut.unregisterAll();
  
  // Stop any ongoing typing processes
  isTyping = false;
  stopTyping = true;
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC handlers
ipcMain.on('close-window', () => {
  if (mainWindow) {
    mainWindow.hide();  // Hide instead of close to keep the window ready for next use
  }
});

ipcMain.on('copy-text', (event, text) => {
  // In a real implementation, we would copy to clipboard
  console.log('Copy text requested:', text);
});