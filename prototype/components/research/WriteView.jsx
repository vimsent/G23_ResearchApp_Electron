// WriteView — Editor/Preview tabs + right panel with context, sources, chat

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

const LATEX_FORMULAS_AND_COMMANDS = [
  { id: 'alpha',           label: '\\alpha',           info: 'Greek alpha (α)',                       text: '\\alpha '                                           },
  { id: 'beta',            label: '\\beta',            info: 'Greek beta (β)',                        text: '\\beta '                                            },
  { id: 'gamma',           label: '\\gamma',           info: 'Greek gamma (γ)',                       text: '\\gamma '                                           },
  { id: 'theta',           label: '\\theta',           info: 'Greek theta (θ)',                       text: '\\theta '                                           },
  { id: 'lambda',          label: '\\lambda',          info: 'Greek lambda (λ)',                      text: '\\lambda '                                          },
  { id: 'pi',              label: '\\pi',              info: 'Pi constant (π)',                       text: '\\pi '                                              },
  { id: 'sigma',           label: '\\sigma',           info: 'Greek sigma (σ)',                       text: '\\sigma '                                           },
  { id: 'Delta',           label: '\\Delta',           info: 'Greek Delta (Δ)',                       text: '\\Delta '                                           },
  { id: 'mu',              label: '\\mu',              info: 'Greek mu (μ)',                          text: '\\mu '                                              },
  { id: 'sum',             label: '\\sum_{i=1}^{n}',  info: 'Summation ∑',                           text: '\\sum_{i=1}^{n} '                                   },
  { id: 'int',             label: '\\int_{a}^{b}',    info: 'Integral ∫',                            text: '\\int_{a}^{b} '                                     },
  { id: 'frac',            label: '\\frac{a}{b}',     info: 'Fraction',                              text: '\\frac{a}{b}'                                       },
  { id: 'sqrt',            label: '\\sqrt{x}',        info: 'Square Root',                           text: '\\sqrt{x}'                                          },
  { id: 'infty',           label: '\\infty',           info: 'Infinity (∞)',                          text: '\\infty'                                            },
  { id: 'partial',         label: '\\partial',         info: 'Partial derivative (∂)',                text: '\\partial '                                         },
  { id: 'equation',        label: '\\begin{equation}', info: 'Math Equation Block',                  text: '\\begin{equation}\n  \n\\end{equation}'             },
  { id: 'align',           label: '\\begin{align}',   info: 'Multi-line Align Block',                text: '\\begin{align}\n  \n\\end{align}'                   },
  { id: 'section',         label: '\\section{}',       info: 'Section Heading',                       text: '\\section{}'                                        },
  { id: 'subsection',      label: '\\subsection{}',    info: 'Subsection Heading',                    text: '\\subsection{}'                                     },
  { id: 'subsubsection',   label: '\\subsubsection{}', info: 'Sub-subsection Heading',                text: '\\subsubsection{}'                                  },
  { id: 'textbf',          label: '\\textbf{}',        info: 'Bold text style',                       text: '\\textbf{}'                                         },
  { id: 'textit',          label: '\\textit{}',        info: 'Italic text style',                     text: '\\textit{}'                                         },
  { id: 'begin_abstract',  label: '\\begin{abstract}', info: 'Abstract block',                        text: '\\begin{abstract}\n  \n\\end{abstract}'             },
  { id: 'begin_itemize',   label: '\\begin{itemize}',  info: 'Bullet points list',                    text: '\\begin{itemize}\n  \\item \n\\end{itemize}'        },
  { id: 'begin_enumerate', label: '\\begin{enumerate}',info: 'Numbered list',                         text: '\\begin{enumerate}\n  \\item \n\\end{enumerate}'   },
  { id: 'item',            label: '\\item',            info: 'List item',                             text: '\\item '                                            },
  { id: 'label',           label: '\\label{}',         info: 'Cross-reference label',                 text: '\\label{}'                                          },
  { id: 'ref',             label: '\\ref{}',           info: 'Reference link',                        text: '\\ref{}'                                            },
  { id: 'href',            label: '\\href{url}{text}', info: 'External hyperlink',                    text: '\\href{}{}'                                         },
];

const getContextSuggestions = (paper) => {
  const list = [];
  if (!paper || !paper.contextFiles) return list;
  paper.contextFiles.forEach(f => {
    const lines = (f.content || '').split('\n');
    lines.forEach(line => {
      const hMatch = line.match(/(H\d+)(?::|\s+—|\s+conecta)\s*(.*)/i);
      if (hMatch) {
        list.push({
          id: hMatch[1],
          label: hMatch[1],
          info: `Hypothesis: ${hMatch[2].trim().slice(0, 50)}...`,
          text: `${hMatch[1]}: ${hMatch[2].trim()}`,
          type: 'hypothesis'
        });
      }
      const cMatch = line.match(/^[-*]\s*["']?([^":\-\n\(\)]+?)["']?\s*(?:—|:|\(|→|$)/);
      if (cMatch && cMatch[1] && cMatch[1].trim().length > 3) {
        const val = cMatch[1].trim();
        const forbidden = ['Estado', 'Creado', 'Última actualización', 'Líneas de investigación', 'Hipótesis', 'Active Sources'];
        if (!forbidden.includes(val) && !val.includes('.bib') && !val.includes('SOURCES') && !val.includes('CONCEPTS')) {
          list.push({ id: val.replace(/\s+/g, '-').toLowerCase(), label: val, info: `Concept from ${f.name}`, text: val, type: 'concept' });
        }
      }
    });
  });
  const seen = new Set();
  return list.filter(item => {
    if (seen.has(item.label.toLowerCase())) return false;
    seen.add(item.label.toLowerCase());
    return true;
  });
};

function getCaretCoordinates(element, position) {
  const properties = [
    'direction','boxSizing','width','height','overflowX','overflowY',
    'borderTopWidth','borderRightWidth','borderBottomWidth','borderLeftWidth','borderStyle',
    'paddingTop','paddingRight','paddingBottom','paddingLeft',
    'fontStyle','fontVariant','fontWeight','fontStretch','fontSize','fontSizeAdjust',
    'lineHeight','fontFamily','textAlign','textTransform','textIndent','textDecoration',
    'letterSpacing','wordSpacing','tabSize','MozTabSize',
  ];
  const div = document.createElement('div');
  document.body.appendChild(div);
  const style = div.style;
  const computed = window.getComputedStyle(element);
  style.whiteSpace = 'pre-wrap';
  style.wordWrap = 'break-word';
  style.position = 'absolute';
  style.visibility = 'hidden';
  properties.forEach(prop => { style[prop] = computed[prop]; });
  style.overflow = 'hidden';
  div.textContent = element.value.substring(0, position);
  const span = document.createElement('span');
  span.textContent = element.value.substring(position) || '.';
  div.appendChild(span);
  const coordinates = {
    top: span.offsetTop + parseInt(computed['borderTopWidth']),
    left: span.offsetLeft + parseInt(computed['borderLeftWidth']),
    lineHeight: parseInt(computed['lineHeight']) || 20,
  };
  document.body.removeChild(div);
  return coordinates;
}

function LatexEditor({ paper, tex, setTex, themeKey = 'normal' }) {
  const th = EDITOR_THEMES[themeKey] || EDITOR_THEMES.normal;
  const lines = (tex || '').split('\n');
  const textareaRef = React.useRef(null);
  const backdropRef = React.useRef(null);

  // Feature 3: Smart cursor offset — insertTexAtCursor exposed globally
  React.useEffect(() => {
    window.insertTexAtCursor = (textToInsert, cursorOffset) => {
      const textarea = textareaRef.current;
      if (!textarea) {
        setTex(prev => prev + textToInsert);
        return;
      }
      const start = textarea.selectionStart;
      const end   = textarea.selectionEnd;
      const nextVal = textarea.value.substring(0, start) + textToInsert + textarea.value.substring(end);
      setTex(nextVal);

      let offset = cursorOffset;
      if (offset === undefined) {
        if (textToInsert.includes('\\caption{}'))        offset = textToInsert.indexOf('\\caption{}') + 9;
        else if (textToInsert.endsWith('{}'))            offset = textToInsert.length - 1;
        else if (textToInsert.includes('\n  \n'))        offset = textToInsert.indexOf('\n  \n') + 3;
        else                                              offset = textToInsert.length;
      }
      setTimeout(() => {
        textarea.focus();
        const newPos = start + offset;
        textarea.setSelectionRange(newPos, newPos);
      }, 50);
    };
    return () => { window.insertTexAtCursor = null; };
  }, [setTex]);

  // Feature 2: Autocomplete state
  const [suggestions, setSuggestions]       = React.useState([]);
  const [suggestionRange, setSuggestionRange] = React.useState(null);
  const [coords, setCoords]                 = React.useState({ top: 0, left: 0 });
  const [activeIndex, setActiveIndex]       = React.useState(0);
  const itemRefs = React.useRef([]);

  // Keep the highlighted suggestion scrolled into view
  React.useEffect(() => {
    const el = itemRefs.current[activeIndex];
    if (el) el.scrollIntoView({ block: 'nearest' });
  }, [activeIndex, suggestions]);

  const handleEditorChangeOrSelect = (text, selectionStart) => {
    const before = text.substring(0, selectionStart);

    const citeMatch    = before.match(/(?:\\cite|\\citep)\{([^}]*)$/);
    const atMatch      = before.match(/@([a-zA-Z0-9_-]*)$/);
    const commandMatch = before.match(/\\([a-zA-Z]*)$/);
    const hashMatch    = before.match(/#([a-zA-Z0-9_-]*)$/);

    let activeSuggestions = [];
    let rangeType = null;
    let queryLength = 0;

    if (citeMatch) {
      const query = citeMatch[1].split(',').pop().trim();
      queryLength = query.length;
      rangeType = 'cite';
      const sources = (paper && paper.activeSources) || [];
      activeSuggestions = sources
        .map(s => ({ id: s.id, label: s.id, info: s.fullTitle || s.name || s.title || '', text: s.id, type: 'citation' }))
        .filter(s => { const q = query.toLowerCase(); return s.id.toLowerCase().includes(q) || s.info.toLowerCase().includes(q); });
    } else if (atMatch) {
      const query = atMatch[1];
      queryLength = query.length + 1;
      rangeType = 'at';
      const sources = (paper && paper.activeSources) || [];
      activeSuggestions = sources
        .map(s => ({ id: s.id, label: '@' + s.id, info: s.fullTitle || s.name || s.title || '', text: `\\citep{${s.id}}`, type: 'citation' }))
        .filter(s => { const q = query.toLowerCase(); return s.id.toLowerCase().includes(q) || s.info.toLowerCase().includes(q); });
    } else if (commandMatch) {
      const query = commandMatch[1];
      queryLength = query.length + 1;
      rangeType = 'command';
      activeSuggestions = LATEX_FORMULAS_AND_COMMANDS
        .filter(cmd => { const q = query.toLowerCase(); return cmd.id.toLowerCase().includes(q) || cmd.label.toLowerCase().includes(q); })
        .map(cmd => ({ ...cmd, type: 'command' }));
    } else if (hashMatch) {
      const query = hashMatch[1];
      queryLength = query.length + 1;
      rangeType = 'hash';
      activeSuggestions = getContextSuggestions(paper)
        .filter(item => { const q = query.toLowerCase(); return item.id.toLowerCase().includes(q) || item.label.toLowerCase().includes(q); });
    }

    if (activeSuggestions.length > 0 && textareaRef.current) {
      setSuggestions(activeSuggestions);
      setActiveIndex(0);
      setSuggestionRange({ start: selectionStart - queryLength, end: selectionStart, type: rangeType });

      const caretCoords  = getCaretCoordinates(textareaRef.current, selectionStart);
      const topVal  = caretCoords.top  - textareaRef.current.scrollTop;
      const leftVal = caretCoords.left - textareaRef.current.scrollLeft;
      const boxH = 240, boxW = 320;
      const lh   = caretCoords.lineHeight || 20;
      const near = (topVal + lh + boxH + 10) > textareaRef.current.clientHeight;
      setCoords({
        top:  near ? Math.max(10, topVal - boxH - 5) : topVal + lh + 5,
        left: Math.max(10, Math.min(leftVal, textareaRef.current.clientWidth - boxW - 20)),
      });
    } else {
      setSuggestions([]);
      setSuggestionRange(null);
    }
  };

  // Insert the chosen suggestion into the textarea (shared by click + keyboard)
  const applySuggestion = (s) => {
    if (!s || !suggestionRange) return;
    const before = tex.substring(0, suggestionRange.start);
    const after  = tex.substring(suggestionRange.end);
    let insertionText  = s.text;
    let cursorOffset   = insertionText.length;
    if (suggestionRange.type === 'cite')          { insertionText = s.text + '}'; cursorOffset = insertionText.length; }
    else if (s.text.endsWith('{}'))               { cursorOffset = s.text.length - 1; }
    else if (s.text.includes('\n  \n'))           { cursorOffset = s.text.indexOf('\n  \n') + 3; }
    setTex(before + insertionText + after);
    setSuggestions([]);
    setSuggestionRange(null);
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        const pos = suggestionRange.start + cursorOffset;
        textareaRef.current.setSelectionRange(pos, pos);
      }
    }, 50);
  };

  const NAV_KEYS = ['ArrowDown', 'ArrowUp', 'Enter', 'Tab', 'Escape'];
  const onChange  = (e) => { setTex(e.target.value); handleEditorChangeOrSelect(e.target.value, e.target.selectionStart); };
  const onKeyUp   = (e) => {
    // Don't recompute on the keys we use to drive the dropdown — it would reset the highlight
    if (suggestions.length > 0 && NAV_KEYS.includes(e.key)) return;
    handleEditorChangeOrSelect(e.target.value, e.target.selectionStart);
  };
  const onClick   = (e) => { handleEditorChangeOrSelect(e.target.value, e.target.selectionStart); };
  const onKeyDown = (e) => {
    if (suggestions.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(i => (i + 1) % suggestions.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(i => (i - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault();
      applySuggestion(suggestions[activeIndex]);
    } else if (e.key === 'Escape') {
      e.preventDefault(); e.stopPropagation();
      setSuggestions([]); setSuggestionRange(null);
    }
  };
  const onScroll  = (e) => {
    if (backdropRef.current) { backdropRef.current.scrollTop = e.target.scrollTop; backdropRef.current.scrollLeft = e.target.scrollLeft; }
    if (suggestions.length > 0 && textareaRef.current && suggestionRange) {
      const cc   = getCaretCoordinates(textareaRef.current, e.target.selectionStart);
      const topV = cc.top  - e.target.scrollTop;
      const lefV = cc.left - e.target.scrollLeft;
      const boxH = 240, boxW = 320, lh = cc.lineHeight || 20;
      const near = (topV + lh + boxH + 10) > e.target.clientHeight;
      setCoords({ top: near ? Math.max(10, topV - boxH - 5) : topV + lh + 5, left: Math.max(10, Math.min(lefV, e.target.clientWidth - boxW - 20)) });
    }
  };

  // Tokenize entire tex for highlighted backdrop
  const highlightedContent = React.useMemo(() => {
    const tokens = window.highlightLatex ? window.highlightLatex(tex || '') : [{ text: tex || '', kind: 'text' }];
    return tokens.map((token, i) => (
      <span key={i} style={{ color: th.tok[token.kind] || th.tok.text }}>{token.text}</span>
    ));
  }, [tex, th]);

  return (
    <div style={{ display: 'flex', flex: 1, overflow: 'hidden', background: th.bg, position: 'relative' }}>
      {/* Line numbers gutter */}
      <div style={{ padding: '14px 0', minWidth: 42, textAlign: 'right', color: th.gutterText, userSelect: 'none', flexShrink: 0, background: th.gutterBg, borderRight: `1px solid ${th.gutterBorder}`, zIndex: 10 }}>
        {lines.map((_, i) => (<div key={i} style={{ padding: '0 10px', height: 20 }}>{i + 1}</div>))}
      </div>

      <div style={{ position: 'relative', flex: 1, height: '100%', overflow: 'hidden' }}>
        {/* Highlighted backdrop */}
        <pre
          ref={backdropRef}
          aria-hidden="true"
          style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            padding: '14px 18px', margin: 0, border: 'none',
            fontFamily: 'var(--font-mono)', fontSize: 13, lineHeight: '20px',
            whiteSpace: 'pre', overflow: 'hidden', pointerEvents: 'none',
            background: 'transparent', boxSizing: 'border-box', zIndex: 1,
            backgroundImage: th.overlay ? th.overlay.image : 'none',
            backgroundSize: th.overlay ? th.overlay.size : 'auto',
            textShadow: themeKey === 'neon' ? `0 0 6px ${th.tok.text}55` : 'none',
          }}
        >
          {highlightedContent}
        </pre>

        {/* Editable textarea on top */}
        <textarea
          ref={textareaRef}
          value={tex}
          onChange={onChange}
          onKeyUp={onKeyUp}
          onClick={onClick}
          onKeyDown={onKeyDown}
          onScroll={onScroll}
          spellCheck={false}
          style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            padding: '14px 18px', margin: 0, border: 'none', outline: 'none', resize: 'none',
            fontFamily: 'var(--font-mono)', fontSize: 13, lineHeight: '20px',
            color: 'transparent', caretColor: th.cursor || 'white',
            background: 'transparent', whiteSpace: 'pre',
            boxSizing: 'border-box', overflow: 'auto', zIndex: 5,
          }}
        />

        {/* Floating autocomplete dropdown */}
        {suggestions.length > 0 && (
          <div style={{
            position: 'absolute', top: coords.top, left: coords.left, zIndex: 100,
            background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12,
            boxShadow: '0 8px 32px rgba(0,0,0,0.15)', width: 320, maxHeight: 240, overflowY: 'auto',
            display: 'flex', flexDirection: 'column', padding: 6,
            fontFamily: 'var(--font-ui)',
          }}>
            <div style={{
              fontSize: 10, fontWeight: 700, color: 'var(--muted)', padding: '6px 8px',
              textTransform: 'uppercase', letterSpacing: '0.05em',
              borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', marginBottom: 4,
            }}>
              <span>Autocomplete</span>
              <span style={{ fontSize: 9, textTransform: 'none', fontWeight: 500 }}>
                ↑↓ navegar · ↵ insertar · esc cerrar
              </span>
            </div>
            {suggestions.map((s, index) => {
              const badgeMap = {
                citation: { text: 'Cite',    bg: 'oklch(0.96 0.02 170)', color: 'oklch(0.45 0.12 170)' },
                command:  { text: s.info && (s.info.startsWith('Greek') || s.info.startsWith('Math')) ? 'Math' : 'Cmd',
                            bg: 'var(--accent-light)', color: 'var(--accent)' },
                hypothesis:{ text: 'Hyp',   bg: 'var(--surface-2)',  color: 'oklch(0.55 0.12 80)' },
                concept:  { text: 'Concept',bg: 'oklch(0.96 0.03 300)', color: 'oklch(0.6 0.14 300)' },
              };
              const badge = badgeMap[s.type] || { text: s.type, bg: 'var(--surface-2)', color: 'var(--muted)' };
              const isActive = index === activeIndex;
              return (
                <button
                  key={s.id + '-' + index}
                  ref={el => { itemRefs.current[index] = el; }}
                  onClick={() => applySuggestion(s)}
                  onMouseMove={() => setActiveIndex(index)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8, padding: '7px 8px',
                    border: 'none', background: isActive ? 'oklch(0.96 0.01 260)' : 'none',
                    borderRadius: 8, cursor: 'pointer',
                    textAlign: 'left', width: '100%',
                  }}
                >
                  <span style={{
                    fontSize: 9.5, fontWeight: 700, padding: '2px 6px', borderRadius: 4,
                    background: badge.bg, color: badge.color, minWidth: 46, textAlign: 'center',
                  }}>{badge.text}</span>
                  <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', fontFamily: s.type === 'command' ? 'var(--font-mono)' : 'var(--font-ui)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {s.label}
                    </span>
                    <span style={{ fontSize: 10.5, color: 'var(--muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {s.info}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function PdfPreview({ paper }) {
  const tex = (paper && paper.tex) || '';
  const title = (paper && (paper.fullTitle || paper.title)) || 'Untitled Paper';
  const parsed = React.useMemo(() => {
    return window.parseLatexToHtml
      ? window.parseLatexToHtml(tex, title)
      : { title, author: '—', date: '', abstract: '', bodyHtml: tex };
  }, [tex, title]);

  return (
    <div style={{ flex: 1, overflow: 'auto', background: 'var(--surface-2)', padding: '40px 24px' }}>
      <div
        data-pdf-preview="true"
        style={{
          maxWidth: 680, margin: '0 auto', background: 'var(--surface)',
          boxShadow: '0 1px 2px oklch(0 0 0 / 0.04), 0 8px 28px oklch(0 0 0 / 0.08)',
          padding: '64px 76px', fontFamily: "'Lora', Georgia, serif",
          color: 'var(--text)', lineHeight: 1.65,
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: 22, fontWeight: 600, lineHeight: 1.3, marginBottom: 16 }} dangerouslySetInnerHTML={{ __html: parsed.title }} />
          <div style={{ fontSize: 13, color: 'var(--text-soft)' }} dangerouslySetInnerHTML={{ __html: parsed.author }} />
          {paper && paper.workspacePath && (
            <div style={{ fontSize: 12, color: 'var(--muted)', fontStyle: 'italic', marginTop: 4 }}>{paper.workspacePath}</div>
          )}
          {parsed.date && <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 6 }}>{parsed.date}</div>}
        </div>
        {parsed.abstract && (
          <div style={{ fontSize: 12, color: 'var(--text-soft)', textAlign: 'center', marginBottom: 28 }}>
            <div style={{ fontWeight: 600, fontSize: 11, marginBottom: 8, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Abstract</div>
            <div style={{ textAlign: 'justify', padding: '0 16px' }} dangerouslySetInnerHTML={{ __html: parsed.abstract }} />
          </div>
        )}
        <div dangerouslySetInnerHTML={{ __html: parsed.bodyHtml }} />
      </div>
    </div>
  );
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
              padding: '5px 9px', background: 'var(--surface-2)', borderRadius: 6,
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
        background: hover ? 'var(--surface-2)' : 'none',
        color: hover ? 'var(--text-soft)' : 'var(--muted)',
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
      border: active ? `2px solid ${entry.deep}` : '1px solid var(--border)',
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
            background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 9,
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

        {/* File colors */}
        <div style={{ padding: '2px 14px 14px' }}>
          <div style={sectionLabel}>File colors</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
            {PAPER_DATA.contextFiles.map(f => {
              const idx = fileColors[f.name] ?? 0;
              return (
                <div key={f.name}>
                  <div style={{
                    fontFamily: 'var(--font-mono)', fontSize: 11.5, fontWeight: 600,
                    color: 'var(--text)', marginBottom: 7,
                    display: 'flex', alignItems: 'center', gap: 6,
                  }}>
                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: PASTEL_PALETTE[idx].deep }} />
                    {f.name}
                    <span style={{ color: 'var(--muted)', fontWeight: 500, fontFamily: 'var(--font-ui)', fontSize: 10.5 }}>
                      {PASTEL_PALETTE[idx].name}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
                    {PASTEL_PALETTE.map((entry, i) => (
                      <PanelSwatch key={i} entry={entry} active={i === idx} onClick={() => setFileColor(f.name, i)} />
                    ))}
                  </div>
                  {fileStyleMode === 'B' && (
                    <div style={{ display: 'flex', gap: 5, marginTop: 8 }}>
                      {TEXTURE_OPTS.map(t => {
                        const active = (fileTextures[f.name] || 'lines') === t.id;
                        return (
                          <button key={t.id} onClick={() => setFileTexture(f.name, t.id)} style={{
                            flex: 1, padding: '4px 6px', fontSize: 10.5, borderRadius: 6, cursor: 'pointer',
                            fontFamily: 'var(--font-ui)', fontWeight: active ? 600 : 500,
                            border: `1px solid ${active ? PASTEL_PALETTE[idx].deep : 'var(--border)'}`,
                            background: active ? PASTEL_PALETTE[idx].pastel : 'var(--surface)',
                            color: active ? 'var(--text-soft)' : 'var(--muted)',
                            transition: 'all 0.12s',
                          }}>{t.label}</button>
                        );
                      })}
                    </div>
                  )}
                </div>
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

function WriteView({ paper }) {
  const [centerTab, setCenterTab] = React.useState('Editor');
  const [rightOpen, setRightOpen] = React.useState(true);
  const [expandedFile, setExpandedFile] = React.useState(null);
  const [expandedSource, setExpandedSource] = React.useState(null);

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

  const [tex, setTex] = React.useState(paper.tex || '');

  // Publish the live editor context so the Topbar "Compile PDF" button can read
  // the currently-edited text (the button lives outside this component).
  const compileCtxRef = React.useRef({});
  compileCtxRef.current = {
    tex,
    title: paper.fullTitle || paper.title || 'Untitled Paper',
    workspacePath: paper.workspacePath || '',
  };
  React.useEffect(() => {
    window.getWriteCompileContext = () => compileCtxRef.current;
    return () => { window.getWriteCompileContext = null; };
  }, []);

  return (
    <div style={{ display: 'flex', flex: 1, minHeight: 0, overflow: 'hidden', position: 'relative' }}>
      {/* Center panel */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, position: 'relative' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 0,
          borderBottom: '1px solid var(--border)', background: 'var(--bg)',
          padding: '0 8px 0 12px', height: 38, flexShrink: 0,
        }}>
          {['Editor', 'Preview PDF', 'Split View'].map(t => (
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
          <div style={{
            fontSize: 11, color: 'var(--muted)', padding: '0 8px 0 14px',
            fontFamily: 'var(--font-mono)',
          }}>paper.tex</div>
          {/* Right-panel toggle — recycled from My Library sidebar */}
          <PanelToggle open={rightOpen} onClick={() => setRightOpen(o => !o)} />
        </div>
        <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
          {centerTab === 'Split View' ? (
            <>
              <div style={{ flex: 1, display: 'flex', minWidth: 0, borderRight: '1px solid var(--border)' }}>
                <LatexEditor paper={paper} tex={tex} setTex={setTex} themeKey={disp.editorBg} />
              </div>
              <div style={{ flex: 1, display: 'flex', minWidth: 0 }}>
                <PdfPreview paper={{ ...paper, tex }} />
              </div>
            </>
          ) : centerTab === 'Editor' ? (
            <LatexEditor paper={paper} tex={tex} setTex={setTex} themeKey={disp.editorBg} />
          ) : (
            <PdfPreview paper={{ ...paper, tex }} />
          )}
        </div>
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
              onMouseEnter={(e) => { if (!settingsOpen) e.currentTarget.style.background = 'var(--surface-2)'; }}
              onMouseLeave={(e) => { if (!settingsOpen) e.currentTarget.style.background = 'transparent'; }}
            >
              <GearIcon size={14} />
            </button>
          }>Context Files</SectionTitle>
          <div style={{ padding: '2px 14px 8px', display: 'flex', flexDirection: 'column', gap: 4 }}>
            {PAPER_DATA.contextFiles.map(f => {
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

Object.assign(window, { WriteView, LatexEditor, PdfPreview, ChatPanel, EDITOR_THEMES, PASTEL_PALETTE });
