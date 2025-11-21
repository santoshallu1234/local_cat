# AI Auto Marker - Windows Application

This is a Windows desktop application version of the AI Auto Marker Chrome extension. It captures screenshots of your screen, sends them to an AI server for processing, and displays the results.

## Features

- Capture your entire screen with a keyboard shortcut (Ctrl+Shift+U)
- Process screenshots with AI to extract text and answer MCQ questions
- Display results in a popup window
- System tray icon for quick access

## Installation

1. Make sure you have Node.js installed on your system
2. Navigate to the windows-app directory
3. Install dependencies:
   ```
   npm install
   ```
4. Start the application:
   ```
   npm start
   ```

## Usage

1. Launch the application
2. Press Ctrl+Shift+U to capture your screen
3. The application will process the screenshot and display results
4. Use the "Copy" button to copy results to clipboard
5. Click the "✕" button or click outside the window to close it

You can also click the system tray icon to trigger a screen capture.

## Building Executable

To build a standalone executable for Windows:

```
npm run build
```

This will create a distributable package in the `dist` folder.