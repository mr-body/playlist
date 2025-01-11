const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const heart = require('./heart.js');

let win;
let form;

heart.init();

function createWindow() {
  win = new BrowserWindow({
    width: 1100,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
    },
      icon: path.join(__dirname, 'favicon.ico'),
  });
  win.setMenuBarVisibility(false)
  win.loadFile('public/index.html') // Janela principal

  // Evento IPC para abrir o formulário em uma nova janela modal
  ipcMain.on('openForm', () => {
    form = new BrowserWindow({
      width: 800,
      height: 700,
      parent: win, // Define a janela principal como pai
      modal: true, // Define a janela como modal
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        nodeIntegration: true,
        contextIsolation: false,
      },
    });

    form.loadFile('public/form.html'); // Carrega o arquivo HTML com React para o formulário
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
