const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform,

  rag: {
    status:   ()  => ipcRenderer.invoke('rag:status'),
    restart:  ()  => ipcRenderer.invoke('rag:restart'),
    onReadyChanged: (cb) => {
      const handler = (_e, ready) => cb(ready)
      ipcRenderer.on('rag:ready-changed', handler)
      return () => ipcRenderer.removeListener('rag:ready-changed', handler)
    },
  },

  keys: {
    list:       ()              => ipcRenderer.invoke('keys:list'),
    set:        (provider, key) => ipcRenderer.invoke('keys:set', provider, key),
    get:        (provider)      => ipcRenderer.invoke('keys:get', provider),
    available:  ()              => ipcRenderer.invoke('keys:available'),
  },

  notes: {
    list:   ()                  => ipcRenderer.invoke('notes:list'),
    read:   (id)                => ipcRenderer.invoke('notes:read', id),
    create: ()                  => ipcRenderer.invoke('notes:create'),
    write:  (id, payload)       => ipcRenderer.invoke('notes:write', id, payload),
    remove: (id)                => ipcRenderer.invoke('notes:delete', id),
  },
})
