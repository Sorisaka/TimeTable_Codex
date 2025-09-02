const { app, BrowserWindow, Menu, dialog } = require('electron');
const path = require('path');
const { loadBandsFromCsv } = require('../../data/csvBandRepository');
const { sortBandsByAvailability } = require('../../application/TimetableService');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  win.loadFile(path.join(__dirname, '../renderer/index.html'));
  return win;
}

app.whenReady().then(() => {
  const win = createWindow();

  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'New',
          click: async () => {
            const result = await dialog.showOpenDialog(win, {
              properties: ['openFile'],
              filters: [{ name: 'CSV', extensions: ['csv'] }]
            });
            if (!result.canceled && result.filePaths.length > 0) {
              const bands = loadBandsFromCsv(result.filePaths[0]);
              const sorted = sortBandsByAvailability(bands);
              const payload = sorted.map((b) => ({
                name: b.name,
                duration: b.duration,
                availability: b.availability,
                totalAvailableSlots: b.totalAvailableSlots()
              }));
              win.webContents.send('bands-loaded', payload);
            }
          }
        },
        { label: 'Load', click: () => {} },
        { label: 'Save', click: () => {} },
        { label: 'Export', click: () => {} }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
