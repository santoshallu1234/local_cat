const { app, BrowserWindow, globalShortcut, ipcMain, Tray, Menu, screen, clipboard, Notification } = require('electron');
const path = require('path');
const fs = require('fs');
const captureAndProcess = require('./capture');

let mainWindow = null;
let tray = null;

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

// Capture screen and process
async function captureScreen() {
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
      
      // Show answer in notification (last 50 chars if too long)
      const notificationText = truncateTextForNotification(result.text);
      new Notification({
        title: 'AI Auto Marker - Results',
        body: notificationText
      }).show();
    } else {
      console.error('Error:', result.error);
      
      // Save error to file
      fs.writeFileSync('results.txt', 'Error: ' + result.error);
      
      // Show error notification
      new Notification({
        title: 'AI Auto Marker - Error',
        body: truncateTextForNotification(result.error)
      }).show();
    }
  } catch (error) {
    console.error('Error capturing screen:', error);
    
    // Save error to file
    fs.writeFileSync('results.txt', 'Error capturing screen: ' + error.message);
    
    // Show error notification
    new Notification({
      title: 'AI Auto Marker - Error',
      body: truncateTextForNotification(error.message)
    }).show();
  }
}

// Register global shortcut
function registerGlobalShortcut() {
  const ret = globalShortcut.register('Control+Shift+U', captureScreen);
  
  if (!ret) {
    console.log('Failed to register global shortcut');
  }
  
  console.log('Global shortcut registered:', globalShortcut.isRegistered('Control+Shift+U'));
}

// App lifecycle events
app.whenReady().then(() => {
  createWindow();
  createTray();
  registerGlobalShortcut();
  
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('will-quit', () => {
  // Unregister the global shortcut
  globalShortcut.unregister('Control+Shift+U');
  globalShortcut.unregisterAll();
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