const electronInstaller = require('electron-installer-windows');
const path = require('path');

async function buildInstaller() {
  try {
    const options = {
      src: 'dist/AI Auto Marker-win32-x64',
      dest: 'dist/installers',
      authors: ['AI Auto Marker Team'],
      exe: 'AI Auto Marker.exe',
      description: 'AI Auto Marker Application',
      version: '1.0.0',
      title: 'AI Auto Marker',
      // Simplified options to avoid icon issues
      noMsi: true,
      skipUpdateIcon: true
    };

    console.log('Building Windows installer...');
    await electronInstaller(options);
    console.log('Successfully created Windows installer at:', path.join(__dirname, 'dist/installers'));
  } catch (error) {
    console.error('Error building installer:', error);
  }
}

buildInstaller();