// Copyright (c) The LHTML team
// See LICENSE for details.

const {app, BrowserWindow, Menu, protocol, ipcMain, autoUpdater} = require('electron');
const log = require('electron-log');

//-------------------------------------------------------------------
// Logging
//
// This logging setup is not required for auto-updates to work,
// but it sure makes debugging easier :)
//-------------------------------------------------------------------
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
console.log('App starting...');

//-------------------------------------------------------------------
// Define the menu
//-------------------------------------------------------------------
let template = []
if (process.platform === 'darwin') {
  // OS X
  const name = app.getName();
  template.unshift({
    label: name,
    submenu: [
      {
        label: 'About ' + name,
        role: 'about'
      },
      {
        label: 'Quit',
        accelerator: 'Command+Q',
        click() { app.quit(); }
      },
    ]
  })
}


//-------------------------------------------------------------------
// Open a window that displays the version
//-------------------------------------------------------------------
let win;
function createDefaultWindow() {
  win = new BrowserWindow();
  win.webContents.openDevTools();
  win.on('closed', () => {
    win = null;
  });
  win.loadURL(`file://${__dirname}/version.html#v${app.getVersion()}`);
  return win;
}

app.on('ready', function() {
  // Create the Menu
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  createDefaultWindow();
});

app.on('window-all-closed', () => {
  app.quit();
});

function sendStatus(text) {
  console.log(text);
  if (win) {
    win.webContents.send('message', text);
  }
}

//-------------------------------------------------------------------
// Auto updates
//-------------------------------------------------------------------
autoUpdater.on('checking-for-update', () => {
  sendStatus('Checking for update...');
})
autoUpdater.on('update-available', (ev, info) => {
  sendStatus('Update available.');
  console.log('info', info);
  console.log('arguments', arguments);
})
autoUpdater.on('update-not-available', (ev, info) => {
  sendStatus('Update not available.');
  console.log('info', info);
  console.log('arguments', arguments);
})
autoUpdater.on('error', (ev, err) => {
  sendStatus('Error in auto-updater.');
  console.log('err', err);
  console.log('arguments', arguments);
})
autoUpdater.on('update-downloaded', (ev, info) => {
  sendStatus('Update downloaded.  Will quit and install in 5 seconds.');
  console.log('info', info);
  console.log('arguments', arguments);
  // Wait 5 seconds, then quit and install
  // setTimeout(function() {
  //   autoUpdater.quitAndInstall();  
  // }, 5000)
})
// Wait a second for the window to exist before checking for updates.
// autoUpdater.setFeedURL('http://localhost/index.php');
setTimeout(function() {
  // console.log('starting update check');
  console.log('starting update check');
  autoUpdater.checkForUpdates() 
  
}, 1000);
