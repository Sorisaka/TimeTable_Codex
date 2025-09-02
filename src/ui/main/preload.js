const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  onBandsLoaded: (callback) => ipcRenderer.on('bands-loaded', (_event, bands) => callback(bands))
});
