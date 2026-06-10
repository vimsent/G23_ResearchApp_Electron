// Topbar + VerticalToolbar + status badge
const STATUSES = ['Draft', 'Revising', 'Submitted', 'Published'];
const STATUS_TONES = {
  Draft:     { fg: 'oklch(0.42 0.12 170)', bg: 'oklch(0.94 0.05 170)', dot: 'oklch(0.55 0.12 170)' },
  Revising:  { fg: 'var(--accent)',         bg: 'var(--accent-light)',  dot: 'var(--accent)' },
  Submitted: { fg: 'oklch(0.45 0.13 60)',  bg: 'oklch(0.95 0.05 60)',  dot: 'oklch(0.6 0.13 60)' },
  Published: { fg: 'oklch(0.42 0.14 300)', bg: 'oklch(0.95 0.04 300)', dot: 'oklch(0.5 0.14 300)' },
};

function StatusBadge({ status, onChange }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  React.useEffect(() => {
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);
  const tone = STATUS_TONES[status];
  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button onClick={() => setOpen(o => !o)} style={{
        display: 'inline-flex', alignItems: 'center', gap: 7,
        background: tone.bg, border: '1px solid transparent', borderRadius: 6,
        padding: '4px 10px', fontSize: 12.5, color: tone.fg, fontWeight: 600,
        fontFamily: 'var(--font-ui)', cursor: 'pointer',
      }}>
        <span style={{
          display: 'inline-block', width: 7, height: 7, borderRadius: '50%',
          background: tone.dot,
        }} />
        {status}
        <span style={{ fontSize: 9, opacity: 0.65, marginLeft: 1 }}>▾</span>
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 4px)', right: 0,
          background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10,
          boxShadow: '0 6px 22px oklch(0 0 0 / 0.08)', minWidth: 140, zIndex: 100,
          padding: 4,
        }}>
          {STATUSES.map(s => {
            const t = STATUS_TONES[s];
            return (
              <button key={s} onClick={() => { onChange(s); setOpen(false); }} style={{
                display: 'flex', alignItems: 'center', gap: 8, width: '100%',
                background: s === status ? 'oklch(0.97 0.005 80)' : 'transparent',
                border: 'none', borderRadius: 6, padding: '7px 10px',
                fontSize: 12.5, color: 'var(--text)', cursor: 'pointer', textAlign: 'left',
                fontFamily: 'var(--font-ui)',
              }}>
                <span style={{ display: 'inline-block', width: 7, height: 7, borderRadius: '50%', background: t.dot }} />
                {s}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Topbar({ view, setView, status, setStatus, workspacePath }) {
  return (
    <div style={{
      height: 46, minHeight: 46, borderBottom: '1px solid var(--border)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 16px', background: 'var(--surface)', flexShrink: 0,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 7,
          fontFamily: 'var(--font-mono)', fontSize: 12,
          color: 'oklch(0.6 0.01 80)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          <span style={{
            display: 'inline-block', width: 8, height: 8, borderRadius: 2,
            background: 'var(--accent)', opacity: 0.85, flexShrink: 0,
          }} />
          {workspacePath}
        </div>
      </div>

      {/* Centered toggle */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', padding: 3,
        background: 'oklch(0.96 0.006 80)', border: '1px solid var(--border)', borderRadius: 20,
        position: 'relative',
      }}>
        {['Write', 'Research'].map(v => {
          const active = view === v;
          return (
            <button key={v} onClick={() => setView(v)} style={{
              padding: '5px 16px', fontSize: 13, fontWeight: active ? 600 : 500,
              borderRadius: 16, border: 'none', cursor: 'pointer',
              background: active ? 'var(--surface)' : 'transparent',
              color: active ? 'var(--text)' : 'var(--muted)',
              boxShadow: active ? '0 1px 2px oklch(0 0 0 / 0.06), 0 0 0 1px oklch(0 0 0 / 0.04)' : 'none',
              fontFamily: 'var(--font-ui)',
              transition: 'all 0.15s ease',
            }}>
              {v === 'Write' && (
                <span style={{ marginRight: 6, opacity: active ? 1 : 0.6 }}>✎</span>
              )}
              {v === 'Research' && (
                <span style={{ marginRight: 6, opacity: active ? 1 : 0.6 }}>⌕</span>
              )}
              {v}
            </button>
          );
        })}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, justifyContent: 'flex-end' }}>
        <StatusBadge status={status} onChange={setStatus} />
        <button
          onClick={() => window.__lumenCompilePdf && window.__lumenCompilePdf()}
          title="Compilar el LaTeX a PDF (vía Electron printToPDF)"
          style={{
            background: 'transparent', border: '1px solid var(--border)', borderRadius: 8,
            padding: '6px 12px', fontSize: 12.5, color: 'var(--muted)', cursor: 'pointer',
            fontFamily: 'var(--font-ui)', fontWeight: 500,
          }}>Compile PDF</button>
        <button style={{
          background: 'var(--accent)', border: '1px solid var(--accent)', borderRadius: 8,
          padding: '6px 12px', fontSize: 12.5, color: '#fff', cursor: 'pointer',
          fontWeight: 600, fontFamily: 'var(--font-ui)',
        }}>↑ Publish to arXiv</button>
        <span style={{
          background: 'oklch(0.94 0.05 170)', color: 'oklch(0.38 0.12 170)',
          padding: '4px 8px', fontSize: 11.5, fontWeight: 600, borderRadius: 5,
          fontFamily: 'var(--font-ui)',
        }}>CC BY 4.0</span>
      </div>
    </div>
  );
}

// HDU-G: 14 tools + dividers. Each `insert` is fed to window.insertTexAtCursor.
const TOOLS = [
  { id: 'bold',      label: 'B', tooltip: 'Negrita — \\textbf{|}',                    insert: '\\textbf{}',  style: { fontWeight: 700 } },
  { id: 'italic',    label: 'I', tooltip: 'Cursiva — \\textit{|}',                    insert: '\\textit{}',  style: { fontStyle: 'italic' } },
  { id: 'underline', label: 'U', tooltip: 'Subrayado — \\underline{|}',               insert: '\\underline{}', style: { textDecoration: 'underline' } },
  { divider: 1 },
  { id: 'section',    label: '§',  tooltip: 'Sección — \\section{|}',                 insert: '\\section{}' },
  { id: 'subsection', label: '§§', tooltip: 'Subsección — \\subsection{|}',           insert: '\\subsection{}',  style: { fontSize: 10 } },
  { divider: 2 },
  { id: 'eq',     label: '∑',   tooltip: 'Ecuación — \\begin{equation}',              insert: '\\begin{equation}\n  \n\\end{equation}' },
  { id: 'table',  label: '⊞',   tooltip: 'Tabla — entorno tabular',                   insert: '\\begin{table}[h]\n  \\centering\n  \\begin{tabular}{cc}\n    a & b \\\\\n    c & d \\\\\n  \\end{tabular}\n  \\caption{}\n\\end{table}' },
  { id: 'figure', label: '🖼',  tooltip: 'Figura — \\includegraphics',                insert: '\\begin{figure}[h]\n  \\centering\n  \\includegraphics[width=0.8\\textwidth]{}\n  \\caption{}\n  \\label{fig:}\n\\end{figure}' },
  { divider: 3 },
  { id: 'itemize',    label: '•',  tooltip: 'Lista con viñetas',                      insert: '\\begin{itemize}\n  \\item \n\\end{itemize}' },
  { id: 'enumerate',  label: '1.', tooltip: 'Lista numerada',                         insert: '\\begin{enumerate}\n  \\item \n\\end{enumerate}', style: { fontSize: 11 } },
  { divider: 4 },
  { id: 'cite',     label: '📖', tooltip: 'Cita bibliográfica — \\citep{|}',          insert: '\\citep{}' },
  { id: 'ref',      label: '🔗', tooltip: 'Referencia cruzada — \\ref{|}',            insert: '\\ref{}' },
  { id: 'footnote', label: '🦶', tooltip: 'Nota al pie — \\footnote{|}',              insert: '\\footnote{}' },
  { divider: 5 },
  { id: 'env',  label: '{ }', tooltip: 'Entorno personalizado',                       insert: '\\begin{name}\n  \n\\end{name}', style: { fontSize: 11.5, fontFamily: 'var(--font-mono)' } },
];

function VerticalToolbar() {
  const [hover, setHover] = React.useState(null);
  const click = (insert) => {
    if (typeof window.insertTexAtCursor === 'function') {
      window.insertTexAtCursor(insert);
    }
  };
  return (
    <div style={{
      width: 42, minWidth: 42, borderRight: '1px solid var(--border)',
      background: 'var(--bg)', display: 'flex', flexDirection: 'column',
      alignItems: 'center', padding: '8px 0', gap: 2, flexShrink: 0,
      overflow: 'visible',
    }}>
      {TOOLS.map((t, idx) => {
        if (t.divider) return <div key={`d${idx}`} style={{ width: 22, height: 1, background: 'var(--border)', margin: '4px 0' }} />;
        return (
          <div key={t.id} style={{ position: 'relative' }} onMouseEnter={() => setHover(t.id)} onMouseLeave={() => setHover(null)}>
            <button
              onClick={() => click(t.insert)}
              title={t.tooltip}
              style={{
                width: 30, height: 30, border: '1px solid transparent', borderRadius: 7,
                background: hover === t.id ? 'var(--surface)' : 'transparent',
                color: 'var(--muted)', fontSize: 13.5, cursor: 'pointer',
                fontFamily: 'var(--font-ui)', padding: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                ...(t.style || {}),
                transition: 'background 0.1s ease',
              }}>{t.label}</button>
            {hover === t.id && (
              <div style={{
                position: 'absolute', left: 'calc(100% + 6px)', top: '50%',
                transform: 'translateY(-50%)', background: 'var(--text)', color: 'var(--bg)',
                fontSize: 11.5, padding: '5px 9px', borderRadius: 6, whiteSpace: 'nowrap',
                fontFamily: 'var(--font-ui)', zIndex: 50,
                pointerEvents: 'none',
                boxShadow: '0 2px 8px oklch(0 0 0 / 0.15)',
              }}>{t.tooltip}</div>
            )}
          </div>
        );
      })}
      <div style={{ flex: 1 }} />
    </div>
  );
}

Object.assign(window, { Topbar, VerticalToolbar, STATUSES, STATUS_TONES });
