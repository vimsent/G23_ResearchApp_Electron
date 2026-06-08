// NotesParts.jsx — markdown live-preview renderer, wikilink pills, concept graph

// ── Inline parser: **bold**, *italic*, `code`, [[wikilink]] / [[target|alias]]
function parseInline(text, onOpenLink, kp) {
  const nodes = [];
  const re = /(\[\[([^\]]+)\]\]|\*\*([^*]+)\*\*|\*([^*\n]+)\*|`([^`]+)`)/g;
  let last = 0, m, k = 0;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) nodes.push(text.slice(last, m.index));
    if (m[2] !== undefined) {
      const raw = m[2];
      const [target, alias] = raw.split('|');
      nodes.push(<WikiPill key={`${kp}-w${k++}`} target={target.trim()} label={(alias || target).trim()} onOpenLink={onOpenLink} />);
    } else if (m[3] !== undefined) {
      nodes.push(<strong key={`${kp}-b${k++}`} style={{ fontWeight: 700, color: 'oklch(0.18 0.015 80)' }}>{m[3]}</strong>);
    } else if (m[4] !== undefined) {
      nodes.push(<em key={`${kp}-i${k++}`} style={{ fontStyle: 'italic', color: 'oklch(0.32 0.01 80)' }}>{m[4]}</em>);
    } else if (m[5] !== undefined) {
      nodes.push(<code key={`${kp}-c${k++}`} style={npStyles.inlineCode}>{m[5]}</code>);
    }
    last = re.lastIndex;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

function WikiPill({ target, label, onOpenLink }) {
  const exists = !!window.TITLE_TO_ID[target.toLowerCase()];
  return (
    <span
      className="nv-wikipill"
      onClick={(e) => { e.stopPropagation(); onOpenLink && onOpenLink(target); }}
      style={{
        ...npStyles.wikipill,
        ...(exists ? {} : npStyles.wikipillMissing),
      }}
      title={exists ? `Abrir «${target}»` : `Nota inexistente: ${target}`}
    >
      <svg width="9" height="9" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, opacity: 0.7 }}>
        <path d="M6.5 9.5l3-3M5 8L3.5 9.5a2.1 2.1 0 003 3L8 11M11 8l1.5-1.5a2.1 2.1 0 00-3-3L8 5" />
      </svg>
      {label}
    </span>
  );
}

// ── Block-level markdown → styled live preview ─────────────────────────────
function MarkdownDoc({ text, onOpenLink }) {
  const lines = (text || '').split('\n');
  const blocks = [];
  let i = 0, key = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.trim() === '') { i++; continue; }

    // headings
    const h = line.match(/^(#{1,4})\s+(.*)$/);
    if (h) {
      const lvl = h[1].length;
      const sz = [25, 19, 15.5, 14][lvl - 1] || 14;
      blocks.push(
        <div key={key++} style={{ ...npStyles.heading, fontSize: sz, marginTop: blocks.length ? (lvl <= 2 ? 22 : 16) : 0 }}>
          {parseInline(h[2], onOpenLink, 'h' + key)}
        </div>
      );
      i++; continue;
    }

    // blockquote (collapse consecutive)
    if (line.startsWith('>')) {
      const q = [];
      while (i < lines.length && lines[i].startsWith('>')) { q.push(lines[i].replace(/^>\s?/, '')); i++; }
      blocks.push(
        <blockquote key={key++} style={npStyles.quote}>
          {parseInline(q.join(' '), onOpenLink, 'q' + key)}
        </blockquote>
      );
      continue;
    }

    // ordered list
    if (/^\d+\.\s/.test(line)) {
      const items = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) { items.push(lines[i].replace(/^\d+\.\s/, '')); i++; }
      blocks.push(
        <ol key={key++} style={npStyles.ol}>
          {items.map((it, j) => <li key={j} style={npStyles.li}>{parseInline(it, onOpenLink, `ol${key}-${j}`)}</li>)}
        </ol>
      );
      continue;
    }

    // unordered list
    if (/^[-*]\s/.test(line)) {
      const items = [];
      while (i < lines.length && /^[-*]\s/.test(lines[i])) { items.push(lines[i].replace(/^[-*]\s/, '')); i++; }
      blocks.push(
        <ul key={key++} style={npStyles.ul}>
          {items.map((it, j) => (
            <li key={j} style={npStyles.li}>
              <span style={npStyles.bullet} />
              <span>{parseInline(it, onOpenLink, `ul${key}-${j}`)}</span>
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // paragraph
    blocks.push(<p key={key++} style={npStyles.para}>{parseInline(line, onOpenLink, 'p' + key)}</p>);
    i++;
  }

  return <div>{blocks}</div>;
}

// ── Concept graph (minimap + fullscreen) ───────────────────────────────────
const HUE_FOR_CLASS = { algoritmos: 260, estrellas: 70, proteinas: 170, vegetacion: 145, free: 305, library: 235 };

// normalized node layout (x,y in 0..1)
const GRAPH_NODES = [
  { id: 'merge', label: 'Merge Sort', x: 0.20, y: 0.30, c: 'algoritmos', r: 1.3 },
  { id: 'quick', label: 'Quick Sort', x: 0.34, y: 0.16, c: 'algoritmos' },
  { id: 'dvc', label: 'Divide y vencerás', x: 0.30, y: 0.46, c: 'algoritmos', r: 1.2 },
  { id: 'dijkstra', label: 'Dijkstra', x: 0.13, y: 0.55, c: 'algoritmos' },
  { id: 'heap', label: 'Heap Sort', x: 0.46, y: 0.30, c: 'algoritmos' },
  { id: 'betel', label: 'Betelgeuse', x: 0.78, y: 0.22, c: 'estrellas' },
  { id: 'sirius', label: 'Sirius A', x: 0.90, y: 0.38, c: 'estrellas' },
  { id: 'super', label: 'Supernova', x: 0.66, y: 0.13, c: 'estrellas' },
  { id: 'hemo', label: 'Hemoglobina', x: 0.62, y: 0.64, c: 'proteinas' },
  { id: 'colag', label: 'Colágeno', x: 0.50, y: 0.80, c: 'proteinas' },
  { id: 'mio', label: 'Mioglobina', x: 0.74, y: 0.78, c: 'proteinas' },
  { id: 'quercus', label: 'Quercus robur', x: 0.86, y: 0.66, c: 'vegetacion' },
  { id: 'carbono', label: 'Ciclo del carbono', x: 0.70, y: 0.92, c: 'vegetacion' },
  { id: 'diamond', label: 'Diamond OA', x: 0.30, y: 0.78, c: 'library', r: 1.4 },
  { id: 'plans', label: 'Plan S', x: 0.16, y: 0.88, c: 'library' },
  { id: 'grafo', label: 'Grafo vivo', x: 0.46, y: 0.60, c: 'free' },
];
const GRAPH_EDGES = [
  ['merge', 'dvc'], ['quick', 'dvc'], ['merge', 'quick'], ['quick', 'heap'],
  ['dijkstra', 'dvc'], ['betel', 'super'], ['betel', 'sirius'],
  ['hemo', 'mio'], ['hemo', 'colag'], ['colag', 'carbono'], ['quercus', 'carbono'],
  ['diamond', 'plans'], ['diamond', 'grafo'], ['grafo', 'merge'], ['diamond', 'hemo'],
];

function ConceptGraph({ width, height, large = false }) {
  const pad = large ? 0.07 : 0.10;
  const nx = n => (pad + n.x * (1 - 2 * pad)) * width;
  const ny = n => (pad + n.y * (1 - 2 * pad)) * height;
  const byId = Object.fromEntries(GRAPH_NODES.map(n => [n.id, n]));
  const baseR = large ? 6 : 2.4;
  const col = n => `oklch(0.6 0.13 ${HUE_FOR_CLASS[n.c]})`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height} style={{ display: 'block', overflow: 'visible' }}>
      {GRAPH_EDGES.map(([a, b], i) => {
        const na = byId[a], nb = byId[b];
        return <line key={i} x1={nx(na)} y1={ny(na)} x2={nx(nb)} y2={ny(nb)}
          stroke={large ? 'oklch(0.84 0.01 80)' : 'oklch(0.86 0.01 80)'} strokeWidth={large ? 1.4 : 0.7} />;
      })}
      {GRAPH_NODES.map((n, i) => {
        const r = baseR * (n.r || 1);
        return (
          <g key={i}>
            <circle cx={nx(n)} cy={ny(n)} r={r} fill={col(n)} stroke="#fff" strokeWidth={large ? 2 : 1} />
            {large && (
              <text x={nx(n) + r + 6} y={ny(n) + 4} fontSize="12.5" fontFamily="var(--font-ui)"
                fill="oklch(0.3 0.01 80)" fontWeight="500">{n.label}</text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

const npStyles = {
  wikipill: {
    display: 'inline-flex', alignItems: 'center', gap: 3,
    padding: '1px 7px 1px 6px', margin: '0 1px', borderRadius: 5,
    background: 'var(--accent-light)', color: 'var(--accent)',
    border: '1px solid oklch(0.9 0.03 var(--accent-hue, 260))',
    fontSize: '0.92em', fontWeight: 600, cursor: 'pointer',
    fontFamily: 'var(--font-ui)', lineHeight: 1.4, whiteSpace: 'nowrap',
    verticalAlign: 'baseline', transition: 'all 0.12s',
  },
  wikipillMissing: {
    background: 'oklch(0.96 0.005 80)', color: 'oklch(0.55 0.01 80)',
    border: '1px dashed oklch(0.82 0.01 80)',
  },
  inlineCode: {
    fontFamily: 'var(--font-mono)', fontSize: '0.86em',
    background: 'oklch(0.955 0.006 80)', color: 'oklch(0.4 0.06 320)',
    padding: '1px 5px', borderRadius: 4, border: '1px solid oklch(0.93 0.006 80)',
  },
  heading: { fontFamily: 'var(--font-ui)', fontWeight: 700, color: 'oklch(0.15 0.015 80)', lineHeight: 1.3, marginBottom: 8, letterSpacing: '-0.01em' },
  para: { fontFamily: 'var(--font-ui)', fontSize: 14.5, color: 'oklch(0.28 0.01 80)', lineHeight: 1.78, margin: '0 0 12px' },
  quote: { borderLeft: '3px solid var(--accent)', background: 'oklch(0.985 0.008 var(--accent-hue, 260))', padding: '8px 14px', margin: '0 0 14px', borderRadius: '0 6px 6px 0', fontFamily: 'var(--font-ui)', fontSize: 14, color: 'oklch(0.4 0.02 80)', lineHeight: 1.7, fontStyle: 'italic' },
  ul: { listStyle: 'none', margin: '0 0 14px', padding: 0, display: 'flex', flexDirection: 'column', gap: 6 },
  ol: { margin: '0 0 14px 20px', padding: 0, display: 'flex', flexDirection: 'column', gap: 6 },
  li: { fontFamily: 'var(--font-ui)', fontSize: 14.5, color: 'oklch(0.28 0.01 80)', lineHeight: 1.7, display: 'flex', alignItems: 'flex-start', gap: 9 },
  bullet: { width: 5, height: 5, borderRadius: '50%', background: 'var(--accent)', marginTop: 9, flexShrink: 0 },
};

Object.assign(window, { MarkdownDoc, ConceptGraph, parseInline });
