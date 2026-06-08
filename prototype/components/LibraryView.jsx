// LibraryView — renovated layout with Library/Files toggle.
// Library view: left categories sidebar + content tabs + source list.
// Files view: see components/FilesView.jsx.
// Browse & Capture is preserved as a slide-out panel from the source list.

const SOURCES = [
  { id: 1, type: 'pdf', title: 'The oligopoly of academic publishers in the digital era', authors: 'Larivière, V., Haustein, S., Mongeon, P.', year: 2015, journal: 'PLOS ONE', tags: ['oligopoly', 'publishing', 'open-access'], license: 'CC BY', status: 'read', relevance: 'high', paper: 'paper-1' },
  { id: 2, type: 'pdf', title: 'Quantifying the advantage of looking forward', authors: 'Sinatra, R. et al.', year: 2016, journal: 'Science', tags: ['impact', 'citations', 'h-index'], license: 'restricted', status: 'reading', relevance: 'medium', paper: 'paper-1' },
  { id: 3, type: 'url', title: 'The Scholarly Kitchen: Who really pays for Diamond Open Access?', authors: 'Anderson, R.', year: 2025, journal: 'scholarlykitchen.sspnet.org', tags: ['blog', 'diamond-oa', 'commentary'], license: 'OA', status: 'read', relevance: 'high', paper: null },
  { id: 4, type: 'note', title: 'Notes on Diamond OA models — peer review economics', authors: 'M. Vargas', year: 2026, journal: 'Personal note', tags: ['diamond-oa', 'peer-review'], license: 'own', status: 'read', relevance: 'high', paper: 'paper-2' },
  { id: 5, type: 'pdf', title: 'Plan S: Making full and immediate Open Access a reality', authors: 'cOAlition S', year: 2021, journal: 'cOAlition S', tags: ['open-access', 'policy', 'mandate'], license: 'CC BY', status: 'unread', relevance: 'medium', paper: null },
  { id: 6, type: 'pdf', title: 'Measuring the evolution of a scientific field from its literature', authors: 'Radicchi, F., Fortunato, S.', year: 2012, journal: 'J. Informetrics', tags: ['bibliometrics', 'citations', 'network'], license: 'restricted', status: 'unread', relevance: 'low', paper: 'paper-2' },
  { id: 7, type: 'code', title: 'citation_graph_analysis.py — network analysis script', authors: 'M. Vargas', year: 2026, journal: 'Local file', tags: ['python', 'network', 'analysis'], license: 'own', status: 'read', relevance: 'high', paper: 'paper-1' },
  { id: 8, type: 'url', title: 'UNESCO Recommendation on Open Science — institutional report', authors: 'UNESCO', year: 2021, journal: 'unesco.org', tags: ['policy', 'open-science', 'report'], license: 'OA', status: 'unread', relevance: 'medium', paper: null },
  { id: 9, type: 'pdf', title: 'Sci-Hub and the new wave of academic piracy', authors: 'Bohannon, J.', year: 2016, journal: 'Science', tags: ['sci-hub', 'access', 'legal'], license: 'restricted', status: 'read', relevance: 'high', paper: 'paper-2' },
  { id: 10, type: 'note', title: 'LUMEN platform — architecture notes & open questions', authors: 'M. Vargas', year: 2026, journal: 'Personal note', tags: ['lumen', 'architecture', 'pkm'], license: 'own', status: 'read', relevance: 'high', paper: null },
  { id: 11, type: 'url', title: 'Universities push back on rising journal subscription costs', authors: 'The Guardian — Science', year: 2024, journal: 'theguardian.com', tags: ['news', 'subscriptions', 'open-access'], license: 'OA', status: 'read', relevance: 'medium', paper: null },
];

const BROWSER_PAGES = {
  'arxiv.org': {
    url: 'https://arxiv.org/search/?searchtype=all&query=diamond+open+access',
    site: 'arXiv.org',
    query: 'diamond open access',
    results: '1–4 of 312 results',
    content: [
      { title: 'Economic sustainability of Diamond OA journals: a consortium model', authors: 'L. Chen, M. Okoro, R. Patel', year: '2025', id: 'arXiv:2503.04821', license: 'CC BY', abstract: 'We model the operating costs of 40 Diamond OA journals and show that institutional consortia pooling ≥60% of editorial costs achieve long-term sustainability without article processing charges.' },
      { title: 'Decoupling prestige from publisher: citation network evidence', authors: 'S. Kim, H. Müller', year: '2024', id: 'arXiv:2412.09341', license: 'CC BY', abstract: 'Using a 12-year citation graph of 1.2M papers, we find that perceived journal prestige can be reconstructed from author and institutional signals independent of the commercial publisher.' },
      { title: 'Consortium funding for open access: evidence from Latin America', authors: 'A. Ramos, C. Núñez, F. Lima', year: '2025', id: 'arXiv:2501.11203', license: 'CC BY', abstract: 'SciELO and Redalyc demonstrate that regional consortia can fund fully open journals at a fraction of APC-equivalent cost. We quantify the per-article subsidy across 14 countries.' },
      { title: 'APC inequity and Global South researcher exclusion', authors: 'F. Silva, C. Torres', year: '2024', id: 'arXiv:2408.07612', license: 'CC BY', abstract: 'Article processing charges create a systematic barrier for under-funded researchers. We estimate that 38% of eligible authors decline to submit to Gold OA venues for cost reasons.' },
    ]
  },
  'scholar.google.com': {
    url: 'https://scholar.google.com/scholar?q=diamond+open+access+peer+review',
    site: 'Google Scholar',
    query: 'diamond open access peer review',
    results: 'About 4,210 results (0.06 sec)',
    content: [
      { title: 'Diamond open access: principles and practice', authors: 'J. Bosman, B. Kramer — Quantitative Science Studies', year: '2021', id: null, license: 'unknown', abstract: 'A foundational overview of the Diamond OA model: journals that charge neither readers nor authors, typically funded by institutions, libraries, or scholarly societies.' },
      { title: 'The future of scholarly communication and peer review', authors: 'J. Tennant et al. — F1000Research', year: '2019', id: null, license: 'CC BY', abstract: 'We survey emerging models of open peer review and argue that reviewer labour should be recognised as a visible scholarly contribution rather than invisible unpaid work.' },
      { title: 'Plan S and the transformation of academic publishing', authors: 'J. Brainard — Science', year: '2021', id: null, license: 'restricted', abstract: 'An analysis of cOAlition S mandates and their downstream effects on publisher business models, transformative agreements, and author compliance across Europe.' },
    ]
  },
  'pubmed.ncbi.nlm.nih.gov': {
    url: 'https://pubmed.ncbi.nlm.nih.gov/?term=open+access+publishing+equity',
    site: 'PubMed.gov',
    query: 'open access publishing equity',
    results: '1–2 of 1,847 results',
    content: [
      { title: 'Open access publishing in biomedicine: equity and access', authors: 'L. Haak, M. Fenner, R. Cousijn', year: '2023', id: 'PMC10234567', license: 'CC BY', abstract: 'A cross-sectional study of 9,400 biomedical articles assessing the relationship between funding source, APC waivers, and geographic distribution of corresponding authors.' },
      { title: 'Article processing charges and research inequity', authors: 'B. Okafor', year: '2024', id: 'PMC11098234', license: 'CC BY', abstract: 'This commentary documents how rising APCs reproduce existing inequities in global health research and proposes consortium-funded alternatives for low-income settings.' },
    ]
  },
  'zenodo.org': {
    url: 'https://zenodo.org/search?q=diamond+open+access+dataset',
    site: 'Zenodo',
    query: 'diamond open access dataset',
    results: '1–2 of 86 records',
    content: [
      { title: 'Dataset: editorial operating costs of 40 Diamond OA journals (2018–2024)', authors: 'L. Chen, OpenCost Initiative', year: '2025', id: 'DOI:10.5281/zenodo.10947', license: 'CC BY', abstract: 'Anonymised per-journal cost breakdowns covering copy-editing, typesetting, platform hosting, and editorial honoraria. CSV + codebook included.' },
      { title: 'Replication package: citation-network prestige decoupling', authors: 'S. Kim, H. Müller', year: '2024', id: 'DOI:10.5281/zenodo.10231', license: 'CC BY', abstract: 'Python notebooks and the 1.2M-paper citation graph used to reproduce the prestige reconstruction analysis.' },
    ]
  },
  'scielo.org': {
    url: 'https://search.scielo.org/?q=acceso+abierto+diamante',
    site: 'SciELO',
    query: 'acceso abierto diamante',
    results: '1–2 de 540 resultados',
    content: [
      { title: 'El modelo SciELO como infraestructura de acceso abierto diamante', authors: 'A. Packer, R. Meneghini', year: '2023', id: 'S0100-19652023', license: 'CC BY', abstract: 'Describe cómo la red SciELO sostiene más de 1,500 revistas regionales sin cobrar a autores ni lectores, financiada por agencias públicas de ciencia.' },
      { title: 'Sostenibilidad de revistas diamante en América Latina', authors: 'C. Núñez, F. Lima', year: '2024', id: 'S0102-44732024', license: 'CC BY', abstract: 'Análisis de los costos y fuentes de financiamiento de revistas de acceso abierto diamante en la región, con evidencia de 14 países.' },
    ]
  },
};

// Per-domain tab/favicon metadata for the embedded browser.
const DOMAIN_META = {
  'arxiv.org':                 { title: 'arXiv', letter: 'X', color: 'oklch(0.55 0.18 25)' },
  'scholar.google.com':        { title: 'Scholar', letter: 'S', color: 'oklch(0.5 0.16 255)' },
  'pubmed.ncbi.nlm.nih.gov':   { title: 'PubMed', letter: 'P', color: 'oklch(0.48 0.13 215)' },
  'zenodo.org':                { title: 'Zenodo', letter: 'Z', color: 'oklch(0.5 0.13 150)' },
  'scielo.org':                { title: 'SciELO', letter: 'S', color: 'oklch(0.58 0.16 50)' },
};
const BOOKMARKS = ['arxiv.org', 'scholar.google.com', 'pubmed.ncbi.nlm.nih.gov', 'zenodo.org', 'scielo.org'];
const metaFor = (d) => DOMAIN_META[d] || { title: d, letter: (d[0] || '?').toUpperCase(), color: 'oklch(0.55 0.02 80)' };

const TYPE_ICON = {
  pdf: 'M3 2h7l4 4v9a1 1 0 01-1 1H3a1 1 0 01-1-1V3a1 1 0 011-1zm7 0v4h4',
  url: 'M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71',
  note: 'M11 4H4a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-7M14.5 2.5a2.121 2.121 0 013 3L9 14l-4 1 1-4 7.5-7.5z',
  code: 'M8 3l-5 5 5 5M16 3l5 5-5 5',
  dataset: 'M3 3h10v2H3zM3 7h10v2H3zM3 11h10v2H3z',
};

const LICENSE_COLOR = {
  'CC BY':       { bg: 'oklch(0.93 0.07 160)', text: 'oklch(0.35 0.12 160)' },
  'OA':          { bg: 'oklch(0.93 0.06 260)', text: 'oklch(0.38 0.13 260)' },
  'restricted':  { bg: 'oklch(0.94 0.03 30)',  text: 'oklch(0.45 0.1 30)'  },
  'own':         { bg: 'oklch(0.94 0.03 80)',  text: 'oklch(0.45 0.08 80)' },
  'unknown':     { bg: 'oklch(0.93 0.01 80)',  text: 'oklch(0.55 0.01 80)' },
};

function SourceIcon({ type, size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d={TYPE_ICON[type] || TYPE_ICON.pdf} />
    </svg>
  );
}

// Category icon used in the sidebar (DM Sans/lucide-flavored, project palette)
function CatIcon({ id }) {
  const c = { width: 13, height: 13, viewBox: '0 0 16 16', fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' };
  switch (id) {
    case 'all':       return <svg {...c}><rect x="2" y="2" width="5" height="5" rx="1"/><rect x="9" y="2" width="5" height="5" rx="1"/><rect x="2" y="9" width="5" height="5" rx="1"/><rect x="9" y="9" width="5" height="5" rx="1"/></svg>;
    case 'pdf':       return <svg {...c}><path d="M3 3h7l3 3v7a1 1 0 01-1 1H3a1 1 0 01-1-1V3a1 1 0 011-1z"/><path d="M10 3v3h3M5 9h6M5 11h4"/></svg>;
    case 'url':       return <svg {...c}><circle cx="8" cy="8" r="6"/><path d="M2 8h12M8 2c2 2 2 10 0 12M8 2c-2 2-2 10 0 12"/></svg>;
    case 'note':      return <svg {...c}><path d="M3 2h8l3 3v9a1 1 0 01-1 1H3a1 1 0 01-1-1V3a1 1 0 011-1z"/><path d="M5 7h6M5 10h6M5 13h3"/></svg>;
    case 'code':      return <svg {...c}><path d="M6 4l-4 4 4 4M10 4l4 4-4 4"/></svg>;
    case 'dataset':   return <svg {...c}><ellipse cx="8" cy="4" rx="5" ry="2"/><path d="M3 4v8c0 1.1 2.24 2 5 2s5-.9 5-2V4"/><path d="M3 8c0 1.1 2.24 2 5 2s5-.9 5-2"/></svg>;
    case 'oa':        return <svg {...c}><rect x="3" y="7" width="10" height="7" rx="1"/><path d="M5 7V5a3 3 0 016 0"/></svg>;
    case 'licensed':  return <svg {...c}><rect x="3" y="7" width="10" height="7" rx="1"/><path d="M5 7V5a3 3 0 016 0v2"/></svg>;
    case 'private':   return <svg {...c}><rect x="3" y="7" width="10" height="7" rx="1"/><path d="M5 7V5a3 3 0 016 0v2"/><circle cx="8" cy="10.5" r="0.5" fill="currentColor"/></svg>;
    default:          return <svg {...c}><rect x="2" y="2" width="12" height="12" rx="2"/></svg>;
  }
}

function LibraryView({ onOpenPaper }) {
  // ---- view + search + filter state ----
  const [viewMode, setViewMode]   = React.useState('library');  // 'library' | 'files'
  const [sideOpen, setSideOpen]   = React.useState(true);       // My Library panel collapse
  const [search, setSearch]       = React.useState('');
  const [sideQuery, setSideQuery] = React.useState('');
  const [filter, setFilter]       = React.useState('all');
  const [showBrowser, setShowBrowser] = React.useState(false);
  const [browserTabs, setBrowserTabs] = React.useState([
    { id: 't1', domain: 'arxiv.org' },
    { id: 't2', domain: 'scholar.google.com' },
    { id: 't3', domain: 'pubmed.ncbi.nlm.nih.gov' },
  ]);
  const [activeBrowserTab, setActiveBrowserTab] = React.useState('t1');
  const [browserUrl, setBrowserUrl] = React.useState('arxiv.org');
  const [browserInput, setBrowserInput] = React.useState('https://arxiv.org/search/?searchtype=all&query=diamond+open+access');
  const [urlEditing, setUrlEditing] = React.useState(false);
  const [showSettings, setShowSettings] = React.useState(false);
  const [tabPosition, setTabPosition] = React.useState('top'); // 'top' | 'left'
  const [credentials, setCredentials] = React.useState([
    { id: 'c1', site: 'scholar.google.com', detail: 'cuenta@gmail.com', kind: 'account' },
    { id: 'c2', site: 'sci-hub.se', detail: 'acceso configurado', kind: 'config' },
    { id: 'c3', site: 'jstor.org', detail: 'institucional · USM', kind: 'institutional' },
  ]);
  const [captured, setCaptured] = React.useState(new Set());
  const [sources, setSources] = React.useState(SOURCES);
  const [captureFlash, setCaptureFlash] = React.useState(null);

  // ---- tab state for the new library content area ----
  const [openTabs, setOpenTabs] = React.useState([{ id: 'all-sources', label: 'All sources', kind: 'all' }]);
  const [activeTab, setActiveTab] = React.useState('all-sources');

  // ---- counts for sidebar badges ----
  const counts = React.useMemo(() => {
    const by = (t) => sources.filter(s => s.type === t).length;
    return {
      all: sources.length,
      pdf: by('pdf'),
      url: by('url'),
      note: by('note'),
      code: by('code'),
      dataset: by('dataset') + sources.filter(s => s.tags.some(x => x === 'data')).length,
      oa: sources.filter(s => s.license === 'CC BY' || s.license === 'OA').length,
      licensed: sources.filter(s => s.license === 'restricted').length,
    };
  }, [sources]);

  // ---- filtering ----
  const filtered = filter === 'private' ? [] : sources.filter(s => {
    let matchType = true;
    if (filter === 'pdf')      matchType = s.type === 'pdf';
    else if (filter === 'url') matchType = s.type === 'url';
    else if (filter === 'note')matchType = s.type === 'note';
    else if (filter === 'code')matchType = s.type === 'code';
    else if (filter === 'dataset') matchType = s.type === 'dataset';
    else if (filter === 'oa')      matchType = s.license === 'CC BY' || s.license === 'OA';
    else if (filter === 'licensed') matchType = s.license === 'restricted';

    const q = search.toLowerCase();
    const matchSearch = !q || s.title.toLowerCase().includes(q) || s.authors.toLowerCase().includes(q) || s.tags.some(t => t.includes(q));
    return matchType && matchSearch;
  });

  // ---- sidebar Papers shortcut list ----
  const recentPapers = [
    { id: 'paper-1', label: 'Diamond OA Framing' },
    { id: 'paper-2', label: 'Peer Review Economics' },
  ];

  // ---- handlers ----
  const setCategory = (id, label, kind = 'category') => {
    setFilter(id);
    // sync the All-sources tab label with filter
    setOpenTabs(tabs => tabs.map(t => t.id === 'all-sources' ? { ...t, label, kind } : t));
    setActiveTab('all-sources');
  };

  const openSourceInTab = (s) => {
    const id = `src-${s.id}`;
    setOpenTabs(t => t.find(x => x.id === id) ? t : [...t, { id, label: s.title.length > 28 ? s.title.slice(0, 26) + '…' : s.title, kind: 'source', sourceId: s.id, type: s.type }]);
    setActiveTab(id);
  };

  const openPaperInTab = (p) => {
    const id = `paper-${p.id}`;
    setOpenTabs(t => t.find(x => x.id === id) ? t : [...t, { id, label: p.label, kind: 'paper', paperId: p.id }]);
    setActiveTab(id);
  };

  const closeTab = (id, e) => {
    e?.stopPropagation();
    setOpenTabs(t => {
      const next = t.filter(x => x.id !== id);
      if (activeTab === id) setActiveTab(next.length ? next[next.length - 1].id : '');
      return next.length ? next : [{ id: 'all-sources', label: 'All sources', kind: 'all' }];
    });
  };

  const navigateTo = (domain) => {
    setBrowserUrl(domain);
    setBrowserInput(BROWSER_PAGES[domain]?.url || `https://${domain}/`);
    setUrlEditing(false);
    setBrowserTabs(tabs => tabs.map(t => t.id === activeBrowserTab ? { ...t, domain } : t));
  };

  const selectBrowserTab = (id) => {
    const tab = browserTabs.find(t => t.id === id);
    if (!tab) return;
    setActiveBrowserTab(id);
    setBrowserUrl(tab.domain);
    setBrowserInput(BROWSER_PAGES[tab.domain]?.url || `https://${tab.domain}/`);
    setUrlEditing(false);
  };

  const addBrowserTab = () => {
    const id = 't' + Date.now();
    setBrowserTabs(tabs => [...tabs, { id, domain: 'arxiv.org' }]);
    setActiveBrowserTab(id);
    setBrowserUrl('arxiv.org');
    setBrowserInput(BROWSER_PAGES['arxiv.org'].url);
    setUrlEditing(false);
  };

  const closeBrowserTab = (id, e) => {
    e?.stopPropagation();
    setBrowserTabs(tabs => {
      const idx = tabs.findIndex(t => t.id === id);
      const next = tabs.filter(t => t.id !== id);
      if (next.length === 0) { setShowBrowser(false); return tabs; }
      if (activeBrowserTab === id) {
        const neighbor = next[Math.min(idx, next.length - 1)];
        setActiveBrowserTab(neighbor.id);
        setBrowserUrl(neighbor.domain);
        setBrowserInput(BROWSER_PAGES[neighbor.domain]?.url || `https://${neighbor.domain}/`);
      }
      return next;
    });
  };

  const removeCredential = (id) => setCredentials(cs => cs.filter(c => c.id !== id));
  const addCredential = () => setCredentials(cs => [...cs, { id: 'c' + Date.now(), site: 'nuevo-sitio.org', detail: 'sin configurar', kind: 'config' }]);

  const capturePage = () => {
    const p = BROWSER_PAGES[browserUrl];
    const meta = metaFor(browserUrl);
    const title = p ? `${meta.title} — “${p.query}” (search)` : browserInput;
    if (captured.has(title)) return;
    setCaptured(c => new Set([...c, title]));
    setCaptureFlash(title);
    setSources(ss => [{
      id: ss.length + 1, type: 'url', title, authors: meta.title, year: 2026,
      journal: browserUrl, tags: ['web', 'captured', 'search'], license: 'OA',
      status: 'unread', relevance: 'medium', paper: null,
    }, ...ss]);
    setTimeout(() => setCaptureFlash(null), 1800);
  };

  const captureSource = (item) => {
    if (captured.has(item.title)) return;
    setCaptured(c => new Set([...c, item.title]));
    setCaptureFlash(item.title);
    const newSource = {
      id: sources.length + 1,
      type: 'pdf',
      title: item.title,
      authors: item.authors,
      year: parseInt(item.year),
      journal: item.id || 'Web capture',
      tags: ['open-access', 'captured'],
      license: item.license === 'CC BY' ? 'CC BY' : item.license === 'restricted' ? 'restricted' : 'OA',
      status: 'unread',
      relevance: 'medium',
      paper: null,
    };
    setSources(ss => [newSource, ...ss]);
    setTimeout(() => setCaptureFlash(null), 1800);
  };

  // ---- derived: what's the active tab showing? ----
  const activeTabObj = openTabs.find(t => t.id === activeTab);
  const activeSource = activeTabObj?.kind === 'source' ? sources.find(s => s.id === activeTabObj.sourceId) : null;
  const activePaper  = activeTabObj?.kind === 'paper' ? recentPapers.find(p => p.id === activeTabObj.paperId) : null;
  const currentPage  = BROWSER_PAGES[browserUrl] || null;
  const urlParts = (() => {
    const raw = browserInput.replace(/^https?:\/\//, '');
    const slash = raw.indexOf('/');
    return slash === -1 ? { domain: raw, path: '' } : { domain: raw.slice(0, slash), path: raw.slice(slash) };
  })();

  // ---- sidebar items ----
  const browseItems = [
    { id: 'all',     label: 'All sources', count: counts.all },
    { id: 'pdf',     label: 'Papers',      count: counts.pdf },
    { id: 'url',     label: 'Web',         count: counts.url },
    { id: 'note',    label: 'Notes',       count: counts.note },
    { id: 'code',    label: 'Code',        count: counts.code },
    { id: 'dataset', label: 'Datasets',    count: counts.dataset },
  ];
  const accessItems = [
    { id: 'oa',       label: 'Open Access', count: counts.oa,       pill: 'oa' },
    { id: 'licensed', label: 'Licensed',    count: counts.licensed, pill: 'licensed' },
    { id: 'private',  label: 'PRIVATE',     count: 2,               pill: 'private' },
  ];

  // ---- filter sidebar with sideQuery ----
  const sideMatch = (label) => !sideQuery || label.toLowerCase().includes(sideQuery.toLowerCase());

  // =========================================================================
  return (
    <div style={lb.root} data-screen-label="Library">
      {/* ====== TOP BAR ====== */}
      <header style={lb.topbar}>
        <div style={lb.topbarLeft}>
          <div>
            <div style={lb.breadcrumb}>~/Documents/LumenWorkspace · library</div>
            <h1 style={lb.title}>My Library</h1>
          </div>
        </div>

        <div style={lb.topbarRight}>
          <button
            style={{ ...lb.browserToggle, ...(showBrowser ? lb.browserToggleActive : {}) }}
            onClick={() => { setShowBrowser(!showBrowser); setViewMode('library'); }}
          >
            <svg width={13} height={13} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="1" y="2" width="14" height="12" rx="2"/><path d="M1 5h14M5 2v3"/></svg>
            {showBrowser ? 'Hide Browser' : 'Browse & Capture'}
          </button>
          <button style={lb.addBtn}>+ Add Source</button>

          {/* Library/Files view toggle */}
          <div style={lb.viewToggle} role="tablist">
            <button
              onClick={() => setViewMode('library')}
              style={{ ...lb.viewOpt, ...(viewMode === 'library' ? lb.viewOptActive : {}) }}
            >
              <svg width={12} height={12} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M2 4h12M2 8h12M2 12h12"/></svg>
              Library
            </button>
            <button
              onClick={() => setViewMode('files')}
              style={{ ...lb.viewOpt, ...(viewMode === 'files' ? lb.viewOptActive : {}) }}
            >
              <svg width={12} height={12} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 5a1 1 0 011-1h3l2 2h6a1 1 0 011 1v6a1 1 0 01-1 1H3a1 1 0 01-1-1V5z"/></svg>
              Files
            </button>
          </div>
        </div>
      </header>

      {/* ====== BODY ====== */}
      {viewMode === 'files' ? (
        <FilesView />
      ) : (
        <div style={lb.body}>
          {/* ===== LEFT SIDEBAR ===== */}
          <aside style={{ ...lb.sidebar, width: sideOpen ? 230 : 44 }}>
            <div style={{ ...lb.sideHeader, ...(sideOpen ? {} : lb.sideHeaderCollapsed) }}>
              {sideOpen && <span style={lb.sideHeaderLabel}>My Library</span>}
              <button
                onClick={() => setSideOpen(o => !o)}
                style={lb.sideToggle}
                title={sideOpen ? 'Collapse panel' : 'Expand panel'}
                aria-label={sideOpen ? 'Collapse panel' : 'Expand panel'}
              >
                <svg width={14} height={14} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
                  style={{ transform: sideOpen ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.24s cubic-bezier(0.4,0,0.2,1)' }}>
                  <path d="M4 4l4 4-4 4" />
                  <path d="M9 4l4 4-4 4" />
                </svg>
              </button>
            </div>

            {sideOpen && (
            <div style={lb.sideScroll}>
            <div style={lb.sideSearchWrap}>
              <div style={lb.sideSearchInner}>
                <svg width={12} height={12} viewBox="0 0 16 16" fill="none" stroke="oklch(0.6 0.01 80)" strokeWidth="1.5" strokeLinecap="round" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                  <circle cx="7" cy="7" r="5"/><path d="M11 11l3 3"/>
                </svg>
                <input
                  style={lb.sideSearch}
                  value={sideQuery}
                  onChange={e => setSideQuery(e.target.value)}
                  placeholder="Search sources..."
                />
              </div>
            </div>

            <div style={lb.sideSection}>
              <div style={lb.sideSectionLabel}>Browse</div>
              {browseItems.filter(it => sideMatch(it.label)).map(it => (
                <SideItem key={it.id}
                  active={filter === it.id}
                  onClick={() => setCategory(it.id, it.label, 'category')}
                  icon={<CatIcon id={it.id} />}
                  label={it.label}
                  badge={it.count}
                  badgeKind="neutral"
                />
              ))}
            </div>

            <div style={lb.sideSection}>
              <div style={lb.sideSectionLabel}>Access</div>
              {accessItems.filter(it => sideMatch(it.label)).map(it => (
                <SideItem key={it.id}
                  active={filter === it.id}
                  onClick={() => setCategory(it.id, it.label, 'access')}
                  icon={<CatIcon id={it.id} />}
                  label={it.label}
                  badge={it.count}
                  badgeKind={it.pill}
                />
              ))}
            </div>

            <div style={lb.sideSection}>
              <div style={lb.sideSectionLabel}>Papers</div>
              {recentPapers.filter(p => sideMatch(p.label)).map(p => (
                <SideItem key={p.id}
                  onClick={() => openPaperInTab(p)}
                  icon={
                    <svg width={13} height={13} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 3h7l3 3v7a1 1 0 01-1 1H3a1 1 0 01-1-1V3a1 1 0 011-1z"/><path d="M10 3v3h3M5 9h6M5 11h4"/>
                    </svg>
                  }
                  label={p.label}
                />
              ))}
            </div>
            </div>
            )}
          </aside>

          {/* ===== CONTENT AREA ===== */}
          <section style={lb.content}>
            {/* Tabs bar — hidden when the browser takes over the full area */}
            {!showBrowser && (
            <div style={lb.tabsBar}>
              {openTabs.map(t => (
                <div
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  style={{ ...lb.tab, ...(activeTab === t.id ? lb.tabActive : {}) }}
                >
                  <span style={lb.tabIcon}>
                    {t.kind === 'all'      && <CatIcon id="all" />}
                    {t.kind === 'category' && <CatIcon id={filter} />}
                    {t.kind === 'access'   && <CatIcon id={filter} />}
                    {t.kind === 'source'   && <SourceIcon type={t.type} size={12} />}
                    {t.kind === 'paper'    && <CatIcon id="pdf" />}
                  </span>
                  <span style={lb.tabLabel}>{t.label}</span>
                  {t.id !== 'all-sources' && (
                    <button onClick={(e) => closeTab(t.id, e)} style={lb.tabClose}>×</button>
                  )}
                </div>
              ))}
              <button style={lb.tabAdd} title="New tab">
                <svg width={12} height={12} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M8 3v10M3 8h10"/></svg>
              </button>

              <div style={{ flex: 1 }} />

              {/* Inline search lives in the tabs bar — matches the toolbar density */}
              <div style={lb.inlineSearchWrap}>
                <svg width={12} height={12} viewBox="0 0 16 16" fill="none" stroke="oklch(0.55 0.01 80)" strokeWidth="1.5" strokeLinecap="round" style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)' }}>
                  <circle cx="7" cy="7" r="5"/><path d="M11 11l3 3"/>
                </svg>
                <input
                  style={lb.inlineSearch}
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Filter in view…"
                />
              </div>
            </div>
            )}

            {/* ===== Active tab content ===== */}
            <div style={lb.tabBody}>
              {/* Source list */}
              {!showBrowser && activeTabObj?.kind !== 'source' && activeTabObj?.kind !== 'paper' && filter !== 'private' && (
                <div style={{ ...lb.list, flex: 1 }}>
                  {captureFlash && (
                    <div style={lb.captureToast}>
                      <svg width={12} height={12} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 8l4 4 6-7"/></svg>
                      Captured to library
                    </div>
                  )}
                  <div style={lb.listInfoBar}>
                    {filtered.length} {filtered.length === 1 ? 'source' : 'sources'} · sorted by recency
                  </div>
                  {filtered.map(source => (
                    <div key={source.id}
                      onClick={() => openSourceInTab(source)}
                      style={lb.sourceRow}
                    >
                      <div style={{ ...lb.typeIcon, color: source.type === 'code' ? 'oklch(0.5 0.1 170)' : source.type === 'note' ? 'oklch(0.5 0.08 80)' : 'oklch(0.5 0.1 260)' }}>
                        <SourceIcon type={source.type} />
                      </div>
                      <div style={lb.sourceInfo}>
                        <div style={lb.sourceTitle}>{source.title}</div>
                        <div style={lb.sourceMeta}>{source.authors} · {source.year} · {source.journal}</div>
                        <div style={lb.sourceTags}>
                          {source.tags.slice(0, 3).map(t => <span key={t} style={lb.tag}>{t}</span>)}
                          {source.license !== 'own' && (
                            <span style={{ ...lb.licenseTag, background: LICENSE_COLOR[source.license]?.bg, color: LICENSE_COLOR[source.license]?.text }}>
                              {source.license}
                            </span>
                          )}
                        </div>
                      </div>
                      <div style={lb.sourceRight}>
                        <div style={{ ...lb.statusDot, background: source.status === 'read' ? 'oklch(0.55 0.12 170)' : source.status === 'reading' ? 'oklch(0.65 0.12 80)' : 'oklch(0.84 0.02 80)' }} title={source.status} />
                      </div>
                    </div>
                  ))}
                  {filtered.length === 0 && (
                    <div style={lb.emptyList}>No sources match this filter.</div>
                  )}
                </div>
              )}

              {/* PRIVATE access pane (unchanged content, integrated into tab body) */}
              {!showBrowser && activeTabObj?.kind !== 'source' && activeTabObj?.kind !== 'paper' && filter === 'private' && (
                <div style={lb.privateRoot}>
                  <div style={lb.privateBanner}>
                    <div style={lb.privateBannerIcon}>
                      <svg width={18} height={18} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="7" width="10" height="7" rx="1"/><path d="M5 7V5a3 3 0 016 0v2"/></svg>
                    </div>
                    <div>
                      <div style={lb.privateBannerTitle}>PRIVATE — Encrypted local storage</div>
                      <div style={lb.privateBannerSub}>Quotes and annotations from paywalled sources. Never redistributed. Stored encrypted on your machine only.</div>
                    </div>
                  </div>
                  <div style={lb.privateLegal}>
                    <svg width={13} height={13} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="8" cy="8" r="6"/><path d="M8 7v4M8 5v.5"/></svg>
                    <span><strong>What is allowed:</strong> Short quotes (≤400 words per source) and your own annotations, paraphrases, and synthesis notes. The full PDF never enters the system.</span>
                  </div>
                  <div style={lb.privateItems}>
                    {[
                      { title: 'Elsevier — The Publishing Oligopoly (2013 annual report)', source: 'Restricted · Elsevier.com', quotes: 2, annotations: 3, preview: '"Operating margins of 37.3% in 2013, outperforming both technology and pharmaceutical sectors."' },
                      { title: 'Nature — Peer Review under the Microscope', source: 'Restricted · Nature.com · Captured 2025-11-08', quotes: 1, annotations: 2, preview: '"The average reviewer spends 8.5 hours per manuscript review — labour that accrues entirely to the publisher."' },
                    ].map((item, i) => (
                      <div key={i} style={lb.privateItem}>
                        <div style={lb.privateItemHeader}>
                          <div style={lb.privateItemLock}>
                            <svg width={13} height={13} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="3" y="7" width="10" height="7" rx="1"/><path d="M5 7V5a3 3 0 016 0v2"/></svg>
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={lb.privateItemTitle}>{item.title}</div>
                            <div style={lb.privateItemSource}>{item.source}</div>
                          </div>
                          <div style={lb.privateItemStats}>
                            <span>{item.quotes} quotes</span>
                            <span style={lb.privateItemDot}>·</span>
                            <span>{item.annotations} annotations</span>
                          </div>
                        </div>
                        <div style={lb.privateItemPreview}>{item.preview}</div>
                        <div style={lb.privateItemActions}>
                          <button style={lb.privateBtn}>View annotations</button>
                          <button style={lb.privateBtn}>Use in paper</button>
                        </div>
                      </div>
                    ))}
                    <button style={lb.privateAddBtn}>
                      <svg width={13} height={13} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M8 2v12M2 8h12"/></svg>
                      Add quote or annotation from restricted source
                    </button>
                  </div>
                </div>
              )}

              {/* ----- Source-as-tab detail view ----- */}
              {!showBrowser && activeSource && (
                <div style={lb.detailFull}>
                  <div style={lb.detailHeader}>
                    <div style={{ ...lb.typeIcon, color: 'oklch(0.42 0.14 260)' }}>
                      <SourceIcon type={activeSource.type} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={lb.detailType}>{activeSource.type.toUpperCase()}</div>
                      <div style={lb.detailTitle}>{activeSource.title}</div>
                      <div style={lb.detailMeta}>{activeSource.authors} · {activeSource.journal}, {activeSource.year}</div>
                    </div>
                  </div>

                  <div style={lb.detailGrid}>
                    <div style={lb.detailCard}>
                      <div style={lb.detailLabel}>License</div>
                      <span style={{ ...lb.licenseTag, ...LICENSE_COLOR[activeSource.license] }}>{activeSource.license}</span>
                    </div>
                    <div style={lb.detailCard}>
                      <div style={lb.detailLabel}>Status</div>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        {['unread','reading','read'].map(s => (
                          <span key={s} style={{ ...lb.statusChip, ...(activeSource.status === s ? lb.statusChipActive : {}) }}>{s}</span>
                        ))}
                      </div>
                    </div>
                    <div style={lb.detailCard}>
                      <div style={lb.detailLabel}>Linked paper</div>
                      <div style={{ fontSize: 13, color: activeSource.paper ? 'oklch(0.42 0.14 260)' : 'oklch(0.6 0.01 80)', fontFamily: 'var(--font-ui)' }}>
                        {activeSource.paper || 'Not linked'}
                      </div>
                    </div>
                    <div style={{ ...lb.detailCard, gridColumn: '1 / -1' }}>
                      <div style={lb.detailLabel}>Tags</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                        {activeSource.tags.map(t => <span key={t} style={lb.tag}>{t}</span>)}
                      </div>
                    </div>
                  </div>

                  <div style={lb.detailActions}>
                    <button style={lb.actionBtn} onClick={() => onOpenPaper && onOpenPaper(activeSource.paper)}>Open in Editor</button>
                    <button style={{ ...lb.actionBtn, ...lb.actionBtnSecondary }}>Ask about this source</button>
                  </div>
                </div>
              )}

              {/* ----- Paper tab placeholder ----- */}
              {!showBrowser && activePaper && (
                <div style={lb.detailFull}>
                  <div style={lb.detailHeader}>
                    <div style={{ ...lb.typeIcon, color: 'oklch(0.42 0.14 260)' }}><CatIcon id="pdf" /></div>
                    <div style={{ flex: 1 }}>
                      <div style={lb.detailType}>PAPER WORKSPACE</div>
                      <div style={lb.detailTitle}>{activePaper.label}</div>
                      <div style={lb.detailMeta}>Linked sources, drafts and notes from this paper.</div>
                    </div>
                  </div>
                  <div style={lb.detailActions}>
                    <button style={lb.actionBtn} onClick={() => onOpenPaper && onOpenPaper(activePaper.id)}>Open in Editor</button>
                  </div>
                </div>
              )}

              {/* ----- Browse & Capture — embedded Chromium browser, full main area ----- */}
              {showBrowser && (
                <div style={lb.browserWrap}>
                  <div style={{ ...lb.browserWindow, flexDirection: tabPosition === 'left' ? 'row' : 'column' }}>

                    {/* ===== Tab strip (top) ===== */}
                    {tabPosition === 'top' && (
                      <div style={lb.tabStripTop}>
                        <div style={lb.tabStripScroll}>
                          {browserTabs.map(tab => {
                            const m = metaFor(tab.domain);
                            const active = tab.id === activeBrowserTab;
                            return (
                              <div key={tab.id}
                                onClick={() => selectBrowserTab(tab.id)}
                                style={{ ...lb.bTab, ...(active ? lb.bTabActive : {}) }}>
                                <span style={{ ...lb.favicon, background: m.color }}>{m.letter}</span>
                                <span style={lb.bTabLabel}>{m.title}</span>
                                <button style={lb.bTabClose} onClick={(e) => closeBrowserTab(tab.id, e)} title="Close tab">
                                  <svg width={9} height={9} viewBox="0 0 10 10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"><path d="M2 2l6 6M8 2l-6 6"/></svg>
                                </button>
                              </div>
                            );
                          })}
                          <button style={lb.bTabAdd} onClick={addBrowserTab} title="New tab">
                            <svg width={13} height={13} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M8 3v10M3 8h10"/></svg>
                          </button>
                        </div>
                        <div style={lb.winControls}>
                          <button style={lb.winBtn} title="Minimize">
                            <svg width={12} height={12} viewBox="0 0 16 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M3 11l5-3 5 3"/></svg>
                          </button>
                          <button style={lb.winBtn} title="Maximize">
                            <svg width={11} height={11} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"><rect x="3" y="3" width="10" height="10" rx="1.5"/></svg>
                          </button>
                          <button style={{ ...lb.winBtn, ...lb.winBtnClose }} onClick={() => setShowBrowser(false)} title="Close browser">
                            <svg width={12} height={12} viewBox="0 0 16 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M4 4l8 8M12 4l-8 8"/></svg>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* ===== Tab rail (left) ===== */}
                    {tabPosition === 'left' && (
                      <div style={lb.tabRailLeft}>
                        {browserTabs.map(tab => {
                          const m = metaFor(tab.domain);
                          const active = tab.id === activeBrowserTab;
                          return (
                            <div key={tab.id}
                              onClick={() => selectBrowserTab(tab.id)}
                              style={{ ...lb.bRailTab, ...(active ? lb.bRailTabActive : {}) }}>
                              <span style={{ ...lb.favicon, background: m.color }}>{m.letter}</span>
                              <span style={lb.bRailLabel}>{m.title}</span>
                              <button style={lb.bTabClose} onClick={(e) => closeBrowserTab(tab.id, e)} title="Close tab">
                                <svg width={9} height={9} viewBox="0 0 10 10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"><path d="M2 2l6 6M8 2l-6 6"/></svg>
                              </button>
                            </div>
                          );
                        })}
                        <button style={lb.bRailAdd} onClick={addBrowserTab} title="New tab">
                          <svg width={13} height={13} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M8 3v10M3 8h10"/></svg>
                          New tab
                        </button>
                      </div>
                    )}

                    {/* ===== Main column: nav + bookmarks + page ===== */}
                    <div style={lb.browserMain}>
                      {/* nav bar */}
                      <div style={lb.navBar}>
                        <div style={lb.navBtns}>
                          <button style={lb.navIconBtn} title="Back">
                            <svg width={15} height={15} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M10 3l-5 5 5 5"/></svg>
                          </button>
                          <button style={{ ...lb.navIconBtn, color: 'oklch(0.7 0.01 80)' }} title="Forward">
                            <svg width={15} height={15} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3l5 5-5 5"/></svg>
                          </button>
                          <button style={lb.navIconBtn} title="Reload" onClick={() => navigateTo(browserUrl)}>
                            <svg width={15} height={15} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M13 8a5 5 0 11-1.5-3.5M13 2v3h-3"/></svg>
                          </button>
                        </div>

                        {/* URL bar */}
                        <div style={lb.urlBarWrap} onClick={() => setUrlEditing(true)}>
                          <svg width={12} height={12} viewBox="0 0 16 16" fill="none" stroke="oklch(0.5 0.1 160)" strokeWidth="1.4" strokeLinecap="round" style={{ flexShrink: 0 }}>
                            <rect x="3.5" y="7" width="9" height="6.5" rx="1.5"/><path d="M5.5 7V5a2.5 2.5 0 015 0v2"/>
                          </svg>
                          {urlEditing ? (
                            <input
                              autoFocus
                              style={lb.urlInput}
                              value={browserInput}
                              onChange={e => setBrowserInput(e.target.value)}
                              onBlur={() => setUrlEditing(false)}
                              onKeyDown={e => { if (e.key === 'Enter') { navigateTo(urlParts.domain); e.target.blur(); } if (e.key === 'Escape') setUrlEditing(false); }}
                            />
                          ) : (
                            <div style={lb.urlDisplay}>
                              <span style={lb.urlScheme}>https://</span>
                              <span style={lb.urlDomain}>{urlParts.domain}</span>
                              <span style={lb.urlPath}>{urlParts.path}</span>
                            </div>
                          )}
                        </div>

                        {/* right actions */}
                        <button style={lb.captureToolBtn} onClick={capturePage} title="Capture this page to your library">
                          <svg width={13} height={13} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M8 2v8M4.5 6.5L8 10l3.5-3.5"/><path d="M3 13h10"/></svg>
                          Capture to Library
                        </button>
                        <button style={lb.gearBtn} onClick={() => setShowSettings(true)} title="Browser settings">
                          <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
                        </button>
                      </div>

                      {/* bookmarks bar */}
                      <div style={lb.bookmarksBar}>
                        <svg width={12} height={12} viewBox="0 0 16 16" fill="none" stroke="oklch(0.6 0.01 80)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginRight: 2 }}><path d="M4 2.5h8a.5.5 0 01.5.5v10.5L8 11l-4.5 2.5V3a.5.5 0 01.5-.5z"/></svg>
                        {BOOKMARKS.map(domain => {
                          const m = metaFor(domain);
                          return (
                            <button key={domain}
                              style={{ ...lb.bookmark, ...(browserUrl === domain ? lb.bookmarkActive : {}) }}
                              onClick={() => navigateTo(domain)}>
                              <span style={{ ...lb.bmFavicon, background: m.color }}>{m.letter}</span>
                              {domain}
                            </button>
                          );
                        })}
                      </div>

                      {/* page viewport */}
                      <div style={lb.pageViewport}>
                        {captureFlash && (
                          <div style={lb.pageCaptureToast}>
                            <svg width={13} height={13} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 8l4 4 6-7"/></svg>
                            Captured to your library
                          </div>
                        )}
                        {currentPage ? (
                          <div style={lb.webPage}>
                            {/* faux site header */}
                            <div style={{ ...lb.siteHeader, borderColor: metaFor(browserUrl).color }}>
                              <span style={{ ...lb.siteLogo, background: metaFor(browserUrl).color }}>{metaFor(browserUrl).letter}</span>
                              <span style={lb.siteName}>{currentPage.site}</span>
                              <div style={lb.siteSearch}>
                                <svg width={12} height={12} viewBox="0 0 16 16" fill="none" stroke="oklch(0.6 0.01 80)" strokeWidth="1.5" strokeLinecap="round"><circle cx="7" cy="7" r="5"/><path d="M11 11l3 3"/></svg>
                                {currentPage.query}
                              </div>
                            </div>
                            <div style={lb.pageBody}>
                              <div style={lb.resultsCount}>{currentPage.results}</div>
                              {currentPage.content.map((item, i) => (
                                <div key={i} style={lb.webResult}>
                                  <div style={lb.webResultTop}>
                                    {item.id && <span style={lb.webResultId}>{item.id}</span>}
                                    <span style={lb.webResultYear}>{item.year}</span>
                                    <span style={{ ...lb.licenseTag, ...LICENSE_COLOR[item.license], marginLeft: 'auto' }}>{item.license}</span>
                                  </div>
                                  <div style={lb.webResultTitle}>{item.title}</div>
                                  <div style={lb.webResultAuthors}>{item.authors}</div>
                                  <div style={lb.webResultAbstract}>{item.abstract}</div>
                                  <button
                                    style={{ ...lb.captureBtn, ...(captured.has(item.title) ? lb.captureBtnDone : {}) }}
                                    onClick={() => captureSource(item)}
                                    disabled={captured.has(item.title)}>
                                    {captured.has(item.title)
                                      ? <><svg width={11} height={11} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 8l4 4 6-7"/></svg> Captured</>
                                      : <><svg width={11} height={11} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M8 2v8M4.5 6.5L8 10l3.5-3.5"/><path d="M3 13h10"/></svg> Capture to Library</>}
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div style={lb.blankPage}>
                            <div style={lb.blankIcon}>
                              <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="oklch(0.75 0.01 80)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.7 2.5 15.3 0 18M12 3c-2.5 2.7-2.5 15.3 0 18"/></svg>
                            </div>
                            <div style={lb.blankTitle}>{urlParts.domain || 'New tab'}</div>
                            <div style={lb.blankSub}>Press Enter in the address bar to load, or pick a bookmark above.</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* ===== Settings modal ===== */}
                  {showSettings && (
                    <div style={lb.modalOverlay} onClick={() => setShowSettings(false)}>
                      <div style={lb.modalCard} onClick={e => e.stopPropagation()}>
                        <div style={lb.modalHeader}>
                          <div>
                            <div style={lb.modalTitle}>Browser settings</div>
                            <div style={lb.modalSub}>Embedded research browser · Lumen</div>
                          </div>
                          <button style={lb.modalClose} onClick={() => setShowSettings(false)}>
                            <svg width={14} height={14} viewBox="0 0 16 16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M4 4l8 8M12 4l-8 8"/></svg>
                          </button>
                        </div>

                        <div style={lb.modalBody}>
                          {/* tab position */}
                          <div style={lb.settingBlock}>
                            <div style={lb.settingLabel}>Posición de pestañas</div>
                            <div style={lb.settingDesc}>Dónde se muestran las pestañas abiertas dentro del navegador.</div>
                            <div style={lb.segmented}>
                              {[{ v: 'top', label: 'Superior' }, { v: 'left', label: 'Lateral izquierdo' }].map(opt => (
                                <button key={opt.v}
                                  style={{ ...lb.segOpt, ...(tabPosition === opt.v ? lb.segOptActive : {}) }}
                                  onClick={() => setTabPosition(opt.v)}>
                                  {opt.v === 'top'
                                    ? <svg width={14} height={14} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3"><rect x="2" y="2" width="12" height="12" rx="1.5"/><path d="M2 5.5h12"/></svg>
                                    : <svg width={14} height={14} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3"><rect x="2" y="2" width="12" height="12" rx="1.5"/><path d="M5.5 2v12"/></svg>}
                                  {opt.label}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* credentials */}
                          <div style={lb.settingBlock}>
                            <div style={lb.settingLabel}>Credenciales guardadas</div>
                            <div style={lb.settingDesc}>Cuentas con acceso facilitado en sitios de investigación. Almacenadas cifradas localmente.</div>
                            <div style={lb.credList}>
                              {credentials.map(c => (
                                <div key={c.id} style={lb.credItem}>
                                  <span style={{ ...lb.credFavicon, background: metaFor(c.site).color }}>{metaFor(c.site).letter}</span>
                                  <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={lb.credSite}>{c.site}</div>
                                    <div style={lb.credDetail}>{c.detail}</div>
                                  </div>
                                  <span style={lb.credKind}>{c.kind === 'account' ? 'Cuenta' : c.kind === 'institutional' ? 'Institucional' : 'Acceso'}</span>
                                  <button style={lb.credDelete} onClick={() => removeCredential(c.id)} title="Eliminar credencial">
                                    <svg width={13} height={13} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 5h10M6.5 5V3.5h3V5M5 5l.5 8h5l.5-8"/></svg>
                                  </button>
                                </div>
                              ))}
                            </div>
                            <button style={lb.addCredBtn} onClick={addCredential}>
                              <svg width={13} height={13} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M8 3v10M3 8h10"/></svg>
                              Add credential
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>
        </div>
      )}

      {/* ====== STATUS BAR ====== */}
      <footer style={lb.statusBar}>
        <span style={lb.statusItem}>
          <svg width={11} height={11} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><ellipse cx="8" cy="4" rx="5" ry="2"/><path d="M3 4v8c0 1.1 2.24 2 5 2s5-.9 5-2V4"/><path d="M3 8c0 1.1 2.24 2 5 2s5-.9 5-2"/></svg>
          {sources.length} sources
        </span>
        <span style={lb.statusSep}>·</span>
        <span style={lb.statusItem}>
          <svg width={11} height={11} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="3" y="7" width="10" height="7" rx="1"/><path d="M5 7V5a3 3 0 016 0"/></svg>
          {counts.oa} open access
        </span>
        <span style={lb.statusSep}>·</span>
        <span style={lb.statusItem}>
          <svg width={11} height={11} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="3" y="7" width="10" height="7" rx="1"/><path d="M5 7V5a3 3 0 016 0v2"/></svg>
          {counts.licensed} licensed
        </span>
        <span style={{ marginLeft: 'auto', ...lb.statusItem }}>
          <svg width={11} height={11} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="8" r="6"/><path d="M5 8l2 2 4-4"/></svg>
          Local-first · Encrypted
        </span>
      </footer>
    </div>
  );
}

// ===== Sidebar item =====
function SideItem({ active, onClick, icon, label, badge, badgeKind = 'neutral' }) {
  const [hover, setHover] = React.useState(false);
  const badgeStyle = badgeKind === 'oa'
    ? { background: 'oklch(0.93 0.07 160)', color: 'oklch(0.35 0.12 160)' }
    : badgeKind === 'licensed'
    ? { background: 'oklch(0.94 0.05 60)', color: 'oklch(0.45 0.1 60)' }
    : badgeKind === 'private'
    ? { background: 'oklch(0.94 0.05 25)', color: 'oklch(0.45 0.12 25)' }
    : { background: 'oklch(0.94 0.008 80)', color: 'oklch(0.5 0.01 80)' };
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        ...lb.sideItem,
        background: active ? '#fff' : hover ? 'oklch(0.98 0.005 80)' : 'transparent',
        color: active ? 'oklch(0.13 0.015 80)' : 'oklch(0.4 0.01 80)',
        fontWeight: active ? 600 : 500,
        boxShadow: active ? 'inset 2px 0 0 oklch(0.42 0.14 260)' : 'none',
      }}
    >
      <span style={lb.sideItemIcon}>{icon}</span>
      <span style={lb.sideItemLabel}>{label}</span>
      {badge != null && <span style={{ ...lb.sideBadge, ...badgeStyle }}>{badge}</span>}
    </button>
  );
}

// ============================================================ STYLES
const lb = {
  root: { display: 'flex', flexDirection: 'column', height: '100%', background: 'oklch(0.985 0.006 80)', overflow: 'hidden' },

  // top bar
  topbar: {
    display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
    padding: '24px 32px 16px', borderBottom: '1px solid oklch(0.92 0.008 80)',
    background: '#fff', flexShrink: 0, gap: 18,
  },
  topbarLeft: { display: 'flex', alignItems: 'flex-end' },
  topbarRight: { display: 'flex', gap: 10, alignItems: 'center' },
  breadcrumb: { fontSize: 11.5, color: 'oklch(0.55 0.01 80)', marginBottom: 6, fontFamily: 'var(--font-mono)' },
  title: { fontSize: 26, fontWeight: 700, color: 'oklch(0.13 0.015 80)', fontFamily: 'var(--font-display)', margin: 0, letterSpacing: '-0.02em', lineHeight: 1 },

  viewToggle: {
    display: 'flex', gap: 2, background: 'oklch(0.95 0.008 80)',
    padding: 3, borderRadius: 8, border: '1px solid oklch(0.91 0.008 80)',
  },
  viewOpt: {
    display: 'flex', alignItems: 'center', gap: 6,
    padding: '6px 12px', borderRadius: 6, border: 'none',
    background: 'none', cursor: 'pointer', fontSize: 12.5,
    color: 'oklch(0.5 0.01 80)', fontFamily: 'var(--font-ui)', fontWeight: 500,
    transition: 'all 0.15s',
  },
  viewOptActive: {
    background: '#fff', color: 'oklch(0.13 0.015 80)',
    boxShadow: '0 1px 2px oklch(0 0 0 / 0.05), 0 0 0 0.5px oklch(0.88 0.01 80)',
    fontWeight: 600,
  },

  browserToggle: { display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: '1px solid oklch(0.88 0.02 260)', borderRadius: 7, padding: '7px 14px', fontSize: 13, color: 'oklch(0.42 0.14 260)', cursor: 'pointer', fontFamily: 'var(--font-ui)', fontWeight: 600, transition: 'all 0.15s' },
  browserToggleActive: { background: 'oklch(0.96 0.03 260)', borderColor: 'oklch(0.75 0.08 260)' },
  addBtn: { background: 'oklch(0.42 0.14 260)', color: '#fff', border: 'none', borderRadius: 7, padding: '8px 15px', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-ui)' },

  // body
  body: { display: 'flex', flex: 1, minHeight: 0, overflow: 'hidden' },

  // sidebar
  sidebar: {
    flexShrink: 0,
    background: 'oklch(0.975 0.005 80)',
    borderRight: '1px solid oklch(0.92 0.008 80)',
    display: 'flex', flexDirection: 'column', overflow: 'hidden',
    paddingBottom: 10,
    transition: 'width 0.24s cubic-bezier(0.4,0,0.2,1)',
  },
  sideHeader: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '12px 10px 10px 16px', fontFamily: 'var(--font-ui)',
    minHeight: 40,
  },
  sideHeaderCollapsed: { padding: '12px 0 10px', justifyContent: 'center' },
  sideHeaderLabel: {
    fontSize: 10.5, fontWeight: 700, color: 'oklch(0.5 0.01 80)',
    textTransform: 'uppercase', letterSpacing: '0.08em', whiteSpace: 'nowrap',
  },
  sideToggle: {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    width: 26, height: 26, flexShrink: 0,
    border: 'none', borderRadius: 6, background: 'none', cursor: 'pointer',
    color: 'oklch(0.55 0.01 80)', transition: 'background 0.14s, color 0.14s',
  },
  sideScroll: { display: 'flex', flexDirection: 'column', overflow: 'hidden', flex: 1 },
  sideSearchWrap: { padding: '0 12px 10px' },
  sideSearchInner: { position: 'relative', display: 'flex', alignItems: 'center' },
  sideSearch: {
    width: '100%', padding: '6px 10px 6px 28px', fontSize: 12,
    border: '1px solid oklch(0.91 0.008 80)', borderRadius: 6,
    background: '#fff', color: 'oklch(0.2 0.01 80)',
    outline: 'none', fontFamily: 'var(--font-ui)',
  },
  sideSection: { padding: '8px 0', borderTop: '1px solid oklch(0.92 0.008 80)' },
  sideSectionLabel: {
    padding: '4px 16px 6px', fontSize: 10, fontWeight: 700,
    color: 'oklch(0.55 0.01 80)', textTransform: 'uppercase',
    letterSpacing: '0.08em', fontFamily: 'var(--font-ui)',
  },
  sideItem: {
    display: 'flex', alignItems: 'center', gap: 9,
    width: '100%', textAlign: 'left',
    padding: '6px 16px 6px 16px',
    border: 'none', background: 'none', cursor: 'pointer',
    fontSize: 12.5, fontFamily: 'var(--font-ui)',
    transition: 'background 0.08s',
    position: 'relative',
  },
  sideItemIcon: { display: 'inline-flex', flexShrink: 0, color: 'oklch(0.55 0.01 80)' },
  sideItemLabel: { flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  sideBadge: {
    fontSize: 10, padding: '1px 7px', borderRadius: 10,
    fontFamily: 'var(--font-mono)', fontWeight: 500,
    minWidth: 18, textAlign: 'center',
  },

  // content area
  content: { flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' },

  // tabs bar
  tabsBar: {
    display: 'flex', alignItems: 'stretch',
    background: 'oklch(0.97 0.006 80)',
    borderBottom: '1px solid oklch(0.92 0.008 80)',
    minHeight: 36, flexShrink: 0, paddingRight: 12,
    gap: 0,
  },
  tab: {
    display: 'flex', alignItems: 'center', gap: 7,
    padding: '0 12px', height: 36,
    borderRight: '1px solid oklch(0.93 0.008 80)',
    background: 'oklch(0.97 0.006 80)',
    fontSize: 12.5, color: 'oklch(0.5 0.01 80)',
    cursor: 'pointer', whiteSpace: 'nowrap',
    fontFamily: 'var(--font-ui)',
    maxWidth: 220,
    flexShrink: 0,
  },
  tabActive: {
    background: '#fff', color: 'oklch(0.13 0.015 80)',
    fontWeight: 600, borderBottom: '2px solid oklch(0.42 0.14 260)',
    marginBottom: -1,
  },
  tabIcon: { display: 'inline-flex', color: 'oklch(0.5 0.1 260)' },
  tabLabel: { overflow: 'hidden', textOverflow: 'ellipsis' },
  tabClose: {
    width: 16, height: 16, border: 'none', background: 'none',
    color: 'oklch(0.55 0.01 80)', borderRadius: 3,
    fontSize: 14, cursor: 'pointer', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    marginLeft: 2,
  },
  tabAdd: {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    border: 'none', background: 'none',
    color: 'oklch(0.55 0.01 80)', padding: '0 12px',
    borderRight: '1px solid oklch(0.93 0.008 80)',
    cursor: 'pointer',
  },
  inlineSearchWrap: { position: 'relative', alignSelf: 'center' },
  inlineSearch: {
    width: 170, padding: '5px 10px 5px 26px', fontSize: 12,
    border: '1px solid oklch(0.91 0.008 80)', borderRadius: 6,
    background: '#fff', color: 'oklch(0.2 0.01 80)',
    outline: 'none', fontFamily: 'var(--font-ui)',
  },

  tabBody: { flex: 1, display: 'flex', minHeight: 0, overflow: 'hidden' },

  // source list
  list: { overflow: 'auto', transition: 'flex 0.25s', minWidth: 0, background: '#fff' },
  listInfoBar: {
    padding: '10px 24px', fontSize: 11.5, color: 'oklch(0.55 0.01 80)',
    fontFamily: 'var(--font-mono)', borderBottom: '1px solid oklch(0.95 0.005 80)',
    background: 'oklch(0.985 0.005 80)',
  },
  captureToast: { display: 'flex', alignItems: 'center', gap: 7, background: 'oklch(0.93 0.07 160)', color: 'oklch(0.32 0.12 160)', fontSize: 13, fontWeight: 600, padding: '10px 24px', fontFamily: 'var(--font-ui)', borderBottom: '1px solid oklch(0.86 0.08 160)' },
  sourceRow: { display: 'flex', alignItems: 'flex-start', gap: 12, padding: '13px 24px', cursor: 'pointer', borderBottom: '1px solid oklch(0.95 0.005 80)', transition: 'background 0.1s' },
  typeIcon: { width: 30, height: 30, borderRadius: 7, background: 'oklch(0.95 0.015 260)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 },
  sourceInfo: { flex: 1, minWidth: 0 },
  sourceTitle: { fontSize: 14, fontWeight: 500, color: 'oklch(0.15 0.01 80)', lineHeight: 1.4, marginBottom: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: 'var(--font-ui)' },
  sourceMeta: { fontSize: 12, color: 'oklch(0.58 0.01 80)', marginBottom: 6, fontFamily: 'var(--font-ui)' },
  sourceTags: { display: 'flex', gap: 5, flexWrap: 'wrap' },
  tag: { background: 'oklch(0.94 0.015 80)', color: 'oklch(0.4 0.02 80)', fontSize: 11, padding: '2px 7px', borderRadius: 4, fontFamily: 'var(--font-ui)' },
  licenseTag: { fontSize: 11, padding: '2px 7px', borderRadius: 4, fontWeight: 600, fontFamily: 'var(--font-ui)' },
  sourceRight: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, paddingTop: 4 },
  statusDot: { width: 8, height: 8, borderRadius: '50%', flexShrink: 0 },
  emptyList: { padding: '40px 24px', textAlign: 'center', color: 'oklch(0.6 0.01 80)', fontFamily: 'var(--font-ui)', fontSize: 13 },

  // ===== Embedded browser (Browse & Capture) =====
  browserWrap: { flex: 1, minWidth: 0, display: 'flex', padding: 16, background: 'oklch(0.965 0.006 80)', overflow: 'hidden', position: 'relative' },
  browserWindow: { flex: 1, minWidth: 0, display: 'flex', background: '#fff', border: '1px solid oklch(0.87 0.008 80)', borderRadius: 10, overflow: 'hidden', boxShadow: '0 8px 28px oklch(0 0 0 / 0.08), 0 1px 3px oklch(0 0 0 / 0.06)' },

  // tab strip (top)
  tabStripTop: { display: 'flex', alignItems: 'flex-end', gap: 4, background: 'oklch(0.93 0.006 80)', borderBottom: '1px solid oklch(0.88 0.008 80)', padding: '7px 10px 0', flexShrink: 0 },
  browserBrand: { display: 'flex', alignItems: 'center', gap: 7, marginBottom: 7, marginRight: 6, paddingRight: 12, borderRight: '1px solid oklch(0.85 0.008 80)', fontSize: 10.5, fontWeight: 700, letterSpacing: '0.13em', color: 'oklch(0.48 0.01 80)', fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap', flexShrink: 0 },
  browserBrandDot: { width: 9, height: 9, borderRadius: '50%', background: 'oklch(0.42 0.14 260)', flexShrink: 0 },
  winControls: { display: 'flex', alignItems: 'center', gap: 1, marginBottom: 6, marginLeft: 6, flexShrink: 0 },
  winBtn: { width: 26, height: 26, borderRadius: 6, border: 'none', background: 'none', cursor: 'pointer', color: 'oklch(0.45 0.01 80)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  winBtnClose: { color: 'oklch(0.5 0.01 80)' },
  tabStripScroll: { display: 'flex', alignItems: 'flex-end', gap: 3, overflowX: 'auto', flex: 1 },
  bTab: { display: 'flex', alignItems: 'center', gap: 7, padding: '0 10px', height: 33, minWidth: 130, maxWidth: 190, borderRadius: '8px 8px 0 0', background: 'transparent', color: 'oklch(0.45 0.01 80)', cursor: 'pointer', fontSize: 12.5, fontFamily: 'var(--font-ui)', flexShrink: 0, transition: 'background 0.12s' },
  bTabActive: { background: '#fff', color: 'oklch(0.15 0.01 80)', fontWeight: 600, boxShadow: '0 -1px 2px oklch(0 0 0 / 0.04)' },
  bTabLabel: { flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  favicon: { width: 16, height: 16, borderRadius: 4, color: '#fff', fontSize: 9.5, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontFamily: 'var(--font-ui)' },
  bTabClose: { width: 17, height: 17, borderRadius: 4, border: 'none', background: 'none', color: 'oklch(0.55 0.01 80)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  bTabAdd: { width: 28, height: 28, marginBottom: 3, marginLeft: 2, borderRadius: 6, border: 'none', background: 'none', color: 'oklch(0.5 0.01 80)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },

  // tab rail (left)
  tabRailLeft: { width: 168, flexShrink: 0, background: 'oklch(0.96 0.006 80)', borderRight: '1px solid oklch(0.89 0.008 80)', display: 'flex', flexDirection: 'column', gap: 3, padding: 8, overflowY: 'auto' },
  bRailTab: { display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', borderRadius: 8, background: 'transparent', color: 'oklch(0.42 0.01 80)', cursor: 'pointer', fontSize: 12.5, fontFamily: 'var(--font-ui)', flexShrink: 0 },
  bRailTabActive: { background: '#fff', color: 'oklch(0.15 0.01 80)', fontWeight: 600, boxShadow: '0 1px 3px oklch(0 0 0 / 0.06)' },
  bRailLabel: { flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  bRailAdd: { display: 'flex', alignItems: 'center', gap: 7, padding: '8px 10px', borderRadius: 8, border: '1px dashed oklch(0.84 0.01 80)', background: 'none', color: 'oklch(0.5 0.01 80)', cursor: 'pointer', fontSize: 12, fontFamily: 'var(--font-ui)', marginTop: 2 },

  browserMain: { flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#fff' },

  // nav bar
  navBar: { display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderBottom: '1px solid oklch(0.93 0.006 80)', flexShrink: 0 },
  navBtns: { display: 'flex', alignItems: 'center', gap: 1 },
  navIconBtn: { width: 30, height: 30, borderRadius: 7, border: 'none', background: 'none', cursor: 'pointer', color: 'oklch(0.4 0.01 80)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  urlBarWrap: { flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: 8, background: 'oklch(0.965 0.005 80)', border: '1px solid oklch(0.9 0.008 80)', borderRadius: 18, padding: '7px 14px', cursor: 'text', height: 32 },
  urlInput: { flex: 1, border: 'none', outline: 'none', fontSize: 12.5, color: 'oklch(0.2 0.01 80)', fontFamily: 'var(--font-mono)', background: 'transparent', padding: 0 },
  urlDisplay: { flex: 1, minWidth: 0, fontSize: 12.5, fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  urlScheme: { color: 'oklch(0.62 0.01 80)' },
  urlDomain: { color: 'oklch(0.16 0.01 80)', fontWeight: 600 },
  urlPath: { color: 'oklch(0.62 0.01 80)' },
  captureToolBtn: { display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, fontWeight: 600, color: '#fff', background: 'oklch(0.42 0.14 260)', border: 'none', borderRadius: 8, padding: '7px 13px', cursor: 'pointer', fontFamily: 'var(--font-ui)', flexShrink: 0, whiteSpace: 'nowrap' },
  gearBtn: { width: 32, height: 32, borderRadius: 8, border: '1px solid oklch(0.9 0.008 80)', background: 'none', cursor: 'pointer', color: 'oklch(0.45 0.01 80)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },

  // bookmarks bar
  bookmarksBar: { display: 'flex', alignItems: 'center', gap: 4, padding: '6px 12px', borderBottom: '1px solid oklch(0.93 0.006 80)', background: 'oklch(0.987 0.004 80)', flexShrink: 0, overflowX: 'auto' },
  bookmark: { display: 'flex', alignItems: 'center', gap: 6, fontSize: 11.5, padding: '4px 9px', borderRadius: 6, border: 'none', background: 'none', color: 'oklch(0.42 0.01 80)', cursor: 'pointer', fontFamily: 'var(--font-ui)', whiteSpace: 'nowrap', flexShrink: 0, transition: 'background 0.12s' },
  bookmarkActive: { background: 'oklch(0.95 0.025 260)', color: 'oklch(0.38 0.12 260)', fontWeight: 600 },
  bmFavicon: { width: 14, height: 14, borderRadius: 3, color: '#fff', fontSize: 8.5, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },

  // page viewport + web page
  pageViewport: { flex: 1, overflow: 'auto', background: 'oklch(0.95 0.005 80)', padding: 18, position: 'relative' },
  pageCaptureToast: { position: 'absolute', top: 14, left: '50%', transform: 'translateX(-50%)', zIndex: 5, display: 'flex', alignItems: 'center', gap: 7, background: 'oklch(0.34 0.1 160)', color: '#fff', fontSize: 12.5, fontWeight: 600, padding: '8px 16px', borderRadius: 20, fontFamily: 'var(--font-ui)', boxShadow: '0 4px 14px oklch(0 0 0 / 0.18)', animation: 'fadeIn 0.2s ease' },
  webPage: { background: '#fff', borderRadius: 8, border: '1px solid oklch(0.91 0.006 80)', boxShadow: '0 1px 4px oklch(0 0 0 / 0.04)', overflow: 'hidden', maxWidth: 720, margin: '0 auto' },
  siteHeader: { display: 'flex', alignItems: 'center', gap: 10, padding: '14px 22px', borderBottom: '2px solid', background: '#fff' },
  siteLogo: { width: 26, height: 26, borderRadius: 6, color: '#fff', fontSize: 14, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontFamily: 'var(--font-display)' },
  siteName: { fontSize: 16, fontWeight: 700, color: 'oklch(0.2 0.01 80)', fontFamily: 'var(--font-display)' },
  siteSearch: { marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, color: 'oklch(0.45 0.01 80)', fontFamily: 'var(--font-ui)', background: 'oklch(0.97 0.004 80)', border: '1px solid oklch(0.91 0.006 80)', borderRadius: 16, padding: '6px 14px', maxWidth: 280, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  pageBody: { padding: '18px 22px 24px' },
  resultsCount: { fontSize: 12, color: 'oklch(0.55 0.01 80)', fontFamily: 'var(--font-ui)', marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid oklch(0.94 0.005 80)' },
  webResult: { padding: '14px 0', borderBottom: '1px solid oklch(0.95 0.005 80)' },
  webResultTop: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 },
  webResultId: { fontSize: 11.5, color: 'oklch(0.45 0.14 25)', fontFamily: 'var(--font-mono)', fontWeight: 500 },
  webResultYear: { fontSize: 11.5, color: 'oklch(0.6 0.01 80)', fontFamily: 'var(--font-ui)' },
  webResultTitle: { fontSize: 15, fontWeight: 600, color: 'oklch(0.32 0.1 260)', lineHeight: 1.35, marginBottom: 4, fontFamily: 'var(--font-ui)', cursor: 'pointer' },
  webResultAuthors: { fontSize: 12, color: 'oklch(0.45 0.09 150)', fontFamily: 'var(--font-ui)', marginBottom: 7 },
  webResultAbstract: { fontSize: 12.5, color: 'oklch(0.42 0.01 80)', fontFamily: 'var(--font-ui)', lineHeight: 1.6, marginBottom: 11 },
  captureBtn: { display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: 'oklch(0.38 0.14 260)', background: 'oklch(0.96 0.025 260)', border: '1px solid oklch(0.86 0.06 260)', borderRadius: 7, padding: '5px 12px', cursor: 'pointer', fontFamily: 'var(--font-ui)', transition: 'all 0.15s' },
  captureBtnDone: { color: 'oklch(0.35 0.12 160)', background: 'oklch(0.93 0.07 160)', borderColor: 'oklch(0.82 0.08 160)', cursor: 'default' },

  // blank tab state
  blankPage: { height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, textAlign: 'center' },
  blankIcon: { width: 56, height: 56, borderRadius: 14, background: '#fff', border: '1px solid oklch(0.9 0.006 80)', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  blankTitle: { fontSize: 16, fontWeight: 600, color: 'oklch(0.35 0.01 80)', fontFamily: 'var(--font-mono)' },
  blankSub: { fontSize: 13, color: 'oklch(0.58 0.01 80)', fontFamily: 'var(--font-ui)', maxWidth: 320 },

  // ===== Settings modal =====
  modalOverlay: { position: 'absolute', inset: 0, background: 'oklch(0.15 0.02 80 / 0.5)', backdropFilter: 'blur(2px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: 24, animation: 'fadeIn 0.15s ease' },
  modalCard: { width: 460, maxWidth: '100%', maxHeight: '100%', background: '#fff', borderRadius: 14, boxShadow: '0 20px 60px oklch(0 0 0 / 0.28)', display: 'flex', flexDirection: 'column', overflow: 'hidden' },
  modalHeader: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '20px 22px 16px', borderBottom: '1px solid oklch(0.93 0.006 80)' },
  modalTitle: { fontSize: 19, fontWeight: 700, color: 'oklch(0.15 0.015 80)', fontFamily: 'var(--font-display)', letterSpacing: '-0.01em' },
  modalSub: { fontSize: 12, color: 'oklch(0.55 0.01 80)', fontFamily: 'var(--font-mono)', marginTop: 3 },
  modalClose: { width: 30, height: 30, borderRadius: 8, border: '1px solid oklch(0.91 0.008 80)', background: 'none', cursor: 'pointer', color: 'oklch(0.45 0.01 80)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  modalBody: { padding: '20px 22px 22px', display: 'flex', flexDirection: 'column', gap: 24, overflowY: 'auto' },
  settingBlock: { display: 'flex', flexDirection: 'column', gap: 4 },
  settingLabel: { fontSize: 13.5, fontWeight: 600, color: 'oklch(0.2 0.01 80)', fontFamily: 'var(--font-ui)' },
  settingDesc: { fontSize: 12, color: 'oklch(0.55 0.01 80)', fontFamily: 'var(--font-ui)', lineHeight: 1.5, marginBottom: 8 },
  segmented: { display: 'flex', gap: 4, background: 'oklch(0.96 0.005 80)', padding: 4, borderRadius: 9, border: '1px solid oklch(0.92 0.006 80)' },
  segOpt: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, padding: '8px 10px', borderRadius: 6, border: 'none', background: 'none', cursor: 'pointer', fontSize: 12.5, color: 'oklch(0.45 0.01 80)', fontFamily: 'var(--font-ui)', fontWeight: 500, transition: 'all 0.12s' },
  segOptActive: { background: '#fff', color: 'oklch(0.15 0.01 80)', fontWeight: 600, boxShadow: '0 1px 3px oklch(0 0 0 / 0.08)' },
  credList: { display: 'flex', flexDirection: 'column', gap: 6 },
  credItem: { display: 'flex', alignItems: 'center', gap: 11, padding: '10px 12px', border: '1px solid oklch(0.92 0.006 80)', borderRadius: 9, background: 'oklch(0.99 0.003 80)' },
  credFavicon: { width: 24, height: 24, borderRadius: 6, color: '#fff', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontFamily: 'var(--font-ui)' },
  credSite: { fontSize: 13, fontWeight: 600, color: 'oklch(0.2 0.01 80)', fontFamily: 'var(--font-ui)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  credDetail: { fontSize: 11.5, color: 'oklch(0.55 0.01 80)', fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  credKind: { fontSize: 10.5, fontWeight: 600, color: 'oklch(0.45 0.04 260)', background: 'oklch(0.95 0.02 260)', padding: '2px 8px', borderRadius: 5, fontFamily: 'var(--font-ui)', flexShrink: 0, whiteSpace: 'nowrap' },
  credDelete: { width: 28, height: 28, borderRadius: 7, border: 'none', background: 'none', cursor: 'pointer', color: 'oklch(0.55 0.06 25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  addCredBtn: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, padding: '10px', marginTop: 8, borderRadius: 9, border: '1.5px dashed oklch(0.85 0.02 260)', background: 'none', color: 'oklch(0.42 0.12 260)', cursor: 'pointer', fontSize: 12.5, fontWeight: 600, fontFamily: 'var(--font-ui)' },

  // ----- Source detail (tab full view) -----
  detailFull: { flex: 1, overflow: 'auto', background: '#fff', padding: '28px 36px', display: 'flex', flexDirection: 'column' },
  detailHeader: { display: 'flex', alignItems: 'flex-start', gap: 14, paddingBottom: 22, borderBottom: '1px solid oklch(0.93 0.008 80)', marginBottom: 22 },
  detailType: { fontSize: 11, fontWeight: 700, color: 'oklch(0.55 0.08 260)', letterSpacing: '0.08em', fontFamily: 'var(--font-ui)', marginBottom: 6 },
  detailTitle: { fontSize: 22, fontWeight: 700, color: 'oklch(0.13 0.015 80)', lineHeight: 1.25, marginBottom: 8, fontFamily: 'var(--font-display)', letterSpacing: '-0.01em' },
  detailMeta: { fontSize: 13, color: 'oklch(0.5 0.01 80)', fontFamily: 'var(--font-ui)' },
  detailGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 22 },
  detailCard: { background: 'oklch(0.985 0.005 80)', border: '1px solid oklch(0.92 0.008 80)', borderRadius: 8, padding: '14px 16px' },
  detailLabel: { fontSize: 10.5, fontWeight: 700, color: 'oklch(0.55 0.01 80)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8, fontFamily: 'var(--font-ui)' },
  statusChip: { fontSize: 12, padding: '3px 9px', borderRadius: 5, border: '1px solid oklch(0.88 0.01 80)', color: 'oklch(0.55 0.01 80)', cursor: 'pointer', fontFamily: 'var(--font-ui)' },
  statusChipActive: { background: 'oklch(0.55 0.12 170)', borderColor: 'oklch(0.55 0.12 170)', color: '#fff' },
  detailActions: { display: 'flex', gap: 10 },
  actionBtn: { padding: '9px 18px', borderRadius: 7, background: 'oklch(0.42 0.14 260)', color: '#fff', border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-ui)' },
  actionBtnSecondary: { background: 'none', border: '1px solid oklch(0.88 0.02 260)', color: 'oklch(0.42 0.14 260)' },

  // ----- PRIVATE -----
  privateRoot: { flex: 1, overflow: 'auto', padding: '20px 32px 28px', display: 'flex', flexDirection: 'column', gap: 16, background: '#fff' },
  privateBanner: { display: 'flex', alignItems: 'flex-start', gap: 14, background: 'oklch(0.96 0.02 30)', border: '1px solid oklch(0.88 0.06 30)', borderRadius: 10, padding: '16px 20px' },
  privateBannerIcon: { color: 'oklch(0.4 0.1 30)', flexShrink: 0, lineHeight: 1, marginTop: 2 },
  privateBannerTitle: { fontSize: 15, fontWeight: 700, color: 'oklch(0.28 0.08 30)', fontFamily: 'var(--font-ui)', marginBottom: 4 },
  privateBannerSub: { fontSize: 13, color: 'oklch(0.4 0.06 30)', fontFamily: 'var(--font-ui)', lineHeight: 1.5 },
  privateLegal: { display: 'flex', alignItems: 'flex-start', gap: 10, background: 'oklch(0.97 0.01 80)', border: '1px solid oklch(0.9 0.01 80)', borderRadius: 8, padding: '12px 16px', fontSize: 12.5, color: 'oklch(0.4 0.01 80)', fontFamily: 'var(--font-ui)', lineHeight: 1.6 },
  privateItems: { display: 'flex', flexDirection: 'column', gap: 10 },
  privateItem: { background: '#fff', border: '1px solid oklch(0.9 0.01 80)', borderRadius: 10, padding: '14px 18px', borderLeft: '3px solid oklch(0.55 0.14 20)' },
  privateItemHeader: { display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 9 },
  privateItemLock: { color: 'oklch(0.5 0.1 30)', flexShrink: 0, marginTop: 1 },
  privateItemTitle: { fontSize: 14, fontWeight: 600, color: 'oklch(0.2 0.01 80)', fontFamily: 'var(--font-ui)', lineHeight: 1.4, marginBottom: 3 },
  privateItemSource: { fontSize: 11.5, color: 'oklch(0.55 0.06 30)', fontFamily: 'var(--font-ui)' },
  privateItemStats: { display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'oklch(0.6 0.01 80)', fontFamily: 'var(--font-ui)', flexShrink: 0, whiteSpace: 'nowrap' },
  privateItemDot: { color: 'oklch(0.78 0.01 80)' },
  privateItemPreview: { fontSize: 13, color: 'oklch(0.35 0.02 80)', fontFamily: 'Georgia, serif', fontStyle: 'italic', lineHeight: 1.7, background: 'oklch(0.97 0.008 80)', borderRadius: 6, padding: '10px 14px', marginBottom: 10, borderLeft: '2px solid oklch(0.84 0.04 80)' },
  privateItemActions: { display: 'flex', gap: 8 },
  privateBtn: { fontSize: 12, fontWeight: 600, padding: '5px 12px', borderRadius: 6, border: '1px solid oklch(0.88 0.01 80)', background: 'none', color: 'oklch(0.45 0.01 80)', cursor: 'pointer', fontFamily: 'var(--font-ui)' },
  privateAddBtn: { display: 'flex', alignItems: 'center', gap: 8, padding: '12px 18px', borderRadius: 10, border: '1.5px dashed oklch(0.82 0.04 30)', background: 'none', cursor: 'pointer', fontSize: 13, color: 'oklch(0.5 0.08 30)', fontFamily: 'var(--font-ui)', width: '100%', justifyContent: 'center' },

  // ----- Status bar -----
  statusBar: {
    height: 26, display: 'flex', alignItems: 'center',
    padding: '0 14px', gap: 10,
    background: 'oklch(0.42 0.14 260)',
    color: 'oklch(0.99 0.005 260 / 0.85)',
    fontSize: 11, fontFamily: 'var(--font-ui)',
    flexShrink: 0,
  },
  statusItem: { display: 'flex', alignItems: 'center', gap: 5 },
  statusSep: { opacity: 0.5 },
};

Object.assign(window, { LibraryView });
