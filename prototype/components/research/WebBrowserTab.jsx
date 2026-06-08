// WebBrowserTab — embedded Chromium webview with URL bar, history nav, bookmarks.
// Used inside ResearchView as one of the openable tab types.
// HDU-C: webview-preload injects Ctrl+Shift+S capture; toolbar button uses executeJavaScript.

// Resolve the webview preload path relative to this app's prototype/ directory.
// document.baseURI = file:///…/prototype/index.html → preload at file:///…/prototype/webview-preload.js
const WEBVIEW_PRELOAD_URL = new URL('./webview-preload.js', document.baseURI).href

function WebBrowserTab({ tabId, initialUrl, onTitleChange, onUrlChange, onCapture }) {
  const [addressBar, setAddressBar] = React.useState(initialUrl)
  const [loading, setLoading] = React.useState(false)
  const [canBack, setCanBack] = React.useState(false)
  const [canForward, setCanForward] = React.useState(false)
  const viewRef = React.useRef(null)
  const isReady = React.useRef(false)
  // Keep onCapture stable across re-renders without re-registering DOM listeners.
  const onCaptureRef = React.useRef(onCapture)
  React.useEffect(() => { onCaptureRef.current = onCapture }, [onCapture])

  React.useEffect(() => {
    const wv = viewRef.current
    if (!wv) return

    const refreshNav = () => {
      try {
        setCanBack(wv.canGoBack())
        setCanForward(wv.canGoForward())
      } catch {}
    }

    const onReady     = () => { isReady.current = true; refreshNav() }
    const onStart     = () => setLoading(true)
    const onStop      = () => { setLoading(false); refreshNav() }
    const onNavigate  = (e) => {
      const url = e.url || (wv.getURL && wv.getURL()) || ''
      setAddressBar(url)
      onUrlChange && onUrlChange(url)
      refreshNav()
    }
    const onTitle = (e) => {
      const title = e.title || ''
      onTitleChange && onTitleChange(title || 'Browser')
    }
    const onIpcMessage = (e) => {
      if (e.channel === 'web-capture') {
        onCaptureRef.current && onCaptureRef.current(e.args[0] || {})
      }
    }

    wv.addEventListener('dom-ready',            onReady)
    wv.addEventListener('did-start-loading',    onStart)
    wv.addEventListener('did-stop-loading',     onStop)
    wv.addEventListener('did-navigate',         onNavigate)
    wv.addEventListener('did-navigate-in-page', onNavigate)
    wv.addEventListener('page-title-updated',   onTitle)
    wv.addEventListener('ipc-message',          onIpcMessage)

    return () => {
      wv.removeEventListener('dom-ready',            onReady)
      wv.removeEventListener('did-start-loading',    onStart)
      wv.removeEventListener('did-stop-loading',     onStop)
      wv.removeEventListener('did-navigate',         onNavigate)
      wv.removeEventListener('did-navigate-in-page', onNavigate)
      wv.removeEventListener('page-title-updated',   onTitle)
      wv.removeEventListener('ipc-message',          onIpcMessage)
    }
  }, [])

  const loadUrl = (raw) => {
    let url = (raw || '').trim()
    if (!url) return
    if (!/^https?:\/\//i.test(url)) {
      if (url.includes(' ') || !url.includes('.')) {
        url = 'https://duckduckgo.com/?q=' + encodeURIComponent(url)
      } else {
        url = 'https://' + url
      }
    }
    setAddressBar(url)
    const wv = viewRef.current
    if (wv && isReady.current) wv.loadURL(url).catch(() => {})
  }

  // Capture button: uses executeJavaScript so it works even when page blocks keydown.
  const handleCaptureBtn = async () => {
    const wv = viewRef.current
    if (!wv || !onCaptureRef.current) return
    try {
      const [text, title] = await Promise.all([
        wv.executeJavaScript('window.getSelection().toString()'),
        wv.executeJavaScript('document.title'),
      ])
      onCaptureRef.current({ text: (text || '').trim(), url: addressBar, title: title || '' })
    } catch {}
  }

  const BOOKMARKS = [
    { label: 'Scholar', url: 'https://scholar.google.com' },
    { label: 'PubMed',  url: 'https://pubmed.ncbi.nlm.nih.gov' },
    { label: 'arXiv',   url: 'https://arxiv.org' },
    { label: 'SSRN',    url: 'https://www.ssrn.com' },
    { label: 'DOAJ',    url: 'https://doaj.org' },
  ]

  const navBtn = (enabled) => ({
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 6,
    width: 28, height: 28,
    cursor: enabled ? 'pointer' : 'not-allowed',
    opacity: enabled ? 1 : 0.4,
    color: 'var(--text)', fontSize: 17, lineHeight: 1,
    fontFamily: 'var(--font-ui)', padding: 0,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  })

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
      {/* Toolbar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        padding: '6px 10px', borderBottom: '1px solid var(--border)',
        background: 'var(--bg)', flexShrink: 0,
      }}>
        <button style={navBtn(canBack)}    disabled={!canBack}    onClick={() => viewRef.current?.goBack()}    title="Atrás">‹</button>
        <button style={navBtn(canForward)} disabled={!canForward} onClick={() => viewRef.current?.goForward()} title="Adelante">›</button>
        <button style={navBtn(true)}                              onClick={() => viewRef.current?.reload()}    title="Recargar">↺</button>

        <div style={{
          flex: 1, display: 'flex', alignItems: 'center', gap: 8,
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 8, padding: '4px 10px', minWidth: 0,
        }}>
          {loading && (
            <span style={{
              width: 7, height: 7, borderRadius: '50%', background: 'var(--accent)',
              animation: 'pulse 1s ease-in-out infinite', flexShrink: 0,
            }} />
          )}
          <input
            value={addressBar}
            onChange={e => setAddressBar(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && loadUrl(addressBar)}
            onFocus={e => e.target.select()}
            placeholder="Buscar o ingresar URL"
            style={{
              flex: 1, minWidth: 0, border: 'none', outline: 'none',
              fontSize: 12.5, color: 'var(--text)',
              fontFamily: 'var(--font-mono)', background: 'transparent',
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
          {BOOKMARKS.map(b => (
            <button key={b.label} onClick={() => loadUrl(b.url)} style={{
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 6, padding: '3px 9px', fontSize: 11, fontWeight: 500,
              color: 'var(--muted)', cursor: 'pointer', fontFamily: 'var(--font-ui)',
            }}>{b.label}</button>
          ))}
        </div>

        {/* Capture button — also triggered by Ctrl+Shift+S inside the webview */}
        <button
          onClick={handleCaptureBtn}
          title="Capturar selección (Ctrl+Shift+S)"
          style={{
            background: 'var(--accent-light)', border: '1px solid oklch(0.8 0.06 260)',
            borderRadius: 6, padding: '3px 10px', fontSize: 11, fontWeight: 600,
            color: 'var(--accent)', cursor: 'pointer', fontFamily: 'var(--font-ui)',
            flexShrink: 0,
          }}
        >
          Capturar
        </button>
      </div>

      {/* Real Chromium webview */}
      <webview
        ref={viewRef}
        src={initialUrl}
        partition="persist:research"
        preload={WEBVIEW_PRELOAD_URL}
        allowpopups="true"
        style={{ flex: 1, width: '100%', height: '100%', display: 'flex' }}
      />
    </div>
  )
}

Object.assign(window, { WebBrowserTab })
