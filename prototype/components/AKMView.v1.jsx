
const RESEARCH_LINES = [
  {
    id: 'rl1',
    question: 'Can Diamond OA models eliminate APC dependency while preserving quality signals in peer review?',
    state: 'active',
    narrative: 'Started from the observation that Gold OA merely relocates the financial barrier from reader to author. The central tension is between institutional funding sustainability and the prestige function that commercial publishers currently provide. Key insight from Larivière 2015: the oligopoly survives not just through paywalls but through the prestige infrastructure. Diamond OA must offer a credible prestige alternative — not just a cheaper one.\n\nCurrent direction: exploring how institutional consortia in LATAM can pool resources to fund Diamond journals, using SciELO as proof of concept.',
    papers: ['paper-1', 'paper-2'],
    hypotheses: ['h1', 'h2', 'h3'],
    created: '2024-08-12',
    updated: '2026-04-18',
  },
  {
    id: 'rl2',
    question: 'How can verified contributor identity decouple researcher reputation from journal prestige?',
    state: 'active',
    narrative: 'The h-index critique is well established but no credible alternative has achieved institutional adoption. ORCID provides identity but not reputation. The gap is a platform that aggregates verified contributions — authorship roles (CRediT), peer review records, datasets, code — into a profile that committees can evaluate independently of where papers were published.\n\nOpen question: what is the minimum institutional adoption threshold for an alternative reputation signal to become self-sustaining?',
    papers: ['paper-2'],
    hypotheses: ['h4', 'h5'],
    created: '2025-01-20',
    updated: '2026-04-10',
  },
  {
    id: 'rl3',
    question: 'Do preprint citation rates post-2020 reflect a permanent structural shift in scholarly communication?',
    state: 'suspended',
    narrative: 'Initial evidence from bioRxiv and medRxiv during COVID-19 suggested a permanent acceleration of preprint adoption. Brierley & Nanni 2024 shows a 3.4× increase in citation rates. However, the causal mechanism is unclear — is this a genuine norm shift or a COVID-specific artifact?\n\nSuspended: deprioritized while paper-1 is in progress. Will return after submission.',
    papers: [],
    hypotheses: ['h6'],
    created: '2025-03-05',
    updated: '2025-11-14',
  },
];

const HYPOTHESES = [
  { id: 'h1', lineId: 'rl1', description: 'Diamond OA reduces systemic dependency on APC payments when institutional consortia provide baseline funding equivalent to ≥60% of editorial operating costs.', state: 'active', refutation: null },
  { id: 'h2', lineId: 'rl1', description: 'Researcher identity platforms can decouple prestige signaling from commercial publisher infrastructure within a 10-year adoption horizon given sufficient institutional backing.', state: 'active', refutation: null },
  { id: 'h3', lineId: 'rl1', description: 'Institutional consortia in Latin America can fully replace individual subscription agreements with pooled Diamond OA funding without net budget increase.', state: 'in-review', refutation: null },
  { id: 'h4', lineId: 'rl2', description: 'Verified peer review records, when aggregated into a public profile, are weighted as positively as journal impact factor by tenure committees evaluating junior researchers.', state: 'active', refutation: null },
  { id: 'h5', lineId: 'rl2', description: 'The h-index can be fully replaced by a composite metric combining CRediT role distribution, review-to-authorship ratio, and open-access rate.', state: 'refuted', refutation: 'Sinatra et al. 2016 demonstrates that citation-based metrics have predictive validity for long-term influence that role-based metrics cannot replicate without longitudinal data (>15 years). A composite metric is a complement, not a replacement, in the short term.' },
  { id: 'h6', lineId: 'rl3', description: 'Preprint citation rates post-2020 reflect a permanent norm shift in scholarly communication rather than a COVID-specific artifact.', state: 'suspended', refutation: null },
];

const STATE_CONFIG = {
  active:    { label: 'Active',    color: 'oklch(0.38 0.12 160)', bg: 'oklch(0.93 0.07 160)' },
  'in-review': { label: 'In review', color: 'oklch(0.45 0.1 60)',  bg: 'oklch(0.94 0.06 60)'  },
  suspended: { label: 'Suspended', color: 'oklch(0.5 0.04 80)',   bg: 'oklch(0.93 0.02 80)'  },
  closed:    { label: 'Closed',    color: 'oklch(0.55 0.02 80)',  bg: 'oklch(0.93 0.01 80)'  },
  refuted:   { label: 'Refuted',   color: 'oklch(0.45 0.12 20)',  bg: 'oklch(0.94 0.05 20)'  },
};

function StatePill({ state }) {
  const cfg = STATE_CONFIG[state] || STATE_CONFIG.active;
  return (
    <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 20, background: cfg.bg, color: cfg.color, fontFamily: 'var(--font-ui)', letterSpacing: '0.02em' }}>
      {cfg.label}
    </span>
  );
}

function AKMView() {
  const [lines, setLines] = React.useState(RESEARCH_LINES);
  const [hypotheses, setHypotheses] = React.useState(HYPOTHESES);
  const [selectedLine, setSelectedLine] = React.useState('rl1');
  const [selectedHyp, setSelectedHyp] = React.useState(null);
  const [showNewLine, setShowNewLine] = React.useState(false);
  const [showNewHyp, setShowNewHyp] = React.useState(false);
  const [newLineQ, setNewLineQ] = React.useState('');
  const [narrativeEdit, setNarrativeEdit] = React.useState(false);
  const [narrativeDraft, setNarrativeDraft] = React.useState('');
  const [refutedTipPos, setRefutedTipPos] = React.useState(null);

  const activeLine = lines.find(l => l.id === selectedLine);
  const lineHyps = hypotheses.filter(h => h.lineId === selectedLine);
  const selectedHypData = hypotheses.find(h => h.id === selectedHyp);

  const addLine = () => {
    if (!newLineQ.trim()) return;
    const id = 'rl' + (lines.length + 1);
    setLines(ls => [...ls, { id, question: newLineQ, state: 'active', narrative: '', papers: [], hypotheses: [], created: '2026-04-29', updated: '2026-04-29' }]);
    setSelectedLine(id);
    setNewLineQ('');
    setShowNewLine(false);
  };

  const updateHypState = (hid, state) => {
    setHypotheses(hs => hs.map(h => h.id === hid ? { ...h, state } : h));
  };

  const startNarrativeEdit = () => {
    setNarrativeDraft(activeLine?.narrative || '');
    setNarrativeEdit(true);
  };

  const saveNarrative = () => {
    setLines(ls => ls.map(l => l.id === selectedLine ? { ...l, narrative: narrativeDraft, updated: '2026-04-29' } : l));
    setNarrativeEdit(false);
  };

  const statsActive = hypotheses.filter(h => h.state === 'active').length;
  const statsRefuted = hypotheses.filter(h => h.state === 'refuted').length;
  const statsLines = lines.filter(l => l.state === 'active').length;

  return (
    <div style={ak.root}>
      {/* Header */}
      <div style={ak.header}>
        <div>
          <div style={ak.breadcrumb}>Workspace</div>
          <h1 style={ak.title}>Academic Knowledge Manager</h1>
          <div style={ak.subtitle}>Research lines · Active hypotheses · Negative knowledge</div>
        </div>
        <div style={ak.headerStats}>
          {[['Active lines', statsLines], ['Active hypotheses', statsActive], ['Refuted (knowledge)', statsRefuted]].map(([l, v]) => (
            <div key={l} style={ak.headerStat}>
              <div style={ak.headerStatNum}>{v}</div>
              <div style={ak.headerStatLabel}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={ak.body}>
        {/* Left: Lines list */}
        <div style={ak.linesPanel}>
          <div style={ak.panelHeader}>
            <span style={ak.panelTitle}>Research Lines</span>
            <button style={ak.addBtn} onClick={() => setShowNewLine(true)}>+</button>
          </div>

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

          {lines.map(line => (
            <div key={line.id}
              style={{ ...ak.lineItem, ...(selectedLine === line.id ? ak.lineItemActive : {}) }}
              onClick={() => { setSelectedLine(line.id); setSelectedHyp(null); setNarrativeEdit(false); }}>
              <div style={ak.lineItemTop}>
                <StatePill state={line.state} />
                <span style={ak.lineDate}>Updated {line.updated}</span>
              </div>
              <div style={ak.lineQuestion}>{line.question}</div>
              <div style={ak.lineMeta}>
                <span>{hypotheses.filter(h => h.lineId === line.id).length} hypotheses</span>
                <span style={ak.dot}>·</span>
                <span>{line.papers.length} papers</span>
              </div>
            </div>
          ))}
        </div>

        {/* Center: Line detail + hypotheses */}
        {activeLine && (
          <div style={ak.centerPanel}>
            {/* Line header */}
            <div style={ak.lineDetailHeader}>
              <div style={ak.lineDetailQ}>{activeLine.question}</div>
              <StatePill state={activeLine.state} />
            </div>

            {/* Narrative thread */}
            <div style={ak.section}>
              <div style={ak.sectionHeader}>
                <span style={ak.sectionTitle}>Narrative Thread</span>
                <span style={ak.sectionSub}>— where this exploration is going</span>
                {!narrativeEdit && (
                  <button style={ak.editBtn} onClick={startNarrativeEdit}>Edit</button>
                )}
              </div>
              {narrativeEdit ? (
                <div>
                  <textarea style={ak.narrativeEdit} value={narrativeDraft}
                    onChange={e => setNarrativeDraft(e.target.value)} rows={7} autoFocus />
                  <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                    <button style={ak.confirmBtn} onClick={saveNarrative}>Save</button>
                    <button style={ak.cancelBtn} onClick={() => setNarrativeEdit(false)}>Cancel</button>
                  </div>
                </div>
              ) : (
                <div style={ak.narrative}>
                  {activeLine.narrative || <span style={{ color: 'oklch(0.7 0.01 80)', fontStyle: 'italic' }}>No narrative yet. Add your thinking about where this line is heading.</span>}
                </div>
              )}
            </div>

            {/* Hypotheses */}
            <div style={ak.section}>
              <div style={ak.sectionHeader}>
                <span style={ak.sectionTitle}>Hypotheses</span>
                <button style={ak.editBtn} onClick={() => setShowNewHyp(true)}>+ New</button>
              </div>

              {showNewHyp && (
                <div style={ak.newHypForm}>
                  <textarea style={ak.newLineInput} placeholder="State a falsifiable proposition about a relationship in your domain…" rows={3} autoFocus />
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button style={ak.confirmBtn} onClick={() => setShowNewHyp(false)}>Add hypothesis</button>
                    <button style={ak.cancelBtn} onClick={() => setShowNewHyp(false)}>Cancel</button>
                  </div>
                </div>
              )}

              <div style={ak.hypList}>
                {lineHyps.length === 0 && (
                  <div style={ak.emptyHyp}>No hypotheses declared yet for this line.</div>
                )}
                {lineHyps.map((h, i) => (
                  <div key={h.id}
                    style={{ ...ak.hypCard, ...(selectedHyp === h.id ? ak.hypCardActive : {}), ...(h.state === 'refuted' ? ak.hypCardRefuted : {}) }}
                    onClick={() => setSelectedHyp(selectedHyp === h.id ? null : h.id)}>
                    <div style={ak.hypTop}>
                      <span style={ak.hypNum}>H{i + 1}</span>
                      <StatePill state={h.state} />
                    </div>
                    <div style={ak.hypDesc}>{h.description}</div>

                    {h.state === 'refuted' && h.refutation && (
                      <div style={ak.refutationBox}>
                        <div style={ak.refutationLabel}>
                          <svg width={11} height={11} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 8l4 4 6-7" /></svg>
                          Refutation — negative knowledge
                        </div>
                        <div style={ak.refutationText}>{h.refutation}</div>
                      </div>
                    )}

                    {selectedHyp === h.id && h.state !== 'refuted' && (
                      <div style={ak.hypActions}>
                        <span style={ak.hypActLabel}>Change state:</span>
                        {['active', 'in-review', 'suspended', 'refuted'].map(s => (
                          <button key={s} style={{ ...ak.stateBtn, ...(h.state === s ? ak.stateBtnActive : {}) }}
                            onClick={e => { e.stopPropagation(); updateHypState(h.id, s); }}>
                            {STATE_CONFIG[s].label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
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
                    <div key={pid} style={ak.rpPaper}>{pid === 'paper-1' ? 'Diamond OA Framework' : 'Peer Review Economics'}</div>
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
                      <span style={{ ...ak.rpStatDot, background: cfg.color }} />
                      <span style={ak.rpStatLabel}>{cfg.label}</span>
                      <span style={ak.rpStatNum}>{count}</span>
                    </div>
                  );
                })}
              </div>
              <div style={ak.rpSection}>
                <div style={{ ...ak.rpLabel, marginBottom: 0, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <span>Why refuted matters</span>
                  <span
                    tabIndex={0}
                    style={{
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      width: 14, height: 14, borderRadius: '50%',
                      border: '1px solid oklch(0.7 0.02 80)', color: 'oklch(0.5 0.01 80)',
                      fontSize: 9, fontWeight: 700, fontStyle: 'italic',
                      fontFamily: 'Georgia, serif',
                      letterSpacing: 0, textTransform: 'none',
                      background: '#fff',
                    }}
                    onMouseEnter={e => {
                      const r = e.currentTarget.getBoundingClientRect();
                      setRefutedTipPos({ top: r.bottom + 8, right: window.innerWidth - r.right });
                    }}
                    onMouseLeave={() => setRefutedTipPos(null)}
                    onFocus={e => {
                      const r = e.currentTarget.getBoundingClientRect();
                      setRefutedTipPos({ top: r.bottom + 8, right: window.innerWidth - r.right });
                    }}
                    onBlur={() => setRefutedTipPos(null)}
                  >i</span>
                </div>
              </div>
              <div style={ak.rpSection}>
                <div style={ak.rpLabel}>Created</div>
                <div style={ak.rpMeta}>{activeLine.created}</div>
                <div style={ak.rpLabel} style={{ marginTop: 8 }}>Last updated</div>
                <div style={ak.rpMeta}>{activeLine.updated}</div>
              </div>
            </>
          )}
        </div>
      </div>
      {refutedTipPos && (
        <div style={{
          position: 'fixed', top: refutedTipPos.top, right: refutedTipPos.right,
          width: 260, zIndex: 9999, pointerEvents: 'none',
          fontSize: 12, color: 'oklch(0.45 0.01 80)', fontFamily: 'var(--font-ui)',
          lineHeight: 1.6, background: 'oklch(0.97 0.01 260)', borderRadius: 8,
          padding: '10px 12px',
          boxShadow: '0 10px 30px oklch(0 0 0 / 0.14), 0 2px 6px oklch(0 0 0 / 0.06)',
          border: '1px solid oklch(0.88 0.015 260)',
          textTransform: 'none', letterSpacing: 'normal', fontWeight: 400,
          textAlign: 'left',
          animation: 'fadeIn 0.14s ease',
        }}>
          Refuted hypotheses with justification are <strong>negative knowledge</strong> — they tell the AI assistant which paths have already been explored and why. This context survives across papers and sessions.
        </div>
      )}
    </div>
  );
}

const ak = {
  root: { display: 'flex', flexDirection: 'column', height: '100%', background: 'oklch(0.985 0.006 80)', overflow: 'hidden' },
  header: { padding: '28px 32px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  breadcrumb: { fontSize: 12, color: 'oklch(0.6 0.01 80)', marginBottom: 3, fontFamily: 'var(--font-ui)' },
  title: { fontSize: 26, fontWeight: 700, color: 'oklch(0.13 0.015 80)', fontFamily: 'var(--font-display)', margin: 0, letterSpacing: '-0.02em' },
  subtitle: { fontSize: 13, color: 'oklch(0.55 0.01 80)', fontFamily: 'var(--font-ui)', marginTop: 4 },
  headerStats: { display: 'flex', gap: 20, paddingTop: 6 },
  headerStat: { textAlign: 'center' },
  headerStatNum: { fontSize: 24, fontWeight: 700, color: 'oklch(0.13 0.015 80)', fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' },
  headerStatLabel: { fontSize: 11, color: 'oklch(0.6 0.01 80)', fontFamily: 'var(--font-ui)', marginTop: 2, whiteSpace: 'nowrap' },
  body: { display: 'flex', flex: 1, overflow: 'hidden', padding: '18px 32px 28px', gap: 16 },

  // Lines panel
  linesPanel: { width: 280, minWidth: 280, background: '#fff', borderRadius: 12, border: '1px solid oklch(0.91 0.008 80)', display: 'flex', flexDirection: 'column', overflow: 'hidden' },
  panelHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px 12px', borderBottom: '1px solid oklch(0.93 0.006 80)' },
  panelTitle: { fontSize: 13, fontWeight: 700, color: 'oklch(0.2 0.01 80)', fontFamily: 'var(--font-ui)' },
  addBtn: { width: 26, height: 26, borderRadius: 6, border: '1px solid oklch(0.88 0.02 260)', background: 'none', color: 'oklch(0.42 0.14 260)', cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-ui)' },
  newLineForm: { padding: '12px 14px', borderBottom: '1px solid oklch(0.93 0.006 80)', display: 'flex', flexDirection: 'column', gap: 8 },
  newLineInput: { width: '100%', border: '1px solid oklch(0.88 0.02 260)', borderRadius: 8, padding: '10px 12px', fontSize: 13, fontFamily: 'var(--font-ui)', color: 'oklch(0.2 0.01 80)', resize: 'none', outline: 'none', boxSizing: 'border-box' },
  confirmBtn: { fontSize: 12, fontWeight: 600, padding: '6px 14px', borderRadius: 6, border: 'none', background: 'oklch(0.42 0.14 260)', color: '#fff', cursor: 'pointer', fontFamily: 'var(--font-ui)' },
  cancelBtn: { fontSize: 12, padding: '6px 12px', borderRadius: 6, border: '1px solid oklch(0.88 0.01 80)', background: 'none', color: 'oklch(0.55 0.01 80)', cursor: 'pointer', fontFamily: 'var(--font-ui)' },
  lineItem: { padding: '14px 18px', borderBottom: '1px solid oklch(0.95 0.004 80)', cursor: 'pointer', transition: 'background 0.12s' },
  lineItemActive: { background: 'oklch(0.97 0.015 260)', borderLeft: '3px solid oklch(0.42 0.14 260)' },
  lineItemTop: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 7 },
  lineDate: { fontSize: 11, color: 'oklch(0.65 0.01 80)', fontFamily: 'var(--font-ui)' },
  lineQuestion: { fontSize: 13, fontWeight: 500, color: 'oklch(0.2 0.01 80)', fontFamily: 'var(--font-ui)', lineHeight: 1.5, marginBottom: 7 },
  lineMeta: { display: 'flex', gap: 6, fontSize: 12, color: 'oklch(0.6 0.01 80)', fontFamily: 'var(--font-ui)' },
  dot: { color: 'oklch(0.78 0.01 80)' },

  // Center panel
  centerPanel: { flex: 1, background: '#fff', borderRadius: 12, border: '1px solid oklch(0.91 0.008 80)', overflow: 'auto', padding: '22px 24px' },
  lineDetailHeader: { display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 22, paddingBottom: 18, borderBottom: '1px solid oklch(0.93 0.006 80)' },
  lineDetailQ: { flex: 1, fontSize: 16, fontWeight: 700, color: 'oklch(0.13 0.015 80)', fontFamily: 'var(--font-ui)', lineHeight: 1.5 },
  section: { marginBottom: 28 },
  sectionHeader: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 },
  sectionTitle: { fontSize: 13, fontWeight: 700, color: 'oklch(0.2 0.01 80)', fontFamily: 'var(--font-ui)' },
  sectionSub: { fontSize: 12, color: 'oklch(0.6 0.01 80)', fontFamily: 'var(--font-ui)', fontStyle: 'italic' },
  editBtn: { marginLeft: 'auto', fontSize: 12, color: 'oklch(0.42 0.14 260)', background: 'none', border: '1px solid oklch(0.85 0.04 260)', borderRadius: 6, padding: '4px 12px', cursor: 'pointer', fontFamily: 'var(--font-ui)', fontWeight: 600 },
  narrative: { fontSize: 14, color: 'oklch(0.28 0.01 80)', lineHeight: 1.8, fontFamily: 'var(--font-ui)', whiteSpace: 'pre-wrap', background: 'oklch(0.985 0.005 80)', borderRadius: 8, padding: '14px 16px' },
  narrativeEdit: { width: '100%', border: '1px solid oklch(0.85 0.04 260)', borderRadius: 8, padding: '12px 14px', fontSize: 14, fontFamily: 'var(--font-ui)', color: 'oklch(0.2 0.01 80)', resize: 'vertical', outline: 'none', lineHeight: 1.7, boxSizing: 'border-box' },

  // Hypotheses
  hypList: { display: 'flex', flexDirection: 'column', gap: 10 },
  newHypForm: { marginBottom: 12, display: 'flex', flexDirection: 'column', gap: 8 },
  emptyHyp: { fontSize: 13, color: 'oklch(0.65 0.01 80)', fontStyle: 'italic', fontFamily: 'var(--font-ui)', padding: '10px 0' },
  hypCard: { border: '1px solid oklch(0.91 0.008 80)', borderRadius: 10, padding: '14px 16px', cursor: 'pointer', transition: 'all 0.15s', background: 'oklch(0.99 0.003 80)' },
  hypCardActive: { border: '1.5px solid oklch(0.72 0.08 260)', background: '#fff', boxShadow: '0 2px 12px oklch(0.42 0.14 260 / 0.08)' },
  hypCardRefuted: { background: 'oklch(0.99 0.01 20)', border: '1px solid oklch(0.9 0.04 20)' },
  hypTop: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 },
  hypNum: { fontSize: 11, fontWeight: 800, color: 'oklch(0.55 0.08 260)', background: 'oklch(0.94 0.03 260)', padding: '2px 7px', borderRadius: 4, fontFamily: 'var(--font-mono)' },
  hypDesc: { fontSize: 14, color: 'oklch(0.22 0.01 80)', fontFamily: 'var(--font-ui)', lineHeight: 1.6 },
  refutationBox: { marginTop: 12, background: 'oklch(0.97 0.03 20)', border: '1px solid oklch(0.88 0.06 20)', borderRadius: 8, padding: '12px 14px' },
  refutationLabel: { fontSize: 11, fontWeight: 700, color: 'oklch(0.45 0.12 20)', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 6, fontFamily: 'var(--font-ui)', display: 'flex', alignItems: 'center', gap: 5 },
  refutationText: { fontSize: 13, color: 'oklch(0.3 0.05 20)', fontFamily: 'var(--font-ui)', lineHeight: 1.6 },
  hypActions: { marginTop: 12, display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
  hypActLabel: { fontSize: 11, color: 'oklch(0.6 0.01 80)', fontFamily: 'var(--font-ui)', marginRight: 4 },
  stateBtn: { fontSize: 11, padding: '4px 10px', borderRadius: 6, border: '1px solid oklch(0.88 0.01 80)', background: 'none', color: 'oklch(0.5 0.01 80)', cursor: 'pointer', fontFamily: 'var(--font-ui)', transition: 'all 0.12s' },
  stateBtnActive: { background: 'oklch(0.42 0.14 260)', color: '#fff', borderColor: 'oklch(0.42 0.14 260)' },

  // Right panel
  rightPanel: { width: 220, background: '#fff', borderRadius: 12, border: '1px solid oklch(0.91 0.008 80)', padding: '18px 16px', overflow: 'auto', alignSelf: 'flex-start' },
  rpTitle: { fontSize: 13, fontWeight: 700, color: 'oklch(0.2 0.01 80)', fontFamily: 'var(--font-ui)', marginBottom: 14 },
  rpSection: { marginBottom: 18 },
  rpLabel: { fontSize: 11, fontWeight: 700, color: 'oklch(0.6 0.01 80)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 7, fontFamily: 'var(--font-ui)' },
  rpPaper: { fontSize: 13, color: 'oklch(0.3 0.02 260)', fontFamily: 'var(--font-ui)', padding: '6px 0', borderBottom: '1px solid oklch(0.96 0.004 80)', cursor: 'pointer' },
  rpEmpty: { fontSize: 12, color: 'oklch(0.7 0.01 80)', fontStyle: 'italic', fontFamily: 'var(--font-ui)' },
  rpStatRow: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 7 },
  rpStatDot: { width: 7, height: 7, borderRadius: '50%', flexShrink: 0 },
  rpStatLabel: { fontSize: 12, color: 'oklch(0.45 0.01 80)', fontFamily: 'var(--font-ui)', flex: 1 },
  rpStatNum: { fontSize: 13, fontWeight: 700, color: 'oklch(0.2 0.01 80)', fontFamily: 'var(--font-display)' },
  rpNote: { fontSize: 12, color: 'oklch(0.45 0.01 80)', fontFamily: 'var(--font-ui)', lineHeight: 1.6, background: 'oklch(0.97 0.01 260)', borderRadius: 8, padding: '10px 12px' },
  rpMeta: { fontSize: 12, color: 'oklch(0.5 0.01 80)', fontFamily: 'var(--font-mono)' },
};

Object.assign(window, { AKMView });
