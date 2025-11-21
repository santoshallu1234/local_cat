const { app, BrowserWindow, globalShortcut, ipcMain, Tray, Menu } = require('electron');
const path = require('path');
const captureAndProcess = require('./capture');

let mainWindow = null;
let tray = null;

// Create the main application window
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 300,
    height: 200,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    resizable: false,
    movable: true,
    frame: false,
    show: false // Hidden by default
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

// Capture screen and process
async function captureScreen() {
  try {
    if (mainWindow) {
      // Show processing status
      mainWindow.webContents.send('update-status', 'Capturing screen...');
      mainWindow.show();
      
      // Capture and process the screen
      const result = await captureAndProcess();
      
      // Send result to popup
      mainWindow.webContents.send('display-result', result);
    }
  } catch (error) {
    console.error('Error capturing screen:', error);
    if (mainWindow) {
      mainWindow.webContents.send('update-status', 'Error: ' + error.message);
    }
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
    mainWindow.hide();
  }
});

ipcMain.on('copy-text', (event, text) => {
  // In a real implementation, we would copy to clipboard
  console.log('Copy text requested:', text);
});