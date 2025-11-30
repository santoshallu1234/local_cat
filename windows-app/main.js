const { app, BrowserWindow, globalShortcut, ipcMain, Tray, Menu, screen, clipboard } = require('electron');
const path = require('path');
const fs = require('fs');
const { captureAndProcess, captureAndProcessWithGemini } = require('./capture');

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
      label: 'Capture Screen and Type (Ctrl+Shift+P)',
      click: captureAndType
    },
    {
      label: 'Capture Screen (Ctrl+Shift+R)',
      click: captureAndDisplay
    },
    {
      label: 'Capture Screen with Gemini (Ctrl+Shift+Y)',
      click: captureAndDisplayWithGemini
    },
    {
      label: 'View Results',
      click: showResults
    },
    {
      label: 'Test Cursor Display',
      click: testCursorDisplay
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
  tray.on('click', captureAndType);
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
        const storageData = fs.readFileSync(storagePath, 'utf8');
        const storage = JSON.parse(storageData);
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
    // Split text into lines to handle newlines properly
    const lines = textToType.split('\n');
    
    // Type each line
    for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
      const line = lines[lineIndex];
      
      // Type each character in the line
      for (let i = 0; i < line.length; i++) {
        // Check if we should stop typing (simple check without listener)
        // In a real implementation, we would need a more sophisticated approach
        // For now, we'll just type without the backspace stop feature
        
        const char = line[i];
        
        try {
          // Handle special characters
          if (char === '\t') {
            await keyboard.pressKey(Key.Tab);
            await keyboard.releaseKey(Key.Tab);
          } else if (char === ' ') {
            await keyboard.pressKey(Key.Space);
            await keyboard.releaseKey(Key.Space);
            
          } else {
            // Type the character
            await keyboard.type(char);
          }
          
          console.log(`Typed character: ${char} (line: ${lineIndex}, index: ${i})`);
          
          // Random delay between 50-150ms to simulate human typing
          const delay = 50 + Math.random() * 100;
          await new Promise(resolve => setTimeout(resolve, delay));
        } catch (error) {
          console.error('Error typing character:', error);
        }
      }
      
      // After typing each line (except the last one), press Enter
      if (lineIndex < lines.length - 1) {
        try {
          await keyboard.pressKey(Key.Enter);
          await keyboard.releaseKey(Key.Enter);
          console.log(`Pressed Enter after line ${lineIndex}`);
          
          // Small delay after pressing Enter
          await new Promise(resolve => setTimeout(resolve, 100));
        } catch (error) {
          console.error('Error pressing Enter:', error);
        }
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

// New function to capture screen and send to server without displaying results
async function captureAndDisplay() {
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
      
      // Don't display popup - just log success
      console.log('Screen captured and sent to server successfully');
    } else {
      console.error('Error:', result.error);
      
      // Save error to file
      fs.writeFileSync('results.txt', 'Error: ' + result.error);
      
      // Don't display popup - just log error
      console.error('Screen capture failed');
    }
  } catch (error) {
    console.error('Error capturing screen:', error);
    
    // Save error to file
    fs.writeFileSync('results.txt', 'Error capturing screen: ' + error.message);
    
    // Don't display popup - just log error
    console.error('Screen capture failed with exception');
  }
}

// New function to capture screen, send to Gemini API, and display result with cursor
async function captureAndDisplayWithGemini() {
  // Start overall timer
  const startTime = Date.now();
  console.log('=== Ctrl+Shift+Y Process Timing ===');
  
  try {
    // Show processing status in console only
    console.log('Capturing screen for Gemini processing...');
    
    // Time the capture and processing
    const captureStartTime = Date.now();
    const result = await captureAndProcessWithGemini();
    const captureEndTime = Date.now();
    console.log(`Capture and API processing time: ${captureEndTime - captureStartTime}ms`);
    
    // Handle result - copy to clipboard and save to file
    if (result.success) {
      // Time file operations
      const fileOpStartTime = Date.now();
      
      // Save results to file
      fs.writeFileSync('results.txt', result.text);
      
      // Copy to clipboard
      clipboard.writeText(result.text);
      
      // Store AI answer in our variable and localStorage-like storage
      lastAiAnswer = result.text;
      saveToLocalStorage('lastAiAnswer', lastAiAnswer);
      
      const fileOpEndTime = Date.now();
      console.log(`File operations time: ${fileOpEndTime - fileOpStartTime}ms`);
      
      // Display the result using cursor movement
      console.log('Displaying result with cursor movement...');
      console.log('Raw result text:', result.text);
      
      // Process the text to make it suitable for cursor display
      let displayText = result.text.trim();
      
      // If it's in the format "10. C", extract just the answer part "C"
      const answerMatch = displayText.match(/^\d+\.\s*([A-Z0-9])/i);
      if (answerMatch) {
        displayText = answerMatch[1]; // Just the letter/number answer
      } else {
        // For other formats, take the first alphanumeric character
        const firstCharMatch = displayText.match(/[A-Z0-9]/i);
        if (firstCharMatch) {
          displayText = firstCharMatch[0];
        } else {
          // Fallback to a simple default
          displayText = 'A';
        }
      }
      
      console.log('Processed display text:', displayText);
      
      // Time cursor display
      const cursorStartTime = Date.now();
      
      // Execute the VBScript to move cursor with the AI answer
      const { spawn } = require('child_process');
      const vbsPath = path.join(__dirname, 'run-cursor.vbs');
      
      // Run VBScript with the text as parameter
      console.log('Executing VBScript with text:', displayText);
      const vbsProcess = spawn('wscript.exe', ['//nologo', vbsPath, displayText], {
        cwd: __dirname,
        detached: true,
        stdio: ['ignore', 'ignore', 'ignore'] // Ignore all stdio
      });
      
      vbsProcess.on('error', (err) => {
        console.error('Failed to start VBScript process:', err);
      });
      
      vbsProcess.unref();
      
      const cursorEndTime = Date.now();
      console.log(`Cursor display initiation time: ${cursorEndTime - cursorStartTime}ms`);
      
      console.log('Sent result to cursor display');
    } else {
      throw new Error(result.error || 'Gemini API processing failed');
    }
  } catch (error) {
    console.error('Error in Gemini capture and display:', error.message);
    console.error(error.stack);
    
    // Save error to file
    fs.writeFileSync('results.txt', 'Error: ' + error.message);
    
    // Even on error, we might want to show something
    const { spawn } = require('child_process');
    const vbsPath = path.join(__dirname, 'run-cursor.vbs');
    
    // Run VBScript with error message
    const vbsProcess = spawn('wscript.exe', ['//nologo', vbsPath, 'ERROR'], {
      cwd: __dirname,
      detached: true,
      stdio: ['ignore', 'ignore', 'ignore']
    });
    
    vbsProcess.on('error', (err) => {
      console.error('Failed to start error VBScript process:', err);
    });
    
    vbsProcess.unref();
  } finally {
    // End overall timer
    const endTime = Date.now();
    console.log(`Total Ctrl+Shift+Y process time: ${endTime - startTime}ms`);
    console.log('====================================');
  }
}

// Test function to verify cursor display is working
function testCursorDisplay() {
  console.log('Testing cursor display with sample text...');
  
  // Execute the VBScript with a simple test text
  const { spawn } = require('child_process');
  const vbsPath = path.join(__dirname, 'run-cursor.vbs');
  
  console.log('Executing VBScript with test text: TEST');
  const vbsProcess = spawn('wscript.exe', ['//nologo', vbsPath, 'TEST'], {
    cwd: __dirname,
    detached: true,
    stdio: ['ignore', 'ignore', 'ignore']
  });
  
  vbsProcess.on('error', (err) => {
    console.error('Failed to start test VBScript process:', err);
  });
  
  vbsProcess.unref();
  
  console.log('Test sent to cursor display');
}

// Register global shortcuts
function registerGlobalShortcuts() {
  // Try to register shortcut for capture and automatic typing
  let ret1 = globalShortcut.register('Control+Shift+P', captureAndType);
  
  // If failed, try alternative
  if (!ret1) {
    console.log('Trying alternative shortcut for capture and type...');
    ret1 = globalShortcut.register('Control+Alt+P', captureAndType);
  }
  
  // Try to register shortcut for capture and display without auto-typing
  let ret2 = globalShortcut.register('Control+Shift+R', captureAndDisplay);
  
  // If failed, try alternative
  if (!ret2) {
    console.log('Trying alternative shortcut for capture and display...');
    ret2 = globalShortcut.register('Control+Alt+R', captureAndDisplay);
  }
  
  // Try to register shortcut for capture and Gemini API processing with cursor display
  let ret3 = globalShortcut.register('Control+Shift+Y', captureAndDisplayWithGemini);
  
  // If failed, try alternative
  if (!ret3) {
    console.log('Trying alternative shortcut for capture and Gemini display...');
    ret3 = globalShortcut.register('Control+Alt+Y', captureAndDisplayWithGemini);
  }
  
  if (!ret1) {
    console.log('Failed to register global shortcut for capture and type (both default and alternative)');
  }
  
  if (!ret2) {
    console.log('Failed to register global shortcut for capture and display (both default and alternative)');
  }
  
  if (!ret3) {
    console.log('Failed to register global shortcut for capture and Gemini display (both default and alternative)');
  }
  
  console.log('Global shortcuts registered:');
  console.log('- Control+Shift+P/Alt+P:', globalShortcut.isRegistered('Control+Shift+P') || globalShortcut.isRegistered('Control+Alt+P'));
  console.log('- Control+Shift+R/Alt+R:', globalShortcut.isRegistered('Control+Shift+R') || globalShortcut.isRegistered('Control+Alt+R'));
  console.log('- Control+Shift+Y/Alt+Y:', globalShortcut.isRegistered('Control+Shift+Y') || globalShortcut.isRegistered('Control+Alt+Y'));
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
  globalShortcut.unregister('Control+Shift+P');
  globalShortcut.unregister('Control+Shift+R');
  globalShortcut.unregister('Control+Shift+Y');
  globalShortcut.unregister('Control+Alt+P');
  globalShortcut.unregister('Control+Alt+R');
  globalShortcut.unregister('Control+Alt+Y');
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