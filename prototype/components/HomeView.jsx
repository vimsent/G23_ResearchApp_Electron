
const RECENT_ACTIVITY = [
  { label: 'Updated LUMEN.md — Diamond OA Framework', time: 'Today 09:14', type: 'paper', color: 'oklch(0.55 0.12 170)' },
  { label: 'Added 2 sources to My Library', time: 'Today 08:42', type: 'library', color: 'oklch(0.55 0.1 260)' },
  { label: 'Peer review completed — Scientometrics', time: 'Yesterday', type: 'review', color: 'oklch(0.55 0.1 60)' },
  { label: 'New concept: "Institutional Consortia"', time: '2 days ago', type: 'concept', color: 'oklch(0.48 0.12 300)' },
  { label: 'Searched Alexandria: "Diamond OA economics"', time: '3 days ago', type: 'search', color: 'oklch(0.5 0.1 200)' },
];

const STATS = [
  { label: 'Sources', value: 10, sub: 'in My Library', icon: 'M3 4h10v1H3zM3 7h10v1H3zM3 10h7v1H3z' },
  { label: 'Papers', value: 2, sub: 'active drafts', icon: 'M3 2h7l4 4v9a1 1 0 01-1 1H3a1 1 0 01-1-1V3a1 1 0 011-1zm7 0v4h4' },
  { label: 'Concepts', value: 12, sub: 'in knowledge graph', icon: 'M8 8m-2 0a2 2 0 104 0 2 2 0 10-4 0M3 4a1 1 0 102 0 1 1 0 10-2 0M11 4a1 1 0 102 0 1 1 0 10-2 0' },
  { label: 'Reviews', value: 6, sub: 'completed, verified', icon: 'M3 8l4 4 6-7' },
];

function HomeView({ setActive }) {
  return (
    <div style={hs.root}>
      <div style={hs.header}>
        <div>
          <div style={hs.greeting}>Good morning, Matías</div>
          <h1 style={hs.title}>Dashboard</h1>
        </div>
        <div style={hs.dateBlock}>
          <div style={hs.dateDay}>Sunday</div>
          <div style={hs.dateFull}>April 20, 2026</div>
        </div>
      </div>

      <div style={hs.body}>
        {/* Two modes */}
        <div style={hs.modesRow}>
          <div style={hs.modeCard} onClick={() => setActive('library')}>
            <div style={hs.modeIcon}>
              <svg width={22} height={22} viewBox="0 0 16 16" fill="none" stroke="var(--accent)" strokeWidth="1.3" strokeLinecap="round"><path d="M3 4h10v1H3zM3 7h10v1H3zM3 10h7v1H3zM3 13h4v1H3z"/></svg>
            </div>
            <div style={hs.modeTitle}>Library & Knowledge</div>
            <div style={hs.modeDesc}>Ingest sources · Build research lines · Declare hypotheses</div>
            <div style={hs.modeMeta}>My Library · My Knowledge</div>
          </div>
          <div style={{ ...hs.modeCard, ...hs.modeCardPaper }} onClick={() => setActive('editor')}>
            <div style={{ ...hs.modeIcon, background: 'var(--surface-2)' }}>
              <svg width={22} height={22} viewBox="0 0 16 16" fill="none" stroke="oklch(0.42 0.12 170)" strokeWidth="1.3" strokeLinecap="round"><path d="M3 2h7l4 4v9a1 1 0 01-1 1H3a1 1 0 01-1-1V3a1 1 0 011-1zm7 0v4h4"/></svg>
            </div>
            <div style={hs.modeTitle}>Research Assistant</div>
            <div style={hs.modeDesc}>Write · Cite · Verify · Ask the AI — with full paper context</div>
            <div style={{ ...hs.modeMeta, color: 'oklch(0.42 0.12 170)' }}>Active paper: Diamond OA Framework</div>
          </div>
        </div>

        {/* Stats row */}
        <div style={hs.statsRow}>
          {STATS.map(stat => (
            <div key={stat.label} style={hs.statCard}>
              <svg width={16} height={16} viewBox="0 0 16 16" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: 8 }}>
                <path d={stat.icon} />
              </svg>
              <div style={hs.statValue}>{stat.value}</div>
              <div style={hs.statLabel}>{stat.label}</div>
              <div style={hs.statSub}>{stat.sub}</div>
            </div>
          ))}
        </div>

        <div style={hs.twoCol}>
          {/* Active papers */}
          <div style={hs.card}>
            <div style={hs.cardHeader}>
              <div style={hs.cardTitle}>Active Papers</div>
              <button style={hs.cardAction} onClick={() => setActive('editor')}>Open Editor →</button>
            </div>
            {[
              { title: 'Open Knowledge Infrastructure: A Framework for Diamond OA', status: 'Draft', progress: 42, section: 'Writing §2 Background' },
              { title: 'Peer review labour and its economic invisibility', status: 'Revising', progress: 78, section: 'Responding to Reviewer 2' },
            ].map((p, i) => (
              <div key={i} style={hs.paperRow} onClick={() => setActive('editor')}>
                <div style={hs.paperRowLeft}>
                  <div style={hs.paperRowTitle}>{p.title}</div>
                  <div style={hs.paperRowMeta}>{p.section}</div>
                  <div style={hs.progressTrack}>
                    <div style={{ ...hs.progressFill, width: p.progress + '%' }} />
                  </div>
                </div>
                <div style={hs.paperRowRight}>
                  <div style={{ ...hs.statusPill, background: p.status === 'Draft' ? 'oklch(0.94 0.05 170)' : 'oklch(0.94 0.04 260)', color: p.status === 'Draft' ? 'oklch(0.38 0.12 170)' : 'oklch(0.38 0.12 260)' }}>
                    {p.status}
                  </div>
                  <div style={hs.progressPct}>{p.progress}%</div>
                </div>
              </div>
            ))}
          </div>

          {/* Recent activity */}
          <div style={hs.card}>
            <div style={hs.cardHeader}>
              <div style={hs.cardTitle}>Recent Activity</div>
            </div>
            {RECENT_ACTIVITY.map((a, i) => (
              <div key={i} style={hs.activityRow}>
                <div style={{ ...hs.actDot, background: a.color }} />
                <div style={{ flex: 1 }}>
                  <div style={hs.actLabel}>{a.label}</div>
                  <div style={hs.actTime}>{a.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick actions */}
        <div style={hs.quickRow}>
          {[
            { label: 'Add source to Library', icon: '+', view: 'library', desc: 'PDF, URL, note or code' },
            { label: 'Search Alexandria', icon: '◎', view: 'alexandria', desc: 'Open-access discovery' },
            { label: 'New concept', icon: '◈', view: 'pkm', desc: 'Build your knowledge graph' },
            { label: 'Find a colleague', icon: '⊕', view: 'community', desc: 'Academic Community' },
          ].map(q => (
            <button key={q.label} style={hs.quickCard} onClick={() => setActive(q.view)}>
              <div style={hs.quickIcon}>{q.icon}</div>
              <div style={hs.quickLabel}>{q.label}</div>
              <div style={hs.quickDesc}>{q.desc}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

const hs = {
  root: { display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg)', overflow: 'hidden' },
  header: { padding: '24px 28px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' },
  greeting: { fontSize: 16, color: 'var(--muted)', marginBottom: 3, fontFamily: 'var(--font-ui)' },
  title: { fontSize: 30, fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--font-display)', margin: 0, letterSpacing: '-0.02em' },
  dateBlock: { textAlign: 'right', paddingBottom: 4 },
  dateDay: { fontSize: 17, color: 'var(--muted)', fontFamily: 'var(--font-ui)' },
  dateFull: { fontSize: 17, fontWeight: 600, color: 'var(--text-soft)', fontFamily: 'var(--font-ui)' },
  body: { flex: 1, overflow: 'auto', padding: '24px 32px 32px', display: 'flex', flexDirection: 'column', gap: 16 },
  modesRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 },
  modeCard: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '20px 22px', cursor: 'pointer', transition: 'all 0.15s', display: 'flex', flexDirection: 'column', gap: 6 },
  modeCardPaper: { borderColor: 'oklch(0.85 0.06 170)', background: 'var(--surface-2)' },
  modeIcon: { width: 42, height: 42, borderRadius: 10, background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  modeTitle: { fontSize: 16, fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--font-ui)' },
  modeDesc: { fontSize: 13, color: 'var(--muted)', fontFamily: 'var(--font-ui)', lineHeight: 1.5 },
  modeMeta: { fontSize: 12, color: 'var(--accent)', fontFamily: 'var(--font-ui)', fontWeight: 600, marginTop: 2 },
  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 },
  statCard: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '18px 20px', display: 'flex', flexDirection: 'column' },
  statValue: { fontSize: 30, fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--font-display)', letterSpacing: '-0.02em', lineHeight: 1 },
  statLabel: { fontSize: 16, fontWeight: 600, color: 'var(--text-soft)', fontFamily: 'var(--font-ui)', marginTop: 4 },
  statSub: { fontSize: 17, color: 'var(--muted)', fontFamily: 'var(--font-ui)', marginTop: 2 },
  twoCol: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 },
  card: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '18px 20px' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  cardTitle: { fontSize: 16, fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--font-ui)' },
  cardAction: { fontSize: 17, color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-ui)', fontWeight: 600 },
  paperRow: { display: 'flex', gap: 14, padding: '10px 0', borderBottom: '1px solid var(--surface-2)', cursor: 'pointer', alignItems: 'flex-start' },
  paperRowLeft: { flex: 1, minWidth: 0 },
  paperRowTitle: { fontSize: 16, fontWeight: 500, color: 'var(--text)', fontFamily: 'var(--font-ui)', lineHeight: 1.4, marginBottom: 3, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' },
  paperRowMeta: { fontSize: 16.5, color: 'var(--muted)', fontFamily: 'var(--font-ui)', marginBottom: 6 },
  progressTrack: { height: 3, background: 'var(--border)', borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: '100%', background: 'var(--accent)', borderRadius: 2 },
  paperRowRight: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 14, flexShrink: 0 },
  statusPill: { fontSize: 16, padding: '2px 7px', borderRadius: 4, fontWeight: 600, fontFamily: 'var(--font-ui)' },
  progressPct: { fontSize: 17, fontFamily: 'var(--font-mono)', color: 'var(--accent)', fontWeight: 600 },
  activityRow: { display: 'flex', alignItems: 'flex-start', gap: 9, padding: '7px 0', borderBottom: '1px solid var(--bg)' },
  actDot: { width: 7, height: 7, borderRadius: '50%', marginTop: 4, flexShrink: 0 },
  actLabel: { fontSize: 16, color: 'var(--text)', fontFamily: 'var(--font-ui)', lineHeight: 1.4 },
  actTime: { fontSize: 16, color: 'var(--muted)', fontFamily: 'var(--font-ui)', marginTop: 1 },
  quickRow: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 },
  quickCard: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '18px 20px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s', fontFamily: 'var(--font-ui)' },
  quickIcon: { fontSize: 30, color: 'var(--accent)', marginBottom: 8, lineHeight: 1 },
  quickLabel: { fontSize: 16, fontWeight: 600, color: 'var(--text)', fontFamily: 'var(--font-ui)', marginBottom: 3 },
  quickDesc: { fontSize: 17, color: 'var(--muted)', fontFamily: 'var(--font-ui)' },
};

Object.assign(window, { HomeView });
