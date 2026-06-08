// NotesView.jsx — AKM Notes page · 3-column VS Code layout
// Sidebar 1 (sections) · Sidebar 2 (note list) · Editor (tabs + body)

// small class glyphs
function ClassIcon({ kind, hue = 260 }) {
  const s = { width: 14, height: 14, viewBox: '0 0 16 16', fill: 'none', stroke: `oklch(0.55 0.13 ${hue})`, strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' };
  switch (kind) {
    case 'algo':    return <svg {...s}><path d="M3 5h4M3 8h7M3 11h5" /><circle cx="12" cy="5" r="1.4" /><circle cx="13" cy="11" r="1.4" /></svg>;
    case 'star':    return <svg {...s}><path d="M8 2.5l1.6 3.4 3.7.5-2.7 2.6.7 3.7L8 11l-3.3 1.7.7-3.7L2.7 6.4l3.7-.5z" /></svg>;
    case 'protein': return <svg {...s}><path d="M5 3c0 2.5 6 2.5 6 5s-6 2.5-6 5" /><path d="M11 3c0 2.5-6 2.5-6 5s6 2.5 6 5" /></svg>;
    case 'leaf':    return <svg {...s}><path d="M3 13c0-6 5-10 10-10 0 6-4 10-10 10z" /><path d="M3 13C6 10 8 8 10 6" /></svg>;
    default:        return <svg {...s}><circle cx="8" cy="8" r="5" /></svg>;
  }
}
function SmallGlyph({ d, hue = 80, chroma = 0.01 }) {
  return <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke={`oklch(0.5 ${chroma} ${hue})`} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">{d}</svg>;
}
const GLYPHS = {
  folder: <path d="M2 5a1 1 0 011-1h3l2 2h6a1 1 0 011 1v6a1 1 0 01-1 1H3a1 1 0 01-1-1V5z" />,
  paper:  <g><path d="M4 2h6l3 3v9a.7.7 0 01-.7.7H4a.7.7 0 01-.7-.7V2.7A.7.7 0 014 2z" /><path d="M10 2v3h3" /><path d="M5.5 8.5h5M5.5 11h3" /></g>,
  web:    <g><circle cx="8" cy="8" r="6" /><path d="M2 8h12M8 2c2 2 2 10 0 12M8 2c-2 2-2 10 0 12" /></g>,
  note:   <g><path d="M4 2.5h8a.5.5 0 01.5.5v10a.5.5 0 01-.5.5H4a.5.5 0 01-.5-.5V3a.5.5 0 01.5-.5z" /><path d="M5.5 6h5M5.5 8.5h5M5.5 11h3" /></g>,
};

function NotesView() {
  // persisted UI state
  const saved = (() => { try { return JSON.parse(localStorage.getItem('lumen_notes') || '{}'); } catch { return {}; } })();
  const [activeItem, setActiveItem] = React.useState(saved.activeItem || 'obj:algoritmos');
  const [openTabs, setOpenTabs] = React.useState(saved.openTabs || ['algo-merge', 'star-betelgeuse']);
  const [activeTab, setActiveTab] = React.useState(saved.activeTab || 'algo-merge');
  const [graphOpen, setGraphOpen] = React.useState(false);
  const [folders, setFolders] = React.useState(['metodologia', 'ideas']);

  React.useEffect(() => {
    localStorage.setItem('lumen_notes', JSON.stringify({ activeItem, openTabs, activeTab }));
  }, [activeItem, openTabs, activeTab]);

  const openNote = (id) => {
    if (!id) return;
    setOpenTabs(t => t.includes(id) ? t : [...t, id]);
    setActiveTab(id);
  };
  const openByTitle = (title) => {
    const id = window.TITLE_TO_ID[title.toLowerCase()];
    if (id) openNote(id);
  };
  const closeTab = (id, e) => {
    e.stopPropagation();
    setOpenTabs(t => {
      const next = t.filter(x => x !== id);
      if (activeTab === id) setActiveTab(next[next.length - 1] || '');
      return next;
    });
  };

  const note = window.NOTE_INDEX[activeTab];

  return (
    <div style={nv.root}>
      <style>{NV_CSS}</style>

      {/* ── Sidebar 1 — sections ── */}
      <aside style={nv.s1}>
        <div style={nv.s1Head}>
          <span style={nv.s1Title}>Notes</span>
          <button className="nv-plus" title="Nueva nota / clase">
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M8 3v10M3 8h10" /></svg>
          </button>
        </div>

        <div style={nv.s1Body}>
          {/* OBJECT NOTES */}
          <div style={nv.s1SecHead}>Object notes</div>
          {Object.entries(window.NOTE_CLASSES).map(([id, cls]) => (
            <SectionRow key={id} active={activeItem === `obj:${id}`} onClick={() => setActiveItem(`obj:${id}`)}
              icon={<ClassIcon kind={cls.icon} hue={cls.hue} />} label={cls.label} count={window.OBJECT_NOTES[id].length} />
          ))}

          {/* FREE NOTES */}
          <div style={{ ...nv.s1SecHead, marginTop: 14 }}>Free notes</div>
          {folders.map(fid => (
            <SectionRow key={fid} active={activeItem === `free:${fid}`} onClick={() => setActiveItem(`free:${fid}`)}
              icon={<SmallGlyph d={GLYPHS.folder} hue={85} chroma={0.06} />} label={window.FREE_FOLDERS[fid].label} count={window.FREE_FOLDERS[fid].notes.length} />
          ))}
          <button className="nv-newfolder" onClick={() => {}}>
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M8 4v8M4 8h8" /></svg>
            New folder
          </button>

          {/* LIBRARY */}
          <div style={{ ...nv.s1SecHead, marginTop: 14 }}>Library</div>
          <SectionRow active={activeItem === 'lib:papers'} onClick={() => setActiveItem('lib:papers')}
            icon={<SmallGlyph d={GLYPHS.paper} hue={30} chroma={0.1} />} label="Papers" count={countLib('papers')} />
          <SectionRow active={activeItem === 'lib:web'} onClick={() => setActiveItem('lib:web')}
            icon={<SmallGlyph d={GLYPHS.web} hue={220} chroma={0.1} />} label="Web" count={countLib('web')} />
          <SectionRow active={activeItem === 'lib:notes'} onClick={() => setActiveItem('lib:notes')}
            icon={<SmallGlyph d={GLYPHS.note} hue={170} chroma={0.08} />} label="Notes" count={countLib('notes')} />
        </div>

        {/* graph minimap */}
        <button style={nv.miniWrap} className="nv-mini" onClick={() => setGraphOpen(true)} title="Expandir grafo">
          <div style={nv.miniCanvas}>
            <ConceptGraph width={156} height={84} />
          </div>
          <div style={nv.miniLabel}>
            <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="4" cy="4" r="2" /><circle cx="12" cy="6" r="2" /><circle cx="7" cy="12" r="2" /><path d="M5.5 5l5 0.5M5.5 5.5L6.5 10" /></svg>
            Graph view
            <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" style={{ marginLeft: 'auto' }}><path d="M6 3h7v7M13 3L7 9M9 6H4a1 1 0 00-1 1v6a1 1 0 001 1h6a1 1 0 001-1V9" /></svg>
          </div>
        </button>
      </aside>

      {/* ── Sidebar 2 — note list ── */}
      <aside style={nv.s2}>
        <NoteList activeItem={activeItem} folders={folders} activeTab={activeTab} openNote={openNote} />
      </aside>

      {/* ── Editor ── */}
      <section style={nv.editor}>
        <div style={nv.tabsBar}>
          {openTabs.map(id => {
            const n = window.NOTE_INDEX[id];
            if (!n) return null;
            const isActive = id === activeTab;
            const hue = n.kind === 'object' ? window.NOTE_CLASSES[n.classId].hue : (n.kind === 'free' ? 305 : 235);
            return (
              <div key={id} onClick={() => setActiveTab(id)} style={{ ...nv.tab, ...(isActive ? nv.tabActive : {}) }}>
                <span style={{ ...nv.tabDot, background: `oklch(0.6 0.13 ${hue})` }} />
                <span style={nv.tabLabel}>{n.title}</span>
                <button onClick={(e) => closeTab(id, e)} style={nv.tabClose} className="nv-tabclose">×</button>
              </div>
            );
          })}
        </div>

        <div style={nv.editorBody}>
          {note ? <NoteEditor note={note} onOpenLink={openByTitle} /> : (
            <div style={nv.emptyEditor}>
              <div style={nv.emptyIcon}>
                <svg width="34" height="34" viewBox="0 0 16 16" fill="none" stroke="oklch(0.78 0.01 80)" strokeWidth="1.2"><path d="M4 2.5h8a.5.5 0 01.5.5v10a.5.5 0 01-.5.5H4a.5.5 0 01-.5-.5V3a.5.5 0 01.5-.5z" /><path d="M5.5 6h5M5.5 8.5h5M5.5 11h3" /></svg>
              </div>
              <div>Selecciona una nota de la lista</div>
            </div>
          )}
        </div>
      </section>

      {/* ── Graph overlay ── */}
      {graphOpen && <GraphOverlay onClose={() => setGraphOpen(false)} />}
    </div>
  );
}

function countLib(sec) {
  return window.LIBRARY[sec].groups.reduce((a, g) => a + g.notes.length, 0);
}

function SectionRow({ active, onClick, icon, label, count }) {
  return (
    <div className="nv-srow" onClick={onClick} style={{ ...nv.srow, ...(active ? nv.srowActive : {}) }}>
      <span style={nv.srowIcon}>{icon}</span>
      <span style={nv.srowLabel}>{label}</span>
      <span style={{ ...nv.srowCount, ...(active ? nv.srowCountActive : {}) }}>{count}</span>
    </div>
  );
}

// ── Sidebar 2 — list variants ──────────────────────────────────────────────
function NoteList({ activeItem, folders, activeTab, openNote }) {
  const [kind, key] = activeItem.split(':');

  if (kind === 'obj') {
    const cls = window.NOTE_CLASSES[key];
    const notes = window.OBJECT_NOTES[key];
    return (
      <>
        <ListHeader title={cls.label} sub={`${notes.length} notes`} accent={`oklch(0.55 0.13 ${cls.hue})`} />
        <div style={nv.listBody}>
          {notes.map(n => (
            <div key={n.id} className="nv-listrow" onClick={() => openNote(n.id)}
              style={{ ...nv.listRow, ...(activeTab === n.id ? nv.listRowActive : {}) }}>
              <div style={nv.listTitle}>{n.title}</div>
              <div style={nv.listFields}>
                {cls.keyFields.map((f, idx) => (
                  <React.Fragment key={f}>
                    {idx > 0 && <span style={nv.fieldSep}>·</span>}
                    <span style={nv.fieldVal}>{String(n.fields[f])}</span>
                  </React.Fragment>
                ))}
              </div>
            </div>
          ))}
        </div>
      </>
    );
  }

  if (kind === 'free') {
    const folder = window.FREE_FOLDERS[key];
    return (
      <>
        <ListHeader title={folder.label} sub={`${folder.notes.length} notes`} accent="oklch(0.55 0.13 305)" />
        <div style={nv.listBody}>
          {folder.notes.map(n => (
            <div key={n.id} className="nv-listrow" onClick={() => openNote(n.id)}
              style={{ ...nv.listRow, ...(activeTab === n.id ? nv.listRowActive : {}) }}>
              <div style={nv.listTitle}>{n.title}</div>
              <div style={nv.listDate}>{n.date}</div>
            </div>
          ))}
        </div>
      </>
    );
  }

  // library — grouped by source
  const sec = window.LIBRARY[key];
  return (
    <>
      <ListHeader title={sec.label} sub={`${countLib(key)} notes`} accent="oklch(0.5 0.1 235)" />
      <div style={nv.listBody}>
        {sec.groups.map((g, gi) => (
          <div key={gi} style={nv.srcGroup}>
            <div style={nv.srcHead}>
              <div style={nv.srcTitle}>{g.source}</div>
              <div style={nv.srcMeta}>{g.meta}</div>
            </div>
            {g.notes.map(n => (
              <div key={n.id} className="nv-listrow" onClick={() => openNote(n.id)}
                style={{ ...nv.libRow, ...(activeTab === n.id ? nv.listRowActive : {}) }}>
                <span style={nv.libTick} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={nv.listTitle}>{n.title}</div>
                  <div style={nv.listDate}>{n.date}</div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}

function ListHeader({ title, sub, accent }) {
  return (
    <div style={nv.listHead}>
      <span style={{ ...nv.listHeadDot, background: accent }} />
      <span style={nv.listHeadTitle}>{title}</span>
      <span style={nv.listHeadSub}>· {sub}</span>
    </div>
  );
}

// ── Editor body ────────────────────────────────────────────────────────────
function NoteEditor({ note, onOpenLink }) {
  if (note.kind === 'object') {
    const cls = window.NOTE_CLASSES[note.classId];
    return (
      <div style={nv.doc}>
        <div style={nv.docTitle}>{note.title}</div>
        <div style={nv.docMeta}>
          <span style={nv.docTypeTag}>
            <ClassIcon kind={cls.icon} hue={cls.hue} />
            {cls.label}
          </span>
          <span style={nv.docMetaDate}>Actualizado {note.date}</span>
        </div>

        {/* structured fields — visual frontmatter */}
        <div style={nv.fields}>
          {cls.fields.filter(f => f !== 'Nombre').map((f, i) => {
            const isBool = cls.boolFields.includes(f);
            const val = note.fields[f];
            return (
              <div key={f} style={{ ...nv.fieldRow, borderBottom: i === cls.fields.length - 2 ? 'none' : '1px solid oklch(0.95 0.005 80)' }}>
                <div style={nv.fieldKey}>{f}</div>
                <div style={nv.fieldValue}>
                  {isBool ? (
                    <span style={{ ...nv.boolPill, ...(val ? nv.boolYes : nv.boolNo) }}>
                      <span style={{ ...nv.boolDot, background: val ? 'oklch(0.6 0.13 145)' : 'oklch(0.6 0.02 80)' }} />
                      {val ? 'Sí' : 'No'}
                    </span>
                  ) : (f === 'Complejidad temporal' || f === 'Complejidad espacial' || f === 'Peso molecular' || f === 'Tipo espectral' || f === 'Masa (M☉)' || f === 'Distancia (ly)') ? (
                    <span style={nv.fieldMono}>{val}</span>
                  ) : (
                    <span>{val}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div style={nv.fieldDivider}>
          <span style={nv.fieldDividerLabel}>Body</span>
        </div>

        <MarkdownDoc text={note.body} onOpenLink={onOpenLink} />
      </div>
    );
  }

  // free / library — pure markdown
  return (
    <div style={nv.doc}>
      <div style={nv.docMetaPlain}>
        <span style={nv.docKindPlain}>
          {note.kind === 'free' ? `Free note · ${window.FREE_FOLDERS[note.folderId].label}` : `Library · ${note.source}`}
        </span>
        <span style={nv.docMetaDate}>{note.date}</span>
      </div>
      <MarkdownDoc text={note.body} onOpenLink={onOpenLink} />
    </div>
  );
}

// ── Graph fullscreen overlay ───────────────────────────────────────────────
function GraphOverlay({ onClose }) {
  const wrapRef = React.useRef(null);
  const [dims, setDims] = React.useState({ w: 900, h: 560 });
  React.useEffect(() => {
    const upd = () => { if (wrapRef.current) setDims({ w: wrapRef.current.offsetWidth, h: wrapRef.current.offsetHeight }); };
    upd(); window.addEventListener('resize', upd);
    return () => window.removeEventListener('resize', upd);
  }, []);
  return (
    <div style={nv.overlay} onClick={onClose}>
      <div style={nv.overlayCard} onClick={e => e.stopPropagation()}>
        <div style={nv.overlayHead}>
          <div>
            <div style={nv.overlayTitle}>Concept graph</div>
            <div style={nv.overlaySub}>16 notes · 15 links · colored by note class</div>
          </div>
          <div style={nv.overlayLegend}>
            {[['Algoritmos', 260], ['Estrellas', 70], ['Proteínas', 170], ['Vegetación', 145], ['Library', 235], ['Free', 305]].map(([l, h]) => (
              <span key={l} style={nv.legChip}><span style={{ ...nv.legDot, background: `oklch(0.6 0.13 ${h})` }} />{l}</span>
            ))}
          </div>
          <button style={nv.overlayClose} className="nv-plus" onClick={onClose}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M4 4l8 8M12 4l-8 8" /></svg>
          </button>
        </div>
        <div ref={wrapRef} style={nv.overlayCanvas}>
          <ConceptGraph width={dims.w} height={dims.h} large />
        </div>
      </div>
    </div>
  );
}

const NV_CSS = `
  .nv-srow:hover { background: oklch(0.95 0.006 80) !important; }
  .nv-listrow:hover { background: oklch(0.975 0.006 80); }
  .nv-plus { width: 24px; height: 24px; border: 1px solid oklch(0.9 0.008 80); background: #fff; color: oklch(0.45 0.01 80); border-radius: 6px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.12s; }
  .nv-plus:hover { background: var(--accent-light); color: var(--accent); border-color: oklch(0.85 0.04 var(--accent-hue,260)); opacity: 1; }
  .nv-newfolder { display: flex; align-items: center; gap: 6px; width: calc(100% - 16px); margin: 6px 8px 2px; padding: 6px 8px; border: 1px dashed oklch(0.85 0.01 80); background: none; color: oklch(0.5 0.01 80); border-radius: 6px; font-size: 11.5px; font-family: var(--font-ui); cursor: pointer; transition: all 0.12s; }
  .nv-newfolder:hover { border-color: oklch(0.78 0.04 var(--accent-hue,260)); color: var(--accent); opacity: 1; }
  .nv-mini { transition: all 0.14s; }
  .nv-mini:hover { opacity: 1; }
  .nv-mini:hover > div:first-child { border-color: oklch(0.8 0.04 var(--accent-hue,260)); }
  .nv-wikipill:hover { background: var(--accent) !important; color: #fff !important; border-color: var(--accent) !important; }
  .nv-tabclose { opacity: 0; }
  .nv-tab:hover .nv-tabclose { opacity: 1; }
  .nv-listrow { transition: background 0.1s; }
`;

const nv = {
  root: { display: 'flex', flex: 1, minHeight: 0, overflow: 'hidden', background: '#fff', border: '1px solid oklch(0.91 0.008 80)', borderRadius: 12, margin: '20px 32px 28px' },

  // Sidebar 1
  s1: { width: 184, minWidth: 184, flexShrink: 0, borderRight: '1px solid oklch(0.93 0.008 80)', background: 'oklch(0.982 0.005 80)', display: 'flex', flexDirection: 'column', overflow: 'hidden' },
  s1Head: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 12px 11px 16px', borderBottom: '1px solid oklch(0.93 0.008 80)', flexShrink: 0 },
  s1Title: { fontSize: 11, fontWeight: 700, color: 'oklch(0.35 0.01 80)', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'var(--font-ui)' },
  s1Body: { flex: 1, overflowY: 'auto', padding: '10px 0 8px' },
  s1SecHead: { fontSize: 9.5, fontWeight: 700, color: 'oklch(0.62 0.01 80)', textTransform: 'uppercase', letterSpacing: '0.09em', padding: '4px 16px 6px', fontFamily: 'var(--font-ui)' },
  srow: { display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px 6px 16px', cursor: 'pointer', borderLeft: '2px solid transparent', transition: 'background 0.1s' },
  srowActive: { background: 'oklch(0.965 0.014 var(--accent-hue,260))', borderLeftColor: 'var(--accent)' },
  srowIcon: { display: 'inline-flex', flexShrink: 0, width: 16, justifyContent: 'center' },
  srowLabel: { fontSize: 12.5, color: 'oklch(0.25 0.01 80)', fontFamily: 'var(--font-ui)', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  srowCount: { fontSize: 10.5, color: 'oklch(0.62 0.01 80)', fontFamily: 'var(--font-mono)', background: 'oklch(0.94 0.006 80)', borderRadius: 9, padding: '1px 6px', minWidth: 18, textAlign: 'center' },
  srowCountActive: { background: 'oklch(0.92 0.03 var(--accent-hue,260))', color: 'var(--accent)' },

  // minimap
  miniWrap: { margin: '8px 10px 12px', padding: 7, background: '#fff', border: '1px solid oklch(0.91 0.008 80)', borderRadius: 10, cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0, fontFamily: 'var(--font-ui)' },
  miniCanvas: { background: 'oklch(0.99 0.004 80)', border: '1px solid oklch(0.94 0.006 80)', borderRadius: 7, overflow: 'hidden', height: 84, transition: 'border-color 0.14s' },
  miniLabel: { display: 'flex', alignItems: 'center', gap: 5, fontSize: 10.5, fontWeight: 600, color: 'oklch(0.45 0.01 80)', padding: '0 2px 1px' },

  // Sidebar 2
  s2: { width: 246, minWidth: 246, flexShrink: 0, borderRight: '1px solid oklch(0.93 0.008 80)', background: 'oklch(0.991 0.003 80)', display: 'flex', flexDirection: 'column', overflow: 'hidden' },
  listHead: { display: 'flex', alignItems: 'center', gap: 7, padding: '13px 16px 12px', borderBottom: '1px solid oklch(0.93 0.008 80)', flexShrink: 0 },
  listHeadDot: { width: 8, height: 8, borderRadius: '50%', flexShrink: 0 },
  listHeadTitle: { fontSize: 13, fontWeight: 700, color: 'oklch(0.18 0.015 80)', fontFamily: 'var(--font-ui)' },
  listHeadSub: { fontSize: 11.5, color: 'oklch(0.58 0.01 80)', fontFamily: 'var(--font-ui)' },
  listBody: { flex: 1, overflowY: 'auto', padding: '4px 0' },
  listRow: { padding: '10px 16px', cursor: 'pointer', borderLeft: '2px solid transparent' },
  listRowActive: { background: 'var(--accent-light)', borderLeftColor: 'var(--accent)' },
  listTitle: { fontSize: 13, fontWeight: 600, color: 'oklch(0.2 0.01 80)', fontFamily: 'var(--font-ui)', marginBottom: 3, lineHeight: 1.35 },
  listFields: { display: 'flex', alignItems: 'center', gap: 5, flexWrap: 'wrap' },
  fieldVal: { fontSize: 11, color: 'oklch(0.5 0.01 80)', fontFamily: 'var(--font-mono)' },
  fieldSep: { fontSize: 11, color: 'oklch(0.75 0.01 80)' },
  listDate: { fontSize: 11, color: 'oklch(0.6 0.01 80)', fontFamily: 'var(--font-mono)' },

  // library groups
  srcGroup: { marginBottom: 4 },
  srcHead: { padding: '10px 16px 6px' },
  srcTitle: { fontSize: 11.5, fontWeight: 700, color: 'oklch(0.32 0.04 235)', fontFamily: 'var(--font-ui)' },
  srcMeta: { fontSize: 10, color: 'oklch(0.6 0.01 80)', fontFamily: 'var(--font-mono)', marginTop: 2 },
  libRow: { display: 'flex', alignItems: 'flex-start', gap: 8, padding: '8px 16px 8px 18px', cursor: 'pointer', borderLeft: '2px solid transparent' },
  libTick: { width: 5, height: 5, borderRadius: '50%', background: 'oklch(0.72 0.06 235)', marginTop: 6, flexShrink: 0 },

  // Editor
  editor: { flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#fff' },
  tabsBar: { display: 'flex', alignItems: 'stretch', background: 'oklch(0.978 0.005 80)', borderBottom: '1px solid oklch(0.92 0.008 80)', minHeight: 36, overflowX: 'auto', flexShrink: 0 },
  tab: { display: 'flex', alignItems: 'center', gap: 7, padding: '0 11px 0 13px', height: 36, borderRight: '1px solid oklch(0.93 0.008 80)', fontSize: 12, color: 'oklch(0.5 0.01 80)', cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'var(--font-ui)', background: 'oklch(0.978 0.005 80)', flexShrink: 0, maxWidth: 200 },
  tabActive: { background: '#fff', color: 'oklch(0.13 0.015 80)', borderBottom: '2px solid var(--accent)', marginBottom: -1 },
  tabDot: { width: 7, height: 7, borderRadius: '50%', flexShrink: 0 },
  tabLabel: { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  tabClose: { width: 16, height: 16, border: 'none', background: 'none', color: 'oklch(0.55 0.01 80)', borderRadius: 3, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: 1, flexShrink: 0 },

  editorBody: { flex: 1, overflowY: 'auto', background: '#fff' },
  doc: { maxWidth: 720, margin: '0 auto', padding: '32px 48px 80px' },
  docTitle: { fontSize: 30, fontWeight: 700, color: 'oklch(0.13 0.015 80)', fontFamily: 'var(--font-ui)', letterSpacing: '-0.02em', lineHeight: 1.15, marginBottom: 12 },
  docMeta: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 22 },
  docTypeTag: { display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: 'oklch(0.35 0.02 80)', fontFamily: 'var(--font-ui)' },
  docMetaDate: { fontSize: 11.5, color: 'oklch(0.6 0.01 80)', fontFamily: 'var(--font-mono)' },
  docMetaPlain: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, paddingBottom: 14, borderBottom: '1px solid oklch(0.94 0.006 80)' },
  docKindPlain: { fontSize: 11, fontWeight: 700, color: 'oklch(0.5 0.02 80)', textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: 'var(--font-ui)' },

  // fields block (visual frontmatter)
  fields: { background: 'oklch(0.984 0.005 80)', border: '1px solid oklch(0.93 0.008 80)', borderRadius: 10, padding: '4px 16px', marginBottom: 8 },
  fieldRow: { display: 'flex', alignItems: 'flex-start', gap: 16, padding: '9px 0', minHeight: 20 },
  fieldKey: { width: 150, flexShrink: 0, fontSize: 11.5, fontWeight: 600, color: 'oklch(0.5 0.01 80)', fontFamily: 'var(--font-ui)', paddingTop: 1 },
  fieldValue: { flex: 1, fontSize: 13.5, color: 'oklch(0.22 0.01 80)', fontFamily: 'var(--font-ui)', lineHeight: 1.5 },
  fieldMono: { fontFamily: 'var(--font-mono)', fontSize: 12.5, color: 'oklch(0.3 0.04 260)', background: 'oklch(0.965 0.008 260)', padding: '2px 7px', borderRadius: 5, border: '1px solid oklch(0.93 0.01 260)' },
  boolPill: { display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11.5, fontWeight: 600, padding: '2px 9px', borderRadius: 20, fontFamily: 'var(--font-ui)' },
  boolYes: { background: 'oklch(0.95 0.05 145)', color: 'oklch(0.45 0.13 145)' },
  boolNo: { background: 'oklch(0.95 0.008 80)', color: 'oklch(0.5 0.01 80)' },
  boolDot: { width: 6, height: 6, borderRadius: '50%' },
  fieldDivider: { display: 'flex', alignItems: 'center', gap: 10, margin: '20px 0 18px' },
  fieldDividerLabel: { fontSize: 10, fontWeight: 700, color: 'oklch(0.62 0.01 80)', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'var(--font-ui)' },

  emptyEditor: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 14, color: 'oklch(0.6 0.01 80)', fontFamily: 'var(--font-ui)', fontSize: 13 },
  emptyIcon: { opacity: 0.7 },

  // overlay
  overlay: { position: 'absolute', inset: 0, background: 'oklch(0.2 0.01 80 / 0.42)', backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: 40, animation: 'fadeIn 0.14s ease' },
  overlayCard: { width: 'min(1100px, 94%)', height: 'min(760px, 90%)', background: '#fff', borderRadius: 16, border: '1px solid oklch(0.9 0.008 80)', boxShadow: '0 24px 80px oklch(0 0 0 / 0.28)', display: 'flex', flexDirection: 'column', overflow: 'hidden' },
  overlayHead: { display: 'flex', alignItems: 'center', gap: 20, padding: '18px 22px', borderBottom: '1px solid oklch(0.93 0.008 80)', flexShrink: 0 },
  overlayTitle: { fontSize: 17, fontWeight: 700, color: 'oklch(0.14 0.015 80)', fontFamily: 'var(--font-ui)', letterSpacing: '-0.01em' },
  overlaySub: { fontSize: 12, color: 'oklch(0.55 0.01 80)', fontFamily: 'var(--font-ui)', marginTop: 2 },
  overlayLegend: { display: 'flex', flexWrap: 'wrap', gap: 12, marginLeft: 'auto' },
  legChip: { display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11.5, color: 'oklch(0.4 0.01 80)', fontFamily: 'var(--font-ui)' },
  legDot: { width: 9, height: 9, borderRadius: '50%' },
  overlayClose: { width: 30, height: 30, flexShrink: 0 },
  overlayCanvas: { flex: 1, background: 'radial-gradient(circle at 50% 40%, oklch(0.995 0.003 80), oklch(0.975 0.005 80))', overflow: 'hidden' },
};

Object.assign(window, { NotesView });
