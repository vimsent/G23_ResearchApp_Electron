// ChatPanel — real chat against nalanda-rag-backend over HTTP.
// Provider/model are selectable in a settings popover; API keys are stored
// encrypted via Electron safeStorage (set/get via electronAPI.keys.*).

const PROVIDERS = [
  { id: 'ollama',    label: 'Ollama (local)',  defaultModel: 'deepseek-r1:8b', needsKey: false },
  { id: 'openai',    label: 'OpenAI',          defaultModel: 'gpt-4o-mini',    needsKey: true  },
  { id: 'anthropic', label: 'Anthropic',       defaultModel: 'claude-sonnet-4-5-20250929', needsKey: true },
  { id: 'gemini',    label: 'Google Gemini',   defaultModel: 'gemini-1.5-flash', needsKey: true },
]

function ChatPanel({ openSourceTitles }) {
  const [messages, setMessages] = React.useState([])
  const [input, setInput] = React.useState('')
  const [sending, setSending] = React.useState(false)
  const [ragStatus, setRagStatus] = React.useState({ ready: false, running: false, port: 3847, logTail: [] })

  const [provider, setProvider] = React.useState(() => localStorage.getItem('chat_provider') || 'ollama')
  const [model, setModel] = React.useState(() => localStorage.getItem('chat_model') || 'deepseek-r1:8b')
  const [keysAvailable, setKeysAvailable] = React.useState(true)
  const [storedKeys, setStoredKeys] = React.useState([])    // [{provider, hasKey}]
  const [settingsOpen, setSettingsOpen] = React.useState(false)
  const [keyInput, setKeyInput] = React.useState('')

  const scrollRef = React.useRef(null)

  // Poll RAG status every 2s
  React.useEffect(() => {
    let cancelled = false
    const tick = async () => {
      try {
        const s = await window.electronAPI.rag.status()
        if (!cancelled) setRagStatus(s)
      } catch {}
    }
    tick()
    const id = setInterval(tick, 2000)
    const off = window.electronAPI.rag.onReadyChanged(() => tick())
    return () => { cancelled = true; clearInterval(id); off && off() }
  }, [])

  React.useEffect(() => {
    (async () => {
      try {
        const avail = await window.electronAPI.keys.available()
        setKeysAvailable(avail)
        const list = await window.electronAPI.keys.list()
        setStoredKeys(list)
      } catch {}
    })()
  }, [settingsOpen])

  React.useEffect(() => { localStorage.setItem('chat_provider', provider) }, [provider])
  React.useEffect(() => { localStorage.setItem('chat_model', model) }, [model])
  React.useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [messages])

  const currentProvider = PROVIDERS.find(p => p.id === provider) || PROVIDERS[0]
  const providerHasKey = storedKeys.find(k => k.provider === provider)?.hasKey
  const canSend = ragStatus.ready && !sending && input.trim().length > 0 &&
                  (!currentProvider.needsKey || providerHasKey)

  const send = async () => {
    if (!canSend) return
    const question = input.trim()
    const userMsg = { role: 'user', text: question }
    setMessages(m => [...m, userMsg])
    setInput('')
    setSending(true)

    let api_key = ''
    if (currentProvider.needsKey) {
      try { api_key = await window.electronAPI.keys.get(provider) } catch {}
    }

    try {
      const res = await fetch(`http://localhost:${ragStatus.port}/api/chat`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ question, provider, model, api_key, top_k: 5 }),
      })
      const data = await res.json()
      if (!res.ok || data.error) throw new Error(data.error || `HTTP ${res.status}`)
      setMessages(m => [...m, {
        role: 'assistant',
        text: data.answer || '(respuesta vacía)',
        refs: (data.sources || []).map(s => `${s.source} · ${(s.score * 100).toFixed(0)}%`),
      }])
    } catch (err) {
      setMessages(m => [...m, { role: 'assistant', text: 'Error: ' + err.message, error: true }])
    } finally {
      setSending(false)
    }
  }

  const saveKey = async () => {
    if (!currentProvider.needsKey) return
    try {
      await window.electronAPI.keys.set(provider, keyInput)
      setKeyInput('')
      const list = await window.electronAPI.keys.list()
      setStoredKeys(list)
    } catch (err) {
      alert('No se pudo guardar la key: ' + err.message)
    }
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--surface)', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '8px 18px', borderBottom: '1px solid var(--border)',
        background: 'var(--bg)', fontSize: 12, color: 'var(--muted)',
        fontFamily: 'var(--font-ui)', flexShrink: 0,
      }}>
        <StatusDot ready={ragStatus.ready} running={ragStatus.running} />
        <span>
          {ragStatus.ready
            ? <>Backend listo · puerto {ragStatus.port}</>
            : ragStatus.running
              ? <>Iniciando backend…</>
              : <>Backend caído</>}
        </span>
        {openSourceTitles?.length > 0 && (
          <span style={{ marginLeft: 10 }}>
            · fuentes activas: <span style={{ color: 'var(--text)', fontWeight: 600 }}>{openSourceTitles.join(', ')}</span>
          </span>
        )}
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 11, color: 'var(--muted)' }}>{currentProvider.label} · {model}</span>
        <button onClick={() => setSettingsOpen(o => !o)} style={settingsBtnStyle}>
          ⚙ Ajustes
        </button>
      </div>

      {/* Settings popover */}
      {settingsOpen && (
        <div style={{
          padding: '14px 18px', borderBottom: '1px solid var(--border)',
          background: 'oklch(0.98 0.005 80)', fontSize: 12,
          fontFamily: 'var(--font-ui)', flexShrink: 0,
        }}>
          {!keysAvailable && (
            <div style={{
              background: 'oklch(0.96 0.04 25)', padding: '7px 10px',
              borderRadius: 6, marginBottom: 10, color: 'oklch(0.45 0.15 25)',
            }}>
              ⚠ safeStorage no disponible. Las API keys no se podrán cifrar. Verifica que tengas gnome-keyring / libsecret instalado.
            </div>
          )}
          <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '10px 14px', alignItems: 'center' }}>
            <label>Proveedor</label>
            <select value={provider} onChange={e => {
              const next = e.target.value
              setProvider(next)
              const def = PROVIDERS.find(p => p.id === next)?.defaultModel
              if (def) setModel(def)
            }} style={inputStyle}>
              {PROVIDERS.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
            </select>

            <label>Modelo</label>
            <input value={model} onChange={e => setModel(e.target.value)} style={inputStyle} />

            {currentProvider.needsKey && (
              <>
                <label>API Key</label>
                <div style={{ display: 'flex', gap: 6 }}>
                  <input
                    type="password"
                    value={keyInput}
                    placeholder={providerHasKey ? '••••••••  (guardada)' : 'sk-…'}
                    onChange={e => setKeyInput(e.target.value)}
                    style={{ ...inputStyle, flex: 1 }}
                  />
                  <button onClick={saveKey} style={primaryBtnStyle}>Guardar</button>
                  {providerHasKey && (
                    <button onClick={async () => {
                      await window.electronAPI.keys.set(provider, '')
                      const list = await window.electronAPI.keys.list()
                      setStoredKeys(list)
                    }} style={settingsBtnStyle}>Borrar</button>
                  )}
                </div>
              </>
            )}
          </div>
          {currentProvider.id === 'ollama' && (
            <div style={{ marginTop: 10, fontSize: 11, color: 'var(--muted)' }}>
              Ollama corre local. Necesitas tener instalado el modelo: <code style={codeStyle}>ollama pull {model}</code>
            </div>
          )}
          {!ragStatus.ready && ragStatus.logTail?.length > 0 && (
            <details style={{ marginTop: 10 }}>
              <summary style={{ cursor: 'pointer', fontSize: 11, color: 'var(--muted)' }}>Backend log</summary>
              <pre style={{ background: 'oklch(0.95 0.005 80)', padding: 8, borderRadius: 6, fontSize: 10.5, overflow: 'auto', maxHeight: 120, fontFamily: 'var(--font-mono)' }}>
{ragStatus.logTail.join('\n')}
              </pre>
            </details>
          )}
        </div>
      )}

      {/* Messages */}
      <div ref={scrollRef} style={{ flex: 1, overflow: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', color: 'var(--muted)', fontSize: 13, marginTop: 40, fontFamily: 'var(--font-ui)' }}>
            <div style={{ fontSize: 28, marginBottom: 8, opacity: 0.5 }}>💬</div>
            Pregunta algo sobre los PDFs indexados.
            <div style={{ fontSize: 11.5, marginTop: 6, color: 'oklch(0.7 0.01 80)' }}>
              Los PDFs se cargan dejándolos en <code style={codeStyle}>~/.config/Lumen/pdfs/</code><br/>
              y llamando POST /api/index una vez.
            </div>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} style={{ alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '78%' }}>
            <div style={{
              background: m.role === 'user' ? 'var(--accent)' : (m.error ? 'oklch(0.96 0.04 25)' : 'var(--bg)'),
              color:      m.role === 'user' ? '#fff' : (m.error ? 'oklch(0.4 0.15 25)' : 'var(--text)'),
              border:     m.role === 'assistant' ? '1px solid var(--border)' : 'none',
              padding: '10px 14px', borderRadius: 12,
              fontSize: 13, lineHeight: 1.55, fontFamily: 'var(--font-ui)',
              whiteSpace: 'pre-wrap',
            }}>{m.text}</div>
            {m.refs && m.refs.length > 0 && (
              <div style={{ display: 'flex', gap: 4, marginTop: 4, flexWrap: 'wrap' }}>
                {m.refs.map((r, j) => (
                  <span key={j} style={{
                    fontSize: 10, padding: '2px 7px',
                    background: 'var(--accent-light)', color: 'var(--accent)',
                    borderRadius: 4, fontWeight: 600, fontFamily: 'var(--font-mono)',
                  }}>{r}</span>
                ))}
              </div>
            )}
          </div>
        ))}
        {sending && (
          <div style={{ alignSelf: 'flex-start', maxWidth: '78%' }}>
            <div style={{
              background: 'var(--bg)', border: '1px solid var(--border)',
              padding: '10px 14px', borderRadius: 12, fontSize: 13,
              color: 'var(--muted)', fontFamily: 'var(--font-ui)',
            }}>
              <span style={{ animation: 'pulse 1.2s ease-in-out infinite' }}>pensando…</span>
            </div>
          </div>
        )}
      </div>

      {/* Composer */}
      <div style={{ borderTop: '1px solid var(--border)', padding: 12, background: 'var(--bg)', flexShrink: 0 }}>
        <div style={{
          display: 'flex', gap: 6, alignItems: 'center',
          background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10,
          padding: '6px 6px 6px 12px',
        }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), send())}
            placeholder={ragStatus.ready ? 'Pregunta sobre tus fuentes...' : 'Esperando backend...'}
            disabled={!ragStatus.ready || sending}
            style={{
              flex: 1, border: 'none', outline: 'none', fontSize: 13,
              color: 'var(--text)', fontFamily: 'var(--font-ui)', background: 'transparent',
            }}
          />
          <button onClick={send} disabled={!canSend} style={{
            background: canSend ? 'var(--accent)' : 'oklch(0.85 0.01 80)',
            color: '#fff', border: 'none', borderRadius: 7,
            padding: '6px 14px', fontSize: 12, fontWeight: 600,
            cursor: canSend ? 'pointer' : 'not-allowed',
            fontFamily: 'var(--font-ui)',
          }}>Send</button>
        </div>
      </div>
    </div>
  )
}

function StatusDot({ ready, running }) {
  const color = ready ? 'oklch(0.7 0.15 145)' : (running ? 'oklch(0.75 0.13 70)' : 'oklch(0.65 0.18 25)')
  return (
    <span style={{
      display: 'inline-block', width: 8, height: 8, borderRadius: '50%',
      background: color, animation: !ready && running ? 'pulse 1.2s ease-in-out infinite' : 'none',
      flexShrink: 0,
    }} />
  )
}

const inputStyle = {
  border: '1px solid var(--border)', borderRadius: 6,
  padding: '6px 10px', fontSize: 12, color: 'var(--text)',
  background: '#fff', fontFamily: 'var(--font-ui)', outline: 'none',
}
const settingsBtnStyle = {
  background: 'var(--surface)', border: '1px solid var(--border)',
  borderRadius: 6, padding: '3px 10px', fontSize: 11.5,
  color: 'var(--muted)', cursor: 'pointer', fontFamily: 'var(--font-ui)', fontWeight: 500,
}
const primaryBtnStyle = {
  background: 'var(--accent)', color: '#fff', border: 'none',
  borderRadius: 6, padding: '6px 12px', fontSize: 12, fontWeight: 600,
  cursor: 'pointer', fontFamily: 'var(--font-ui)',
}
const codeStyle = {
  fontFamily: 'var(--font-mono)', fontSize: 11,
  background: 'oklch(0.95 0.005 80)', padding: '1px 5px', borderRadius: 3,
}

Object.assign(window, { ChatPanel })
