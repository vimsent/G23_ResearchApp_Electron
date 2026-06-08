// Encrypted at-rest storage for LLM provider API keys.
// Uses Electron safeStorage (libsecret on Linux / Keychain on macOS / DPAPI on Windows).
// Keys are decrypted in the main process only and handed to the renderer on demand.

const { safeStorage, app } = require('electron')
const path = require('path')
const fs = require('fs/promises')

const KEYS_FILE = () => path.join(app.getPath('userData'), 'keys.enc')

async function loadAll() {
  try {
    const buf = await fs.readFile(KEYS_FILE())
    if (!safeStorage.isEncryptionAvailable()) return {}
    const json = safeStorage.decryptString(buf)
    return JSON.parse(json)
  } catch {
    return {}
  }
}

async function saveAll(keys) {
  if (!safeStorage.isEncryptionAvailable()) {
    throw new Error('safeStorage no disponible en este sistema (verifica que tengas libsecret-1-0 / gnome-keyring instalado).')
  }
  const buf = safeStorage.encryptString(JSON.stringify(keys))
  await fs.writeFile(KEYS_FILE(), buf, { mode: 0o600 })
}

module.exports = {
  async list() {
    const keys = await loadAll()
    return ['openai', 'anthropic', 'gemini'].map(provider => ({
      provider,
      hasKey: !!keys[provider],
    }))
  },

  async set(provider, key) {
    if (!['openai', 'anthropic', 'gemini'].includes(provider)) {
      throw new Error(`provider inválido: ${provider}`)
    }
    const keys = await loadAll()
    if (key && key.trim()) {
      keys[provider] = key.trim()
    } else {
      delete keys[provider]
    }
    await saveAll(keys)
    return true
  },

  async get(provider) {
    const keys = await loadAll()
    return keys[provider] || ''
  },

  isAvailable() {
    return safeStorage.isEncryptionAvailable()
  },
}
