
const REVIEWS = [
  { title: 'Toward a post-APC publishing model', journal: 'J. Scholarly Publishing', date: 'Mar 2026', quality: 'high' },
  { title: 'Citation network analysis in biomedicine', journal: 'Scientometrics', date: 'Jan 2026', quality: 'high' },
  { title: 'Open data mandates in LATAM research', journal: 'Información, Cultura y Sociedad', date: 'Nov 2025', quality: 'medium' },
];

const PUBS = [
  { title: 'Open Knowledge Infrastructure: A Framework for Diamond OA', status: 'Draft', year: 2026, license: 'CC BY', venue: 'In preparation' },
  { title: 'Peer review labour and its economic invisibility', status: 'Published', year: 2025, license: 'CC BY', venue: 'SocArXiv' },
  { title: 'Citation graph centrality as prestige proxy: a critique', status: 'Published', year: 2024, license: 'CC BY-NC', venue: 'Zenodo' },
];

const CREDITS = [
  { role: 'Conceptualization', pct: 95 },
  { role: 'Methodology', pct: 80 },
  { role: 'Software', pct: 70 },
  { role: 'Writing – original', pct: 90 },
  { role: 'Visualization', pct: 60 },
  { role: 'Supervision', pct: 20 },
];

function ProfileView() {
  const [tab, setTab] = React.useState('overview');

  return (
    <div style={profStyles.root}>
      {/* Header */}
      <div style={profStyles.profileBanner}>
        <div style={profStyles.avatarLarge}>MV</div>
        <div style={profStyles.profileInfo}>
          <div style={profStyles.name}>Matías Vargas</div>
          <div style={profStyles.role}>PhD Researcher · Pontificia Universidad Católica de Chile</div>
          <div style={profStyles.tagRow}>
            <span style={profStyles.fieldTag}>Open Science</span>
            <span style={profStyles.fieldTag}>Bibliometrics</span>
            <span style={profStyles.fieldTag}>Knowledge Systems</span>
          </div>
        </div>
        <div style={profStyles.orcidBlock}>
          <div style={profStyles.orcidLabel}>ORCID</div>
          <div style={profStyles.orcidId}>0000-0002-1825-0097</div>
          <div style={profStyles.orcidVerified}>
            <svg width={10} height={10} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 8l4 4 6-7" /></svg>
            Verified
          </div>
        </div>
        <div style={profStyles.statsBlock}>
          {[['3', 'Papers'], ['6', 'Reviews'], ['12', 'Concepts'], ['1', 'Institution']].map(([n, l]) => (
            <div key={l} style={profStyles.statItem}>
              <div style={profStyles.statBig}>{n}</div>
              <div style={profStyles.statSmall}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div style={profStyles.tabBar}>
        {['overview', 'publications', 'reviews', 'contributions'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            style={{ ...profStyles.tab, ...(tab === t ? profStyles.tabActive : {}) }}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={profStyles.content}>
        {tab === 'overview' && (
          <div style={profStyles.overviewGrid}>
            {/* Activity */}
            <div style={profStyles.card}>
              <div style={profStyles.cardTitle}>Recent Activity</div>
              {[
                { label: 'Updated LUMEN.md for paper 1', time: 'Today, 09:14', type: 'edit' },
                { label: 'Added 2 sources to Library', time: 'Today, 08:42', type: 'source' },
                { label: 'Completed peer review — Scientometrics', time: 'Yesterday', type: 'review' },
                { label: 'New concept: "Institutional Consortia"', time: '2 days ago', type: 'concept' },
              ].map((a, i) => (
                <div key={i} style={profStyles.activityRow}>
                  <div style={{ ...profStyles.activityDot, background: a.type === 'review' ? 'oklch(0.55 0.12 170)' : a.type === 'source' ? 'oklch(0.55 0.1 260)' : 'oklch(0.65 0.1 60)' }} />
                  <div style={{ flex: 1 }}>
                    <div style={profStyles.activityLabel}>{a.label}</div>
                    <div style={profStyles.activityTime}>{a.time}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* CRediT breakdown */}
            <div style={profStyles.card}>
              <div style={profStyles.cardTitle}>Contribution Profile <span style={profStyles.creditBadge}>CRediT</span></div>
              {CREDITS.map(c => (
                <div key={c.role} style={profStyles.creditRow}>
                  <div style={profStyles.creditLabel}>{c.role}</div>
                  <div style={profStyles.barTrack}>
                    <div style={{ ...profStyles.barFill, width: c.pct + '%' }} />
                  </div>
                  <div style={profStyles.creditPct}>{c.pct}%</div>
                </div>
              ))}
            </div>

            {/* Reputation */}
            <div style={profStyles.card}>
              <div style={profStyles.cardTitle}>Reputation Index</div>
              <div style={profStyles.reputationNote}>
                Lumen reputation replaces h-index with verified contributions across authorship, review, and knowledge building.
              </div>
              {[
                { label: 'Publication score', val: 68, max: 100, color: 'var(--accent)' },
                { label: 'Review quality score', val: 82, max: 100, color: 'oklch(0.45 0.12 170)' },
                { label: 'Open access rate', val: 100, max: 100, color: 'oklch(0.5 0.1 145)' },
                { label: 'Copyright retained', val: 100, max: 100, color: 'oklch(0.5 0.1 145)' },
              ].map(m => (
                <div key={m.label} style={profStyles.creditRow}>
                  <div style={profStyles.creditLabel}>{m.label}</div>
                  <div style={profStyles.barTrack}>
                    <div style={{ ...profStyles.barFill, width: (m.val / m.max * 100) + '%', background: m.color }} />
                  </div>
                  <div style={profStyles.creditPct}>{m.val}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'publications' && (
          <div style={profStyles.tableWrap}>
            {PUBS.map((p, i) => (
              <div key={i} style={profStyles.pubRow}>
                <div style={profStyles.pubStatus} data-status={p.status.toLowerCase()}>
                  {p.status}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={profStyles.pubTitle}>{p.title}</div>
                  <div style={profStyles.pubMeta}>{p.venue} · {p.year}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <span style={{ ...profStyles.licTag, background: 'oklch(0.93 0.07 160)', color: 'oklch(0.35 0.12 160)' }}>{p.license}</span>
                  <span style={profStyles.copyrightNote}>author retains ©</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'reviews' && (
          <div style={profStyles.tableWrap}>
            <div style={profStyles.reviewHeader}>
              <div style={profStyles.reviewStat}>
                <div style={profStyles.reviewStatNum}>6</div>
                <div style={profStyles.reviewStatLabel}>Total reviews completed</div>
              </div>
              <div style={profStyles.reviewStat}>
                <div style={profStyles.reviewStatNum}>4.7</div>
                <div style={profStyles.reviewStatLabel}>Avg quality score</div>
              </div>
              <div style={profStyles.reviewStat}>
                <div style={profStyles.reviewStatNum}>2:1</div>
                <div style={profStyles.reviewStatLabel}>R-Index (given:received)</div>
              </div>
            </div>
            {REVIEWS.map((r, i) => (
              <div key={i} style={profStyles.reviewRow}>
                <div style={{ ...profStyles.qualityDot, background: r.quality === 'high' ? 'oklch(0.55 0.12 170)' : 'oklch(0.65 0.1 60)' }} />
                <div style={{ flex: 1 }}>
                  <div style={profStyles.pubTitle}>{r.title}</div>
                  <div style={profStyles.pubMeta}>{r.journal} · {r.date}</div>
                </div>
                <span style={{ fontSize: 16, color: 'oklch(0.55 0.08 170)', background: 'oklch(0.94 0.05 170)', padding: '3px 7px', borderRadius: 4, fontFamily: 'var(--font-ui)', fontWeight: 600 }}>
                  Verified
                </span>
              </div>
            ))}
            <div style={profStyles.reviewNote}>
              Peer reviews are verified and linked to the submitted paper. They appear on your profile regardless of publication outcome.
            </div>
          </div>
        )}

        {tab === 'contributions' && (
          <div style={profStyles.tableWrap}>
            <div style={{ fontSize: 17, color: 'var(--text-soft)', lineHeight: 1.7, marginBottom: 20, fontFamily: 'var(--font-ui)', maxWidth: 580 }}>
              Your contribution profile uses the <strong>CRediT taxonomy</strong> to record 14 standardized roles across all collaborative work. Copyright is retained by you on all CC-licensed outputs.
            </div>
            {CREDITS.map(c => (
              <div key={c.role} style={{ ...profStyles.creditRow, marginBottom: 10 }}>
                <div style={{ ...profStyles.creditLabel, width: 200 }}>{c.role}</div>
                <div style={{ ...profStyles.barTrack, flex: 1 }}>
                  <div style={{ ...profStyles.barFill, width: c.pct + '%' }} />
                </div>
                <div style={profStyles.creditPct}>{c.pct}%</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const profStyles = {
  root: { display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg)', overflow: 'hidden' },
  profileBanner: { background: 'var(--surface)', borderBottom: '1px solid var(--border)', padding: '24px 28px', display: 'flex', alignItems: 'center', gap: 20 },
  avatarLarge: { width: 52, height: 52, borderRadius: '50%', background: 'var(--accent)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30, fontWeight: 700, flexShrink: 0, fontFamily: 'var(--font-ui)' },
  profileInfo: { flex: 1 },
  name: { fontSize: 30, fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--font-display)', letterSpacing: '-0.02em', marginBottom: 3 },
  role: { fontSize: 16, color: 'var(--muted)', fontFamily: 'var(--font-ui)', marginBottom: 6 },
  tagRow: { display: 'flex', gap: 5 },
  fieldTag: { fontSize: 16, background: 'var(--surface-2)', color: 'var(--text-soft)', padding: '3px 7px', borderRadius: 4, fontFamily: 'var(--font-ui)' },
  orcidBlock: { textAlign: 'center', padding: '0 20px' },
  orcidLabel: { fontSize: 17, fontWeight: 700, color: 'var(--muted)', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'var(--font-ui)', marginBottom: 3 },
  orcidId: { fontSize: 17, fontFamily: 'var(--font-mono)', color: 'var(--text-soft)', marginBottom: 4 },
  orcidVerified: { fontSize: 16, color: 'oklch(0.45 0.12 170)', display: 'flex', alignItems: 'center', gap: 14, justifyContent: 'center', fontFamily: 'var(--font-ui)', fontWeight: 600 },
  statsBlock: { display: 'flex', gap: 20, borderLeft: '1px solid var(--border)', paddingLeft: 20 },
  statItem: { textAlign: 'center' },
  statBig: { fontSize: 30, fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' },
  statSmall: { fontSize: 16, color: 'var(--muted)', fontFamily: 'var(--font-ui)' },
  tabBar: { display: 'flex', borderBottom: '1px solid var(--border)', padding: '0 32px', background: 'var(--surface)' },
  tab: { background: 'none', border: 'none', borderBottom: '2px solid transparent', padding: '9px 12px 11px', fontSize: 16, color: 'var(--muted)', cursor: 'pointer', fontFamily: 'var(--font-ui)', transition: 'all 0.15s' },
  tabActive: { color: 'var(--accent)', borderBottomColor: 'var(--accent)', fontWeight: 600 },
  content: { flex: 1, overflow: 'auto', padding: '24px 32px' },
  overviewGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 },
  card: { background: 'var(--surface)', borderRadius: 12, border: '1px solid var(--border)', padding: '18px 20px' },
  cardTitle: { fontSize: 16, fontWeight: 700, color: 'var(--text)', marginBottom: 12, fontFamily: 'var(--font-ui)', display: 'flex', alignItems: 'center', gap: 14 },
  creditBadge: { fontSize: 17, background: 'oklch(0.93 0.03 260)', color: 'oklch(0.42 0.1 260)', padding: '2px 5px', borderRadius: 3, fontWeight: 700, letterSpacing: '0.05em' },
  activityRow: { display: 'flex', alignItems: 'flex-start', gap: 14, padding: '6px 0', borderBottom: '1px solid var(--surface-2)' },
  activityDot: { width: 7, height: 7, borderRadius: '50%', marginTop: 3, flexShrink: 0 },
  activityLabel: { fontSize: 17.5, color: 'var(--text)', fontFamily: 'var(--font-ui)', lineHeight: 1.4 },
  activityTime: { fontSize: 16, color: 'var(--muted)', fontFamily: 'var(--font-ui)', marginTop: 1 },
  creditRow: { display: 'flex', alignItems: 'center', gap: 14, marginBottom: 7 },
  creditLabel: { fontSize: 17, color: 'var(--text-soft)', fontFamily: 'var(--font-ui)', width: 130, flexShrink: 0 },
  barTrack: { flex: 1, height: 5, background: 'var(--border)', borderRadius: 3, overflow: 'hidden' },
  barFill: { height: '100%', background: 'var(--accent)', borderRadius: 3, transition: 'width 0.5s ease' },
  creditPct: { fontSize: 17, color: 'var(--muted)', fontFamily: 'var(--font-mono)', width: 30, textAlign: 'right' },
  reputationNote: { fontSize: 17, color: 'var(--muted)', fontFamily: 'var(--font-ui)', lineHeight: 1.5, marginBottom: 12 },
  tableWrap: { background: 'var(--surface)', borderRadius: 12, border: '1px solid var(--border)', padding: '18px 22px' },
  pubRow: { display: 'flex', alignItems: 'center', gap: 14, padding: '12px 0', borderBottom: '1px solid var(--surface-2)' },
  pubStatus: { fontSize: 16, padding: '3px 7px', borderRadius: 4, fontWeight: 600, background: 'oklch(0.94 0.05 170)', color: 'oklch(0.38 0.12 170)', fontFamily: 'var(--font-ui)', flexShrink: 0 },
  pubTitle: { fontSize: 17, fontWeight: 500, color: 'var(--text)', fontFamily: 'var(--font-ui)', marginBottom: 2 },
  pubMeta: { fontSize: 17, color: 'var(--muted)', fontFamily: 'var(--font-ui)' },
  licTag: { fontSize: 16, padding: '2px 6px', borderRadius: 4, fontWeight: 600, fontFamily: 'var(--font-ui)' },
  copyrightNote: { fontSize: 16, color: 'var(--muted)', fontFamily: 'var(--font-ui)' },
  reviewHeader: { display: 'flex', gap: 16, marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid var(--surface-2)' },
  reviewStat: { flex: 1, textAlign: 'center', background: 'var(--bg)', borderRadius: 12, padding: '10px' },
  reviewStatNum: { fontSize: 30, fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--font-display)' },
  reviewStatLabel: { fontSize: 16, color: 'var(--muted)', fontFamily: 'var(--font-ui)', marginTop: 2 },
  reviewRow: { display: 'flex', alignItems: 'center', gap: 14, padding: '10px 0', borderBottom: '1px solid var(--surface-2)' },
  qualityDot: { width: 8, height: 8, borderRadius: '50%', flexShrink: 0 },
  reviewNote: { fontSize: 17, color: 'var(--muted)', fontFamily: 'var(--font-ui)', marginTop: 14, lineHeight: 1.6, fontStyle: 'italic' },
};

Object.assign(window, { ProfileView });
