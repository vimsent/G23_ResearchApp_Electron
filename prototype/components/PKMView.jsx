
const CONCEPTS = [
  { id: 'c1', label: 'Diamond OA', x: 320, y: 180, size: 'large', color: 'var(--accent)', papers: 2, sources: 4 },
  { id: 'c2', label: 'Knowledge Oligopoly', x: 560, y: 120, size: 'large', color: 'oklch(0.45 0.13 20)', papers: 1, sources: 3 },
  { id: 'c3', label: 'Peer Review Economics', x: 200, y: 310, size: 'medium', color: 'oklch(0.45 0.12 170)', papers: 2, sources: 2 },
  { id: 'c4', label: 'APC Model', x: 480, y: 280, size: 'medium', color: 'oklch(0.45 0.13 20)', papers: 1, sources: 2 },
  { id: 'c5', label: 'CC BY Licensing', x: 140, y: 160, size: 'medium', color: 'oklch(0.45 0.12 170)', papers: 2, sources: 1 },
  { id: 'c6', label: 'ORCID Identity', x: 420, y: 390, size: 'small', color: 'var(--accent)', papers: 0, sources: 1 },
  { id: 'c7', label: 'CRediT Taxonomy', x: 620, y: 340, size: 'small', color: 'var(--accent)', papers: 0, sources: 1 },
  { id: 'c8', label: 'Researcher Reputation', x: 560, y: 220, size: 'medium', color: 'var(--accent)', papers: 1, sources: 2 },
  { id: 'c9', label: 'arXiv / Preprints', x: 240, y: 420, size: 'small', color: 'oklch(0.45 0.12 170)', papers: 1, sources: 2 },
  { id: 'c10', label: 'h-index Critique', x: 680, y: 190, size: 'small', color: 'oklch(0.45 0.13 20)', papers: 1, sources: 1 },
  { id: 'c11', label: 'Open Peer Review', x: 310, y: 460, size: 'small', color: 'oklch(0.45 0.12 170)', papers: 0, sources: 1 },
  { id: 'c12', label: 'Institutional Consortia', x: 680, y: 420, size: 'small', color: 'var(--accent)', papers: 1, sources: 1 },
];

const EDGES = [
  ['c1','c3'], ['c1','c4'], ['c1','c5'], ['c1','c8'],
  ['c2','c4'], ['c2','c10'], ['c2','c8'],
  ['c3','c9'], ['c3','c11'],
  ['c4','c6'], ['c4','c12'],
  ['c5','c9'], ['c6','c7'],
  ['c8','c7'], ['c8','c10'], ['c8','c12'],
];

const SIZE_R = { large: 36, medium: 26, small: 18 };
const SIZE_FONT = { large: 12, medium: 10.5, small: 9.5 };

function PKMView() {
  const [selected, setSelected] = React.useState(null);
  const [hovered, setHovered] = React.useState(null);
  const [search, setSearch] = React.useState('');
  const [newConcept, setNewConcept] = React.useState('');
  const [concepts, setConcepts] = React.useState(CONCEPTS);

  const sel = selected ? concepts.find(c => c.id === selected) : null;

  const addConcept = () => {
    if (!newConcept.trim()) return;
    const id = 'c' + (concepts.length + 1);
    setConcepts(cs => [...cs, {
      id, label: newConcept, x: 120 + Math.random() * 400, y: 100 + Math.random() * 300,
      size: 'small', color: 'var(--accent)', papers: 0, sources: 0
    }]);
    setNewConcept('');
  };

  const filtered = search
    ? concepts.filter(c => c.label.toLowerCase().includes(search.toLowerCase()))
    : concepts;
  const filteredIds = new Set(filtered.map(c => c.id));

  return (
    <div style={pkmStyles.root}>
      <div style={pkmStyles.header}>
        <div>
          <div style={pkmStyles.breadcrumb}>Workspace</div>
          <h1 style={pkmStyles.title}>Knowledge Graph</h1>
        </div>
        <div style={pkmStyles.headerRight}>
          <div style={pkmStyles.searchWrap}>
            <input style={pkmStyles.search} placeholder="Filter concepts…"
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div style={pkmStyles.addWrap}>
            <input style={pkmStyles.addInput} placeholder="New concept…"
              value={newConcept} onChange={e => setNewConcept(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addConcept()} />
            <button style={pkmStyles.addBtn} onClick={addConcept}>+ Add</button>
          </div>
        </div>
      </div>

      <div style={pkmStyles.body}>
        {/* Graph */}
        <div style={pkmStyles.canvas}>
          <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
            <defs>
              <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
                <path d="M 32 0 L 0 0 0 32" fill="none" stroke="var(--border)" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />

            {/* Edges */}
            {EDGES.map(([a, b]) => {
              const ca = concepts.find(c => c.id === a);
              const cb = concepts.find(c => c.id === b);
              if (!ca || !cb) return null;
              const isHighlighted = selected && (selected === a || selected === b);
              const isVisible = filteredIds.has(a) && filteredIds.has(b);
              return (
                <line key={a+b}
                  x1={ca.x} y1={ca.y} x2={cb.x} y2={cb.y}
                  stroke={isHighlighted ? 'var(--accent)' : 'var(--muted)'}
                  strokeWidth={isHighlighted ? 1.5 : 1}
                  strokeOpacity={isVisible ? (isHighlighted ? 1 : 0.6) : 0.15}
                  strokeDasharray={isHighlighted ? 'none' : '3,3'}
                />
              );
            })}

            {/* Nodes */}
            {concepts.map(c => {
              const r = SIZE_R[c.size];
              const isSelected = selected === c.id;
              const isHovered = hovered === c.id;
              const isFiltered = filteredIds.has(c.id);
              const opacity = filteredIds.size < concepts.length ? (isFiltered ? 1 : 0.2) : 1;
              return (
                <g key={c.id} style={{ cursor: 'pointer', opacity }}
                  onClick={() => setSelected(isSelected ? null : c.id)}
                  onMouseEnter={() => setHovered(c.id)}
                  onMouseLeave={() => setHovered(null)}
                >
                  <circle cx={c.x} cy={c.y} r={r + (isSelected || isHovered ? 4 : 0)}
                    fill={isSelected ? c.color : '#fff'}
                    stroke={c.color}
                    strokeWidth={isSelected ? 0 : 1.5}
                    opacity={isSelected ? 0.15 : 1}
                  />
                  <circle cx={c.x} cy={c.y} r={r}
                    fill={isSelected ? c.color : isHovered ? 'oklch(0.97 0.02 260)' : '#fff'}
                    stroke={c.color}
                    strokeWidth={isSelected ? 2 : 1.5}
                  />
                  <text x={c.x} y={c.y + SIZE_FONT[c.size] * 0.4}
                    textAnchor="middle"
                    fontSize={SIZE_FONT[c.size]}
                    fontFamily="var(--font-ui)"
                    fontWeight={isSelected ? 700 : 500}
                    fill={isSelected ? '#fff' : 'var(--text)'}
                    style={{ pointerEvents: 'none', userSelect: 'none' }}
                  >
                    {c.label.length > 14 ? c.label.slice(0, 12) + '…' : c.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Detail panel */}
        <div style={pkmStyles.panel}>
          {sel ? (
            <>
              <div style={pkmStyles.panelHeader}>
                <div style={{ ...pkmStyles.conceptDot, background: sel.color }} />
                <span style={pkmStyles.panelTitle}>{sel.label}</span>
              </div>
              <div style={pkmStyles.statRow}>
                <div style={pkmStyles.stat}><div style={pkmStyles.statNum}>{sel.papers}</div><div style={pkmStyles.statLabel}>papers</div></div>
                <div style={pkmStyles.stat}><div style={pkmStyles.statNum}>{sel.sources}</div><div style={pkmStyles.statLabel}>sources</div></div>
                <div style={pkmStyles.stat}><div style={pkmStyles.statNum}>{EDGES.filter(([a,b]) => a === sel.id || b === sel.id).length}</div><div style={pkmStyles.statLabel}>links</div></div>
              </div>
              <div style={pkmStyles.section}>
                <div style={pkmStyles.sectionLabel}>Connected concepts</div>
                {EDGES
                  .filter(([a,b]) => a === sel.id || b === sel.id)
                  .map(([a,b]) => {
                    const other = concepts.find(c => c.id === (a === sel.id ? b : a));
                    return other ? (
                      <div key={other.id} style={pkmStyles.linkedConcept}
                        onClick={() => setSelected(other.id)}>
                        <div style={{ ...pkmStyles.conceptDot, background: other.color, width: 6, height: 6 }} />
                        {other.label}
                      </div>
                    ) : null;
                  })
                }
              </div>
              <div style={pkmStyles.section}>
                <div style={pkmStyles.sectionLabel}>Notes</div>
                <textarea style={pkmStyles.noteArea}
                  placeholder="Add your notes on this concept…"
                  defaultValue={sel.id === 'c1' ? 'Diamond OA is the model that removes financial barriers for both readers and authors. Key for LUMEN strategy — institutional funding replaces APCs.' : ''} />
              </div>
              <button style={pkmStyles.closeBtn} onClick={() => setSelected(null)}>Deselect</button>
            </>
          ) : (
            <div style={pkmStyles.panelEmpty}>
              <div style={pkmStyles.emptyIcon}>◈</div>
              <div style={pkmStyles.emptyTitle}>Your Knowledge Graph</div>
              <div style={pkmStyles.emptyText}>
                {concepts.length} concepts · {EDGES.length} connections<br />
                Click a node to explore
              </div>
              <div style={pkmStyles.legendRow}>
                {[['large', 'Core concept'], ['medium', 'Supporting'], ['small', 'Emerging']].map(([s, l]) => (
                  <div key={s} style={pkmStyles.legendItem}>
                    <div style={{ width: SIZE_R[s] * 0.6, height: SIZE_R[s] * 0.6, borderRadius: '50%', background: 'var(--accent)', opacity: 0.7 }} />
                    <span style={pkmStyles.legendLabel}>{l}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const pkmStyles = {
  root: { display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg)', overflow: 'hidden' },
  header: { padding: '28px 32px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' },
  breadcrumb: { fontSize: 17, color: 'var(--muted)', marginBottom: 2, fontFamily: 'var(--font-ui)' },
  title: { fontSize: 30, fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--font-display)', margin: 0, letterSpacing: '-0.02em' },
  headerRight: { display: 'flex', gap: 14, alignItems: 'center', paddingBottom: 2 },
  searchWrap: {},
  search: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '10px 16px', fontSize: 16, color: 'var(--text)', outline: 'none', width: 160, fontFamily: 'var(--font-ui)' },
  addWrap: { display: 'flex', gap: 0 },
  addInput: { background: 'var(--surface)', border: '1px solid oklch(0.88 0.02 260)', borderRadius: '6px 0 0 6px', padding: '10px 16px', fontSize: 16, color: 'var(--text)', outline: 'none', width: 160, fontFamily: 'var(--font-ui)' },
  addBtn: { background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '0 6px 6px 0', padding: '10px 16px', fontSize: 16, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-ui)' },
  body: { display: 'flex', flex: 1, overflow: 'hidden', padding: '20px 32px 28px', gap: 20 },
  canvas: { flex: 1, position: 'relative', background: 'var(--surface)', borderRadius: 12, border: '1px solid var(--border)', overflow: 'hidden' },
  panel: { width: 260, background: 'var(--surface)', borderRadius: 12, border: '1px solid var(--border)', padding: 20, display: 'flex', flexDirection: 'column', gap: 0, overflow: 'auto' },
  panelHeader: { display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 },
  panelTitle: { fontSize: 16, fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--font-ui)', lineHeight: 1.3 },
  conceptDot: { width: 10, height: 10, borderRadius: '50%', flexShrink: 0 },
  statRow: { display: 'flex', gap: 14, marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid var(--surface-2)' },
  stat: { flex: 1, textAlign: 'center', background: 'var(--bg)', borderRadius: 12, padding: '8px 4px' },
  statNum: { fontSize: 30, fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--font-display)' },
  statLabel: { fontSize: 16, color: 'var(--muted)', fontFamily: 'var(--font-ui)', marginTop: 2 },
  section: { marginBottom: 14 },
  sectionLabel: { fontSize: 16, fontWeight: 700, color: 'var(--muted)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 6, fontFamily: 'var(--font-ui)' },
  linkedConcept: { display: 'flex', alignItems: 'center', gap: 7, padding: '5px 8px', borderRadius: 12, cursor: 'pointer', fontSize: 16, color: 'oklch(0.3 0.02 260)', fontFamily: 'var(--font-ui)', transition: 'background 0.1s', marginBottom: 1 },
  noteArea: { width: '100%', border: '1px solid var(--border)', borderRadius: 12, padding: '18px 20px', fontSize: 16, fontFamily: 'var(--font-ui)', color: 'var(--text)', resize: 'vertical', minHeight: 80, outline: 'none', boxSizing: 'border-box' },
  closeBtn: { background: 'none', border: '1px solid var(--border)', borderRadius: 12, padding: '10px 16px', fontSize: 17, color: 'var(--muted)', cursor: 'pointer', fontFamily: 'var(--font-ui)', marginTop: 8 },
  panelEmpty: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 14, textAlign: 'center' },
  emptyIcon: { fontSize: 36, color: 'oklch(0.75 0.05 260)', marginBottom: 4 },
  emptyTitle: { fontSize: 16, fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--font-display)' },
  emptyText: { fontSize: 16, color: 'var(--muted)', fontFamily: 'var(--font-ui)', lineHeight: 1.6 },
  legendRow: { display: 'flex', flexDirection: 'column', gap: 14, marginTop: 16, alignItems: 'flex-start' },
  legendItem: { display: 'flex', alignItems: 'center', gap: 14 },
  legendLabel: { fontSize: 17, color: 'var(--muted)', fontFamily: 'var(--font-ui)' },
};

Object.assign(window, { PKMView });
