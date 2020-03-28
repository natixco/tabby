import { app, BrowserWindow, Menu, Tray, NativeImage, nativeImage } from 'electron';
import * as path from 'path';
import * as url from 'url';

let win: BrowserWindow = null;
let tray: Tray = null;
let close: boolean = false;

const args = process.argv.slice(1),
  serve = args.some(val => val === '--serve');

function createWindow(): BrowserWindow {

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

  tray = new Tray(nativeImage.createFromPath(path.join(__dirname, 'dist/favicon.ico')));
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Open',
      type: 'normal',
      click: function () {
        win.show();
      }
    },
    {
      label: 'Exit',
      type: 'normal',
      click: function () {
        close = true;
        app.quit();
      }
    }
  ]);
  tray.setToolTip('Tabby');
  tray.setContextMenu(contextMenu);

  tray.on('double-click', () => {
    win.show();
  });

  win.on('close', (event) => {
    if (!close) event.preventDefault();
    win.hide();
  });

  return win;
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