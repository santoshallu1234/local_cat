const builder = require('electron-builder');

// Disable code signing
process.env.CSC_IDENTITY_AUTO_DISCOVERY = 'false';
process.env.WIN_CSC_LINK = '';
process.env.WIN_CSC_KEY_PASSWORD = '';

builder.build({
  config: {
    appId: "com.ai-auto-marker.app",
    productName: "AI Auto Marker",
    directories: {
      output: "dist"
    },
    win: {
      target: "nsis",
      sign: false,
      verifyUpdateCodeSignature: false
    },
    nsis: {
      oneClick: true,
      perMachine: false,
      allowToChangeInstallationDirectory: true,
      createDesktopShortcut: true,
      createStartMenuShortcut: true
    }
  }
}).then(() => {
  console.log("Installer built successfully!");
}).catch((error) => {
  console.error("Error building installer:", error);
});