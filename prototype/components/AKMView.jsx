
const RESEARCH_LINES = [
  {
    id: 'rl1',
    question: 'Can Diamond OA models eliminate APC dependency while preserving quality signals in peer review?',
    state: 'active',
    narrative: 'Started from the observation that Gold OA merely relocates the financial barrier from reader to author. The central tension is between institutional funding sustainability and the prestige function that commercial publishers currently provide. Key insight from Larivière 2015: the oligopoly survives not just through paywalls but through the prestige infrastructure. Diamond OA must offer a credible prestige alternative — not just a cheaper one.\n\nCurrent direction: exploring how institutional consortia in LATAM can pool resources to fund Diamond journals, using SciELO as proof of concept.',
    papers: ['paper-1', 'paper-2'],
    created: '2024-08-12',
    updated: '2026-04-18',
  },
  {
    id: 'rl2',
    question: 'How can verified contributor identity decouple researcher reputation from journal prestige?',
    state: 'active',
    narrative: 'The h-index critique is well established but no credible alternative has achieved institutional adoption. ORCID provides identity but not reputation. The gap is a platform that aggregates verified contributions — authorship roles (CRediT), peer review records, datasets, code — into a profile that committees can evaluate independently of where papers were published.\n\nOpen question: what is the minimum institutional adoption threshold for an alternative reputation signal to become self-sustaining?',
    papers: ['paper-2'],
    created: '2025-01-20',
    updated: '2026-04-10',
  },
  {
    id: 'rl3',
    question: 'Do preprint citation rates post-2020 reflect a permanent structural shift in scholarly communication?',
    state: 'suspended',
    narrative: 'Initial evidence from bioRxiv and medRxiv during COVID-19 suggested a permanent acceleration of preprint adoption. Brierley & Nanni 2024 shows a 3.4× increase in citation rates. However, the causal mechanism is unclear — is this a genuine norm shift or a COVID-specific artifact?\n\nSuspended: deprioritized while paper-1 is in progress. Will return after submission.',
    papers: [],
    created: '2025-03-05',
    updated: '2025-11-14',
  },
];

const HYPOTHESES = [
  // rl1 — main rail + one branch
  { id: 'h1', lineId: 'rl1', state: 'active',    t: 0.12, rail: 0,
    description: 'Diamond OA reduces systemic dependency on APC payments when institutional consortia provide baseline funding equivalent to ≥60% of editorial operating costs.',
    refutation: null },
  { id: 'h2', lineId: 'rl1', state: 'active',    t: 0.72, rail: 0,
    description: 'Researcher identity platforms can decouple prestige signaling from commercial publisher infrastructure within a 10-year adoption horizon given sufficient institutional backing.',
    refutation: null },
  { id: 'h3', lineId: 'rl1', state: 'in-review', t: 0.50, rail: 1, branchFrom: 0.12,
    description: 'Institutional consortia in Latin America can fully replace individual subscription agreements with pooled Diamond OA funding without net budget increase.',
    refutation: null },

  // rl2 — main rail + one branch (refuted)
  { id: 'h4', lineId: 'rl2', state: 'active',    t: 0.22, rail: 0,
    description: 'Verified peer review records, when aggregated into a public profile, are weighted as positively as journal impact factor by tenure committees evaluating junior researchers.',
    refutation: null },
  { id: 'h5', lineId: 'rl2', state: 'refuted',   t: 0.68, rail: 1, branchFrom: 0.22,
    description: 'The h-index can be fully replaced by a composite metric combining CRediT role distribution, review-to-authorship ratio, and open-access rate.',
    refutation: 'Sinatra et al. 2016 demonstrates that citation-based metrics have predictive validity for long-term influence that role-based metrics cannot replicate without longitudinal data (>15 years). A composite metric is a complement, not a replacement, in the short term.' },

  // rl3 — main rail only
  { id: 'h6', lineId: 'rl3', state: 'suspended', t: 0.40, rail: 0,
    description: 'Preprint citation rates post-2020 reflect a permanent norm shift in scholarly communication rather than a COVID-specific artifact.',
    refutation: null },
];

const STATE_CONFIG = {
  active:      { label: 'Active',    color: 'oklch(0.55 0.16 145)', bg: 'oklch(0.95 0.06 145)', border: 'oklch(0.85 0.08 145)', dot: '#5a9020' },
  'in-review': { label: 'In review', color: 'oklch(0.45 0.14 250)', bg: 'oklch(0.95 0.05 250)', border: 'oklch(0.85 0.08 250)', dot: '#3a78d8' },
  suspended:   { label: 'Suspended', color: 'oklch(0.5 0.02 80)',   bg: 'oklch(0.94 0.01 80)',  border: 'oklch(0.85 0.01 80)',  dot: '#8e8a82' },
  refuted:     { label: 'Refuted',   color: 'oklch(0.5 0.18 25)',   bg: 'oklch(0.95 0.06 25)',  border: 'oklch(0.85 0.1 25)',   dot: '#d8493f' },
  closed:      { label: 'Closed',    color: 'oklch(0.55 0.02 80)',  bg: 'oklch(0.93 0.01 80)',  border: 'oklch(0.85 0.01 80)',  dot: '#a0a0a0' },
};

const PAPER_NAMES = {
  'paper-1': 'Diamond OA Framework',
  'paper-2': 'Peer Review Economics',
};

function StatePill({ state, size = 'sm' }) {
  const cfg = STATE_CONFIG[state] || STATE_CONFIG.active;
  const padding = size === 'sm' ? '3px 8px' : '4px 10px';
  const fs = size === 'sm' ? 11 : 12;
  return (
    <span style={{ fontSize: fs, fontWeight: 600, padding, borderRadius: 20, background: cfg.bg, color: cfg.color, fontFamily: 'var(--font-ui)', letterSpacing: '0.01em', whiteSpace: 'nowrap' }}>
      {cfg.label}
    </span>
  );
}

// Mini rails for sidebar cards — pure SVG
function MiniRails({ hyps }) {
  const W = 232, H = 36, PAD = 10;
  const rails = [...new Set(hyps.map(h => h.rail))].sort((a, b) => a - b);
  const railCount = Math.max(...rails, 0) + 1;
  const railSpacing = railCount > 1 ? 12 : 0;
  const mainY = railCount > 1 ? H - 12 : H / 2;

  const xOf = t => PAD + t * (W - PAD * 2);
  const yOf = r => mainY - r * railSpacing;

  const trackCol = 'oklch(0.85 0.008 80)';
  const branchCol = 'oklch(0.9 0.008 80)';

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} style={{ overflow: 'visible', display: 'block' }}>
      {/* main rail */}
      <line x1="0" y1={mainY} x2={W} y2={mainY} stroke={trackCol} strokeWidth="1.5" />

      {/* branches */}
      {Array.from({ length: railCount - 1 }, (_, i) => {
        const r = i + 1;
        const rHyps = hyps.filter(h => h.rail === r);
        if (!rHyps.length) return null;
        const ry = yOf(r);
        const bx = xOf(rHyps[0].branchFrom ?? 0);
        const joinX = bx + 18;
        return (
          <g key={r}>
            <path
              d={`M${bx},${mainY} C${bx + 8},${mainY - 2} ${joinX - 6},${ry + 4} ${joinX},${ry}`}
              fill="none" stroke={branchCol} strokeWidth="1" strokeDasharray="3,3"
            />
            <line x1={joinX} y1={ry} x2={W} y2={ry} stroke={branchCol} strokeWidth="1.2" />
          </g>
        );
      })}

      {/* dots */}
      {hyps.map(h => {
        const cfg = STATE_CONFIG[h.state] || STATE_CONFIG.active;
        return (
          <circle key={h.id} cx={xOf(h.t)} cy={yOf(h.rail)} r="3.5" fill={cfg.dot} stroke="#fff" strokeWidth="1" />
        );
      })}
    </svg>
  );
}

// Main canvas-based rails timeline
function MainRails({ hyps, selectedHyp, onSelectHyp, onHoverHyp }) {
  const canvasRef = React.useRef(null);
  const wrapRef = React.useRef(null);
  const [hover, setHover] = React.useState(null); // { hyp, x, y }
  const [width, setWidth] = React.useState(600);

  React.useEffect(() => {
    if (!wrapRef.current) return;
    const ro = new ResizeObserver(() => {
      setWidth(wrapRef.current.offsetWidth);
    });
    ro.observe(wrapRef.current);
    setWidth(wrapRef.current.offsetWidth);
    return () => ro.disconnect();
  }, []);

  const rails = [...new Set(hyps.map(h => h.rail))].sort((a, b) => a - b);
  const railCount = Math.max(...rails, 0) + 1;
  const RAIL_SPACING = 44;
  const PAD_X = 36;
  const TOP = 32;
  const BOTTOM = 24;
  const H = TOP + (railCount - 1) * RAIL_SPACING + BOTTOM;

  const xOf = t => PAD_X + t * (width - PAD_X * 2);
  const yOf = r => TOP + r * RAIL_SPACING;

  // Build hit targets for hover/click
  const hits = hyps.map(h => ({ h, x: xOf(h.t), y: yOf(h.rail) }));

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = H * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = H + 'px';
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, H);

    const trackCol = 'oklch(0.82 0.01 80)';
    const branchCol = 'oklch(0.88 0.01 80)';
    const labelCol = 'oklch(0.6 0.01 80)';

    // Main rail
    ctx.strokeStyle = trackCol;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, yOf(0));
    ctx.lineTo(width, yOf(0));
    ctx.stroke();

    // Branch rails
    for (let r = 1; r < railCount; r++) {
      const rHyps = hyps.filter(h => h.rail === r);
      if (!rHyps.length) continue;
      const ry = yOf(r);
      const branchT = rHyps[0].branchFrom ?? 0;
      const bx = xOf(branchT);
      const joinX = bx + 40;

      ctx.strokeStyle = branchCol;
      ctx.lineWidth = 1.3;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(bx, yOf(0));
      ctx.bezierCurveTo(bx + 8, yOf(0) + 10, joinX - 8, ry - 10, joinX, ry);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.beginPath();
      ctx.moveTo(joinX, ry);
      ctx.lineTo(width, ry);
      ctx.stroke();

      ctx.fillStyle = labelCol;
      ctx.font = '500 10px "DM Sans", system-ui, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('branch', joinX + 6, ry - 7);
    }

    // Dots
    hits.forEach(({ h, x, y }) => {
      const cfg = STATE_CONFIG[h.state] || STATE_CONFIG.active;
      const isSel = selectedHyp === h.id;
      const isHov = hover && hover.h.id === h.id;
      const r = isSel ? 9 : (isHov ? 8 : 6.5);

      // halo on selected
      if (isSel) {
        ctx.fillStyle = cfg.bg;
        ctx.beginPath();
        ctx.arc(x, y, r + 5, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.fillStyle = cfg.dot;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = isSel ? 2.5 : 2;
      ctx.stroke();

      // label below
      ctx.fillStyle = isSel ? cfg.color : labelCol;
      ctx.font = `${isSel ? '600' : '500'} 10px "JetBrains Mono", monospace`;
      ctx.textAlign = 'center';
      ctx.fillText(h.id.toUpperCase(), x, y + r + 13);
    });
  }, [width, hyps, selectedHyp, hover, railCount]);

  const handleMove = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    let found = null;
    for (const hit of hits) {
      if ((mx - hit.x) ** 2 + (my - hit.y) ** 2 < 18 * 18) { found = hit; break; }
    }
    if (found) {
      setHover({ h: found.h, x: found.x, y: found.y });
      canvasRef.current.style.cursor = 'pointer';
      onHoverHyp?.(found.h);
    } else {
      setHover(null);
      canvasRef.current.style.cursor = 'default';
      onHoverHyp?.(null);
    }
  };
  const handleLeave = () => { setHover(null); onHoverHyp?.(null); };
  const handleClick = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    for (const hit of hits) {
      if ((mx - hit.x) ** 2 + (my - hit.y) ** 2 < 18 * 18) { onSelectHyp(hit.h.id); return; }
    }
  };

  return (
    <div ref={wrapRef} style={{ position: 'relative', width: '100%' }}>
      <canvas ref={canvasRef} onMouseMove={handleMove} onMouseLeave={handleLeave} onClick={handleClick} />
      {hover && (
        <div style={{
          position: 'absolute',
          left: Math.min(Math.max(hover.x - 130, 8), width - 268),
          top: hover.y + 18,
          width: 260,
          background: '#fff',
          border: '1px solid oklch(0.88 0.01 80)',
          borderRadius: 10,
          padding: '10px 12px',
          boxShadow: '0 8px 24px oklch(0 0 0 / 0.10)',
          pointerEvents: 'none',
          zIndex: 5,
          fontFamily: 'var(--font-ui)',
          animation: 'fadeIn 0.12s ease',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'oklch(0.4 0.01 80)', background: 'oklch(0.95 0.005 80)', padding: '2px 6px', borderRadius: 4 }}>
              {hover.h.id.toUpperCase()}
            </span>
            <StatePill state={hover.h.state} />
            {hover.h.rail > 0 && (
              <span style={{ fontSize: 10, color: 'oklch(0.55 0.01 80)', fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                <svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 3v10M6 7c0 2 2 4 4 4M10 11v2"/></svg>
                branch
              </span>
            )}
          </div>
          <div style={{ fontSize: 12, color: 'oklch(0.25 0.01 80)', lineHeight: 1.55 }}>
            {hover.h.description}
          </div>
        </div>
      )}
    </div>
  );
}

function AKMView() {
  const [page, setPage] = React.useState(() => {
    try { return JSON.parse(localStorage.getItem('lumen_akm_page') || '""') || 'lines'; } catch { return 'lines'; }
  });
  React.useEffect(() => { localStorage.setItem('lumen_akm_page', JSON.stringify(page)); }, [page]);

  const [lines, setLines] = React.useState(RESEARCH_LINES);
  const [hypotheses, setHypotheses] = React.useState(HYPOTHESES);
  const [selectedLine, setSelectedLine] = React.useState('rl1');
  const [selectedHyp, setSelectedHyp] = React.useState(null);
  const [showNewLine, setShowNewLine] = React.useState(false);
  const [showNewHyp, setShowNewHyp] = React.useState(false);
  const [newLineQ, setNewLineQ] = React.useState('');
  const [newHypText, setNewHypText] = React.useState('');
  const [narrativeOpen, setNarrativeOpen] = React.useState(false);
  const [narrativeEdit, setNarrativeEdit] = React.useState(false);
  const [narrativeDraft, setNarrativeDraft] = React.useState('');
  const [hoveredHyp, setHoveredHyp] = React.useState(null);

  const activeLine = lines.find(l => l.id === selectedLine);
  const lineHyps = hypotheses.filter(h => h.lineId === selectedLine);

  const addLine = () => {
    if (!newLineQ.trim()) return;
    const id = 'rl' + (lines.length + 1);
    setLines(ls => [...ls, { id, question: newLineQ, state: 'active', narrative: '', papers: [], created: '2026-05-18', updated: '2026-05-18' }]);
    setSelectedLine(id);
    setNewLineQ('');
    setShowNewLine(false);
  };

  const addHyp = () => {
    if (!newHypText.trim()) return;
    const existing = hypotheses.filter(h => h.lineId === selectedLine);
    const lastT = existing.length ? Math.max(...existing.map(h => h.t)) : 0;
    const id = 'h' + (hypotheses.length + 1);
    setHypotheses(hs => [...hs, {
      id, lineId: selectedLine, state: 'in-review',
      t: Math.min(lastT + 0.14, 0.92), rail: 0,
      description: newHypText, refutation: null,
    }]);
    setNewHypText('');
    setShowNewHyp(false);
  };

  const updateHypState = (hid, state) => {
    setHypotheses(hs => hs.map(h => h.id === hid ? { ...h, state } : h));
  };

  const startNarrativeEdit = () => {
    setNarrativeDraft(activeLine?.narrative || '');
    setNarrativeEdit(true);
    setNarrativeOpen(true);
  };

  const saveNarrative = () => {
    setLines(ls => ls.map(l => l.id === selectedLine ? { ...l, narrative: narrativeDraft, updated: '2026-05-18' } : l));
    setNarrativeEdit(false);
  };

  const statsActive = hypotheses.filter(h => h.state === 'active').length;
  const statsRefuted = hypotheses.filter(h => h.state === 'refuted').length;
  const statsLines = lines.filter(l => l.state === 'active').length;

  // Auto-scroll to selected hyp card when timeline dot is clicked
  React.useEffect(() => {
    if (!selectedHyp) return;
    const el = document.getElementById(`hyp-card-${selectedHyp}`);
    if (el) el.scrollIntoView && el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [selectedHyp]);

  return (
    <div style={ak.root}>
      {/* Header */}
      <div style={ak.header}>
        <div>
          <div style={ak.breadcrumb}>Workspace</div>
          <h1 style={ak.title}>Academic Knowledge Manager</h1>
          <div style={ak.subtitle}>
            {page === 'notes' ? 'Typed notes · Free notes · Source library' : 'Research lines · Hypothesis rails · Negative knowledge'}
          </div>
        </div>
        {page === 'lines' && (
          <div style={ak.headerStats}>
            {[['Active lines', statsLines], ['Active hypotheses', statsActive], ['Refuted (knowledge)', statsRefuted]].map(([l, v]) => (
              <div key={l} style={ak.headerStat}>
                <div style={ak.headerStatNum}>{v}</div>
                <div style={ak.headerStatLabel}>{l}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Page toggle */}
      <div style={ak.pageTabs}>
        {[['notes', 'Notes'], ['lines', 'Research Lines']].map(([id, label]) => (
          <button key={id} onClick={() => setPage(id)}
            style={{ ...ak.pageTab, ...(page === id ? ak.pageTabActive : {}) }}>
            {label}
          </button>
        ))}
      </div>

      {page === 'notes' && <NotesView />}

      {page === 'lines' && <div style={ak.body}>
        {/* Left: Lines list with mini rails */}
        <div style={ak.linesPanel}>
          <div style={ak.panelHeader}>
            <span style={ak.panelTitle}>Research Lines</span>
            <button style={ak.addBtn} onClick={() => setShowNewLine(true)} title="New research line">+</button>
          </div>

          <div style={{ overflowY: 'auto', flex: 1 }}>
            {showNewLine && (
              <div style={ak.newLineForm}>
                <textarea
                  style={ak.newLineInput}
                  placeholder="What is the guiding question for this research line?"
                  value={newLineQ}
                  onChange={e => setNewLineQ(e.target.value)}
                  rows={3}
                  autoFocus
                />
                <div style={{ display: 'flex', gap: 6 }}>
                  <button style={ak.confirmBtn} onClick={addLine}>Add line</button>
                  <button style={ak.cancelBtn} onClick={() => { setShowNewLine(false); setNewLineQ(''); }}>Cancel</button>
                </div>
              </div>
            )}

            {lines.map(line => {
              const isActive = selectedLine === line.id;
              const hyps = hypotheses.filter(h => h.lineId === line.id);
              return (
                <div key={line.id}
                  style={{ ...ak.lineItem, ...(isActive ? ak.lineItemActive : {}) }}
                  onClick={() => { setSelectedLine(line.id); setSelectedHyp(null); setNarrativeEdit(false); setNarrativeOpen(false); }}>
                  <div style={ak.lineItemTop}>
                    <StatePill state={line.state} />
                    <span style={ak.lineDate}>{line.updated}</span>
                  </div>
                  <div style={ak.lineQuestion}>{line.question}</div>
                  <div style={ak.miniRailsWrap}>
                    <MiniRails hyps={hyps} />
                  </div>
                  <div style={ak.lineMeta}>
                    <span style={ak.metaItem}>
                      <span style={ak.metaDot} /> {hyps.length} hyp.
                    </span>
                    <span style={ak.metaItem}>
                      <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="2" width="10" height="12" rx="1"/><line x1="5.5" y1="6" x2="10.5" y2="6"/><line x1="5.5" y1="9" x2="10.5" y2="9"/></svg>
                      {line.papers.length} papers
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Center: Rails + hypothesis cards */}
        {activeLine && (
          <div style={ak.centerPanel}>
            {/* Line header */}
            <div style={ak.lineDetailHeader}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={ak.lineDetailLabel}>Research line · {activeLine.id.toUpperCase()}</div>
                <div style={ak.lineDetailQ}>{activeLine.question}</div>
              </div>
              <StatePill state={activeLine.state} size="md" />
            </div>

            {/* Rails timeline */}
            <div style={ak.railsZone}>
              <div style={ak.railsHeaderRow}>
                <div>
                  <div style={ak.sectionTitle}>Hypothesis rails</div>
                  <div style={ak.sectionSub}>Main line and branches over the line's lifespan</div>
                </div>
                <div style={ak.hint}>Hover dots · click to select</div>
              </div>

              <MainRails
                hyps={lineHyps}
                selectedHyp={selectedHyp}
                onSelectHyp={(id) => setSelectedHyp(selectedHyp === id ? null : id)}
                onHoverHyp={setHoveredHyp}
              />

              <div style={ak.legend}>
                {['active', 'in-review', 'suspended', 'refuted'].map(s => (
                  <div key={s} style={ak.legendItem}>
                    <span style={{ ...ak.legendDot, background: STATE_CONFIG[s].dot }} />
                    {STATE_CONFIG[s].label}
                  </div>
                ))}
                <div style={{ ...ak.legendItem, marginLeft: 'auto' }}>
                  <svg width="30" height="10" style={{ overflow: 'visible' }}>
                    <line x1="0" y1="5" x2="12" y2="5" stroke="oklch(0.78 0.01 80)" strokeWidth="1.3" strokeDasharray="3,3"/>
                    <line x1="12" y1="5" x2="30" y2="5" stroke="oklch(0.78 0.01 80)" strokeWidth="1.3"/>
                  </svg>
                  Branch rail
                </div>
              </div>
            </div>

            {/* Narrative thread (collapsible to stay focused on rails) */}
            <div style={ak.section}>
              <div style={ak.sectionHeader}>
                <button style={ak.collapseBtn} onClick={() => setNarrativeOpen(o => !o)}>
                  <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: narrativeOpen ? 'rotate(90deg)' : 'rotate(0)', transition: 'transform 0.15s' }}>
                    <polyline points="6 4 10 8 6 12"/>
                  </svg>
                  <span style={ak.sectionTitle}>Narrative thread</span>
                  <span style={ak.sectionSub}>— where this exploration is going</span>
                </button>
                {narrativeOpen && !narrativeEdit && (
                  <button style={ak.editBtn} onClick={startNarrativeEdit}>Edit</button>
                )}
              </div>
              {narrativeOpen && (
                narrativeEdit ? (
                  <div>
                    <textarea style={ak.narrativeEdit} value={narrativeDraft} onChange={e => setNarrativeDraft(e.target.value)} rows={7} autoFocus />
                    <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                      <button style={ak.confirmBtn} onClick={saveNarrative}>Save</button>
                      <button style={ak.cancelBtn} onClick={() => setNarrativeEdit(false)}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div style={ak.narrative}>
                    {activeLine.narrative || <span style={{ color: 'oklch(0.7 0.01 80)', fontStyle: 'italic' }}>No narrative yet.</span>}
                  </div>
                )
              )}
            </div>

            {/* Hypotheses */}
            <div style={ak.section}>
              <div style={ak.sectionHeader}>
                <span style={ak.sectionTitle}>Hypotheses</span>
                <span style={ak.sectionSub}>{lineHyps.length} on this line</span>
                <button style={ak.editBtn} onClick={() => setShowNewHyp(true)}>+ New</button>
              </div>

              {showNewHyp && (
                <div style={ak.newHypForm}>
                  <textarea
                    style={ak.newLineInput}
                    placeholder="State a falsifiable proposition about a relationship in your domain…"
                    value={newHypText}
                    onChange={e => setNewHypText(e.target.value)}
                    rows={3}
                    autoFocus
                  />
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button style={ak.confirmBtn} onClick={addHyp}>Add hypothesis</button>
                    <button style={ak.cancelBtn} onClick={() => { setShowNewHyp(false); setNewHypText(''); }}>Cancel</button>
                  </div>
                </div>
              )}

              <div style={ak.hypList}>
                {lineHyps.length === 0 && (
                  <div style={ak.emptyHyp}>No hypotheses declared yet for this line.</div>
                )}
                {lineHyps.map((h) => {
                  const isSel = selectedHyp === h.id;
                  const isHov = hoveredHyp && hoveredHyp.id === h.id;
                  const cfg = STATE_CONFIG[h.state] || STATE_CONFIG.active;
                  return (
                    <div key={h.id} id={`hyp-card-${h.id}`}
                      style={{
                        ...ak.hypCard,
                        ...(isSel ? { borderColor: cfg.border, background: '#fff', boxShadow: `0 2px 14px ${cfg.bg}` } : {}),
                        ...(isHov && !isSel ? { borderColor: cfg.border } : {}),
                        ...(h.state === 'refuted' ? ak.hypCardRefuted : {}),
                      }}
                      onClick={() => setSelectedHyp(isSel ? null : h.id)}
                      onMouseEnter={() => setHoveredHyp(h)}
                      onMouseLeave={() => setHoveredHyp(null)}>
                      <div style={ak.hypTop}>
                        <span style={{ ...ak.hypNum, color: cfg.color, background: cfg.bg }}>{h.id.toUpperCase()}</span>
                        <StatePill state={h.state} />
                        {h.rail > 0 && (
                          <span style={ak.branchTag}>
                            <svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 3v10M6 7c0 2 2 4 4 4M10 11v2"/></svg>
                            branch
                          </span>
                        )}
                      </div>
                      <div style={ak.hypDesc}>{h.description}</div>

                      {h.state === 'refuted' && h.refutation && (
                        <div style={ak.refutationBox}>
                          <div style={ak.refutationLabel}>
                            <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 8l4 4 6-7"/></svg>
                            Refutation — negative knowledge
                          </div>
                          <div style={ak.refutationText}>{h.refutation}</div>
                        </div>
                      )}

                      {isSel && h.state !== 'refuted' && (
                        <div style={ak.hypActions}>
                          <span style={ak.hypActLabel}>Change state:</span>
                          {['active', 'in-review', 'suspended', 'refuted'].map(s => (
                            <button key={s}
                              style={{ ...ak.stateBtn, ...(h.state === s ? { ...ak.stateBtnActive, background: STATE_CONFIG[s].color, borderColor: STATE_CONFIG[s].color } : {}) }}
                              onClick={e => { e.stopPropagation(); updateHypState(h.id, s); }}>
                              {STATE_CONFIG[s].label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Right: context panel */}
        <div style={ak.rightPanel}>
          {activeLine && (
            <>
              <div style={ak.rpTitle}>Line context</div>

              <div style={ak.rpSection}>
                <div style={ak.rpLabel}>Papers in this line</div>
                {activeLine.papers.length === 0
                  ? <div style={ak.rpEmpty}>No papers linked yet</div>
                  : activeLine.papers.map(pid => (
                    <div key={pid} style={ak.rpPaper}>{PAPER_NAMES[pid] || pid}</div>
                  ))
                }
              </div>

              <div style={ak.rpSection}>
                <div style={ak.rpLabel}>Hypothesis summary</div>
                {['active', 'in-review', 'refuted', 'suspended'].map(st => {
                  const count = lineHyps.filter(h => h.state === st).length;
                  if (!count) return null;
                  const cfg = STATE_CONFIG[st];
                  return (
                    <div key={st} style={ak.rpStatRow}>
                      <span style={{ ...ak.rpStatDot, background: cfg.dot }} />
                      <span style={ak.rpStatLabel}>{cfg.label}</span>
                      <span style={ak.rpStatNum}>{count}</span>
                    </div>
                  );
                })}
              </div>

              <div style={ak.rpSection}>
                <div style={ak.rpLabel}>Why refuted matters</div>
                <div style={ak.rpNote}>
                  Refuted hypotheses become <strong>negative knowledge</strong> — recorded with justification so the AI assistant and future papers skip already-disproven paths.
                </div>
              </div>

              <div style={ak.rpSection}>
                <div style={ak.rpLabel}>Created</div>
                <div style={ak.rpMeta}>{activeLine.created}</div>
                <div style={{ ...ak.rpLabel, marginTop: 10 }}>Last updated</div>
                <div style={ak.rpMeta}>{activeLine.updated}</div>
              </div>
            </>
          )}
        </div>
      </div>}
    </div>
  );
}

const ak = {
  root: { display: 'flex', flexDirection: 'column', height: '100%', background: 'oklch(0.985 0.006 80)', overflow: 'hidden' },
  header: { padding: '28px 32px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexShrink: 0 },
  breadcrumb: { fontSize: 12, color: 'oklch(0.6 0.01 80)', marginBottom: 3, fontFamily: 'var(--font-ui)' },
  title: { fontSize: 26, fontWeight: 400, color: 'oklch(0.13 0.015 80)', fontFamily: 'var(--font-display)', margin: 0, letterSpacing: '-0.01em', whiteSpace: 'nowrap' },
  subtitle: { fontSize: 13, color: 'oklch(0.55 0.01 80)', fontFamily: 'var(--font-ui)', marginTop: 4 },
  headerStats: { display: 'flex', gap: 24, paddingTop: 6 },
  headerStat: { textAlign: 'right' },
  headerStatNum: { fontSize: 26, fontWeight: 400, color: 'oklch(0.13 0.015 80)', fontFamily: 'var(--font-display)', letterSpacing: '-0.01em', lineHeight: 1 },
  headerStatLabel: { fontSize: 11, color: 'oklch(0.6 0.01 80)', fontFamily: 'var(--font-ui)', marginTop: 4, whiteSpace: 'nowrap' },
  body: { display: 'flex', flex: 1, minHeight: 0, overflow: 'hidden', padding: '20px 32px 28px', gap: 16 },

  // Page toggle tabs
  pageTabs: { display: 'flex', gap: 4, padding: '14px 32px 0', borderBottom: '1px solid oklch(0.92 0.008 80)', flexShrink: 0 },
  pageTab: { position: 'relative', fontSize: 13, fontWeight: 600, color: 'oklch(0.55 0.01 80)', background: 'none', border: 'none', padding: '8px 14px', cursor: 'pointer', fontFamily: 'var(--font-ui)', borderBottom: '2px solid transparent', marginBottom: -1, transition: 'color 0.12s' },
  pageTabActive: { color: 'var(--accent)', borderBottomColor: 'var(--accent)' },

  // Lines panel
  linesPanel: { width: 288, minWidth: 288, background: '#fff', borderRadius: 12, border: '1px solid oklch(0.91 0.008 80)', display: 'flex', flexDirection: 'column', overflow: 'hidden' },
  panelHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px 12px', borderBottom: '1px solid oklch(0.93 0.006 80)', flexShrink: 0 },
  panelTitle: { fontSize: 11, fontWeight: 700, color: 'oklch(0.4 0.01 80)', fontFamily: 'var(--font-ui)', textTransform: 'uppercase', letterSpacing: '0.06em' },
  addBtn: { width: 26, height: 26, borderRadius: 6, border: '1px solid oklch(0.88 0.02 var(--accent-hue,260))', background: 'oklch(0.97 0.015 var(--accent-hue,260))', color: 'var(--accent)', cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-ui)', lineHeight: 1 },
  newLineForm: { padding: '12px 14px', borderBottom: '1px solid oklch(0.93 0.006 80)', display: 'flex', flexDirection: 'column', gap: 8 },
  newLineInput: { width: '100%', border: '1px solid oklch(0.88 0.02 var(--accent-hue,260))', borderRadius: 8, padding: '10px 12px', fontSize: 13, fontFamily: 'var(--font-ui)', color: 'oklch(0.2 0.01 80)', resize: 'none', outline: 'none', boxSizing: 'border-box' },
  confirmBtn: { fontSize: 12, fontWeight: 600, padding: '6px 14px', borderRadius: 6, border: 'none', background: 'var(--accent)', color: '#fff', cursor: 'pointer', fontFamily: 'var(--font-ui)' },
  cancelBtn: { fontSize: 12, padding: '6px 12px', borderRadius: 6, border: '1px solid oklch(0.88 0.01 80)', background: 'none', color: 'oklch(0.55 0.01 80)', cursor: 'pointer', fontFamily: 'var(--font-ui)' },
  lineItem: { padding: '14px 18px', borderBottom: '1px solid oklch(0.95 0.004 80)', cursor: 'pointer', transition: 'background 0.12s', borderLeft: '3px solid transparent' },
  lineItemActive: { background: 'oklch(0.985 0.012 var(--accent-hue,260))', borderLeftColor: 'var(--accent)' },
  lineItemTop: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  lineDate: { fontSize: 11, color: 'oklch(0.6 0.01 80)', fontFamily: 'var(--font-mono)' },
  lineQuestion: { fontSize: 12.5, fontWeight: 500, color: 'oklch(0.2 0.01 80)', fontFamily: 'var(--font-ui)', lineHeight: 1.5, marginBottom: 8 },
  miniRailsWrap: { padding: '4px 0 6px' },
  lineMeta: { display: 'flex', gap: 12, fontSize: 11, color: 'oklch(0.55 0.01 80)', fontFamily: 'var(--font-ui)', marginTop: 4 },
  metaItem: { display: 'inline-flex', alignItems: 'center', gap: 4 },
  metaDot: { width: 6, height: 6, borderRadius: '50%', background: 'oklch(0.7 0.05 145)' },

  // Center panel
  centerPanel: { flex: 1, minWidth: 0, background: '#fff', borderRadius: 12, border: '1px solid oklch(0.91 0.008 80)', overflow: 'auto', padding: '22px 26px 28px' },
  lineDetailHeader: { display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 18, paddingBottom: 16, borderBottom: '1px solid oklch(0.93 0.006 80)' },
  lineDetailLabel: { fontSize: 10, fontWeight: 600, color: 'oklch(0.55 0.01 80)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 },
  lineDetailQ: { fontSize: 17, fontWeight: 500, color: 'oklch(0.13 0.015 80)', fontFamily: 'var(--font-ui)', lineHeight: 1.45 },

  // Rails zone
  railsZone: { background: 'oklch(0.99 0.005 80)', border: '1px solid oklch(0.93 0.006 80)', borderRadius: 12, padding: '16px 18px 12px', marginBottom: 24 },
  railsHeaderRow: { display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 10 },
  sectionTitle: { fontSize: 12, fontWeight: 700, color: 'oklch(0.25 0.01 80)', fontFamily: 'var(--font-ui)', textTransform: 'uppercase', letterSpacing: '0.06em' },
  sectionSub: { fontSize: 12, color: 'oklch(0.55 0.01 80)', fontFamily: 'var(--font-ui)', fontStyle: 'italic', marginLeft: 6 },
  hint: { fontSize: 11, color: 'oklch(0.6 0.01 80)', fontFamily: 'var(--font-mono)' },
  legend: { display: 'flex', alignItems: 'center', gap: 16, marginTop: 8, paddingTop: 10, borderTop: '1px solid oklch(0.94 0.006 80)' },
  legendItem: { display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'oklch(0.45 0.01 80)', fontFamily: 'var(--font-ui)' },
  legendDot: { width: 8, height: 8, borderRadius: '50%' },

  // Sections
  section: { marginBottom: 24 },
  sectionHeader: { display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 },
  collapseBtn: { display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: 'oklch(0.25 0.01 80)', fontFamily: 'var(--font-ui)' },
  editBtn: { marginLeft: 'auto', fontSize: 11, color: 'var(--accent)', background: 'none', border: '1px solid oklch(0.88 0.04 var(--accent-hue,260))', borderRadius: 6, padding: '4px 12px', cursor: 'pointer', fontFamily: 'var(--font-ui)', fontWeight: 600 },
  narrative: { fontSize: 13.5, color: 'oklch(0.28 0.01 80)', lineHeight: 1.75, fontFamily: 'var(--font-ui)', whiteSpace: 'pre-wrap', background: 'oklch(0.985 0.005 80)', borderRadius: 8, padding: '14px 16px' },
  narrativeEdit: { width: '100%', border: '1px solid oklch(0.85 0.04 var(--accent-hue,260))', borderRadius: 8, padding: '12px 14px', fontSize: 14, fontFamily: 'var(--font-ui)', color: 'oklch(0.2 0.01 80)', resize: 'vertical', outline: 'none', lineHeight: 1.7, boxSizing: 'border-box' },

  // Hypothesis cards
  hypList: { display: 'flex', flexDirection: 'column', gap: 10 },
  newHypForm: { marginBottom: 12, display: 'flex', flexDirection: 'column', gap: 8 },
  emptyHyp: { fontSize: 13, color: 'oklch(0.65 0.01 80)', fontStyle: 'italic', fontFamily: 'var(--font-ui)', padding: '10px 0' },
  hypCard: { border: '1px solid oklch(0.92 0.008 80)', borderRadius: 10, padding: '14px 16px', cursor: 'pointer', transition: 'all 0.15s', background: 'oklch(0.995 0.003 80)' },
  hypCardRefuted: { background: 'oklch(0.985 0.015 25)' },
  hypTop: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 },
  hypNum: { fontSize: 10.5, fontWeight: 700, padding: '2px 7px', borderRadius: 4, fontFamily: 'var(--font-mono)', letterSpacing: '0.04em' },
  branchTag: { fontSize: 10.5, color: 'oklch(0.55 0.01 80)', fontFamily: 'var(--font-ui)', display: 'inline-flex', alignItems: 'center', gap: 3, fontWeight: 500 },
  hypDesc: { fontSize: 13.5, color: 'oklch(0.22 0.01 80)', fontFamily: 'var(--font-ui)', lineHeight: 1.6 },
  refutationBox: { marginTop: 12, background: 'oklch(0.96 0.04 25)', border: '1px solid oklch(0.88 0.07 25)', borderRadius: 8, padding: '12px 14px' },
  refutationLabel: { fontSize: 10.5, fontWeight: 700, color: 'oklch(0.45 0.14 25)', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 6, fontFamily: 'var(--font-ui)', display: 'flex', alignItems: 'center', gap: 5 },
  refutationText: { fontSize: 12.5, color: 'oklch(0.32 0.05 25)', fontFamily: 'var(--font-ui)', lineHeight: 1.6 },
  hypActions: { marginTop: 12, display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
  hypActLabel: { fontSize: 11, color: 'oklch(0.55 0.01 80)', fontFamily: 'var(--font-ui)', marginRight: 4 },
  stateBtn: { fontSize: 11, padding: '4px 10px', borderRadius: 6, border: '1px solid oklch(0.88 0.01 80)', background: 'none', color: 'oklch(0.5 0.01 80)', cursor: 'pointer', fontFamily: 'var(--font-ui)', fontWeight: 500, transition: 'all 0.12s' },
  stateBtnActive: { color: '#fff' },

  // Right panel
  rightPanel: { width: 228, flexShrink: 0, background: '#fff', borderRadius: 12, border: '1px solid oklch(0.91 0.008 80)', padding: '18px 16px', overflow: 'auto', alignSelf: 'stretch' },
  rpTitle: { fontSize: 11, fontWeight: 700, color: 'oklch(0.4 0.01 80)', fontFamily: 'var(--font-ui)', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.06em' },
  rpSection: { marginBottom: 18 },
  rpLabel: { fontSize: 10, fontWeight: 700, color: 'oklch(0.55 0.01 80)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8, fontFamily: 'var(--font-ui)' },
  rpPaper: { fontSize: 12.5, color: 'oklch(0.3 0.02 var(--accent-hue,260))', fontFamily: 'var(--font-ui)', padding: '6px 0', borderBottom: '1px solid oklch(0.96 0.004 80)', cursor: 'pointer' },
  rpEmpty: { fontSize: 12, color: 'oklch(0.7 0.01 80)', fontStyle: 'italic', fontFamily: 'var(--font-ui)' },
  rpStatRow: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 7 },
  rpStatDot: { width: 8, height: 8, borderRadius: '50%', flexShrink: 0 },
  rpStatLabel: { fontSize: 12, color: 'oklch(0.4 0.01 80)', fontFamily: 'var(--font-ui)', flex: 1 },
  rpStatNum: { fontSize: 13, fontWeight: 500, color: 'oklch(0.13 0.015 80)', fontFamily: 'var(--font-display)' },
  rpNote: { fontSize: 12, color: 'oklch(0.4 0.01 80)', fontFamily: 'var(--font-ui)', lineHeight: 1.6, background: 'oklch(0.975 0.012 var(--accent-hue,260))', borderRadius: 8, padding: '10px 12px', border: '1px solid oklch(0.93 0.015 var(--accent-hue,260))' },
  rpMeta: { fontSize: 12, color: 'oklch(0.5 0.01 80)', fontFamily: 'var(--font-mono)' },
};

Object.assign(window, { AKMView });
