// HDU-G: native LaTeX → PDF export via Electron's printToPDF.
// The renderer parses .tex into HTML, MathJax typesets it, then it sends the
// rendered HTML to us. We load it into a hidden BrowserWindow, wait for the
// page to settle, call printToPDF, and ask the user where to save it.

const { BrowserWindow, dialog } = require('electron')
const fs   = require('fs/promises')
const path = require('path')

async function exportPdf(parentWindow, html, defaultName = 'document.pdf') {
  const win = new BrowserWindow({
    show: false,
    width: 800,
    height: 1100,
    webPreferences: { offscreen: false, sandbox: true },
  })

  try {
    const dataUrl = 'data:text/html;charset=utf-8,' + encodeURIComponent(html)
    await win.loadURL(dataUrl)
    // Give the page a tick to fully lay out (MathJax-typeset SVG already comes
    // serialized in the HTML, so no async wait needed beyond did-finish-load).
    await new Promise(r => setTimeout(r, 250))

    const pdfBuffer = await win.webContents.printToPDF({
      printBackground: true,
      pageSize: 'A4',
      margins: { top: 0.6, bottom: 0.6, left: 0.7, right: 0.7 },
    })

    const { canceled, filePath } = await dialog.showSaveDialog(parentWindow, {
      title: 'Exportar PDF',
      defaultPath: defaultName.endsWith('.pdf') ? defaultName : defaultName + '.pdf',
      filters: [{ name: 'PDF', extensions: ['pdf'] }],
    })

    if (canceled || !filePath) return { ok: false, canceled: true }
    await fs.writeFile(filePath, pdfBuffer)
    return { ok: true, path: filePath }
  } catch (err) {
    return { ok: false, error: err.message }
  } finally {
    win.destroy()
  }
}

module.exports = { exportPdf }
