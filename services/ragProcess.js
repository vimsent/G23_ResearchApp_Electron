// Spawn / monitor / kill the nalanda-rag-backend child process.
// The backend lives in ./backend/ and is started with env vars pointing PDF_FOLDER
// and EMBEDDINGS_FILE to the user's Electron userData dir.

const { spawn } = require('child_process')
const path = require('path')
const fs = require('fs/promises')

const PORT = 3847                                 // intentionally unusual to avoid clashing with other dev servers
const READY_LINE = '[nalanda-rag] running on'

let proc = null
let ready = false
let lastError = null
const stdoutBuffer = []        // last 40 lines, useful for surfacing errors to the UI

function pushLog(line) {
  stdoutBuffer.push(line)
  if (stdoutBuffer.length > 40) stdoutBuffer.shift()
}

async function start(electronApp, onReadyChange) {
  if (proc) return                                                // already running

  const userData    = electronApp.getPath('userData')
  const pdfFolder   = path.join(userData, 'pdfs')
  const embeddings  = path.join(userData, 'embeddings.json')

  await fs.mkdir(pdfFolder, { recursive: true })

  const backendDir = path.join(__dirname, '..', 'backend')
  const entry      = path.join(backendDir, 'src', 'index.js')

  proc = spawn(process.execPath, [entry], {
    cwd: backendDir,
    env: {
      ...process.env,
      ELECTRON_RUN_AS_NODE: '1',                                  // run Electron's bundled Node, not Chromium
      PORT:            String(PORT),
      PDF_FOLDER:      pdfFolder,
      EMBEDDINGS_FILE: embeddings,
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  })

  proc.stdout.on('data', chunk => {
    const text = chunk.toString()
    text.split('\n').filter(Boolean).forEach(line => {
      pushLog(line)
      console.log('[rag]', line)
      if (line.includes(READY_LINE) && !ready) {
        ready = true
        lastError = null
        onReadyChange && onReadyChange(true)
      }
    })
  })

  proc.stderr.on('data', chunk => {
    const text = chunk.toString().trim()
    text.split('\n').filter(Boolean).forEach(line => {
      pushLog('[err] ' + line)
      console.error('[rag err]', line)
      lastError = line
    })
  })

  proc.on('exit', code => {
    pushLog(`[exit] code=${code}`)
    console.log('[rag] exited with code', code)
    proc = null
    ready = false
    onReadyChange && onReadyChange(false)
  })
}

function stop() {
  if (!proc) return
  try {
    proc.kill('SIGTERM')
    // Give it 2s to flush, then SIGKILL if still alive
    setTimeout(() => { if (proc) try { proc.kill('SIGKILL') } catch {} }, 2000)
  } catch (e) {
    console.error('[rag] failed to stop:', e.message)
  }
}

function status() {
  return {
    ready,
    running: !!proc,
    port: PORT,
    lastError,
    logTail: stdoutBuffer.slice(-15),
  }
}

module.exports = { start, stop, status, PORT }
