// notesVault — CRUD for markdown vault notes in userData/notes/<id>.md
// Each note is a single .md file with YAML frontmatter (id, title, created, modified).
// Filenames use the stable id so titles can be renamed without breaking wiki-links.

const fs     = require('fs/promises')
const path   = require('path')
const crypto = require('crypto')

const FM_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/

let dir = null

async function init(electronApp) {
  dir = path.join(electronApp.getPath('userData'), 'notes')
  await fs.mkdir(dir, { recursive: true })
}

function newId() {
  return 'vault-' + crypto.randomBytes(5).toString('hex')
}

function fileFor(id) {
  // Defense in depth: never allow path separators in id.
  if (!/^[a-z0-9-]+$/i.test(id)) throw new Error('invalid note id')
  return path.join(dir, id + '.md')
}

function parseFrontmatter(raw) {
  const m = raw.match(FM_RE)
  if (!m) return { meta: {}, body: raw }
  const meta = {}
  for (const line of m[1].split(/\r?\n/)) {
    const i = line.indexOf(':')
    if (i === -1) continue
    const k = line.slice(0, i).trim()
    const v = line.slice(i + 1).trim()
    meta[k] = v
  }
  return { meta, body: m[2] }
}

function serialize({ id, title, created, modified, body }) {
  return `---
id: ${id}
title: ${title.replace(/\n/g, ' ')}
created: ${created}
modified: ${modified}
---
${body || ''}`
}

async function list() {
  if (!dir) return []
  const entries = await fs.readdir(dir).catch(() => [])
  const out = []
  for (const f of entries) {
    if (!f.endsWith('.md')) continue
    try {
      const raw = await fs.readFile(path.join(dir, f), 'utf8')
      const { meta, body } = parseFrontmatter(raw)
      const id = meta.id || f.replace(/\.md$/, '')
      out.push({
        id,
        title:    meta.title    || 'Untitled',
        created:  meta.created  || new Date().toISOString(),
        modified: meta.modified || new Date().toISOString(),
        body,
      })
    } catch (e) {
      console.error('[notesVault] failed to read', f, e.message)
    }
  }
  // newest-modified first
  out.sort((a, b) => (b.modified || '').localeCompare(a.modified || ''))
  return out
}

async function read(id) {
  const raw = await fs.readFile(fileFor(id), 'utf8')
  const { meta, body } = parseFrontmatter(raw)
  return {
    id,
    title:    meta.title    || 'Untitled',
    created:  meta.created  || new Date().toISOString(),
    modified: meta.modified || new Date().toISOString(),
    body,
  }
}

async function create() {
  const id  = newId()
  const now = new Date().toISOString()
  const note = { id, title: 'Untitled note', created: now, modified: now, body: '' }
  await fs.writeFile(fileFor(id), serialize(note), 'utf8')
  return note
}

async function write(id, { title, body }) {
  let existing = null
  try { existing = await read(id) } catch {}
  const now = new Date().toISOString()
  const merged = {
    id,
    title:    (title ?? existing?.title ?? 'Untitled').trim() || 'Untitled',
    created:  existing?.created || now,
    modified: now,
    body:     body ?? existing?.body ?? '',
  }
  await fs.writeFile(fileFor(id), serialize(merged), 'utf8')
  return merged
}

async function remove(id) {
  await fs.unlink(fileFor(id)).catch(() => {})
}

function dirPath() { return dir }

module.exports = { init, list, read, create, write, remove, dirPath }
