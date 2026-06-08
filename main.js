const { app, BrowserWindow } = require('electron')
const path = require('path')

function createWindow() {
  const win = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1024,
    minHeight: 700,
    title: 'Lumen — Academic Research Platform',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      // Babel Standalone carga cada .jsx externo con XMLHttpRequest desde file://.
      // Chromium bloquea esas peticiones por defecto (origen nulo en file://).
      // webSecurity: false las habilita. Es seguro aquí porque la ventana principal
      // nunca carga HTML remoto — solo archivos locales del prototipo.
      webSecurity: false,
      webviewTag: true,      // Habilita <webview> para el browser de investigación
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  win.loadFile(path.join(__dirname, 'prototype', 'index.html'))

  // Descomentar para abrir DevTools automáticamente en desarrollo:
  // win.webContents.openDevTools()
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
