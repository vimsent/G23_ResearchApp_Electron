// PaperWorkspace — wrapper that provides per-paper Research Assistant
// Each paper has its own independent state (view, status, tabs, expanded files)

// Per-paper data overrides (extends PAPER_DATA defaults)
const PAPER_OVERRIDES = {
  'paper-1': {
    title: 'Diamond OA Framework',
    fullTitle: 'Open Knowledge Infrastructure: A Framework for Diamond Open Access',
    workspacePath: '~/Documents/LumenWorkspace / papers / diamond-oa-framework',
    status: 'Draft',
  },
  'paper-2': {
    title: 'Peer Review Economics',
    fullTitle: 'Peer review labour and its economic invisibility in academic publishing',
    workspacePath: '~/Documents/LumenWorkspace / papers / peer-review-economics',
    status: 'Revising',
  },
};

function PaperWorkspace({ papers, activePaperId }) {
  const meta = papers.find(p => p.id === activePaperId) || papers[0];
  const overrides = PAPER_OVERRIDES[activePaperId] || {};
  const paper = React.useMemo(() => ({
    ...PAPER_DATA,
    ...overrides,
  }), [activePaperId]);

  // Per-paper persisted state
  const stateKey = `lumen_paper_${activePaperId}`;
  const saved = (() => { try { return JSON.parse(localStorage.getItem(stateKey) || '{}'); } catch { return {}; } })();

  const [view, setView] = React.useState(saved.view || 'Write');
  const [status, setStatus] = React.useState(saved.status || paper.status);

  React.useEffect(() => {
    setStatus(paper.status);
  }, [activePaperId]);

  React.useEffect(() => {
    localStorage.setItem(stateKey, JSON.stringify({ view, status }));
  }, [view, status, stateKey]);

  return (
    <div key={activePaperId} style={{ display: 'flex', flexDirection: 'column', flex: 1, height: '100%', overflow: 'hidden', background: 'var(--surface)' }}>
      <Topbar
        view={view}
        setView={setView}
        status={status}
        setStatus={setStatus}
        workspacePath={paper.workspacePath}
      />
      <div style={{ display: 'flex', flex: 1, minHeight: 0, overflow: 'hidden' }}>
        <VerticalToolbar />
        {view === 'Write'
          ? <WriteView paper={paper} />
          : <ResearchView paper={paper} />
        }
      </div>
    </div>
  );
}

Object.assign(window, { PaperWorkspace, PAPER_OVERRIDES });
