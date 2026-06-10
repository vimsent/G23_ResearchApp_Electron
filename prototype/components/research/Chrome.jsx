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
                background: s === status ? 'var(--bg)' : 'transparent',
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
  const [isCompiling, setIsCompiling] = React.useState(false);

  const handleCompilePDF = () => {
    if (isCompiling) return;

    // The editor lives in WriteView; read its live text via the published getter.
    const ctx = (typeof window.getWriteCompileContext === 'function') ? window.getWriteCompileContext() : null;
    if (!ctx || !ctx.tex) {
      alert('Abre la pestaña "Write" y escribe contenido antes de compilar el PDF.');
      return;
    }

    setIsCompiling(true);
    try {
      const parsed = window.parseLatexToHtml
        ? window.parseLatexToHtml(ctx.tex, ctx.title)
        : { title: ctx.title, author: '—', date: '', abstract: '', bodyHtml: ctx.tex };

      const fullHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${parsed.title}</title>
  <link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;1,400&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
  <style>
    @page { size: A4; margin: 20mm; }
    body { font-family: 'Lora', Georgia, serif; line-height: 1.65; color: #111; background: #fff; margin: 0; padding: 0; }
    .title { font-size: 22px; font-weight: 600; line-height: 1.3; margin-bottom: 16px; text-align: center; }
    .author { font-size: 13px; color: #333; text-align: center; }
    .path { font-size: 12px; color: #666; font-style: italic; margin-top: 4px; text-align: center; }
    .date { font-size: 12px; color: #666; margin-top: 6px; text-align: center; margin-bottom: 28px; }
    .abstract-section { font-size: 12px; color: #333; margin-bottom: 28px; text-align: center; }
    .abstract-title { font-weight: 600; font-size: 11px; margin-bottom: 8px; letter-spacing: 0.1em; text-transform: uppercase; text-align: center; }
    .abstract-text { text-align: justify; padding: 0 16px; }
    h2, h3, h4 { font-family: 'Lora', Georgia, serif; font-weight: 600; }
    p { text-align: justify; text-indent: 1.5em; margin: 0 0 12px; font-size: 13px; }
  </style>
</head>
<body>
  <div class="title">${parsed.title}</div>
  <div class="author">${parsed.author}</div>
  ${ctx.workspacePath ? `<div class="path">${ctx.workspacePath}</div>` : ''}
  <div class="date">${parsed.date}</div>
  ${parsed.abstract ? `<div class="abstract-section"><div class="abstract-title">Abstract</div><div class="abstract-text">${parsed.abstract}</div></div>` : ''}
  <div>${parsed.bodyHtml}</div>
</body>
</html>`;

      // Render into a hidden iframe and invoke the browser/Electron print dialog
      // (the user picks "Save as PDF"). No extra dependencies required.
      const iframe = document.createElement('iframe');
      iframe.setAttribute('aria-hidden', 'true');
      iframe.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0;visibility:hidden;';
      document.body.appendChild(iframe);

      let cleaned = false;
      const cleanup = () => {
        if (cleaned) return;
        cleaned = true;
        try { document.body.removeChild(iframe); } catch {}
        setIsCompiling(false);
      };

      const win = iframe.contentWindow;
      const doc = win.document;
      doc.open();
      doc.write(fullHtml);
      doc.close();

      win.onafterprint = cleanup;
      const doPrint = () => {
        try { win.focus(); win.print(); }
        catch (e) { console.error('print() failed:', e); cleanup(); }
      };
      // Allow fonts/layout to settle before printing
      setTimeout(doPrint, 400);
      // Fallback cleanup if onafterprint never fires
      setTimeout(cleanup, 60000);
    } catch (err) {
      console.error('PDF compilation error:', err);
      alert('No se pudo compilar el PDF: ' + err.message);
      setIsCompiling(false);
    }
  };

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
          color: 'var(--muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
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
        background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 20,
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
          onClick={handleCompilePDF}
          disabled={isCompiling}
          title={isCompiling ? 'Compilando PDF…' : 'Compilar y guardar como PDF'}
          style={{
            background: 'transparent', border: '1px solid var(--border)', borderRadius: 8,
            padding: '6px 12px', fontSize: 12.5,
            color: isCompiling ? 'var(--muted)' : 'var(--text)',
            cursor: isCompiling ? 'not-allowed' : 'pointer',
            fontFamily: 'var(--font-ui)', fontWeight: 500,
            opacity: isCompiling ? 0.6 : 1, transition: 'opacity 0.2s',
          }}>{isCompiling ? '⧖ Compiling…' : '📄 Compile PDF'}</button>
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

const TOOLS = [
  { id: 'bold',       label: 'B',   tooltip: 'Negrita — Aplica estilo de texto en negrita (\\textbf{})',             snippet: '\\textbf{}',    style: { fontWeight: 700 } },
  { id: 'italic',     label: 'I',   tooltip: 'Cursiva — Aplica estilo de texto en cursiva (\\textit{})',             snippet: '\\textit{}',    style: { fontStyle: 'italic', fontFamily: 'Lora, Georgia, serif', fontWeight: 600 } },
  { id: 'underline',  label: 'U',   tooltip: 'Subrayado — Subraya el texto seleccionado (\\underline{})',           snippet: '\\underline{}'  },
  { id: 'div1', isDivider: true },
  { id: 'section',    label: '§',   tooltip: 'Sección — Inserta un encabezado de sección principal (\\section{})', snippet: '\\section{}'   },
  { id: 'subsection', label: '§§',  tooltip: 'Subsección — Inserta un encabezado de subsección (\\subsection{})',  snippet: '\\subsection{}' },
  { id: 'div2', isDivider: true },
  { id: 'eq',         label: '∑',   tooltip: 'Ecuación — Inserta un bloque de ecuación matemática numerada',        snippet: '\\begin{equation}\n  \n\\end{equation}' },
  { id: 'table',      label: '⊞',   tooltip: 'Tabla — Inserta una estructura de tabla modelo con leyenda',         snippet: '\\begin{table}[h!]\n\\centering\n\\begin{tabular}{|c|c|}\n\\hline\nEncabezado 1 & Encabezado 2 \\\\\n\\hline\nDato 1 & Dato 2 \\\\\n\\hline\n\\end{tabular}\n\\caption{Título de la Tabla}\n\\label{tab:tabla_ejemplo}\n\\end{table}' },
  { id: 'image',      label: '🖼️', tooltip: 'Figura — Inserta un bloque para imagen con leyenda y etiqueta',      snippet: '\\begin{figure}[h!]\n\\centering\n\\includegraphics[width=0.8\\textwidth]{imagen.png}\n\\caption{Descripción de la Figura}\n\\label{fig:figura_ejemplo}\n\\end{figure}' },
  { id: 'div3', isDivider: true },
  { id: 'list',       label: '•=',  tooltip: 'Lista con viñetas — Inserta una lista desordenada (\\begin{itemize})', snippet: '\\begin{itemize}\n  \\item \n\\end{itemize}' },
  { id: 'enum',       label: '1.',  tooltip: 'Lista numerada — Inserta una lista ordenada (\\begin{enumerate})',    snippet: '\\begin{enumerate}\n  \\item \n\\end{enumerate}' },
  { id: 'div4', isDivider: true },
  { id: 'cite',       label: '📖', tooltip: 'Cita bibliográfica — Inserta una referencia de cita (\\cite{})',       snippet: '\\cite{}'      },
  { id: 'ref',        label: '🔗', tooltip: 'Referencia cruzada — Inserta enlace a sección, tabla o figura (\\ref{})', snippet: '\\ref{}'   },
  { id: 'footnote',   label: '🦶', tooltip: 'Nota al pie — Inserta una nota aclaratoria al pie (\\footnote{})',     snippet: '\\footnote{}' },
  { id: 'div5', isDivider: true },
  { id: 'env',        label: '{ }', tooltip: 'Entorno personalizado — Crea un entorno genérico (\\begin{env})',    snippet: '\\begin{env}\n  \n\\end{env}', style: { fontSize: 11.5, fontFamily: 'var(--font-mono)' } },
];

function VerticalToolbar() {
  const [hover, setHover] = React.useState(null);

  const handleButtonClick = (t) => {
    if (window.insertTexAtCursor) {
      window.insertTexAtCursor(t.snippet);
    } else {
      alert('Por favor, selecciona la pestaña "Write" para poder insertar elementos en el editor.');
    }
  };

  return (
    <div style={{
      width: 42, minWidth: 42, borderRight: '1px solid var(--border)',
      background: 'var(--bg)', display: 'flex', flexDirection: 'column',
      alignItems: 'center', padding: '8px 0', gap: 2, flexShrink: 0,
    }}>
      {TOOLS.map(t => {
        if (t.isDivider) {
          return (
            <div key={t.id} style={{ width: 22, height: 1, background: 'var(--border)', margin: '6px 0' }} />
          );
        }
        return (
          <div key={t.id} style={{ position: 'relative' }} onMouseEnter={() => setHover(t.id)} onMouseLeave={() => setHover(null)}>
            <button
              onClick={() => handleButtonClick(t)}
              title={t.tooltip}
              style={{
                width: 30, height: 30, border: '1px solid transparent', borderRadius: 7,
                background: hover === t.id ? 'var(--surface)' : 'transparent',
                color: 'var(--muted)', fontSize: 13.5, cursor: 'pointer',
                fontFamily: 'var(--font-ui)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                ...(t.style || {}),
                transition: 'background 0.1s ease',
              }}
            >
              {t.label}
            </button>
            {hover === t.id && (
              <div style={{
                position: 'absolute', left: 'calc(100% + 6px)', top: '50%',
                transform: 'translateY(-50%)', background: 'var(--text)', color: '#fff',
                fontSize: 11.5, padding: '5px 9px', borderRadius: 6, whiteSpace: 'nowrap',
                fontFamily: 'var(--font-ui)', zIndex: 100,
                pointerEvents: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              }}>{t.tooltip}</div>
            )}
          </div>
        );
      })}
      <div style={{ flex: 1 }} />
      <div style={{ width: 22, height: 1, background: 'var(--border)', margin: '4px 0' }} />
      <button style={{
        width: 30, height: 30, border: 'none', borderRadius: 7,
        background: 'transparent', color: 'var(--muted)', fontSize: 14, cursor: 'pointer',
      }}>···</button>
    </div>
  );
}

Object.assign(window, { Topbar, VerticalToolbar, STATUSES, STATUS_TONES });
