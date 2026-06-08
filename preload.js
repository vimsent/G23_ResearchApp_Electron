const { contextBridge } = require('electron')

// Bridge mínimo entre el proceso Node (main) y el renderer (React).
// Extiende electronAPI aquí si en el futuro necesitas acceso a fs, IPC, etc.
contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform,
})
