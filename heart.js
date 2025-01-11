const { ipcMain } = require('electron');

function init() {

  ipcMain.on('button-click', (event, arg) => {
    console.log('Button clicked:', arg);
  });

}

module.exports = { init };