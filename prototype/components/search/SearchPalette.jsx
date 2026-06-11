// HDU-E: Global Ctrl/Cmd+K search palette.
// Searches across every note in window.NOTE_INDEX via window.SearchIndex.
// Result selection sets window.__lumenPendingOpen and dispatches 'lumen:nav',
// which App / AKMView / NotesView each consume on mount + on event to
// cascade the navigation (App → pkm, AKM → notes page, NotesView → tab).

function SearchPalette({ open, onClose }) {
  const [query, setQuery] = React.useState('');
  const [results, setResults] = React.useState([]);
  const [selected, setSelected] = React.useState(0);
  const inputRef = React.useRef(null);
  const listRef  = React.useRef(null);

  React.useEffect(() => {
    if (!open) return;
    window.SearchIndex.rebuild();
    setQuery('');
    setResults([]);
    setSelected(0);
    // Focus input on next tick so the modal is laid out first.
    setTimeout(() => inputRef.current?.focus(), 0);
  }, [open]);

  React.useEffect(() => {
    if (!open) return;
    const q = query.trim();
    if (!q) { setResults([]); return; }
    const r = window.SearchIndex.search(q, 30);
    setResults(r);
    setSelected(0);
  }, [query, open]);

  const choose = React.useCallback((res) => {
    if (!res) return;
    // HDU-5: if the result is a web source (URL), open it in a new window.
    // Otherwise, cascade into the notes view to open the note.
    if (res.url && /^https?:\/\//i.test(res.url)) {
      try { window.open(res.url, '_blank'); } catch {}
    } else {
      window.__lumenPendingOpen = res.id;
      window.dispatchEvent(new CustomEvent('lumen:nav'));
    }
    onClose();
  }, [onClose]);

  React.useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (e.key === 'Escape')      { e.preventDefault(); onClose(); }
      else if (e.key === 'ArrowDown') { e.preventDefault(); setSelected(s => Math.min(s + 1, results.length - 1)); }
      else if (e.key === 'ArrowUp')   { e.preventDefault(); setSelected(s => Math.max(s - 1, 0)); }
      else if (e.key === 'Enter')     { e.preventDefault(); choose(results[selected]); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, results, selected, choose, onClose]);

  // Keep the selected row in view as the user arrows through.
  React.useEffect(() => {
    if (!listRef.current) return;
    const el = listRef.current.querySelector(`[data-idx="${selected}"]`);
    el?.scrollIntoView({ block: 'nearest' });
  }, [selected]);

  if (!open) return null;

  const kindBadge = (kind) => {
    const cfg = {
      object:  { label: 'Object',  hue: 260 },
      free:    { label: 'Free',    hue: 305 },
      library: { label: 'Library', hue: 235 },
      vault:   { label: 'Vault',   hue: 170 },
    }[kind] || { label: kind || 'Note', hue: 80 };
    return (
      <span style={{
        fontSize: 10, fontFamily: 'var(--font-mono)', fontWeight: 600,
        padding: '2px 7px', borderRadius: 5,
        background: `oklch(0.95 0.04 ${cfg.hue})`,
        color:      `oklch(0.4 0.13 ${cfg.hue})`,
        textTransform: 'uppercase', letterSpacing: '0.06em',
      }}>{cfg.label}</span>
    );
  };

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, background: 'oklch(0.15 0.01 80 / 0.45)',
      backdropFilter: 'blur(4px)', zIndex: 9000,
      display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
      paddingTop: '14vh', animation: 'fadeIn 0.14s ease',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: 'min(680px, 92%)', maxHeight: '70vh',
        background: 'var(--surface)', borderRadius: 14,
        border: '1px solid var(--border)',
        boxShadow: '0 30px 80px oklch(0 0 0 / 0.4)',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
        fontFamily: 'var(--font-ui)',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '14px 18px', borderBottom: '1px solid var(--border)',
        }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="var(--muted)" strokeWidth="1.8" strokeLinecap="round">
            <circle cx="7" cy="7" r="4.5" />
            <path d="M11 11l3 3" />
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Buscar en todas tus notas…"
            style={{
              flex: 1, border: 'none', outline: 'none',
              fontSize: 15, color: 'var(--text)', background: 'transparent',
              fontFamily: 'var(--font-ui)',
            }}
          />
          <kbd style={kbdStyle}>Esc</kbd>
        </div>

        <div ref={listRef} style={{ flex: 1, overflowY: 'auto', padding: '6px 0' }}>
          {!query.trim() && (
            <div style={emptyHintStyle}>
              <div style={{ fontSize: 22, opacity: 0.4, marginBottom: 8 }}>⌕</div>
              Escribe para buscar en tu vault y notas demo.<br />
              <span style={{ fontSize: 11.5, color: 'var(--muted)' }}>
                ↑↓ para navegar · Enter para abrir · Esc para cerrar
              </span>
            </div>
          )}
          {query.trim() && results.length === 0 && (
            <div style={emptyHintStyle}>
              Sin resultados para <strong>{query.trim()}</strong>.
            </div>
          )}
          {results.map((r, i) => (
            <div
              key={r.id}
              data-idx={i}
              onClick={() => choose(r)}
              onMouseEnter={() => setSelected(i)}
              style={{
                display: 'flex', flexDirection: 'column', gap: 4,
                padding: '10px 18px',
                background: i === selected ? 'var(--accent-light)' : 'transparent',
                borderLeft: i === selected ? '3px solid var(--accent)' : '3px solid transparent',
                cursor: 'pointer',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text)' }}>
                  <HighlightedText text={r.title} tokens={r.queryTokens} />
                </span>
                {kindBadge(r.kind)}
                <div style={{ flex: 1 }} />
                <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--muted)' }}>{r.score}</span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.5 }}>
                <HighlightedText text={r.snippet} tokens={r.queryTokens} />
              </div>
              {(r.source || r.date) && (
                <div style={{
                  display: 'flex', gap: 8, alignItems: 'center',
                  fontSize: 10.5, color: 'var(--muted)',
                  fontFamily: 'var(--font-mono)', marginTop: 2,
                }}>
                  {r.source && (
                    <span title={r.source} style={{
                      maxWidth: '60%', overflow: 'hidden',
                      textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {r.url && /^https?:/i.test(r.url) ? '🌐 ' : '📄 '}{r.source}
                    </span>
                  )}
                  {r.date && (
                    <span style={{ marginLeft: 'auto' }}>{r.date}</span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={{
          display: 'flex', alignItems: 'center', gap: 14,
          padding: '8px 18px', borderTop: '1px solid var(--border)',
          background: 'var(--bg)', fontSize: 11, color: 'var(--muted)',
        }}>
          <span><kbd style={kbdStyle}>↑↓</kbd> navegar</span>
          <span><kbd style={kbdStyle}>↵</kbd> abrir</span>
          <div style={{ flex: 1 }} />
          <span>{results.length} resultado{results.length === 1 ? '' : 's'}</span>
        </div>
      </div>
    </div>
  );
}

function HighlightedText({ text, tokens }) {
  if (!text || !tokens || tokens.length === 0) return text || '';
  const esc = tokens.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
  const re = new RegExp(esc, 'gi');
  const out = [];
  let last = 0, m, key = 0;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) out.push(text.slice(last, m.index));
    out.push(<mark key={key++} style={{ background: 'oklch(0.94 0.1 80)', color: 'oklch(0.25 0.08 80)', padding: '0 2px', borderRadius: 2 }}>{m[0]}</mark>);
    last = re.lastIndex;
    if (m.index === re.lastIndex) re.lastIndex++;   // empty-match guard
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

const kbdStyle = {
  fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 600,
  padding: '2px 6px', borderRadius: 4,
  background: 'var(--bg)', color: 'var(--muted)',
  border: '1px solid var(--border)',
};

const emptyHintStyle = {
  padding: '40px 18px', textAlign: 'center',
  fontSize: 13, color: 'var(--muted)',
  fontFamily: 'var(--font-ui)', lineHeight: 1.6,
};

Object.assign(window, { SearchPalette });
