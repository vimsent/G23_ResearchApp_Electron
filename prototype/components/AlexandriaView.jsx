
const REPOS_META = [
  { id: 'arxiv',   name: 'arXiv',          color: 'oklch(0.5 0.12 20)',  disciplines: 'Physics · Math · CS · Economics',    count: '2.4M+', license: 'CC BY' },
  { id: 'biorxiv', name: 'bioRxiv',         color: 'oklch(0.5 0.12 160)', disciplines: 'Life Sciences · Biology',             count: '320K+', license: 'CC BY' },
  { id: 'zenodo',  name: 'Zenodo',          color: 'oklch(0.46 0.13 260)', disciplines: 'Multidisciplinary · Data · Software', count: '3.5M+', license: 'CC BY' },
  { id: 'scielo',  name: 'SciELO',          color: 'oklch(0.48 0.11 145)', disciplines: 'Latin America · Multidisciplinary',   count: '900K+', license: 'CC BY' },
  { id: 'pmc',     name: 'PubMed Central',  color: 'oklch(0.46 0.12 230)', disciplines: 'Biomedicine · Life Sciences',         count: '8M+',   license: 'CC BY' },
  { id: 'elsevier',name: 'Elsevier',        color: 'oklch(0.45 0.1 20)',   disciplines: 'All disciplines',                    count: '19M+',  license: 'restricted' },
  { id: 'nature',  name: 'Nature/Springer', color: 'oklch(0.44 0.1 280)',  disciplines: 'All disciplines',                    count: '4M+',   license: 'restricted' },
  { id: 'socarxiv',name: 'SocArXiv',        color: 'oklch(0.48 0.1 280)', disciplines: 'Social Sciences · Humanities',        count: '40K+',  license: 'CC BY' },
];

// TIER definitions
const TIER = {
  diamond: { label: 'Diamond OA',  color: 'oklch(0.38 0.13 160)', bg: 'oklch(0.93 0.07 160)', action: 'Download to Library', icon: '↓' },
  green:   { label: 'Green OA',    color: 'oklch(0.44 0.11 145)', bg: 'oklch(0.93 0.06 145)', action: 'Reference + Open',     icon: '⤴' },
  closed:  { label: 'Paywall',     color: 'oklch(0.5 0.08 20)',   bg: 'oklch(0.95 0.03 20)',  action: 'Add as Reference',     icon: '⊠' },
};

const FRONTIER_RESULTS = [
  { id: 'f1', tier: 'diamond', title: 'Economic sustainability of Diamond OA journals: institutional consortium models', authors: 'Chen, L., Park, S., Vargas, M.', year: 2025, repo: 'SocArXiv', license: 'CC BY', relevance: 97, akmMatch: ['H1 — Diamond OA reduces APC dependency'], inLibrary: false, abstract: 'We analyze 14 Diamond OA journals across disciplines, modeling cost structures and institutional funding mechanisms. Consortium pooling of ≥60% editorial costs shows full APC elimination is viable at scale.' },
  { id: 'f2', tier: 'diamond', title: 'Consortium funding for open access: evidence from Latin American universities', authors: 'Ramos, A., Silva, F., Torres, C.', year: 2025, repo: 'SciELO', license: 'CC BY', relevance: 94, akmMatch: ['H3 — LATAM consortia'], inLibrary: false, abstract: 'Analysis of APC costs and institutional budgets across 23 LATAM universities reveals viable pooling mechanisms that replicate Diamond OA without net budget increases.' },
  { id: 'f3', tier: 'green',   title: 'Preprint citation rates post-2020: permanent shift or COVID artifact?', authors: 'Brierley, L., Nanni, F.', year: 2024, repo: 'bioRxiv', license: 'CC BY', relevance: 88, akmMatch: ['Line 3 — Preprint citation dynamics'], inLibrary: false, abstract: 'Longitudinal analysis shows a 3.4× permanent increase in preprint citation rates across all disciplines since 2020.' },
  { id: 'f4', tier: 'closed',  title: 'The commercial transformation of academic publishing, 1990–2020', authors: 'Aspesi, C., Brand, A.', year: 2020, repo: 'Nature', license: 'restricted', relevance: 85, akmMatch: ['H1', 'H2'], inLibrary: false, abstract: 'Comprehensive analysis of publisher consolidation strategies and their structural effects on scholarly communication markets.' },
];

const SEARCH_RESULTS = [
  { id: 's1', tier: 'diamond', title: 'Decoupling prestige from publisher: citation network evidence', authors: 'Kim, S., Müller, H.', year: 2024, repo: 'arXiv', license: 'CC BY', relevance: 91, akmMatch: ['H2 — Identity decouples prestige'], inLibrary: false, abstract: 'Using graph centrality on 4.2M citation links, we demonstrate article-level metrics outperform journal impact factors in predicting long-term scholarly influence.' },
  { id: 's2', tier: 'diamond', title: 'Verified peer review records as academic currency', authors: 'Okafor, B., Singh, P.', year: 2024, repo: 'Zenodo', license: 'CC BY', relevance: 87, akmMatch: ['H2'], inLibrary: false, abstract: 'We propose a blockchain-anchored peer review registry that creates verifiable, citable records of review contributions, decoupled from publisher control.' },
  { id: 's3', tier: 'diamond', title: 'The oligopoly of academic publishers in the digital era', authors: 'Larivière, V., Haustein, S.', year: 2015, repo: 'PubMed Central', license: 'CC BY', relevance: 99, akmMatch: ['H1', 'H3'], inLibrary: true, abstract: 'Classic study demonstrating Big Five control of >50% of peer-reviewed literature. Already in your library.' },
  { id: 's4', tier: 'green',   title: 'Plan S and the transformation of scholarly publishing', authors: 'Brainard, J.', year: 2021, repo: 'PubMed Central', license: 'CC BY-NC', relevance: 82, akmMatch: ['H1'], inLibrary: false, abstract: 'Analysis of cOAlition S implementation across European research funders and its projected impact on publisher revenues.' },
  { id: 's5', tier: 'closed',  title: 'Market dynamics in academic journal publishing', authors: 'Ware, M., Mabe, M.', year: 2022, repo: 'Elsevier', license: 'restricted', relevance: 78, akmMatch: ['H1'], inLibrary: false, abstract: 'Publisher-funded analysis of journal economics. Note: funding source may bias conclusions on APC viability.' },
];

const CANONICAL_MISSING = [
  { title: 'Budapest Open Access Initiative Declaration (2002)', authors: 'Soros Foundation', year: 2002, reason: 'Foundational OA text — referenced by 3 sources in your library' },
  { title: 'Sci-Hub: a solution to the subscription problem?', authors: 'Himmelstein, D. et al.', year: 2018, reason: 'Canonical on access patterns — missing given your H1 focus' },
];

function TierBadge({ tier }) {
  const t = TIER[tier];
  return (
    <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20, background: t.bg, color: t.color, fontFamily: 'var(--font-ui)', letterSpacing: '0.02em', whiteSpace: 'nowrap' }}>
      {tier === 'diamond' ? '◆' : tier === 'green' ? '◉' : '⊠'} {t.label}
    </span>
  );
}

function ResultCard({ result, onAdd, added }) {
  const [expanded, setExpanded] = React.useState(false);
  const tier = TIER[result.tier];
  const isAdded = added.has(result.id);

  return (
    <div style={{ ...ax.resultCard, ...(result.inLibrary ? ax.resultCardInLib : {}), opacity: result.inLibrary ? 0.7 : 1 }}>
      <div style={ax.resultTop}>
        <TierBadge tier={result.tier} />
        <span style={ax.resultRepo}>{result.repo}</span>
        <span style={ax.resultYear}>{result.year}</span>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
          {result.akmMatch?.length > 0 && (
            <div style={ax.akmMatchPill} title={result.akmMatch.join(', ')}>
              <svg width={9} height={9} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 8m-2 0a2 2 0 104 0 2 2 0 10-4 0"/><path d="M3 4a1 1 0 102 0M11 4a1 1 0 102 0M8 6V4"/></svg>
              AKM match
            </div>
          )}
          <div style={ax.relevanceWrap}>
            <div style={{ ...ax.relevanceFill, width: result.relevance + '%' }} />
          </div>
          <span style={ax.relevanceNum}>{result.relevance}%</span>
        </div>
      </div>

      <div style={ax.resultTitle} onClick={() => setExpanded(!expanded)}>{result.title}</div>
      <div style={ax.resultAuthors}>{result.authors}</div>

      {expanded && <div style={ax.resultAbstract}>{result.abstract}</div>}

      <div style={ax.resultActions}>
        <button style={ax.expandBtn} onClick={() => setExpanded(!expanded)}>
          {expanded ? 'Hide abstract' : 'Show abstract'}
        </button>
        {result.inLibrary ? (
          <span style={ax.inLibraryBadge}>✓ In your library</span>
        ) : (
          <button
            style={{ ...ax.ingestBtn, ...(isAdded ? ax.ingestBtnDone : {}), background: isAdded ? 'oklch(0.93 0.07 160)' : tier.bg, color: isAdded ? 'oklch(0.35 0.12 160)' : tier.color, borderColor: isAdded ? 'oklch(0.82 0.08 160)' : tier.color }}
            onClick={() => !isAdded && onAdd(result)}
            disabled={isAdded}
          >
            {isAdded ? '✓ Added' : <>{tier.icon} {tier.action}</>}
          </button>
        )}
      </div>
    </div>
  );
}

function AlexandriaView() {
  const [query, setQuery] = React.useState('');
  const [searched, setSearched] = React.useState(false);
  const [searching, setSearching] = React.useState(false);
  const [added, setAdded] = React.useState(new Set());
  const [activeTab, setActiveTab] = React.useState('frontier');
  const [showContext, setShowContext] = React.useState(true);

  const doSearch = async () => {
    if (!query.trim()) return;
    setSearching(true);
    await new Promise(r => setTimeout(r, 700));
    setSearching(false);
    setSearched(true);
    setActiveTab('results');
  };

  const addResult = (result) => {
    setAdded(a => new Set([...a, result.id]));
  };

  const indexStats = { total: '47.2M', diamond: '12.4M', green: '11.1M', closed: '23.7M', lastCrawl: '2 hours ago' };

  return (
    <div style={ax.root}>
      {/* Header */}
      <div style={ax.header}>
        <div>
          <div style={ax.breadcrumb}>Discovery</div>
          <h1 style={ax.title}>Alexandria</h1>
          <div style={ax.subtitle}>Universal index of academic knowledge — open and closed, mapped and differentiated</div>
        </div>
        {/* OpenClaw status */}
        <div style={ax.openclawStatus}>
          <div style={ax.openclawDot} />
          <div>
            <div style={ax.openclawLabel}>OpenClaw running</div>
            <div style={ax.openclawSub}>Last crawl: {indexStats.lastCrawl} · {indexStats.total} papers indexed</div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div style={ax.searchSection}>
        <div style={ax.searchRow}>
          <div style={ax.searchBox}>
            <svg width={16} height={16} viewBox="0 0 16 16" fill="none" stroke="var(--muted)" strokeWidth="1.5" strokeLinecap="round" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }}>
              <circle cx="7" cy="7" r="5" /><path d="M11 11l3 3" />
            </svg>
            <input style={ax.searchInput}
              placeholder="Search across 47M papers — open and closed, mapped by semantic relevance to your work…"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && doSearch()} />
            <button style={ax.searchBtn} onClick={doSearch} disabled={searching}>
              {searching ? '…' : 'Search'}
            </button>
          </div>
          <button style={{ ...ax.ctxToggle, ...(showContext ? ax.ctxToggleActive : {}) }} onClick={() => setShowContext(!showContext)}>
            <svg width={12} height={12} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M8 8m-2 0a2 2 0 104 0 2 2 0 10-4 0M3 4a1 1 0 102 0M11 4a1 1 0 102 0M8 6V4"/></svg>
            {showContext ? 'Hide context' : 'Your context'}
          </button>
        </div>

        {/* Tier legend */}
        <div style={ax.tierLegend}>
          <span style={ax.legendLabel}>Access:</span>
          {Object.entries(TIER).map(([k, t]) => (
            <span key={k} style={{ ...ax.legendItem, background: t.bg, color: t.color }}>
              {k === 'diamond' ? '◆' : k === 'green' ? '◉' : '⊠'} {t.label}
            </span>
          ))}
          <span style={ax.indexNote}>Alexandria is an index, not a repository — papers live at their original sources</span>
        </div>
      </div>

      <div style={ax.body}>
        {/* Main content */}
        <div style={ax.main}>
          {/* Tabs */}
          <div style={ax.tabBar}>
            <button style={{ ...ax.tab, ...(activeTab === 'frontier' ? ax.tabActive : {}) }} onClick={() => setActiveTab('frontier')}>
              ◈ Knowledge Frontier
              <span style={ax.tabBadge}>{FRONTIER_RESULTS.length}</span>
            </button>
            {searched && (
              <button style={{ ...ax.tab, ...(activeTab === 'results' ? ax.tabActive : {}) }} onClick={() => setActiveTab('results')}>
                Search results
                <span style={ax.tabBadge}>{SEARCH_RESULTS.length}</span>
              </button>
            )}
            <button style={{ ...ax.tab, ...(activeTab === 'missing' ? ax.tabActive : {}) }} onClick={() => setActiveTab('missing')}>
              ⚠ Not in your library
              <span style={{ ...ax.tabBadge, background: 'oklch(0.93 0.06 60)', color: 'oklch(0.42 0.1 60)' }}>{CANONICAL_MISSING.length}</span>
            </button>
          </div>

          {/* Frontier */}
          {activeTab === 'frontier' && (
            <div style={ax.resultsList}>
              <div style={ax.sectionNote}>
                <svg width={13} height={13} viewBox="0 0 16 16" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round"><path d="M8 2v2M8 12v2M2 8h2M12 8h2M4.22 4.22l1.41 1.41M10.36 10.36l1.41 1.41M4.22 11.78l1.41-1.41M10.36 5.64l1.41-1.41"/></svg>
                Recent papers semantically closest to your active hypotheses and paper — ordered by relevance to your work
              </div>
              {FRONTIER_RESULTS.map(r => <ResultCard key={r.id} result={r} onAdd={addResult} added={added} />)}
            </div>
          )}

          {/* Search results */}
          {activeTab === 'results' && searched && (
            <div style={ax.resultsList}>
              <div style={ax.sectionNote}>
                <svg width={13} height={13} viewBox="0 0 16 16" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round"><circle cx="7" cy="7" r="5"/><path d="M11 11l3 3"/></svg>
                {SEARCH_RESULTS.length} results for "{query}" — ranked by relevance to your AKM context
              </div>
              {SEARCH_RESULTS.map(r => <ResultCard key={r.id} result={r} onAdd={addResult} added={added} />)}
            </div>
          )}

          {/* Missing canonicals */}
          {activeTab === 'missing' && (
            <div style={ax.resultsList}>
              <div style={ax.sectionNote} style={{ ...ax.sectionNote, background: 'oklch(0.97 0.04 60)', borderColor: 'oklch(0.88 0.08 60)', color: 'oklch(0.38 0.1 60)' }}>
                <svg width={13} height={13} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="8" cy="8" r="6"/><path d="M8 7v4M8 5v.5"/></svg>
                Fundamental papers in your research area not yet in your library — detected from citation patterns across your sources
              </div>
              {CANONICAL_MISSING.map((p, i) => (
                <div key={i} style={ax.missingCard}>
                  <div style={ax.missingTop}>
                    <span style={ax.missingYear}>{p.year}</span>
                    <span style={ax.missingReason}>{p.reason}</span>
                  </div>
                  <div style={ax.missingTitle}>{p.title}</div>
                  <div style={ax.missingAuthors}>{p.authors}</div>
                  <button style={ax.missingBtn}>Search in Alexandria →</button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: context panel */}
        {showContext && (
          <div style={ax.ctxPanel}>
            <div style={ax.ctxPanelTitle}>
              <svg width={13} height={13} viewBox="0 0 16 16" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round"><path d="M8 8m-2 0a2 2 0 104 0 2 2 0 10-4 0M3 4a1 1 0 102 0M11 4a1 1 0 102 0M8 6V4"/></svg>
              Your research context
            </div>
            <div style={ax.ctxNote}>Results are oriented by your AKM and active paper — not generic keyword ranking</div>

            <div style={ax.ctxSection}>
              <div style={ax.ctxLabel}>Active hypotheses</div>
              {['H1 — Diamond OA reduces APC dependency', 'H2 — Identity decouples prestige', 'H3 — LATAM consortia (in review)'].map((h, i) => (
                <div key={i} style={ax.ctxHyp}>
                  <div style={{ ...ax.ctxHypDot, background: i === 2 ? 'oklch(0.65 0.1 60)' : 'oklch(0.52 0.14 170)' }} />
                  <span>{h}</span>
                </div>
              ))}
            </div>

            <div style={ax.ctxSection}>
              <div style={ax.ctxLabel}>Active paper</div>
              <div style={ax.ctxPaper}>
                <svg width={12} height={12} viewBox="0 0 16 16" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round"><path d="M3 2h7l4 4v9a1 1 0 01-1 1H3a1 1 0 01-1-1V3a1 1 0 011-1zm7 0v4h4"/></svg>
                Diamond OA Framework
              </div>
              <div style={ax.ctxPaperSection}>Writing §2 Background</div>
            </div>

            <div style={ax.ctxSection}>
              <div style={ax.ctxLabel}>Index breakdown</div>
              {[
                { label: 'Diamond OA', val: indexStats.diamond, color: TIER.diamond.color, bg: TIER.diamond.bg },
                { label: 'Green OA', val: indexStats.green, color: TIER.green.color, bg: TIER.green.bg },
                { label: 'Closed', val: indexStats.closed, color: TIER.closed.color, bg: TIER.closed.bg },
              ].map(s => (
                <div key={s.label} style={ax.ctxStatRow}>
                  <span style={{ ...ax.ctxStatBadge, background: s.bg, color: s.color }}>{s.label}</span>
                  <span style={ax.ctxStatVal}>{s.val}</span>
                </div>
              ))}
            </div>

            <div style={ax.ctxSection}>
              <div style={ax.ctxLabel}>Library coverage</div>
              <div style={ax.ctxCoverage}>
                <div style={ax.ctxCoverageBar}>
                  <div style={{ ...ax.ctxCoverageOpen, width: '42%' }} />
                </div>
                <div style={ax.ctxCoverageLabel}>4 of ~10 relevant papers in library</div>
              </div>
            </div>

            <div style={ax.ctxFootnote}>
              Alexandria indexes metadata and embeddings only. Papers live at their original sources — Lumen never stores content it doesn't own.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const ax = {
  root: { display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg)', overflow: 'hidden' },
  header: { padding: '28px 32px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  breadcrumb: { fontSize: 12, color: 'var(--muted)', marginBottom: 3, fontFamily: 'var(--font-ui)' },
  title: { fontSize: 26, fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--font-display)', margin: 0, letterSpacing: '-0.02em' },
  subtitle: { fontSize: 13, color: 'var(--muted)', fontFamily: 'var(--font-ui)', marginTop: 4, maxWidth: 540 },
  openclawStatus: { display: 'flex', alignItems: 'center', gap: 10, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '12px 16px', flexShrink: 0 },
  openclawDot: { width: 8, height: 8, borderRadius: '50%', background: 'oklch(0.52 0.14 170)', flexShrink: 0, boxShadow: '0 0 0 3px oklch(0.88 0.07 170)' },
  openclawLabel: { fontSize: 12, fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--font-ui)' },
  openclawSub: { fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-ui)', marginTop: 1 },
  searchSection: { padding: '16px 32px 0' },
  searchRow: { display: 'flex', gap: 10, marginBottom: 10 },
  searchBox: { position: 'relative', flex: 1, display: 'flex', alignItems: 'center' },
  searchInput: { flex: 1, border: '1.5px solid oklch(0.88 0.02 260)', borderRadius: '8px 0 0 8px', padding: '11px 14px 11px 42px', fontSize: 14, color: 'var(--text)', outline: 'none', fontFamily: 'var(--font-ui)', background: 'var(--surface)' },
  searchBtn: { background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '0 8px 8px 0', padding: '11px 20px', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-ui)', flexShrink: 0 },
  ctxToggle: { display: 'flex', alignItems: 'center', gap: 6, background: 'var(--surface)', border: '1px solid oklch(0.88 0.02 260)', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: 'var(--accent)', cursor: 'pointer', fontFamily: 'var(--font-ui)', fontWeight: 600, flexShrink: 0, transition: 'all 0.12s' },
  ctxToggleActive: { background: 'var(--accent-light)' },
  tierLegend: { display: 'flex', alignItems: 'center', gap: 8, paddingBottom: 14, borderBottom: '1px solid var(--border)', flexWrap: 'wrap' },
  legendLabel: { fontSize: 12, color: 'var(--muted)', fontFamily: 'var(--font-ui)', fontWeight: 600 },
  legendItem: { fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20, fontFamily: 'var(--font-ui)' },
  indexNote: { marginLeft: 'auto', fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-ui)', fontStyle: 'italic' },
  body: { display: 'flex', flex: 1, overflow: 'hidden', padding: '0 32px 24px', gap: 16, marginTop: 0 },
  main: { flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', paddingTop: 16 },
  tabBar: { display: 'flex', gap: 4, marginBottom: 14, flexShrink: 0 },
  tab: { display: 'flex', alignItems: 'center', gap: 7, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 14px', fontSize: 13, color: 'var(--muted)', cursor: 'pointer', fontFamily: 'var(--font-ui)', transition: 'all 0.15s' },
  tabActive: { background: 'var(--accent-light)', borderColor: 'oklch(0.8 0.06 260)', color: 'oklch(0.38 0.12 260)', fontWeight: 600 },
  tabBadge: { fontSize: 11, fontWeight: 700, background: 'oklch(0.93 0.02 260)', color: 'oklch(0.42 0.12 260)', padding: '1px 7px', borderRadius: 10, fontFamily: 'var(--font-ui)' },
  resultsList: { flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column', gap: 10 },
  sectionNote: { display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'oklch(0.38 0.1 260)', background: 'oklch(0.97 0.015 260)', border: '1px solid oklch(0.9 0.04 260)', borderRadius: 8, padding: '10px 14px', fontFamily: 'var(--font-ui)', lineHeight: 1.5, flexShrink: 0 },
  resultCard: { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '15px 18px' },
  resultCardInLib: { borderStyle: 'dashed', background: 'var(--bg)' },
  resultTop: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 9, flexWrap: 'wrap' },
  resultRepo: { fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-ui)', background: 'var(--surface-2)', padding: '2px 7px', borderRadius: 4 },
  resultYear: { fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-ui)' },
  akmMatchPill: { display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, fontWeight: 700, color: 'var(--accent)', background: 'oklch(0.95 0.03 260)', padding: '2px 8px', borderRadius: 20, fontFamily: 'var(--font-ui)' },
  relevanceWrap: { width: 44, height: 3, background: 'var(--border)', borderRadius: 2, overflow: 'hidden' },
  relevanceFill: { height: '100%', background: 'var(--accent)', borderRadius: 2 },
  relevanceNum: { fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--accent)', fontWeight: 700, minWidth: 30 },
  resultTitle: { fontSize: 14.5, fontWeight: 600, color: 'var(--text)', lineHeight: 1.4, marginBottom: 5, cursor: 'pointer', fontFamily: 'var(--font-ui)' },
  resultAuthors: { fontSize: 12, color: 'var(--muted)', fontFamily: 'var(--font-ui)', marginBottom: 10 },
  resultAbstract: { fontSize: 13, color: 'var(--text-soft)', lineHeight: 1.7, fontFamily: 'var(--font-ui)', background: 'var(--bg)', borderRadius: 7, padding: '11px 14px', marginBottom: 10 },
  resultActions: { display: 'flex', alignItems: 'center', gap: 10 },
  expandBtn: { fontSize: 12, color: 'oklch(0.55 0.05 260)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-ui)', padding: 0 },
  ingestBtn: { marginLeft: 'auto', fontSize: 12, fontWeight: 700, padding: '6px 14px', borderRadius: 7, border: '1.5px solid', cursor: 'pointer', fontFamily: 'var(--font-ui)', transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: 5 },
  ingestBtnDone: {},
  inLibraryBadge: { marginLeft: 'auto', fontSize: 12, color: 'oklch(0.38 0.12 160)', background: 'oklch(0.93 0.07 160)', padding: '5px 12px', borderRadius: 7, fontWeight: 700, fontFamily: 'var(--font-ui)' },
  missingCard: { background: 'var(--surface)', border: '1px solid oklch(0.88 0.07 60)', borderLeft: '3px solid oklch(0.65 0.12 60)', borderRadius: 10, padding: '14px 18px' },
  missingTop: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 7 },
  missingYear: { fontSize: 12, color: 'var(--muted)', fontFamily: 'var(--font-ui)' },
  missingReason: { fontSize: 12, color: 'oklch(0.44 0.1 60)', fontFamily: 'var(--font-ui)', fontStyle: 'italic' },
  missingTitle: { fontSize: 14.5, fontWeight: 600, color: 'var(--text)', fontFamily: 'var(--font-ui)', marginBottom: 5, lineHeight: 1.4 },
  missingAuthors: { fontSize: 12, color: 'var(--muted)', fontFamily: 'var(--font-ui)', marginBottom: 10 },
  missingBtn: { fontSize: 12, fontWeight: 600, color: 'oklch(0.44 0.1 60)', background: 'none', border: '1px solid oklch(0.85 0.07 60)', borderRadius: 6, padding: '5px 12px', cursor: 'pointer', fontFamily: 'var(--font-ui)' },
  // Context panel
  ctxPanel: { width: 256, background: 'var(--surface)', borderRadius: 12, border: '1px solid var(--border)', padding: '18px 18px', overflow: 'auto', flexShrink: 0, alignSelf: 'flex-start', marginTop: 16 },
  ctxPanelTitle: { fontSize: 13, fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--font-ui)', display: 'flex', alignItems: 'center', gap: 7, marginBottom: 8 },
  ctxNote: { fontSize: 12, color: 'oklch(0.5 0.02 260)', fontFamily: 'var(--font-ui)', lineHeight: 1.5, background: 'oklch(0.97 0.015 260)', borderRadius: 7, padding: '9px 12px', marginBottom: 16 },
  ctxSection: { marginBottom: 18 },
  ctxLabel: { fontSize: 11, fontWeight: 700, color: 'var(--muted)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8, fontFamily: 'var(--font-ui)' },
  ctxHyp: { display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 12, color: 'var(--text-soft)', fontFamily: 'var(--font-ui)', lineHeight: 1.5, marginBottom: 5 },
  ctxHypDot: { width: 7, height: 7, borderRadius: '50%', flexShrink: 0, marginTop: 5 },
  ctxPaper: { display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, fontWeight: 600, color: 'oklch(0.3 0.08 260)', fontFamily: 'var(--font-ui)', marginBottom: 4 },
  ctxPaperSection: { fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-ui)', paddingLeft: 20 },
  ctxStatRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 7 },
  ctxStatBadge: { fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 20, fontFamily: 'var(--font-ui)' },
  ctxStatVal: { fontSize: 13, fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--font-display)' },
  ctxCoverage: { display: 'flex', flexDirection: 'column', gap: 6 },
  ctxCoverageBar: { height: 5, background: 'var(--border)', borderRadius: 3, overflow: 'hidden' },
  ctxCoverageOpen: { height: '100%', background: 'var(--accent)', borderRadius: 3 },
  ctxCoverageLabel: { fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-ui)' },
  ctxFootnote: { fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-ui)', lineHeight: 1.6, marginTop: 8, fontStyle: 'italic', borderTop: '1px solid var(--border)', paddingTop: 12 },
};

Object.assign(window, { AlexandriaView });
