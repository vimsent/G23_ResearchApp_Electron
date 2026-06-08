// Injected into every webview before the guest page runs.
// Ctrl+Shift+S sends the current text selection + page metadata to the host frame.
const { ipcRenderer } = require('electron')

document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 's') {
    e.preventDefault()
    ipcRenderer.sendToHost('web-capture', {
      text:  (window.getSelection() || '').toString().trim(),
      url:   location.href,
      title: document.title,
    })
  }
})
