// WriteView — Editor/Preview tabs + right panel with context, sources, chat
// HDU-G: LatexEditor is now editable. window.insertTexAtCursor lets the
// vertical toolbar inject snippets at the caret with smart positioning.
// Autocomplete: '\' for LaTeX commands, '@' for bib keys, '#' for hypotheses.
// PdfPreview renders parseLatexToHtml + MathJax. Compile PDF exports natively
// via Electron printToPDF. Local files load with FileReader.

// ===== Pastel palette (Lumen-derived) — pastel for Style-B fill, deep tone for Style-A accent =====
const PASTEL_PALETTE = [
  { name: 'Linen warm',     pastel: '#FAF0E6', deep: '#B5895A' },
  { name: 'Mint mist',      pastel: '#E8F4F0', deep: '#3F9C86' },
  { name: 'Lavender soft',  pastel: '#EDE8F5', deep: '#8061BE' },
  { name: 'Honey pale',     pastel: '#FFF3CD', deep: '#CE9A12' },
  { name: 'Sky wash',       pastel: '#E6F0FA', deep: '#4A82C4' },
  { name: 'Rose dust',      pastel: '#FCE8E8', deep: '#C56F6F' },
  { name: 'Sage light',     pastel: '#E8F5E9', deep: '#5F9E68' },
  { name: 'Parchment',      pastel: '#FDF5E4', deep: '#B89A52' },
];

// ===== Editor background styles (CSS-only textures; light & dark token sets) =====
const EDITOR_THEMES = {
  normal: {
    label: 'Normal', sub: 'Default dark editor', dark: true,
    bg: '#1E1E1E', gutterBg: '#1E1E1E', gutterText: '#5C5C5C', gutterBorder: '#2A2A2A',
    tok: { text: '#D4D4D4', cmd: '#569CD6', env: '#4EC9B0', brace: '#9AA0A6', comment: '#6A9955' },
    cursor: '#CFCFCF', overlay: null, swatch: '#1E1E1E',
  },
  paper: {
    label: 'Paper', sub: 'Warm off-white sheet', dark: false,
    bg: '#FBF7F0', gutterBg: '#F3ECE0', gutterText: '#B5A488', gutterBorder: '#EAE0D0',
    tok: { text: '#473726', cmd: '#9A6E2E', env: '#2E7D6B', brace: '#A99B86', comment: '#A38B62' },
    cursor: '#6B4F2A', overlay: null, swatch: '#FBF7F0',
  },
  'grid-notebook': {
    label: 'Grid notebook', sub: 'Engineering paper', dark: false,
    bg: '#F4F8FF', gutterBg: '#EAF1FC', gutterText: '#9DB1CE', gutterBorder: '#DBE6F5',
    tok: { text: '#22323F', cmd: '#2563B0', env: '#1F8A6B', brace: '#90A4BE', comment: '#6B86A8' },
    cursor: '#2563B0', swatch: '#F4F8FF',
    overlay: { image: 'linear-gradient(rgba(70,120,200,0.14) 1px, transparent 1px), linear-gradient(90deg, rgba(70,120,200,0.14) 1px, transparent 1px)', size: '22px 20px' },
  },
  'dot-notebook': {
    label: 'Dot notebook', sub: 'Bullet journal', dark: false,
    bg: '#FAFAFA', gutterBg: '#F2F2F2', gutterText: '#B5B5B5', gutterBorder: '#E6E6E6',
    tok: { text: '#2B2B2B', cmd: '#6D49C7', env: '#1F8A5B', brace: '#ABABAB', comment: '#8C8C8C' },
    cursor: '#6D49C7', swatch: '#FAFAFA',
    overlay: { image: 'radial-gradient(rgba(0,0,0,0.14) 1.1px, transparent 1.5px)', size: '20px 20px' },
  },
  modern: {
    label: 'Modern', sub: 'Dim slate glow', dark: true,
    bg: '#0D1117', gutterBg: '#0D1117', gutterText: '#4A5568', gutterBorder: '#1A2330',
    tok: { text: '#C9D1D9', cmd: '#79C0FF', env: '#56D364', brace: '#8B949E', comment: '#8B949E' },
    cursor: '#58A6FF', swatch: '#0D1117',
    overlay: { image: 'radial-gradient(130% 70% at 16% 26%, rgba(56,139,253,0.13), transparent 58%)', size: 'cover' },
  },
  neon: {
    label: 'Neon', sub: 'CRT retro terminal', dark: true,
    bg: '#0A0A14', gutterBg: '#0A0A14', gutterText: '#1F7F5C', gutterBorder: '#12241C',
    tok: { text: '#5CE6A0', cmd: '#00E5FF', env: '#36FFC6', brace: '#2E8B6A', comment: '#2A7F5A' },
    cursor: '#36FFC6', swatch: '#0A0A14',
    overlay: { image: 'repeating-linear-gradient(0deg, rgba(0,255,170,0.05) 0, rgba(0,255,170,0.05) 1px, transparent 1px, transparent 3px)', size: 'auto' },
  },
};

// ── Caret coords mirror ────────────────────────────────────────────────────
// Duplicates a textarea's box into a hidden div, places a marker span at the
// caret position, and reads its offsetTop/offsetLeft. Standard approach used
// by every "mention popup over textarea" library.
function getCaretCoordinates(textarea, position) {
  const style = window.getComputedStyle(textarea);
  const mirror = document.createElement('div');
  document.body.appendChild(mirror);
  Object.assign(mirror.style, {
    position: 'absolute', visibility: 'hidden', whiteSpace: 'pre-wrap', wordWrap: 'break-word',
    top: '0', left: '-9999px',
    width: textarea.clientWidth + 'px',
    padding: style.padding, border: style.border, boxSizing: style.boxSizing,
    fontFamily: style.fontFamily, fontSize: style.fontSize, fontWeight: style.fontWeight,
    lineHeight: style.lineHeight, letterSpacing: style.letterSpacing, tabSize: style.tabSize,
  });
  mirror.textContent = textarea.value.substring(0, position);
  const span = document.createElement('span');
  span.textContent = textarea.value.substring(position) || '.';
  mirror.appendChild(span);
  const coords = {
    top:  span.offsetTop - textarea.scrollTop,
    left: span.offsetLeft - textarea.scrollLeft,
  };
  document.body.removeChild(mirror);
  return coords;
}

// ── HDU-G: Smart Cursor Offset ─────────────────────────────────────────────
// Mirrors the original repo's window.insertTexAtCursor placement rules.
// Returns the offset (from the start of the inserted snippet) where the caret
// should land. Ordered by specificity — more specific cases must come first.
//
//   1. \caption{}    → caret lands inside the caption braces
//   2. \n  \n        → caret lands on the indented middle line of a multi-line env
//   3. \item   …     → caret lands after the first "\\item " of a list snippet
//   4. {}{}          → caret lands inside the FIRST pair (handles \\href{|}{})
//   5. {}            → caret lands inside the trailing braces (handles \\textbf{|})
//   6. (none)        → caret lands at the end of the snippet
function smartCaretOffset(snippet) {
  // Most specific first.
  const capIdx = snippet.indexOf('\\caption{}');
  if (capIdx !== -1) return capIdx + '\\caption{'.length;          // \caption{|}

  const multiIdx = snippet.indexOf('\n  \n');
  if (multiIdx !== -1) return multiIdx + 3;                         // middle indented line

  // List entry: after the first "\\item " so the user types the first item now.
  const itemMatch = snippet.match(/\\item\s/);
  if (itemMatch) return itemMatch.index + itemMatch[0].length;      // \item |

  // Two-arg commands: \\href{url}{text} → land in url braces. Check BEFORE {}.
  if (snippet.endsWith('{}{}')) return snippet.length - 3;          // {|}{}

  // One-arg commands: \\textbf{|}, \\section{|}, etc.
  if (snippet.endsWith('{}'))   return snippet.length - 1;          // {|}

  return snippet.length;
}

// ── HDU-G: editable LaTeX editor with overlay highlighting + autocomplete ──
function LatexEditor({ tex, setTex, paper, themeKey = 'normal' }) {
  const th = EDITOR_THEMES[themeKey] || EDITOR_THEMES.normal;
  const textareaRef = React.useRef(null);
  const preRef = React.useRef(null);
  const gutterRef = React.useRef(null);
  const [acState, setAcState] = React.useState(null);   // { trigger, query, x, y, items, selected }

  const lines = tex.split('\n');

  // Sync scroll between textarea, highlight pre, and gutter.
  // The autocomplete dropdown follows the scroll instead of closing —
  // getCaretCoordinates returns viewport-relative coords, so we just recompute.
  const onScroll = () => {
    const ta = textareaRef.current;
    if (!ta) return;
    if (preRef.current)    { preRef.current.scrollTop = ta.scrollTop; preRef.current.scrollLeft = ta.scrollLeft; }
    if (gutterRef.current) gutterRef.current.scrollTop = ta.scrollTop;
    if (acState) {
      const c = getCaretCoordinates(ta, ta.selectionStart);
      const lh = parseFloat(window.getComputedStyle(ta).lineHeight) || 20;
      setAcState(s => s && ({ ...s, x: c.left, y: c.top + lh + 4 }));
    }
  };

  // Compute autocomplete state based on the current caret.
  const computeAc = (text, pos) => {
    const before = text.slice(0, pos);
    // Find the nearest trigger char that has no whitespace between it and pos.
    const m = before.match(/([\\@#])([A-Za-z0-9_\-]*)$/);
    if (!m) return null;
    const trigger = m[1];
    const query = m[2];
    let items = [];
    if (trigger === '\\') {
      const q = ('\\' + query).toLowerCase();
      items = window.LATEX_COMMANDS
        .filter(c => c.cmd.toLowerCase().startsWith(q))
        .slice(0, 8)
        .map(c => ({ kind: c.kind, label: c.label, insert: c.snippet, replaceLen: query.length + 1 }));
    } else if (trigger === '@') {
      const q = query.toLowerCase();
      const sources = paper?.activeSources || [];
      items = sources
        .filter(s => s.id.toLowerCase().includes(q) || s.name.toLowerCase().includes(q))
        .slice(0, 6)
        .map(s => ({ kind: 'cite', label: `@${s.id} — ${s.name}`, insert: `\\citep{${s.id}}`, replaceLen: query.length + 1 }));
    } else if (trigger === '#') {
      const q = query.toLowerCase();
      const hyps = paper?.hypotheses || [];
      items = hyps
        .filter(h => h.id.toLowerCase().includes(q) || (h.text || '').toLowerCase().includes(q))
        .slice(0, 6)
        .map(h => ({ kind: 'hyp', label: `#${h.id} — ${(h.text || '').slice(0, 60)}…`, insert: `\\ref{${h.id}}`, replaceLen: query.length + 1 }));
    }
    if (!items.length) return null;
    const c = getCaretCoordinates(textareaRef.current, pos);
    const lh = parseFloat(window.getComputedStyle(textareaRef.current).lineHeight) || 20;
    return { trigger, query, x: c.left, y: c.top + lh + 4, items, selected: 0 };
  };

  const onChange = (e) => {
    const next = e.target.value;
    setTex(next);
    setAcState(computeAc(next, e.target.selectionStart));
  };

  const onClick = () => {
    const ta = textareaRef.current;
    if (!ta) return;
    setAcState(computeAc(ta.value, ta.selectionStart));
  };

  // Insert text and place caret intelligently — exposed as window.insertTexAtCursor.
  const insertAt = React.useCallback((snippet) => {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end   = ta.selectionEnd;
    const before = ta.value.slice(0, start);
    const after  = ta.value.slice(end);
    const next   = before + snippet + after;
    setTex(next);
    const caret = start + smartCaretOffset(snippet);
    requestAnimationFrame(() => {
      ta.focus();
      ta.setSelectionRange(caret, caret);
    });
  }, [setTex]);

  // Expose insertAt globally so VerticalToolbar can fire it.
  React.useEffect(() => {
    window.insertTexAtCursor = insertAt;
    return () => { if (window.insertTexAtCursor === insertAt) delete window.insertTexAtCursor; };
  }, [insertAt]);

  const applyAcItem = (item) => {
    const ta = textareaRef.current;
    if (!ta) return;
    const pos = ta.selectionStart;
    const before = ta.value.slice(0, pos - item.replaceLen);
    const after  = ta.value.slice(pos);
    const next   = before + item.insert + after;
    setTex(next);
    setAcState(null);
    const caret = before.length + smartCaretOffset(item.insert);
    requestAnimationFrame(() => {
      ta.focus();
      ta.setSelectionRange(caret, caret);
    });
  };

  const onKeyDown = (e) => {
    if (acState) {
      if (e.key === 'ArrowDown') { e.preventDefault(); setAcState(s => ({ ...s, selected: Math.min(s.selected + 1, s.items.length - 1) })); return; }
      if (e.key === 'ArrowUp')   { e.preventDefault(); setAcState(s => ({ ...s, selected: Math.max(s.selected - 1, 0) })); return; }
      if (e.key === 'Escape')    { e.preventDefault(); setAcState(null); return; }
      if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault();
        applyAcItem(acState.items[acState.selected]);
        return;
      }
    }
  };

  const sharedTextStyle = {
    fontFamily: 'var(--font-mono)', fontSize: 13, lineHeight: '20px',
    margin: 0, padding: '14px 18px', whiteSpace: 'pre-wrap', wordWrap: 'break-word',
  };

  return (
    <div style={{
      display: 'flex', flex: 1, background: th.bg, overflow: 'hidden',
      transition: 'background 0.2s ease', position: 'relative', minHeight: 0,
    }}>
      {/* Gutter */}
      <div ref={gutterRef} style={{
        padding: '14px 0', minWidth: 42, textAlign: 'right',
        color: th.gutterText, userSelect: 'none', flexShrink: 0,
        background: th.gutterBg, borderRight: `1px solid ${th.gutterBorder}`,
        overflow: 'hidden', fontFamily: 'var(--font-mono)', fontSize: 13, lineHeight: '20px',
      }}>
        {lines.map((_, i) => (
          <div key={i} style={{ padding: '0 10px', height: 20 }}>{i + 1}</div>
        ))}
      </div>

      {/* Editor overlay container */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden', minHeight: 0 }}>
        {/* Highlighted preview underneath the textarea */}
        <pre ref={preRef} aria-hidden="true" style={{
          ...sharedTextStyle, position: 'absolute', inset: 0, overflow: 'auto',
          color: th.tok.text, pointerEvents: 'none',
          backgroundImage: th.overlay ? th.overlay.image : 'none',
          backgroundSize: th.overlay ? th.overlay.size : 'auto',
          textShadow: themeKey === 'neon' ? `0 0 6px ${th.tok.text}55` : 'none',
        }}>
          {lines.map((line, li) => (
            <div key={li} style={{ minHeight: 20 }}>
              {window.highlightLatex(line).map((tok, i) => {
                const styles = {
                  cmd:     { color: th.tok.cmd },
                  env:     { color: th.tok.env },
                  brace:   { color: th.tok.brace },
                  comment: { color: th.tok.comment, fontStyle: 'italic' },
                  text:    { color: th.tok.text },
                };
                return <span key={i} style={styles[tok.kind]}>{tok.text}</span>;
              })}
              {line === '' && '​'}
            </div>
          ))}
        </pre>

        {/* The real input — transparent text, visible caret */}
        <textarea
          ref={textareaRef}
          value={tex}
          onChange={onChange}
          onScroll={onScroll}
          onKeyDown={onKeyDown}
          onClick={onClick}
          onKeyUp={onClick}
          spellCheck={false}
          style={{
            ...sharedTextStyle, position: 'absolute', inset: 0,
            color: 'transparent', caretColor: th.cursor, background: 'transparent',
            border: 'none', outline: 'none', resize: 'none', overflow: 'auto',
            WebkitTextFillColor: 'transparent',
          }}
        />

        {/* Autocomplete dropdown */}
        {acState && (
          <div style={{
            position: 'absolute', left: acState.x, top: acState.y, zIndex: 30,
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 8, boxShadow: '0 6px 22px oklch(0 0 0 / 0.18)',
            minWidth: 240, maxWidth: 360, padding: 4,
            fontFamily: 'var(--font-ui)', fontSize: 12, color: 'var(--text)',
          }}>
            <div style={{ fontSize: 10, color: 'var(--muted)', padding: '4px 8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              {acState.trigger === '\\' ? 'Comando LaTeX' : acState.trigger === '@' ? 'Cita bibliográfica' : 'Hipótesis'}
            </div>
            {acState.items.map((it, i) => {
              const hue = window.KIND_HUE?.[it.kind] || 80;
              return (
                <div key={i} onMouseDown={(e) => { e.preventDefault(); applyAcItem(it); }}
                  onMouseEnter={() => setAcState(s => ({ ...s, selected: i }))}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '5px 8px', borderRadius: 5, cursor: 'pointer',
                    background: i === acState.selected ? 'var(--accent-light)' : 'transparent',
                  }}>
                  <span style={{
                    width: 7, height: 7, borderRadius: '50%',
                    background: `oklch(0.6 0.13 ${hue})`, flexShrink: 0,
                  }} />
                  <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{it.label}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ── HDU-G: PdfPreview rendering parseLatexToHtml + MathJax ─────────────────
function PdfPreview({ paper, tex }) {
  const containerRef = React.useRef(null);
  const html = React.useMemo(() => window.parseLatexToHtml(tex || paper.tex || ''), [tex, paper.tex]);

  React.useEffect(() => {
    if (!containerRef.current) return;
    // Trigger MathJax to typeset newly-injected math.
    if (window.MathJax && window.MathJax.typesetPromise) {
      window.MathJax.typesetPromise([containerRef.current]).catch(() => {});
    }
  }, [html]);

  return (
    <div style={{ flex: 1, overflow: 'auto', background: 'oklch(0.95 0.005 80)', padding: '40px 24px' }}>
      <style>{`
        .lx-sheet { max-width: 720px; margin: 0 auto; background: #fff;
          box-shadow: 0 1px 2px oklch(0 0 0 / 0.04), 0 8px 28px oklch(0 0 0 / 0.08);
          padding: 64px 76px; font-family: 'Lora', Georgia, serif;
          color: #1a1714; line-height: 1.65; font-size: 13px; }
        .lx-title-block { text-align: center; margin-bottom: 28px; }
        .lx-title { font-size: 22px; font-weight: 600; line-height: 1.3; margin: 0 0 14px; }
        .lx-author { font-size: 13px; color: #3a342c; }
        .lx-date { font-size: 12px; color: #7a7368; font-style: italic; margin-top: 4px; }
        .lx-abstract { text-align: center; margin: 0 16px 28px; }
        .lx-abstract-label { font-weight: 600; font-size: 11px; margin-bottom: 8px; letter-spacing: 0.1em; text-transform: uppercase; }
        .lx-h1 { font-size: 17px; font-weight: 600; margin: 28px 0 10px; }
        .lx-h2 { font-size: 14.5px; font-weight: 600; margin: 22px 0 8px; }
        .lx-h3 { font-size: 13px; font-weight: 600; margin: 16px 0 6px; }
        .lx-h4 { font-size: 12.5px; font-weight: 600; margin: 12px 0 4px; font-style: italic; }
        .lx-p { font-size: 13px; margin: 0 0 12px; text-align: justify; }
        .lx-cite { color: var(--accent, #6648c1); }
        .lx-ref { color: var(--accent, #6648c1); font-style: italic; }
        .lx-link { color: var(--accent, #6648c1); text-decoration: underline; }
        .lx-ul, .lx-ol { margin: 0 0 12px 22px; padding: 0; }
        .lx-ul li, .lx-ol li { font-size: 13px; margin-bottom: 4px; }
        .lx-figure { margin: 16px 0; text-align: center; }
        .lx-fig-ph { background: #f2efe8; border: 1px dashed #b8aa92; padding: 22px 8px; color: #8a7c66; font-family: monospace; font-size: 11px; }
        .lx-figure figcaption { font-size: 11.5px; color: #58524a; margin-top: 6px; font-style: italic; }
        .lx-eq { text-align: center; margin: 14px 0; }
        .lx-foot { color: var(--accent, #6648c1); font-size: 10px; }
      `}</style>
      <div ref={containerRef} className="lx-sheet" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}

// ── HDU-G: native Electron PDF export (uses printToPDF) ────────────────────
async function compileToPdf(paper, tex) {
  const html = window.parseLatexToHtml(tex || paper.tex || '');
  const fullDoc = `<!DOCTYPE html><html><head><meta charset="utf-8">
    <title>${(paper.title || 'document').replace(/[<>]/g, '')}</title>
    <script>window.MathJax = { tex: { inlineMath: [['$','$']] }, svg: { fontCache: 'global' }, startup: { typeset: true } };<\/script>
    <script async src="https://cdn.jsdelivr.net/npm/mathjax@3.2.2/es5/tex-svg.js"><\/script>
    <style>
      body { font-family: 'Lora', Georgia, serif; color: #1a1714; line-height: 1.65;
             max-width: 720px; margin: 0 auto; padding: 40px 24px; font-size: 13px; }
      .lx-title-block { text-align: center; margin-bottom: 28px; }
      .lx-title { font-size: 22px; font-weight: 600; line-height: 1.3; margin: 0 0 14px; }
      .lx-author { font-size: 13px; }
      .lx-date { font-size: 12px; font-style: italic; margin-top: 4px; }
      .lx-abstract { text-align: center; margin: 0 16px 28px; }
      .lx-abstract-label { font-weight: 600; font-size: 11px; margin-bottom: 8px; letter-spacing: 0.1em; text-transform: uppercase; }
      .lx-h1 { font-size: 17px; font-weight: 600; margin: 28px 0 10px; }
      .lx-h2 { font-size: 14.5px; font-weight: 600; margin: 22px 0 8px; }
      .lx-h3 { font-size: 13px; font-weight: 600; margin: 16px 0 6px; }
      .lx-p { font-size: 13px; margin: 0 0 12px; text-align: justify; }
      .lx-cite, .lx-link, .lx-ref { color: #5237a3; }
      .lx-figure { margin: 16px 0; text-align: center; }
      .lx-fig-ph { background: #f2efe8; border: 1px dashed #b8aa92; padding: 22px 8px; color: #8a7c66; font-family: monospace; font-size: 11px; }
      .lx-figure figcaption { font-size: 11.5px; margin-top: 6px; font-style: italic; }
      .lx-ul, .lx-ol { margin: 0 0 12px 22px; }
    </style>
    </head><body>${html}</body></html>`;

  if (window.electronAPI?.latex?.exportPdf) {
    const safe = (paper.title || 'document').replace(/[^A-Za-z0-9_\- ]/g, '').slice(0, 60) || 'document';
    const res = await window.electronAPI.latex.exportPdf(fullDoc, safe + '.pdf');
    if (res.ok)            return { ok: true, msg: `Guardado en ${res.path}` };
    if (res.canceled)      return { ok: false, msg: 'Cancelado' };
    return { ok: false, msg: 'Error: ' + (res.error || 'desconocido') };
  }
  // Browser fallback: html2pdf
  if (window.html2pdf) {
    const wrap = document.createElement('div');
    wrap.innerHTML = fullDoc;
    window.html2pdf().from(wrap).save((paper.title || 'document') + '.pdf');
    return { ok: true, msg: 'Descarga iniciada' };
  }
  return { ok: false, msg: 'No hay backend de PDF disponible' };
}

function ChatPanel({ paper }) {
  const [input, setInput] = React.useState('');
  const [activeChips, setActiveChips] = React.useState({ lariviere2015: true, 'plan-s-2021': true });
  const messages = [
    { role: 'context', text: 'LUMEN.md cargado · 4 fuentes activas · 3 alertas' },
    { role: 'user', text: 'Genera la introducción de §3 basándote en H1 y Plan S' },
    { role: 'assistant', text: 'Basado en H1 y el mandato de Plan S (2021), el §3 puede abrirse estableciendo que la viabilidad del modelo Diamond OA depende de un umbral de financiamiento consorcial (≥60%) que no requiere mandato regulatorio adicional…' },
  ];
  const toggleChip = (id) => setActiveChips(c => ({ ...c, [id]: !c[id] }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, padding: '0 12px 12px' }}>
      <div style={{
        flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column',
        gap: 8, padding: '4px 0', minHeight: 100,
      }}>
        {messages.map((m, i) => {
          if (m.role === 'context') return (
            <div key={i} style={{
              fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-mono)',
              padding: '5px 9px', background: 'oklch(0.96 0.006 80)', borderRadius: 6,
              borderLeft: '2px solid oklch(0.6 0.13 60)',
            }}>{m.text}</div>
          );
          if (m.role === 'user') return (
            <div key={i} style={{
              alignSelf: 'flex-end', maxWidth: '88%',
              background: 'var(--accent)', color: '#fff', padding: '8px 12px',
              borderRadius: 10, fontSize: 12.5, lineHeight: 1.5,
              fontFamily: 'var(--font-ui)',
            }}>{m.text}</div>
          );
          return (
            <div key={i} style={{
              alignSelf: 'flex-start', maxWidth: '94%',
              background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)',
              padding: '9px 12px', borderRadius: 10, fontSize: 12.5, lineHeight: 1.55,
              fontFamily: 'var(--font-ui)',
            }}>{m.text}</div>
          );
        })}
      </div>

      {/* Source chips */}
      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', padding: '8px 0' }}>
        {PAPER_DATA.activeSources.filter(s => s.accessible).map(s => {
          const active = activeChips[s.id];
          return (
            <button key={s.id} onClick={() => toggleChip(s.id)} style={{
              padding: '3px 9px', borderRadius: 12, fontSize: 11,
              border: active ? '1px solid var(--accent)' : '1px solid var(--border)',
              background: active ? 'var(--accent-light)' : 'var(--surface)',
              color: active ? 'var(--accent)' : 'var(--muted)', cursor: 'pointer',
              fontFamily: 'var(--font-ui)', fontWeight: active ? 600 : 500,
              display: 'inline-flex', alignItems: 'center', gap: 4,
            }}>
              {active && <span style={{ fontSize: 9 }}>✓</span>}
              {s.name.length > 22 ? s.name.slice(0, 22) + '…' : s.name}
            </button>
          );
        })}
      </div>

      <div style={{
        display: 'flex', gap: 6, alignItems: 'center',
        background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10,
        padding: '5px 5px 5px 12px',
      }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Draft a section, check sources..."
          style={{
            flex: 1, border: 'none', outline: 'none', fontSize: 12.5,
            color: 'var(--text)', fontFamily: 'var(--font-ui)',
            background: 'transparent',
          }}
        />
        <button style={{
          background: 'var(--accent)', color: '#fff', border: 'none',
          borderRadius: 7, padding: '6px 11px', fontSize: 11.5,
          fontWeight: 600, cursor: 'pointer',
          fontFamily: 'var(--font-ui)',
        }}>↑</button>
      </div>
    </div>
  );
}

function GearIcon({ size = 15, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

/* Library-sidebar toggle — design + animation copied from My Library's collapse control */
function PanelToggle({ open, onClick }) {
  const [hover, setHover] = React.useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      title={open ? 'Collapse panel' : 'Expand panel'}
      aria-label={open ? 'Collapse panel' : 'Expand panel'}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        width: 26, height: 26, flexShrink: 0,
        border: 'none', borderRadius: 6, cursor: 'pointer',
        background: hover ? 'oklch(0.95 0.006 80)' : 'none',
        color: hover ? 'oklch(0.4 0.01 80)' : 'oklch(0.55 0.01 80)',
        transition: 'background 0.14s, color 0.14s',
      }}>
      <svg width={14} height={14} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
        style={{ transform: open ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.24s cubic-bezier(0.4,0,0.2,1)' }}>
        <path d="M4 4l4 4-4 4" />
        <path d="M9 4l4 4-4 4" />
      </svg>
    </button>
  );
}

function PanelSwatch({ entry, active, onClick }) {
  return (
    <button onClick={onClick} title={entry.name} style={{
      width: 22, height: 22, borderRadius: '50%', cursor: 'pointer',
      background: entry.pastel,
      border: active ? `2px solid ${entry.deep}` : '1px solid oklch(0.86 0.01 80)',
      boxShadow: active ? `0 0 0 2px ${entry.pastel}` : 'none',
      position: 'relative', flexShrink: 0, padding: 0,
      transition: 'border-color 0.12s, box-shadow 0.12s',
    }}>
      {active && <span style={{
        position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: entry.deep, fontSize: 11, fontWeight: 800,
      }}>✓</span>}
    </button>
  );
}

const TEXTURE_OPTS = [
  { id: 'lines', label: 'Lines' },
  { id: 'grid', label: 'Grid' },
  { id: 'dots', label: 'Dots' },
];

function WriteSettingsPanel({
  onClose, fileStyleMode, setFileStyleMode,
  fileColors, setFileColor, fileTextures, setFileTexture, editorBg, setEditorBg,
}) {
  const sectionLabel = {
    fontSize: 10.5, fontWeight: 700, color: 'var(--muted)',
    textTransform: 'uppercase', letterSpacing: '0.07em', fontFamily: 'var(--font-ui)',
    marginBottom: 9,
  };
  return (
    <>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, zIndex: 60 }} />
      <div style={{
        position: 'absolute', top: 44, right: 14, zIndex: 70, width: 300,
        maxHeight: 'calc(100% - 60px)', overflowY: 'auto',
        background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12,
        boxShadow: '0 12px 40px oklch(0 0 0 / 0.16)', fontFamily: 'var(--font-ui)',
        animation: 'fadeIn 0.14s ease',
      }}>
        {/* header */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8, padding: '12px 14px',
          borderBottom: '1px solid var(--border)',
        }}>
          <GearIcon size={14} color="var(--muted)" />
          <span style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--text)', flex: 1 }}>Display settings</span>
          <button onClick={onClose} style={{
            border: 'none', background: 'none', cursor: 'pointer', color: 'var(--muted)',
            fontSize: 16, lineHeight: 1, padding: 2,
          }}>×</button>
        </div>

        {/* Context file style */}
        <div style={{ padding: '14px 14px 12px' }}>
          <div style={sectionLabel}>Context file style</div>
          <div style={{
            display: 'flex', padding: 3, gap: 3,
            background: 'oklch(0.96 0.006 80)', border: '1px solid var(--border)', borderRadius: 9,
          }}>
            {[
              { id: 'A', label: 'Folder + bar' },
              { id: 'B', label: 'Pastel + texture' },
            ].map(o => {
              const active = fileStyleMode === o.id;
              return (
                <button key={o.id} onClick={() => setFileStyleMode(o.id)} style={{
                  flex: 1, padding: '6px 8px', fontSize: 11.5, fontWeight: active ? 600 : 500,
                  borderRadius: 7, border: 'none', cursor: 'pointer', fontFamily: 'var(--font-ui)',
                  background: active ? 'var(--surface)' : 'transparent',
                  color: active ? 'var(--text)' : 'var(--muted)',
                  boxShadow: active ? '0 1px 2px oklch(0 0 0 / 0.06), 0 0 0 1px oklch(0 0 0 / 0.04)' : 'none',
                  transition: 'all 0.14s ease',
                }}>{o.label}</button>
              );
            })}
          </div>
        </div>

        {/* Editor background */}
        <div style={{ padding: '2px 14px 16px', borderTop: '1px solid var(--border)', marginTop: 2, paddingTop: 14 }}>
          <div style={sectionLabel}>Editor background</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 7 }}>
            {Object.entries(EDITOR_THEMES).map(([key, th]) => {
              const active = editorBg === key;
              return (
                <button key={key} onClick={() => setEditorBg(key)} style={{
                  display: 'flex', alignItems: 'center', gap: 8, padding: '7px 8px',
                  borderRadius: 9, cursor: 'pointer', textAlign: 'left',
                  border: `1px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
                  background: active ? 'var(--accent-light)' : 'var(--surface)',
                  fontFamily: 'var(--font-ui)', transition: 'all 0.12s',
                }}>
                  <span style={{
                    width: 22, height: 22, borderRadius: 6, flexShrink: 0,
                    background: th.swatch, border: '1px solid oklch(0.8 0.01 80 / 0.4)',
                    backgroundImage: th.overlay ? th.overlay.image : 'none',
                    backgroundSize: th.overlay ? th.overlay.size : 'auto',
                  }} />
                  <span style={{ minWidth: 0 }}>
                    <span style={{
                      display: 'block', fontSize: 11.5, fontWeight: 600,
                      color: active ? 'var(--accent)' : 'var(--text)',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>{th.label}</span>
                    <span style={{ display: 'block', fontSize: 9.5, color: 'var(--muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{th.sub}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

const WRITE_DISP_KEY = 'lumen_write_disp_v1';
const DISP_DEFAULTS = {
  fileStyleMode: 'A',
  fileColors: { 'LUMEN.md': 3, 'SOURCES.md': 1, 'CONCEPTS.md': 2 },
  fileTextures: { 'LUMEN.md': 'lines', 'SOURCES.md': 'grid', 'CONCEPTS.md': 'dots' },
  editorBg: 'normal',
};

// HDU-G: extract loadable file extensions and a UI-driven loader.
const LOADABLE_EXT = ['.py', '.js', '.jsx', '.ts', '.tsx', '.txt', '.md', '.bib', '.json', '.tex', '.csv'];

function WriteView({ paper }) {
  const [centerTab, setCenterTab] = React.useState('Editor');
  const [rightOpen, setRightOpen] = React.useState(true);
  const [expandedFile, setExpandedFile] = React.useState(null);
  const [expandedSource, setExpandedSource] = React.useState(null);

  // HDU-G: editable .tex state + persistence
  const texKey = `lumen_tex_${paper?.title || 'default'}`;
  const [tex, setTex] = React.useState(() => {
    try { return localStorage.getItem(texKey) || paper.tex || ''; }
    catch { return paper.tex || ''; }
  });
  React.useEffect(() => { try { localStorage.setItem(texKey, tex); } catch {} }, [tex, texKey]);

  // HDU-G: locally loaded files (from disk via FileReader) — added to context files.
  const [localFiles, setLocalFiles] = React.useState([]);
  const fileInputRef = React.useRef(null);
  const [toast, setToast] = React.useState(null);
  const showToast = (msg, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 2400);
  };

  const onFilePicked = (e) => {
    const files = Array.from(e.target.files || []);
    e.target.value = '';
    files.forEach(f => {
      const ext = f.name.match(/\.[a-z0-9]+$/i)?.[0]?.toLowerCase();
      if (!LOADABLE_EXT.includes(ext)) {
        showToast(`Extensión no soportada: ${f.name}`, false);
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setLocalFiles(prev => [...prev, {
          name: f.name,
          size: f.size,
          loadStatus: 'local',
          content: String(reader.result || ''),
          color: '#10B981', colorSoft: '#D1FAE5',
        }]);
        showToast(`Cargado ${f.name}`);
      };
      reader.onerror = () => showToast(`Error leyendo ${f.name}`, false);
      reader.readAsText(f);
    });
  };

  // HDU-G: Compile to PDF
  const [compiling, setCompiling] = React.useState(false);
  const doCompile = async () => {
    setCompiling(true);
    try {
      const res = await compileToPdf(paper, tex);
      showToast(res.msg, res.ok);
    } finally { setCompiling(false); }
  };
  // Expose to Topbar.
  React.useEffect(() => {
    window.__lumenCompilePdf = doCompile;
    return () => { if (window.__lumenCompilePdf === doCompile) delete window.__lumenCompilePdf; };
  });

  // Display settings (gear panel)
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const [disp, setDisp] = React.useState(() => {
    try { return { ...DISP_DEFAULTS, ...JSON.parse(localStorage.getItem(WRITE_DISP_KEY) || '{}') }; }
    catch { return DISP_DEFAULTS; }
  });
  React.useEffect(() => { localStorage.setItem(WRITE_DISP_KEY, JSON.stringify(disp)); }, [disp]);

  const setFileStyleMode = (m) => setDisp(d => ({ ...d, fileStyleMode: m }));
  const setEditorBg = (b) => setDisp(d => ({ ...d, editorBg: b }));
  const setFileColor = (name, i) => setDisp(d => ({ ...d, fileColors: { ...d.fileColors, [name]: i } }));
  const setFileTexture = (name, t) => setDisp(d => ({ ...d, fileTextures: { ...d.fileTextures, [name]: t } }));

  const allContextFiles = [...PAPER_DATA.contextFiles, ...localFiles];

  return (
    <div style={{ display: 'flex', flex: 1, minHeight: 0, overflow: 'hidden', position: 'relative' }}>
      {/* Center panel */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, position: 'relative' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 0,
          borderBottom: '1px solid var(--border)', background: 'var(--bg)',
          padding: '0 8px 0 12px', height: 38, flexShrink: 0,
        }}>
          {['Editor', 'Preview PDF'].map(t => (
            <button key={t} onClick={() => setCenterTab(t)} style={{
              padding: '8px 14px', fontSize: 12.5,
              border: 'none', background: 'transparent',
              color: centerTab === t ? 'var(--text)' : 'var(--muted)',
              borderBottom: centerTab === t ? '2px solid var(--accent)' : '2px solid transparent',
              cursor: 'pointer', fontFamily: 'var(--font-ui)',
              fontWeight: centerTab === t ? 600 : 500,
              marginBottom: -1,
            }}>{t}</button>
          ))}
          <div style={{ flex: 1 }} />
          <button
            onClick={doCompile}
            disabled={compiling}
            title="Compilar a PDF nativo"
            style={{
              fontSize: 11.5, fontWeight: 600,
              padding: '4px 11px', marginRight: 8, borderRadius: 7,
              border: '1px solid var(--accent)',
              background: compiling ? 'oklch(0.92 0.02 260)' : 'var(--accent-light)',
              color: 'var(--accent)', cursor: compiling ? 'wait' : 'pointer',
              fontFamily: 'var(--font-ui)',
            }}>
            {compiling ? 'Compilando…' : '↓ Compile PDF'}
          </button>
          <div style={{
            fontSize: 11, color: 'var(--muted)', padding: '0 8px 0 4px',
            fontFamily: 'var(--font-mono)',
          }}>paper.tex</div>
          <PanelToggle open={rightOpen} onClick={() => setRightOpen(o => !o)} />
        </div>
        <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
          {centerTab === 'Editor'
            ? <LatexEditor tex={tex} setTex={setTex} paper={paper} themeKey={disp.editorBg} />
            : <PdfPreview paper={paper} tex={tex} />}
        </div>

        {toast && (
          <div style={{
            position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)',
            background: toast.ok ? 'oklch(0.28 0.1 145)' : 'oklch(0.38 0.14 25)',
            color: '#fff', padding: '8px 14px', borderRadius: 8,
            fontSize: 12, fontFamily: 'var(--font-ui)', fontWeight: 600,
            boxShadow: '0 4px 18px oklch(0 0 0 / 0.2)', zIndex: 80,
            animation: 'fadeIn 0.16s ease',
          }}>{toast.ok ? '✓ ' : '⚠ '}{toast.msg}</div>
        )}
      </div>

      {/* Right panel */}
      <div style={{
        width: rightOpen ? 320 : 0,
        minWidth: rightOpen ? 320 : 0,
        borderLeft: rightOpen ? '1px solid var(--border)' : 'none',
        background: 'var(--bg)', overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
        transition: 'width 0.25s ease, min-width 0.25s ease',
      }}>
        <div style={{ flex: 1, overflowY: 'auto', minHeight: 0, display: 'flex', flexDirection: 'column' }}>
          {/* Section 1: Context Files */}
          <SectionTitle action={
            <button
              onClick={() => setSettingsOpen(o => !o)}
              title="Display settings"
              aria-label="Display settings"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: 24, height: 24, borderRadius: 6, cursor: 'pointer',
                border: 'none', marginLeft: 4,
                background: settingsOpen ? 'var(--accent-light)' : 'transparent',
                color: settingsOpen ? 'var(--accent)' : 'var(--muted)',
                transition: 'background 0.14s, color 0.14s',
              }}
            >
              <GearIcon size={14} />
            </button>
          }>Context Files</SectionTitle>
          <div style={{ padding: '2px 14px 8px', display: 'flex', flexDirection: 'column', gap: 4 }}>
            {allContextFiles.map(f => {
              const idx = disp.fileColors[f.name] ?? 0;
              const entry = PASTEL_PALETTE[idx];
              return (
                <ContextFileItem key={f.name} file={f}
                  styleMode={disp.fileStyleMode}
                  colorHex={entry.pastel} deepHex={entry.deep}
                  texture={disp.fileTextures[f.name] || 'lines'}
                  expanded={expandedFile === f.name}
                  onToggle={() => setExpandedFile(e => e === f.name ? null : f.name)}
                />
              );
            })}

            {/* HDU-G: local file loader */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept={LOADABLE_EXT.join(',')}
              onChange={onFilePicked}
              style={{ display: 'none' }}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              title="Cargar archivo local (.py .md .bib .json …)"
              style={{
                marginTop: 6, padding: '8px 10px',
                border: '1px dashed var(--border)', borderRadius: 8,
                background: 'transparent', color: 'var(--muted)',
                fontSize: 11.5, fontFamily: 'var(--font-ui)',
                cursor: 'pointer', textAlign: 'center',
              }}>
              + Load local file
            </button>
          </div>

          <div style={{ height: 1, background: 'var(--border)', margin: '14px 16px' }} />

          {/* Section 2: Active Sources */}
          <SectionTitle hint="drag from library to add">Active Sources</SectionTitle>
          <div style={{ padding: '2px 14px 16px', display: 'flex', flexDirection: 'column', gap: 5, flex: 1 }}>
            {PAPER_DATA.activeSources.map(s => (
              <SourceRow key={s.id} source={s}
                expanded={expandedSource === s.id}
                onClick={() => setExpandedSource(e => e === s.id ? null : s.id)}
              />
            ))}
            <div style={{
              marginTop: 8, padding: '11px 10px',
              border: '1px dashed var(--border)', borderRadius: 8,
              fontSize: 11.5, color: 'var(--muted)', textAlign: 'center',
              fontFamily: 'var(--font-ui)',
            }}>+ Drop source from library</div>
          </div>

        </div>
      </div>

      {settingsOpen && (
        <WriteSettingsPanel
          onClose={() => setSettingsOpen(false)}
          fileStyleMode={disp.fileStyleMode} setFileStyleMode={setFileStyleMode}
          fileColors={disp.fileColors} setFileColor={setFileColor}
          fileTextures={disp.fileTextures} setFileTexture={setFileTexture}
          editorBg={disp.editorBg} setEditorBg={setEditorBg}
        />
      )}
    </div>
  );
}

Object.assign(window, { WriteView, LatexEditor, PdfPreview, ChatPanel, EDITOR_THEMES, PASTEL_PALETTE, compileToPdf });
