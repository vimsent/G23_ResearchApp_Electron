
const UNIVERSITIES = [
  { id: 'uc', name: 'Pontificia Universidad Católica de Chile', abbr: 'UC Chile', country: 'Chile 🇨🇱', researchers: 847, areas: ['Physics', 'Social Sciences', 'Medicine', 'Engineering'], color: 'oklch(0.48 0.13 20)', verified: true },
  { id: 'unam', name: 'Universidad Nacional Autónoma de México', abbr: 'UNAM', country: 'Mexico 🇲🇽', researchers: 2341, areas: ['Biology', 'Chemistry', 'Humanities', 'Mathematics'], color: 'oklch(0.48 0.12 45)', verified: true },
  { id: 'uba', name: 'Universidad de Buenos Aires', abbr: 'UBA', country: 'Argentina 🇦🇷', researchers: 1203, areas: ['Law', 'Medicine', 'Social Sciences', 'Engineering'], color: 'oklch(0.46 0.13 220)', verified: true },
  { id: 'usp', name: 'Universidade de São Paulo', abbr: 'USP', country: 'Brazil 🇧🇷', researchers: 3102, areas: ['Medicine', 'Engineering', 'Agriculture', 'CS'], color: 'oklch(0.48 0.11 145)', verified: true },
  { id: 'utfsm', name: 'Universidad Técnica Federico Santa María', abbr: 'USM', country: 'Chile 🇨🇱', researchers: 312, areas: ['Engineering', 'Computer Science', 'Physics'], color: 'oklch(0.46 0.14 260)', verified: true },
  { id: 'up', name: 'Universidad del Pacífico', abbr: 'UP', country: 'Peru 🇵🇪', researchers: 156, areas: ['Economics', 'Business', 'Social Sciences'], color: 'oklch(0.48 0.1 280)', verified: false },
];

const RESEARCHERS = [
  { id: 'r1', name: 'Valentina Cruz', title: 'Associate Professor', uni: 'UNAM', area: 'Open Science & Bibliometrics', orcid: '0000-0001-9345-2112', papers: 24, reviews: 18, license: 'CC BY', avatar: 'VC', color: 'oklch(0.48 0.12 45)', following: false },
  { id: 'r2', name: 'Rafael Monteiro', title: 'PhD Candidate', uni: 'USP', area: 'Computational Biology', orcid: '0000-0002-4421-8834', papers: 8, reviews: 12, license: 'CC BY', avatar: 'RM', color: 'oklch(0.48 0.11 145)', following: true },
  { id: 'r3', name: 'Andrea Solís', title: 'Postdoctoral Researcher', uni: 'UC Chile', area: 'Science Policy & OA Mandates', orcid: '0000-0003-7823-0091', papers: 11, reviews: 9, license: 'CC BY-NC', avatar: 'AS', color: 'oklch(0.48 0.13 20)', following: false },
  { id: 'r4', name: 'Diego Fernández', title: 'Full Professor', uni: 'UBA', area: 'Information Science', orcid: '0000-0001-2345-6789', papers: 47, reviews: 31, license: 'CC BY', avatar: 'DF', color: 'oklch(0.46 0.13 220)', following: true },
  { id: 'r5', name: 'Lucia Pereyra', title: 'Assistant Professor', uni: 'UBA', area: 'Digital Humanities', orcid: '0000-0002-9988-1234', papers: 15, reviews: 7, license: 'CC BY', avatar: 'LP', color: 'oklch(0.46 0.13 220)', following: false },
  { id: 'r6', name: 'Carlos Espinoza', title: 'Research Scientist', uni: 'USM', area: 'Machine Learning & Scientometrics', orcid: '0000-0003-1122-3344', papers: 19, reviews: 14, license: 'CC BY', avatar: 'CE', color: 'oklch(0.46 0.14 260)', following: false },
];

function CommunityView() {
  const [search, setSearch] = React.useState('');
  const [tab, setTab] = React.useState('researchers');
  const [selectedUni, setSelectedUni] = React.useState(null);
  const [selectedResearcher, setSelectedResearcher] = React.useState(null);
  const [following, setFollowing] = React.useState(new Set(RESEARCHERS.filter(r => r.following).map(r => r.id)));

  const qLower = search.toLowerCase();
  const filteredResearchers = RESEARCHERS.filter(r =>
    !qLower || r.name.toLowerCase().includes(qLower) || r.area.toLowerCase().includes(qLower) || r.uni.toLowerCase().includes(qLower)
  );
  const filteredUnis = UNIVERSITIES.filter(u =>
    !qLower || u.name.toLowerCase().includes(qLower) || u.abbr.toLowerCase().includes(qLower) || u.areas.some(a => a.toLowerCase().includes(qLower))
  );

  const selectedUniData = UNIVERSITIES.find(u => u.id === selectedUni);
  const selectedResData = RESEARCHERS.find(r => r.id === selectedResearcher);
  const uniResearchers = selectedUniData ? RESEARCHERS.filter(r => r.uni === selectedUniData.abbr) : [];

  const toggleFollow = (id) => {
    setFollowing(f => { const n = new Set(f); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };

  return (
    <div style={cs.root}>
      {/* Header */}
      <div style={cs.header}>
        <div>
          <div style={cs.breadcrumb}>Network</div>
          <h1 style={cs.title}>Academic Community</h1>
        </div>
        <div style={cs.searchWrap}>
          <svg width={13} height={13} viewBox="0 0 16 16" fill="none" stroke="var(--muted)" strokeWidth="1.5" strokeLinecap="round" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }}>
            <circle cx="7" cy="7" r="5" /><path d="M11 11l3 3" />
          </svg>
          <input style={cs.searchInput} placeholder="Search researchers, institutions, fields…"
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      {/* Tabs */}
      <div style={cs.tabBar}>
        {['researchers', 'institutions'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            style={{ ...cs.tab, ...(tab === t ? cs.tabActive : {}) }}>
            {t === 'researchers' ? `Researchers (${filteredResearchers.length})` : `Institutions (${filteredUnis.length})`}
          </button>
        ))}
        <div style={cs.tabSpacer} />
        <div style={cs.networkStats}>
          <span>🌐 {UNIVERSITIES.filter(u => u.verified).length} verified institutions</span>
          <span>· {RESEARCHERS.length} researchers</span>
        </div>
      </div>

      <div style={cs.body}>
        {/* Main list */}
        <div style={cs.list}>
          {tab === 'researchers' && filteredResearchers.map(r => (
            <div key={r.id}
              style={{ ...cs.researcherCard, ...(selectedResearcher === r.id ? cs.cardSelected : {}) }}
              onClick={() => { setSelectedResearcher(r.id === selectedResearcher ? null : r.id); setSelectedUni(null); }}>
              <div style={{ ...cs.resAvatar, background: r.color }}>{r.avatar}</div>
              <div style={cs.resInfo}>
                <div style={cs.resName}>{r.name}
                  <span style={cs.orcidBadge}>ORCID ✓</span>
                </div>
                <div style={cs.resTitle}>{r.title} · {r.uni}</div>
                <div style={cs.resArea}>{r.area}</div>
                <div style={cs.resMeta}>
                  <span>{r.papers} papers</span>
                  <span style={cs.dot}>·</span>
                  <span>{r.reviews} reviews</span>
                  <span style={cs.dot}>·</span>
                  <span style={{ color: 'oklch(0.38 0.12 160)' }}>{r.license}</span>
                </div>
              </div>
              <button
                style={{ ...cs.followBtn, ...(following.has(r.id) ? cs.followBtnActive : {}) }}
                onClick={e => { e.stopPropagation(); toggleFollow(r.id); }}>
                {following.has(r.id) ? 'Following' : '+ Follow'}
              </button>
            </div>
          ))}

          {tab === 'institutions' && filteredUnis.map(u => (
            <div key={u.id}
              style={{ ...cs.uniCard, ...(selectedUni === u.id ? cs.cardSelected : {}) }}
              onClick={() => { setSelectedUni(u.id === selectedUni ? null : u.id); setSelectedResearcher(null); }}>
              <div style={{ ...cs.uniAccent, background: u.color }} />
              <div style={cs.uniInfo}>
                <div style={cs.uniNameRow}>
                  <span style={cs.uniName}>{u.name}</span>
                  {u.verified && <span style={cs.verifiedBadge}>✓ Verified</span>}
                </div>
                <div style={cs.uniMeta}>{u.country} · {u.researchers.toLocaleString()} researchers</div>
                <div style={cs.uniAreas}>
                  {u.areas.map(a => <span key={a} style={cs.areaTag}>{a}</span>)}
                </div>
              </div>
              <div style={cs.uniResCount}>
                <div style={cs.uniResNum}>{RESEARCHERS.filter(r => r.uni === u.abbr).length}</div>
                <div style={cs.uniResLabel}>on Lumen</div>
              </div>
            </div>
          ))}
        </div>

        {/* Detail panel */}
        {(selectedResData || selectedUniData) && (
          <div style={cs.detail}>
            {selectedResData && (
              <>
                <div style={cs.detailAvatar} data-color={selectedResData.color}>
                  <div style={{ ...cs.detailAvatarCircle, background: selectedResData.color }}>{selectedResData.avatar}</div>
                </div>
                <div style={cs.detailName}>{selectedResData.name}</div>
                <div style={cs.detailRole}>{selectedResData.title}</div>
                <div style={cs.detailInst}>{selectedResData.uni}</div>
                <div style={cs.detailOrcid}>
                  <svg width={10} height={10} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 8l4 4 6-7" /></svg>
                  {selectedResData.orcid}
                </div>
                <div style={cs.detailArea}>{selectedResData.area}</div>

                <div style={cs.detailStatRow}>
                  {[['Papers', selectedResData.papers], ['Reviews', selectedResData.reviews], ['Concepts', Math.floor(selectedResData.papers * 2.1)]].map(([l, v]) => (
                    <div key={l} style={cs.detailStat}>
                      <div style={cs.detailStatNum}>{v}</div>
                      <div style={cs.detailStatLabel}>{l}</div>
                    </div>
                  ))}
                </div>

                <div style={cs.detailSection}>
                  <div style={cs.detailSectionLabel}>License Default</div>
                  <span style={{ ...cs.licTag, background: selectedResData.license === 'CC BY' ? 'oklch(0.93 0.07 160)' : 'var(--surface-2)', color: selectedResData.license === 'CC BY' ? 'oklch(0.35 0.12 160)' : 'oklch(0.45 0.08 80)' }}>
                    {selectedResData.license}
                  </span>
                  <span style={cs.copyrightNote}>author retains ©</span>
                </div>

                <div style={cs.detailSection}>
                  <div style={cs.detailSectionLabel}>Recent Papers</div>
                  {['Toward equitable OA in LATAM', 'Preprint citation dynamics post-2020'].slice(0, 2).map((t, i) => (
                    <div key={i} style={cs.miniPaper}>{t}</div>
                  ))}
                </div>

                <button
                  style={{ ...cs.followBtnLarge, ...(following.has(selectedResData.id) ? cs.followBtnLargeActive : {}) }}
                  onClick={() => toggleFollow(selectedResData.id)}>
                  {following.has(selectedResData.id) ? '✓ Following' : '+ Follow'}
                </button>
                <button style={cs.msgBtn}>Send message</button>
              </>
            )}

            {selectedUniData && (
              <>
                <div style={{ ...cs.uniDetailBanner, background: selectedUniData.color }}>
                  <div style={cs.uniDetailAbbr}>{selectedUniData.abbr}</div>
                </div>
                <div style={cs.detailName}>{selectedUniData.name}</div>
                <div style={cs.detailRole}>{selectedUniData.country}</div>
                {selectedUniData.verified && (
                  <div style={cs.uniVerifiedRow}>
                    <svg width={11} height={11} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 8l4 4 6-7" /></svg>
                    Verified institution on Lumen
                  </div>
                )}
                <div style={cs.detailStatRow}>
                  {[['Researchers', selectedUniData.researchers.toLocaleString()], ['On Lumen', uniResearchers.length], ['Areas', selectedUniData.areas.length]].map(([l, v]) => (
                    <div key={l} style={cs.detailStat}>
                      <div style={cs.detailStatNum}>{v}</div>
                      <div style={cs.detailStatLabel}>{l}</div>
                    </div>
                  ))}
                </div>
                <div style={cs.detailSection}>
                  <div style={cs.detailSectionLabel}>Research Areas</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
                    {selectedUniData.areas.map(a => <span key={a} style={cs.areaTag}>{a}</span>)}
                  </div>
                </div>
                {uniResearchers.length > 0 && (
                  <div style={cs.detailSection}>
                    <div style={cs.detailSectionLabel}>Researchers on Lumen</div>
                    {uniResearchers.map(r => (
                      <div key={r.id} style={cs.miniResRow}
                        onClick={() => { setSelectedResearcher(r.id); setSelectedUni(null); setTab('researchers'); }}>
                        <div style={{ ...cs.miniAvatar, background: r.color }}>{r.avatar}</div>
                        <div>
                          <div style={cs.miniName}>{r.name}</div>
                          <div style={cs.miniRole}>{r.title}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const cs = {
  root: { display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg)', overflow: 'hidden' },
  header: { padding: '28px 32px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' },
  breadcrumb: { fontSize: 17, color: 'var(--muted)', marginBottom: 2, fontFamily: 'var(--font-ui)' },
  title: { fontSize: 30, fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--font-display)', margin: 0, letterSpacing: '-0.02em' },
  searchWrap: { position: 'relative', paddingBottom: 2 },
  searchInput: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '7px 12px 7px 30px', fontSize: 16, color: 'var(--text)', outline: 'none', width: 280, fontFamily: 'var(--font-ui)' },
  tabBar: { display: 'flex', alignItems: 'center', borderBottom: '1px solid var(--border)', padding: '0 32px', marginTop: 14 },
  tab: { background: 'none', border: 'none', borderBottom: '2px solid transparent', padding: '7px 12px 10px', fontSize: 16, color: 'var(--muted)', cursor: 'pointer', fontFamily: 'var(--font-ui)', transition: 'all 0.15s' },
  tabActive: { color: 'var(--accent)', borderBottomColor: 'var(--accent)', fontWeight: 600 },
  tabSpacer: { flex: 1 },
  networkStats: { fontSize: 17, color: 'var(--muted)', fontFamily: 'var(--font-ui)', display: 'flex', gap: 14, paddingBottom: 10 },
  body: { display: 'flex', flex: 1, overflow: 'hidden', padding: '18px 32px 28px', gap: 16 },
  list: { flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column', gap: 14 },
  researcherCard: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer', transition: 'all 0.15s' },
  cardSelected: { border: '1.5px solid oklch(0.72 0.08 260)', boxShadow: '0 0 0 3px var(--accent-light)' },
  resAvatar: { width: 40, height: 40, borderRadius: '50%', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, fontWeight: 700, flexShrink: 0, fontFamily: 'var(--font-ui)' },
  resInfo: { flex: 1, minWidth: 0 },
  resName: { fontSize: 17.5, fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--font-ui)', display: 'flex', alignItems: 'center', gap: 7, marginBottom: 2 },
  orcidBadge: { fontSize: 17, background: 'oklch(0.93 0.07 160)', color: 'oklch(0.35 0.12 160)', padding: '2px 5px', borderRadius: 3, fontWeight: 700, letterSpacing: '0.04em', fontFamily: 'var(--font-ui)' },
  resTitle: { fontSize: 17.5, color: 'var(--muted)', fontFamily: 'var(--font-ui)', marginBottom: 2 },
  resArea: { fontSize: 16, color: 'oklch(0.3 0.02 260)', fontFamily: 'var(--font-ui)', marginBottom: 5, fontWeight: 500 },
  resMeta: { display: 'flex', alignItems: 'center', gap: 5, fontSize: 17, color: 'var(--muted)', fontFamily: 'var(--font-ui)' },
  dot: { color: 'var(--muted)' },
  followBtn: { fontSize: 17, fontWeight: 600, padding: '7px 14px', borderRadius: 20, border: '1px solid oklch(0.85 0.04 260)', background: 'none', color: 'var(--accent)', cursor: 'pointer', fontFamily: 'var(--font-ui)', flexShrink: 0, transition: 'all 0.12s' },
  followBtnActive: { background: 'var(--accent)', color: '#fff', border: '1px solid var(--accent)' },
  uniCard: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 0, cursor: 'pointer', transition: 'all 0.15s', overflow: 'hidden', position: 'relative' },
  uniAccent: { width: 3, height: '100%', position: 'absolute', left: 0, top: 0, borderRadius: '10px 0 0 10px' },
  uniInfo: { flex: 1, minWidth: 0, paddingLeft: 12 },
  uniNameRow: { display: 'flex', alignItems: 'center', gap: 14, marginBottom: 3 },
  uniName: { fontSize: 17.5, fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--font-ui)' },
  verifiedBadge: { fontSize: 17, background: 'oklch(0.93 0.07 160)', color: 'oklch(0.35 0.12 160)', padding: '2px 6px', borderRadius: 3, fontWeight: 700, fontFamily: 'var(--font-ui)' },
  uniMeta: { fontSize: 17.5, color: 'var(--muted)', fontFamily: 'var(--font-ui)', marginBottom: 6 },
  uniAreas: { display: 'flex', gap: 14, flexWrap: 'wrap' },
  areaTag: { fontSize: 16, background: 'var(--surface-2)', color: 'var(--text-soft)', padding: '2px 7px', borderRadius: 4, fontFamily: 'var(--font-ui)' },
  uniResCount: { textAlign: 'center', paddingLeft: 16 },
  uniResNum: { fontSize: 30, fontWeight: 700, color: 'var(--accent)', fontFamily: 'var(--font-display)' },
  uniResLabel: { fontSize: 16, color: 'var(--muted)', fontFamily: 'var(--font-ui)' },
  detail: { width: 270, background: 'var(--surface)', borderRadius: 12, border: '1px solid var(--border)', padding: 20, overflow: 'auto', display: 'flex', flexDirection: 'column', gap: 0, alignSelf: 'flex-start', maxHeight: '100%' },
  detailAvatarCircle: { width: 56, height: 56, borderRadius: '50%', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30, fontWeight: 700, marginBottom: 12, fontFamily: 'var(--font-ui)' },
  detailName: { fontSize: 17, fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--font-display)', letterSpacing: '-0.01em', marginBottom: 3 },
  detailRole: { fontSize: 17.5, color: 'var(--muted)', fontFamily: 'var(--font-ui)', marginBottom: 2 },
  detailInst: { fontSize: 17.5, color: 'var(--accent)', fontFamily: 'var(--font-ui)', fontWeight: 600, marginBottom: 6 },
  detailOrcid: { display: 'flex', alignItems: 'center', gap: 14, fontSize: 17, color: 'oklch(0.38 0.12 160)', fontFamily: 'var(--font-mono)', marginBottom: 8 },
  detailArea: { fontSize: 16, color: 'oklch(0.3 0.02 260)', fontFamily: 'var(--font-ui)', fontWeight: 500, marginBottom: 12, lineHeight: 1.4 },
  detailStatRow: { display: 'flex', gap: 14, marginBottom: 14 },
  detailStat: { flex: 1, background: 'var(--bg)', borderRadius: 12, padding: '8px 6px', textAlign: 'center' },
  detailStatNum: { fontSize: 16, fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--font-display)' },
  detailStatLabel: { fontSize: 16, color: 'var(--muted)', fontFamily: 'var(--font-ui)', marginTop: 1 },
  detailSection: { marginBottom: 14 },
  detailSectionLabel: { fontSize: 16, fontWeight: 700, color: 'var(--muted)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 6, fontFamily: 'var(--font-ui)' },
  licTag: { fontSize: 17, padding: '3px 7px', borderRadius: 4, fontWeight: 600, fontFamily: 'var(--font-ui)' },
  copyrightNote: { fontSize: 16, color: 'var(--muted)', fontFamily: 'var(--font-ui)', marginLeft: 6 },
  miniPaper: { fontSize: 16, color: 'oklch(0.3 0.02 260)', fontFamily: 'var(--font-ui)', padding: '5px 0', borderBottom: '1px solid var(--surface-2)', lineHeight: 1.4 },
  followBtnLarge: { width: '100%', padding: '9px', borderRadius: 12, border: '1.5px solid oklch(0.85 0.04 260)', background: 'none', color: 'var(--accent)', cursor: 'pointer', fontFamily: 'var(--font-ui)', fontSize: 16, fontWeight: 600, marginBottom: 7, transition: 'all 0.12s' },
  followBtnLargeActive: { background: 'var(--accent)', color: '#fff', border: '1.5px solid var(--accent)' },
  msgBtn: { width: '100%', padding: '8px', borderRadius: 12, border: '1px solid var(--border)', background: 'none', color: 'var(--muted)', cursor: 'pointer', fontFamily: 'var(--font-ui)', fontSize: 16 },
  uniDetailBanner: { height: 60, borderRadius: 12, marginBottom: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  uniDetailAbbr: { fontSize: 30, fontWeight: 800, color: '#fff', fontFamily: 'var(--font-ui)', letterSpacing: '0.05em', opacity: 0.9 },
  uniVerifiedRow: { display: 'flex', alignItems: 'center', gap: 5, fontSize: 17, color: 'oklch(0.38 0.12 160)', fontFamily: 'var(--font-ui)', fontWeight: 600, marginBottom: 12 },
  miniResRow: { display: 'flex', alignItems: 'center', gap: 14, padding: '7px 0', borderBottom: '1px solid var(--surface-2)', cursor: 'pointer' },
  miniAvatar: { width: 28, height: 28, borderRadius: '50%', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, flexShrink: 0, fontFamily: 'var(--font-ui)' },
  miniName: { fontSize: 16, fontWeight: 600, color: 'var(--text)', fontFamily: 'var(--font-ui)' },
  miniRole: { fontSize: 16, color: 'var(--muted)', fontFamily: 'var(--font-ui)' },
};

Object.assign(window, { CommunityView });
