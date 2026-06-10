const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const os   = require('os')

const ragProcess = require('./services/ragProcess')
const keyVault   = require('./services/keyVault')
const notesVault = require('./services/notesVault')

let mainWindow = null

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1024,
    minHeight: 700,
    title: 'Lumen — Academic Research Platform',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      // Babel Standalone loads each .jsx via XHR from file://, which Chromium blocks
      // by default (null origin). Safe to disable here because the main window never
      // loads remote HTML.
      webSecurity: false,
      webviewTag: true,
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  mainWindow.loadFile(path.join(__dirname, 'prototype', 'index.html'))

  // mainWindow.webContents.openDevTools()    // uncomment for debugging
}

// ───────── IPC: RAG backend lifecycle ─────────
ipcMain.handle('rag:status', () => ragProcess.status())
ipcMain.handle('rag:restart', async () => {
  ragProcess.stop()
  await new Promise(r => setTimeout(r, 500))
  await ragProcess.start(app, (ready) => {
    mainWindow?.webContents.send('rag:ready-changed', ready)
  })
  return ragProcess.status()
})

// ───────── IPC: API key vault (safeStorage) ─────────
ipcMain.handle('keys:list', () => keyVault.list())
ipcMain.handle('keys:set',  (_e, provider, key) => keyVault.set(provider, key))
ipcMain.handle('keys:get',  (_e, provider) => keyVault.get(provider))
ipcMain.handle('keys:available', () => keyVault.isAvailable())

// ───────── IPC: Markdown notes vault ─────────
ipcMain.handle('notes:list',   () => notesVault.list())
ipcMain.handle('notes:read',   (_e, id) => notesVault.read(id))
ipcMain.handle('notes:create', () => notesVault.create())
ipcMain.handle('notes:write',  (_e, id, payload) => notesVault.write(id, payload))
ipcMain.handle('notes:delete', (_e, id) => notesVault.remove(id))

// ───────── IPC: system memory probe (used to warn about heavy LLMs) ─────────
ipcMain.handle('system:meminfo', () => ({
  totalMB: Math.round(os.totalmem() / 1024 / 1024),
  freeMB:  Math.round(os.freemem() / 1024 / 1024),
}))

// ───────── App lifecycle ─────────
app.whenReady().then(async () => {
  await notesVault.init(app)
  await ragProcess.start(app, (ready) => {
    mainWindow?.webContents.send('rag:ready-changed', ready)
  })

  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('before-quit', () => {
  ragProcess.stop()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
