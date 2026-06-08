// FilesView — VS-Code-style file explorer for the Library section
// Lives inside the Library page; toggled via the Library/Files switch.

const FILE_CONTENTS = {
  'lumen-md-diamond': {
    label: 'LUMEN.md',
    icon: 'md',
    lines: [
      ['head',    '# LUMEN.md — Diamond OA Framing Paper'],
      ['blank',   ''],
      ['section', '## STATUS'],
      ['val',     '- Stage: Draft'],
      ['val',     '- Created: 2026-04-03'],
      ['val',     '- Updated: 2026-05-18'],
      ['blank',   ''],
      ['section', '## LINES OF INVESTIGATION'],
      ['val',     '- Political economy of open access'],
      ['val',     '- Sustainability of Diamond OA funding models'],
      ['blank',   ''],
      ['section', '## HYPOTHESES'],
      ['tag',     '- H1: Diamond OA models are financially sustainable'],
      ['active',  '  status: active'],
      ['tag',     '- H2: APCs perpetuate Global South exclusion'],
      ['active',  '  status: active'],
      ['blank',   ''],
      ['section', '## ACTIVE SOURCES'],
      ['ref',     '- Larivière et al. 2015   — relevance: high'],
      ['ref',     '- Plan S (cOAlition S)    — relevance: high'],
      ['ref',     '- Chen et al. 2025        — relevance: medium'],
      ['blank',   ''],
      ['section', '## PAPER INDEX'],
      ['val',     '- Introduction:   complete'],
      ['val',     '- Methodology:    in progress'],
      ['val',     '- Results:        pending'],
      ['val',     '- Discussion:     pending'],
      ['blank',   ''],
      ['section', '## ALERTS'],
      ['comment', '- 3 semantically related papers not yet linked'],
      ['comment', '- Results section lacks supporting sources'],
    ],
  },
  'sources-md': {
    label: 'SOURCES.md',
    icon: 'md',
    lines: [
      ['head',    '# SOURCES.md — Diamond OA Framing Paper'],
      ['blank',   ''],
      ['section', '## Larivière, V. et al. (2015)'],
      ['val',     'Title:   The oligopoly of academic publishers...'],
      ['val',     'DOI:     10.1371/journal.pone.0127502'],
      ['val',     'License: CC BY 4.0'],
      ['blank',   ''],
      ['comment', '> Core claim: 5 publishers control >50% of all'],
      ['comment', '  peer-reviewed scholarly output.'],
      ['blank',   ''],
      ['section', '## cOAlition S (2021)'],
      ['val',     'Title:   Plan S — Making full and immediate OA a reality'],
      ['val',     'URL:     coalition-s.org'],
      ['val',     'License: CC BY 4.0'],
      ['blank',   ''],
      ['comment', '> Defines the 10 principles of Plan S.'],
      ['comment', '  Relevant to the international policy section.'],
      ['blank',   ''],
      ['section', '## Chen, L. et al. (2025)'],
      ['val',     'Title:   Economic sustainability of Diamond OA journals'],
      ['val',     'arXiv:   2503.04821'],
      ['val',     'License: CC BY'],
      ['blank',   ''],
      ['comment', '> Proposes a consortium funding model.'],
      ['comment', '  Directly validates H1.'],
    ],
  },
  'concepts-md': {
    label: 'CONCEPTS.md',
    icon: 'md',
    lines: [
      ['head',    '# CONCEPTS.md — Diamond OA Framing Paper'],
      ['blank',   ''],
      ['section', '## Diamond Open Access'],
      ['val',     'No fee for authors, no fee for readers.'],
      ['val',     'Funded by consortia or scholarly societies.'],
      ['blank',   ''],
      ['section', '## Article Processing Charge (APC)'],
      ['val',     'Author-side fee charged by Gold OA publishers.'],
      ['comment', '- Linked to H2: Global South exclusion'],
      ['blank',   ''],
      ['section', '## Consortium Funding Model'],
      ['val',     'Institutions pool budgets to underwrite journals.'],
      ['ref',     '- See: Chen et al. 2025'],
    ],
  },
  'paper-tex': {
    label: 'main.tex',
    icon: 'tex',
    lines: [
      ['comment', '% Diamond OA Framing — main.tex'],
      ['comment', '% M. Vargas · 2026 · Lumen Research Assistant'],
      ['blank',   ''],
      ['tag',     '\\documentclass[12pt]{article}'],
      ['tag',     '\\usepackage{hyperref, biblatex, csquotes}'],
      ['tag',     '\\addbibresource{references.bib}'],
      ['blank',   ''],
      ['head',    '\\title{Diamond Open Access as Structural Reform:\\\\'],
      ['head',    '  Evidence from Consortium Funding Models}'],
      ['val',     '\\author{M. Vargas \\and A. Lechuga}'],
      ['val',     '\\date{\\today}'],
      ['blank',   ''],
      ['tag',     '\\begin{document}'],
      ['tag',     '\\maketitle'],
      ['blank',   ''],
      ['section', '\\section{Introduction}'],
      ['blank',   ''],
      ['val',     'The academic publishing landscape has been dominated'],
      ['val',     'by five commercial publishers for over two decades'],
      ['val',     '\\cite{lariviere2015}. Their combined market share'],
      ['val',     'exceeds 50\\% of all peer-reviewed output globally,'],
      ['val',     'with operating margins of 30--40\\%...'],
      ['blank',   ''],
      ['section', '\\section{Methodology}'],
      ['comment', '% TODO: bibliometric analysis pipeline'],
      ['comment', '% See citation_graph_analysis.py in library'],
      ['blank',   ''],
      ['tag',     '\\printbibliography'],
      ['tag',     '\\end{document}'],
    ],
  },
  'references-bib': {
    label: 'references.bib',
    icon: 'bib',
    lines: [
      ['comment', '% references.bib — Diamond OA Framing Paper'],
      ['blank',   ''],
      ['section', '@article{lariviere2015,'],
      ['val',     '  title   = {The oligopoly of academic publishers},'],
      ['val',     '  author  = {Larivière, V. and Haustein, S.},'],
      ['val',     '  journal = {PLOS ONE},'],
      ['val',     '  year    = {2015},'],
      ['tag',     '}'],
      ['blank',   ''],
      ['section', '@misc{coalitions2021,'],
      ['val',     '  title  = {Plan S: Making OA a reality},'],
      ['val',     '  author = {{cOAlition S}},'],
      ['val',     '  year   = {2021},'],
      ['tag',     '}'],
    ],
  },
  'line-md': {
    label: 'LINE.md',
    icon: 'md',
    lines: [
      ['head',    '# LINE.md — Line of Investigation'],
      ['blank',   ''],
      ['section', '## FOCUS'],
      ['val',     '- Political economy of open access'],
      ['blank',   ''],
      ['section', '## LINKED PAPERS'],
      ['ref',     '- paper-1 · Diamond OA Framework'],
    ],
  },
  'hypotheses-md': {
    label: 'HYPOTHESES.md',
    icon: 'md',
    lines: [
      ['head',    '# HYPOTHESES.md'],
      ['blank',   ''],
      ['tag',     '- H1: Diamond OA models are financially sustainable'],
      ['active',  '  status: active'],
      ['tag',     '- H2: APCs perpetuate Global South exclusion'],
      ['active',  '  status: active'],
    ],
  },
};

// Lumen-themed token palette (matches project oklch system, not the upload's branded colors)
const TOKEN_COLORS = {
  head:    { color: 'oklch(0.18 0.02 80)', weight: 600 },
  section: { color: 'oklch(0.42 0.14 260)', weight: 600 },
  val:     { color: 'oklch(0.35 0.02 80)', weight: 400 },
  tag:     { color: 'oklch(0.45 0.12 320)', weight: 500 },
  active:  { color: 'oklch(0.45 0.12 170)', weight: 500 },
  ref:     { color: 'oklch(0.45 0.12 220)', weight: 500 },
  comment: { color: 'oklch(0.6 0.01 80)',  weight: 400, italic: true },
  blank:   { color: 'oklch(0.6 0.01 80)',  weight: 400 },
};

// ── Nested file-tree model ────────────────────────────────────────────────
// folder: { name, type:'folder', children:[...] }
// file:   { name, type:'file', ext, content? }   content → key into FILE_CONTENTS
const paperScaffold = () => ([
  { name: 'LUMEN.md',   type: 'file', ext: 'md', content: 'lumen-md-diamond' },
  { name: 'SOURCES.md', type: 'file', ext: 'md', content: 'sources-md' },
  { name: 'CONCEPTS.md', type: 'file', ext: 'md', content: 'concepts-md' },
  { name: 'src', type: 'folder', children: [
    { name: 'main.tex', type: 'file', ext: 'tex', content: 'paper-tex' },
    { name: 'sections', type: 'folder', children: [] },
    { name: 'references.bib', type: 'file', ext: 'bib', content: 'references-bib' },
  ]},
  { name: 'assets',  type: 'folder', children: [] },
  { name: 'build',   type: 'folder', children: [] },
  { name: 'exports', type: 'folder', children: [
    { name: 'paper-v1.pdf',       type: 'file', ext: 'pdf' },
    { name: 'paper-v1-arxiv.zip', type: 'file', ext: 'zip' },
  ]},
  { name: 'PRIVATE', type: 'folder', children: [] },
]);

const akmLine = () => ([
  { name: 'LINE.md',       type: 'file', ext: 'md', content: 'line-md' },
  { name: 'HYPOTHESES.md', type: 'file', ext: 'md', content: 'hypotheses-md' },
]);

const TREE = {
  name: 'LumenWorkspace', type: 'folder', children: [
    { name: 'LIBRARY', type: 'folder', children: [
      { name: 'papers',   type: 'folder', children: [] },
      { name: 'web',      type: 'folder', children: [] },
      { name: 'notes',    type: 'folder', children: [] },
      { name: 'code',     type: 'folder', children: [] },
      { name: 'datasets', type: 'folder', children: [] },
      { name: 'library.db', type: 'file', ext: 'db' },
    ]},
    { name: 'AKM', type: 'folder', children: [
      { name: 'lines', type: 'folder', children: [
        { name: 'line-1', type: 'folder', children: akmLine() },
        { name: 'line-2', type: 'folder', children: akmLine() },
        { name: 'line-3', type: 'folder', children: akmLine() },
      ]},
      { name: 'akm.db', type: 'file', ext: 'db' },
    ]},
    { name: 'PAPERS', type: 'folder', children: [
      { name: 'paper-1', type: 'folder', children: paperScaffold() },
      { name: 'paper-2', type: 'folder', children: paperScaffold() },
      { name: 'paper-3', type: 'folder', children: paperScaffold() },
    ]},
  ],
};

// ── Icons ─────────────────────────────────────────────────────────────────
function Chevron({ open }) {
  return (
    <svg width={11} height={11} viewBox="0 0 16 16" fill="none"
      stroke="oklch(0.55 0.01 80)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
      style={{ transform: open ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.12s', flexShrink: 0 }}>
      <path d="M6 4l4 4-4 4" />
    </svg>
  );
}

function FolderGlyph({ open }) {
  const stroke = 'oklch(0.55 0.08 80)';
  const common = { width: 14, height: 14, viewBox: '0 0 16 16', fill: 'none', stroke, strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' };
  return open
    ? <svg {...common}><path d="M2 5a1 1 0 011-1h3l2 2h6a1 1 0 011 1v1H2V5z"/><path d="M2 7h13l-1.5 5a1 1 0 01-1 .8H3.5a1 1 0 01-1-.8L2 7z"/></svg>
    : <svg {...common}><path d="M2 5a1 1 0 011-1h3l2 2h6a1 1 0 011 1v6a1 1 0 01-1 1H3a1 1 0 01-1-1V5z"/></svg>;
}

function FileGlyph({ ext }) {
  const sw = 1.5;
  const common = { width: 13, height: 13, viewBox: '0 0 16 16', fill: 'none', strokeWidth: sw, strokeLinecap: 'round', strokeLinejoin: 'round' };
  switch (ext) {
    case 'md':
      return <svg {...common} stroke="oklch(0.45 0.12 260)"><path d="M3 3h10v10H3z"/><path d="M5 10V6l1.5 2L8 6v4M10.5 6v4M9 8.5l1.5 1.5L12 8.5"/></svg>;
    case 'tex':
      return <svg {...common} stroke="oklch(0.45 0.12 220)"><path d="M3 3h7l3 3v7a1 1 0 01-1 1H3a1 1 0 01-1-1V3a1 1 0 011-1z"/><path d="M10 3v3h3"/><path d="M5 9h4M7 9v3"/></svg>;
    case 'pdf':
      return <svg {...common} stroke="oklch(0.5 0.14 30)"><path d="M3 3h7l3 3v7a1 1 0 01-1 1H3a1 1 0 01-1-1V3a1 1 0 011-1z"/><path d="M10 3v3h3"/><path d="M5 11h1.2a.9.9 0 000-1.8H5V13"/></svg>;
    case 'db':
      return <svg {...common} stroke="oklch(0.5 0.1 150)"><ellipse cx="8" cy="4" rx="5" ry="2"/><path d="M3 4v8c0 1.1 2.24 2 5 2s5-.9 5-2V4"/><path d="M3 8c0 1.1 2.24 2 5 2s5-.9 5-2"/></svg>;
    case 'bib':
      return <svg {...common} stroke="oklch(0.5 0.1 70)"><path d="M3 3.5A1.5 1.5 0 014.5 2H13v11H4.5A1.5 1.5 0 003 14.5V3.5z"/><path d="M3 12.5A1.5 1.5 0 014.5 11H13"/></svg>;
    case 'zip':
      return <svg {...common} stroke="oklch(0.5 0.04 80)"><path d="M3 3h7l3 3v7a1 1 0 01-1 1H3a1 1 0 01-1-1V3a1 1 0 011-1z"/><path d="M10 3v3h3"/><path d="M6 3v1.5M6 5.5V7M6 8v1.5"/></svg>;
    default:
      return <svg {...common} stroke="oklch(0.55 0.01 80)"><path d="M3 3h7l3 3v7a1 1 0 01-1 1H3a1 1 0 01-1-1V3a1 1 0 011-1z"/><path d="M10 3v3h3"/></svg>;
  }
}

// ── Recursive tree row ────────────────────────────────────────────────────
function TreeRow({ node, path, depth, expanded, toggle, activePath, openFile }) {
  const isFolder = node.type === 'folder';
  const isOpen = expanded.has(path);
  const isActive = path === activePath;
  const indent = 8 + depth * 14;

  const onClick = () => {
    if (isFolder) toggle(path);
    else openFile(node, path);
  };

  return (
    <React.Fragment>
      <div
        className="fv-row"
        onClick={onClick}
        style={{
          ...fv.treeItem,
          paddingLeft: indent,
          ...(isActive ? { background: 'var(--accent-light)' } : {}),
          color: isActive ? 'oklch(0.18 0.015 80)' : (isFolder ? 'oklch(0.3 0.01 80)' : 'oklch(0.4 0.01 80)'),
          fontWeight: isFolder ? 500 : 400,
        }}
      >
        <span style={fv.chevronSlot}>{isFolder ? <Chevron open={isOpen} /> : null}</span>
        <span style={fv.treeItemIcon}>
          {isFolder ? <FolderGlyph open={isOpen} /> : <FileGlyph ext={node.ext} />}
        </span>
        <span style={fv.treeItemLabel}>{node.name}{isFolder ? '/' : ''}</span>
      </div>
      {isFolder && isOpen && node.children.map(child => (
        <TreeRow
          key={path + '/' + child.name}
          node={child}
          path={path + '/' + child.name}
          depth={depth + 1}
          expanded={expanded}
          toggle={toggle}
          activePath={activePath}
          openFile={openFile}
        />
      ))}
    </React.Fragment>
  );
}

function FilesView() {
  const ACTIVE_PATH = 'LumenWorkspace/PAPERS/paper-1/LUMEN.md';
  const [openTabs, setOpenTabs] = React.useState(['lumen-md-diamond', 'sources-md', 'paper-tex']);
  const [activeTab, setActiveTab] = React.useState('lumen-md-diamond');
  const [activePath, setActivePath] = React.useState(ACTIVE_PATH);
  const [expanded, setExpanded] = React.useState(() => new Set([
    'LumenWorkspace',
    'LumenWorkspace/PAPERS',
    'LumenWorkspace/PAPERS/paper-1',
  ]));

  const toggle = (path) => {
    setExpanded(prev => {
      const next = new Set(prev);
      next.has(path) ? next.delete(path) : next.add(path);
      return next;
    });
  };

  const openFile = (node, path) => {
    setActivePath(path);
    if (!node.content) return;
    setActiveTab(node.content);
    setOpenTabs(t => t.includes(node.content) ? t : [...t, node.content]);
  };

  const closeTab = (id, e) => {
    e.stopPropagation();
    setOpenTabs(t => {
      const next = t.filter(x => x !== id);
      if (activeTab === id) setActiveTab(next[next.length - 1] || '');
      return next;
    });
  };

  const file = FILE_CONTENTS[activeTab];

  return (
    <div style={fv.root}>
      <style>{FV_CSS}</style>

      {/* === LEFT: EXPLORER === */}
      <aside style={fv.tree}>
        <div style={fv.treeHeader}>
          <span>Explorer</span>
          <div style={fv.treeActions}>
            <button className="fv-action" data-tip="New file" aria-label="New file">
              <svg width={14} height={14} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 2H4a1 1 0 00-1 1v10a1 1 0 001 1h8a1 1 0 001-1V6"/><path d="M9 2v4h4M11 11h-3M9.5 9.5v3"/></svg>
            </button>
            <button className="fv-action" data-tip="New folder" aria-label="New folder">
              <svg width={14} height={14} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 5a1 1 0 011-1h3l2 2h6a1 1 0 011 1v6a1 1 0 01-1 1H3a1 1 0 01-1-1V5z"/><path d="M10.5 8.5v3M9 10h3"/></svg>
            </button>
            <button className="fv-action" data-tip="Refresh" aria-label="Refresh">
              <svg width={14} height={14} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 8a6 6 0 0110-4.5"/><path d="M12 2v3h-3"/><path d="M14 8a6 6 0 01-10 4.5"/><path d="M4 14v-3h3"/></svg>
            </button>
          </div>
        </div>

        <div style={fv.treeBody}>
          <TreeRow
            node={TREE}
            path={TREE.name}
            depth={0}
            expanded={expanded}
            toggle={toggle}
            activePath={activePath}
            openFile={openFile}
          />
        </div>
      </aside>

      {/* === RIGHT: TABS + CONTENT === */}
      <section style={fv.editor}>
        <div style={fv.tabsBar}>
          {openTabs.map(id => {
            const f = FILE_CONTENTS[id];
            if (!f) return null;
            const isActive = id === activeTab;
            return (
              <div
                key={id}
                onClick={() => setActiveTab(id)}
                style={{ ...fv.tab, ...(isActive ? fv.tabActive : {}) }}
              >
                <span style={fv.tabIcon}><FileGlyph ext={f.icon} /></span>
                <span>{f.label}</span>
                <button onClick={(e) => closeTab(id, e)} style={fv.tabClose}>×</button>
              </div>
            );
          })}
          <button style={fv.tabAdd} title="Open file">
            <svg width={12} height={12} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M8 3v10M3 8h10"/></svg>
          </button>
        </div>

        <div style={fv.editorBody}>
          {file ? (
            <pre style={fv.code}>
              {file.lines.map((ln, i) => {
                const [tok, text] = ln;
                const c = TOKEN_COLORS[tok] || TOKEN_COLORS.val;
                return (
                  <div key={i} style={fv.codeLine}>
                    <span style={fv.lineNum}>{i + 1}</span>
                    <span style={{
                      color: c.color,
                      fontWeight: c.weight,
                      fontStyle: c.italic ? 'italic' : 'normal',
                      whiteSpace: 'pre',
                    }}>{text || ' '}</span>
                  </div>
                );
              })}
            </pre>
          ) : (
            <div style={fv.empty}>Select a file from the explorer</div>
          )}
        </div>

        {/* mini status bar under the editor */}
        <div style={fv.editorStatus}>
          <span>{file ? file.label : '—'}</span>
          <span style={fv.statusDot}>·</span>
          <span>{file ? `${file.lines.length} lines` : ''}</span>
          <span style={{ marginLeft: 'auto' }}>UTF-8</span>
          <span style={fv.statusDot}>·</span>
          <span>LF</span>
          <span style={fv.statusDot}>·</span>
          <span>{file?.icon === 'tex' ? 'LaTeX' : file?.icon === 'md' ? 'Markdown' : 'Plain text'}</span>
        </div>
      </section>
    </div>
  );
}

const FV_CSS = `
  .fv-action {
    width: 26px; height: 26px;
    border: none; background: none;
    color: oklch(0.5 0.01 80);
    border-radius: 5px; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    position: relative;
    transition: background 0.12s, color 0.12s;
  }
  .fv-action:hover { background: oklch(0.92 0.01 80); color: oklch(0.28 0.01 80); opacity: 1; }
  .fv-action::after {
    content: attr(data-tip);
    position: absolute; top: calc(100% + 7px); left: 50%; transform: translateX(-50%);
    background: oklch(0.24 0.01 80); color: #fff;
    font-family: var(--font-ui); font-size: 10.5px; font-weight: 500;
    padding: 3px 8px; border-radius: 5px; white-space: nowrap;
    opacity: 0; pointer-events: none; transition: opacity 0.12s 0.04s;
    box-shadow: 0 4px 12px oklch(0 0 0 / 0.18); z-index: 80;
  }
  .fv-action:hover::after { opacity: 1; }
  .fv-row { transition: background 0.08s; }
  .fv-row:hover { background: oklch(0.945 0.006 80); }
`;

const fv = {
  root: { display: 'flex', flex: 1, minHeight: 0, overflow: 'hidden', background: '#fff' },
  tree: {
    width: 240,
    flexShrink: 0,
    borderRight: '1px solid oklch(0.92 0.008 80)',
    background: 'oklch(0.975 0.005 80)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  treeHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '8px 10px 8px 14px',
    fontSize: 10.5,
    fontWeight: 700,
    color: 'oklch(0.5 0.01 80)',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    fontFamily: 'var(--font-ui)',
    borderBottom: '1px solid oklch(0.93 0.008 80)',
  },
  treeActions: { display: 'flex', gap: 2 },
  treeBody: { flex: 1, overflowY: 'auto', padding: '6px 0' },
  treeItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 5,
    paddingTop: 4,
    paddingBottom: 4,
    paddingRight: 10,
    fontSize: 12.5,
    fontFamily: 'var(--font-mono)',
    cursor: 'pointer',
    userSelect: 'none',
  },
  chevronSlot: { width: 12, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  treeItemIcon: { display: 'inline-flex', flexShrink: 0 },
  treeItemLabel: { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },

  editor: { flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' },
  tabsBar: {
    display: 'flex',
    alignItems: 'stretch',
    background: 'oklch(0.97 0.006 80)',
    borderBottom: '1px solid oklch(0.92 0.008 80)',
    minHeight: 34,
    overflowX: 'auto',
    flexShrink: 0,
  },
  tab: {
    display: 'flex',
    alignItems: 'center',
    gap: 7,
    padding: '0 12px',
    height: 34,
    borderRight: '1px solid oklch(0.93 0.008 80)',
    fontSize: 12,
    color: 'oklch(0.5 0.01 80)',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    fontFamily: 'var(--font-ui)',
    background: 'oklch(0.97 0.006 80)',
    flexShrink: 0,
  },
  tabActive: {
    background: '#fff',
    color: 'oklch(0.13 0.015 80)',
    borderBottom: '2px solid var(--accent)',
    marginBottom: -1,
  },
  tabIcon: { display: 'inline-flex' },
  tabClose: {
    width: 16, height: 16,
    border: 'none', background: 'none',
    color: 'oklch(0.55 0.01 80)',
    borderRadius: 3,
    fontSize: 13,
    cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    marginLeft: 2,
  },
  tabAdd: {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    border: 'none', background: 'none',
    color: 'oklch(0.55 0.01 80)',
    padding: '0 12px',
    cursor: 'pointer',
  },

  editorBody: { flex: 1, overflow: 'auto', background: '#fff', padding: '18px 0' },
  code: {
    margin: 0,
    fontFamily: 'var(--font-mono)',
    fontSize: 12.5,
    lineHeight: 1.85,
  },
  codeLine: { display: 'flex', gap: 0, paddingLeft: 4, paddingRight: 28 },
  lineNum: {
    display: 'inline-block',
    width: 42,
    textAlign: 'right',
    paddingRight: 18,
    color: 'oklch(0.72 0.01 80)',
    userSelect: 'none',
    flexShrink: 0,
    fontFamily: 'var(--font-mono)',
    fontSize: 11.5,
  },
  empty: { padding: 40, color: 'oklch(0.6 0.01 80)', fontFamily: 'var(--font-ui)' },

  editorStatus: {
    height: 26,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '0 14px',
    background: 'var(--accent)',
    color: 'oklch(0.99 0.005 260 / 0.85)',
    fontSize: 11,
    fontFamily: 'var(--font-mono)',
    flexShrink: 0,
  },
  statusDot: { opacity: 0.5 },
};

Object.assign(window, { FilesView });
