const packager = require('electron-packager');
const path = require('path');

async function packageApp() {
  try {
    const appPaths = await packager({
      dir: '.',
      out: 'dist',
      overwrite: true,
      platform: 'win32',
      arch: 'x64',
      appCopyright: 'Copyright (C) 2025 AI Auto Marker Team',
      appVersion: '1.0.0',
      name: 'AI Auto Marker',
      executableName: 'ai-auto-marker',
      icon: path.join(__dirname, 'icon.png'),
      ignore: [
        '/dist($|/)',
        '/package-app.js',
        '/.git($|/)',
        '/node_modules/electron($|/)',
        '/node_modules/electron-builder($|/)'
      ]
    });
    
    console.log('App packaged successfully to:', appPaths);
  } catch (error) {
    console.error('Error packaging app:', error);
  }
}

packageApp();