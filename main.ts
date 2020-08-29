import { app, BrowserWindow, Menu } from 'electron';
import * as path from 'path';
import * as url from 'url';

let win: BrowserWindow = null;

const args = process.argv.slice(1),
  serve = args.some(val => val === '--serve');

function createWindow(): void {

  win = new BrowserWindow({
    width: 1280,
    height: 720,
    minWidth: 1280,
    minHeight: 720,
    webPreferences: {
      nodeIntegration: true,
      allowRunningInsecureContent: (serve) ? true : false,
    },
  });

  if (process.platform !== 'darwin') {
    Menu.setApplicationMenu(null);
  }

  if (serve) {
    require('electron-reload')(__dirname, {
      electron: require(`${__dirname}/node_modules/electron`)
    });
    win.loadURL('http://localhost:4200');
  } else {
    win.loadURL(url.format({
      pathname: path.join(__dirname, 'dist/index.html'),
      protocol: 'file:',
      slashes: true
    }));
  }
}

try {
  app.on('ready', createWindow);

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    if (win === null) {
      createWindow();
    }
  });

} catch (e) { }