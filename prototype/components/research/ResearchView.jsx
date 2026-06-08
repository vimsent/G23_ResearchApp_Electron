// ResearchView — Side panel + tab system

function CodeViewer({ source }) {
  return (
    <div style={{ flex: 1, overflow: 'auto', background: 'oklch(0.18 0.01 80)', padding: 24 }}>
      <div style={{
        maxWidth: 760, margin: '0 auto', background: 'oklch(0.13 0.015 80)',
        borderRadius: 10, padding: '16px 20px',
        fontFamily: 'var(--font-mono)', fontSize: 12.5,
        color: 'oklch(0.92 0.005 80)', lineHeight: 1.6, whiteSpace: 'pre',
        boxShadow: '0 4px 16px oklch(0 0 0 / 0.3)',
      }}>
        <div style={{ fontSize: 11, color: 'oklch(0.55 0.01 80)', marginBottom: 12, paddingBottom: 10, borderBottom: '1px solid oklch(0.25 0.01 80)' }}>
          {source.file} · Python · {source.year}
        </div>
        {(source.code || '').split('\n').map((line, i) => (
          <div key={i}>
            <span style={{ color: 'oklch(0.4 0.01 80)', display: 'inline-block', width: 24, textAlign: 'right', marginRight: 12, userSelect: 'none' }}>{i + 1}</span>
            <span dangerouslySetInnerHTML={{ __html: line
              .replace(/(import|from|as|def|return|print|for|in)/g, '<span style="color:oklch(0.7 0.12 290)">$1</span>')
              .replace(/("[^"]*"|'[^']*')/g, '<span style="color:oklch(0.78 0.12 80)">$1</span>')
              .replace(/(#.*)/g, '<span style="color:oklch(0.55 0.01 80);font-style:italic">$1</span>')
            }} />
          </div>
        ))}
      </div>
    </div>
  );
}

function PaperTabContent({ source }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '9px 18px', borderBottom: '1px solid var(--border)',
        background: 'var(--bg)', flexShrink: 0,
      }}>
        {['Highlight', 'Note', 'Copy citation'].map(t => (
          <button key={t} style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 6, padding: '4px 10px', fontSize: 11.5,
            color: 'var(--muted)', cursor: 'pointer',
            fontFamily: 'var(--font-ui)', fontWeight: 500,
          }}>{t}</button>
        ))}
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>
          library/papers/{source.file}
        </span>
      </div>
      <div style={{ flex: 1, overflow: 'auto', background: 'oklch(0.95 0.005 80)', padding: '32px 20px' }}>
        <div style={{
          maxWidth: 680, margin: '0 auto', background: 'var(--surface)',
          boxShadow: '0 1px 2px oklch(0 0 0 / 0.04), 0 8px 28px oklch(0 0 0 / 0.08)',
          padding: '56px 72px', fontFamily: "'Lora', Georgia, serif",
          color: 'var(--text)', lineHeight: 1.7,
        }}>
          {!source.accessible && (
            <div style={{
              background: 'oklch(0.96 0.04 25)', border: '1px solid oklch(0.85 0.08 25)',
              padding: '10px 14px', borderRadius: 8, marginBottom: 20,
              fontSize: 12, color: 'oklch(0.5 0.16 25)',
              fontFamily: 'var(--font-ui)',
            }}>
              ⚠ Source restricted — limited preview only ({source.license})
            </div>
          )}
          <div style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>
            {source.type === 'paper' ? 'Research Article' : source.type}
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 600, lineHeight: 1.3, marginBottom: 14 }}>
            {source.fullTitle || source.name}
          </h1>
          <div style={{ fontSize: 13, color: 'oklch(0.3 0.01 80)', marginBottom: 6 }}>{source.authors}</div>
          <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 24 }}>
            {source.year} · {source.license}
          </div>
          <div style={{ fontWeight: 600, fontSize: 11, marginBottom: 8, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'oklch(0.3 0.01 80)' }}>Abstract</div>
          <p style={{ fontSize: 13, marginBottom: 16, textAlign: 'justify' }}>
            {source.abstract}
          </p>
          {source.citations && (
            <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
              <div style={{ fontWeight: 600, fontSize: 11, marginBottom: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', fontFamily: 'var(--font-ui)' }}>
                Saved annotations
              </div>
              {source.citations.map((c, i) => (
                <div key={i} style={{
                  background: 'oklch(0.96 0.04 85)', borderLeft: '3px solid oklch(0.7 0.1 80)',
                  padding: '9px 12px', marginBottom: 6, fontSize: 12,
                  color: 'oklch(0.3 0.01 80)', fontStyle: 'italic',
                  fontFamily: 'var(--font-ui)', borderRadius: '0 6px 6px 0',
                }}>{c}</div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ChatTabContent({ openSourceTitles }) {
  const [input, setInput] = React.useState('');
  const messages = [
    { role: 'user', text: '¿Qué dice Larivière sobre la concentración del mercado post-2010?' },
    { role: 'assistant', text: 'Larivière et al. (2015) muestra que entre 2010 y 2013 la concentración aumentó de 47% a 53%, con un crecimiento particularmente marcado en química y ciencias sociales. La adquisición de SAGE-Springer en 2014 (ya fuera del rango temporal del paper) sugiere una continuación de la tendencia.', refs: ['Larivière 2015 §3.2', 'PDF p.7'] },
    { role: 'user', text: 'Cita textual exacta sobre los Big Five' },
    { role: 'assistant', text: '"Reed-Elsevier, Wiley-Blackwell, Springer, and Taylor & Francis… now publish more than half of all academic papers." (Larivière et al. 2015, p. 9)', refs: ['§2 ready'] },
  ];
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--surface)', overflow: 'hidden' }}>
      <div style={{
        padding: '10px 18px', borderBottom: '1px solid var(--border)',
        fontSize: 12, color: 'var(--muted)',
        fontFamily: 'var(--font-ui)',
        background: 'var(--bg)',
      }}>
        Conversación · fuentes activas: <span style={{ color: 'var(--text)', fontWeight: 600 }}>{openSourceTitles.join(', ') || 'ninguna'}</span>
      </div>
      <div style={{ flex: 1, overflow: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {messages.map((m, i) => (
          <div key={i} style={{
            alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
            maxWidth: '78%',
          }}>
            <div style={{
              background: m.role === 'user' ? 'var(--accent)' : 'var(--bg)',
              color: m.role === 'user' ? '#fff' : 'var(--text)',
              border: m.role === 'assistant' ? '1px solid var(--border)' : 'none',
              padding: '10px 14px', borderRadius: 12,
              fontSize: 13, lineHeight: 1.55,
              fontFamily: 'var(--font-ui)',
            }}>{m.text}</div>
            {m.refs && (
              <div style={{ display: 'flex', gap: 4, marginTop: 4, flexWrap: 'wrap' }}>
                {m.refs.map(r => (
                  <span key={r} style={{
                    fontSize: 10, padding: '2px 7px',
                    background: 'var(--accent-light)', color: 'var(--accent)',
                    borderRadius: 4, fontWeight: 600,
                    fontFamily: 'var(--font-mono)',
                  }}>{r}</span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      <div style={{ borderTop: '1px solid var(--border)', padding: 12, background: 'var(--bg)', flexShrink: 0 }}>
        <div style={{
          display: 'flex', gap: 6, alignItems: 'center',
          background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10,
          padding: '6px 6px 6px 12px',
        }}>
          <input value={input} onChange={e => setInput(e.target.value)}
            placeholder="Ask about your sources..."
            style={{
              flex: 1, border: 'none', outline: 'none', fontSize: 13,
              color: 'var(--text)', fontFamily: 'var(--font-ui)',
              background: 'transparent',
            }} />
          <button style={{
            background: 'var(--accent)', color: '#fff', border: 'none',
            borderRadius: 7, padding: '6px 14px', fontSize: 12,
            fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-ui)',
          }}>Send</button>
        </div>
      </div>
    </div>
  );
}

function PlaceholderTab({ kind }) {
  const isCanvas = kind === 'canvas';
  return (
    <div style={{
      flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg)',
      backgroundImage: 'radial-gradient(circle, oklch(0.86 0.01 80) 1px, transparent 1px)',
      backgroundSize: '20px 20px', position: 'relative', overflow: 'hidden',
    }}>
      {isCanvas && (
        <>
          <div style={{ position: 'absolute', top: '20%', left: '15%', width: 130, padding: 12, background: 'oklch(0.96 0.04 85)', boxShadow: '0 4px 12px oklch(0 0 0 / 0.08)', transform: 'rotate(-3deg)', fontSize: 11.5, fontFamily: 'var(--font-ui)', color: 'oklch(0.4 0.1 80)', borderRadius: 4 }}>
            H1 ↔ §3 framework anchor
          </div>
          <div style={{ position: 'absolute', top: '55%', right: '18%', width: 140, padding: 12, background: 'var(--accent-light)', boxShadow: '0 4px 12px oklch(0 0 0 / 0.08)', transform: 'rotate(2deg)', fontSize: 11.5, fontFamily: 'var(--font-ui)', color: 'var(--accent)', borderRadius: 4 }}>
            Plan S ⇒ rights retention. Mandate ≠ infrastructure.
          </div>
          <div style={{ position: 'absolute', bottom: '15%', left: '25%', width: 120, padding: 12, background: 'oklch(0.95 0.04 300)', boxShadow: '0 4px 12px oklch(0 0 0 / 0.08)', transform: 'rotate(-1deg)', fontSize: 11.5, fontFamily: 'var(--font-ui)', color: 'oklch(0.42 0.14 300)', borderRadius: 4 }}>
            ¿LATAM ≠ Europa? — H3
          </div>
        </>
      )}
      <div style={{
        textAlign: 'center', background: 'oklch(1 0 0 / 0.92)',
        padding: '24px 32px', borderRadius: 12,
        border: '1px solid var(--border)', zIndex: 2,
      }}>
        <div style={{ marginBottom: 12, opacity: 0.5 }}>
          {isCanvas ? <CanvasIcon size={36} /> : <ChartIcon size={36} />}
        </div>
        <div style={{ fontSize: 14, color: 'oklch(0.3 0.01 80)', fontWeight: 600, fontFamily: 'var(--font-ui)' }}>
          {isCanvas ? 'Canvas de investigación' : 'Gráficos e visualizaciones'}
        </div>
        <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4, fontFamily: 'var(--font-ui)' }}>próximamente</div>
      </div>
    </div>
  );
}

function NewTabPicker({ onPick, sources }) {
  const [showSources, setShowSources] = React.useState(false);
  return (
    <div style={{
      position: 'absolute', top: 'calc(100% + 4px)', left: 0,
      background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10,
      boxShadow: '0 6px 22px oklch(0 0 0 / 0.1)', minWidth: 200, zIndex: 100,
      padding: 4,
    }}>
      {!showSources ? (
        <>
          <button onClick={() => setShowSources(true)} style={pickerBtn}>
            <PaperIcon size={12} /> <span style={{ flex: 1 }}>Abrir fuente</span> <span style={{ color: 'var(--muted)' }}>›</span>
          </button>
          <button onClick={() => onPick({ type: 'chat' })} style={pickerBtn}>
            <ChatIcon size={12} /> Chat
          </button>
          <button onClick={() => onPick({ type: 'web' })} style={pickerBtn}>
            <span style={{ fontSize: 13 }}>🌐</span> <span style={{ flex: 1 }}>Navegar web</span>
          </button>
          <button onClick={() => onPick({ type: 'chart' })} style={pickerBtn}>
            <ChartIcon size={12} /> Gráfico <span style={{ color: 'var(--muted)', fontSize: 10, marginLeft: 'auto' }}>soon</span>
          </button>
          <button onClick={() => onPick({ type: 'canvas' })} style={pickerBtn}>
            <CanvasIcon size={12} /> Canvas <span style={{ color: 'var(--muted)', fontSize: 10, marginLeft: 'auto' }}>soon</span>
          </button>
        </>
      ) : (
        <>
          <button onClick={() => setShowSources(false)} style={{ ...pickerBtn, color: 'var(--muted)', fontSize: 11 }}>‹ back</button>
          {sources.map(s => (
            <button key={s.id} onClick={() => onPick({ type: 'source', sourceId: s.id })} style={pickerBtn}>
              {getSourceIcon(s.type, 'var(--muted)', 11)}
              <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.name}</span>
            </button>
          ))}
        </>
      )}
    </div>
  );
}

const pickerBtn = {
  display: 'flex', alignItems: 'center', gap: 8, width: '100%',
  background: 'transparent', border: 'none', borderRadius: 6,
  padding: '7px 10px', fontSize: 12.5, color: 'var(--text)',
  cursor: 'pointer', textAlign: 'left',
  fontFamily: 'var(--font-ui)',
};

function ResearchView({ paper }) {
  const [expandedFile, setExpandedFile] = React.useState(null);
  const [tabs, setTabs] = React.useState([]);
  const [activeTab, setActiveTab] = React.useState(null);
  const [pickerOpen, setPickerOpen] = React.useState(false);
  const [notes, setNotes] = React.useState('');
  const pickerRef = React.useRef(null);

  React.useEffect(() => {
    const onDoc = (e) => { if (pickerRef.current && !pickerRef.current.contains(e.target)) setPickerOpen(false); };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const openSource = (source) => {
    const id = `source-${source.id}`;
    if (!tabs.find(t => t.id === id)) {
      setTabs(t => [...t, { id, type: 'source', sourceId: source.id, title: source.name }]);
    }
    setActiveTab(id);
  };

  const handlePick = (pick) => {
    setPickerOpen(false);
    if (pick.type === 'source') {
      const s = paper.activeSources.find(x => x.id === pick.sourceId);
      if (s) openSource(s);
    } else {
      const id = `${pick.type}-${Date.now()}`;
      const titles = { chat: 'New chat', chart: 'New chart', canvas: 'New canvas', web: 'Scholar' };
      const tab = { id, type: pick.type, title: titles[pick.type] };
      if (pick.type === 'web') tab.url = 'https://scholar.google.com';
      setTabs(t => [...t, tab]);
      setActiveTab(id);
    }
  };

  const updateTab = (id, patch) => {
    setTabs(ts => ts.map(t => t.id === id ? { ...t, ...patch } : t));
  };

  const closeTab = (id, e) => {
    e.stopPropagation();
    const idx = tabs.findIndex(t => t.id === id);
    const next = tabs.filter(t => t.id !== id);
    setTabs(next);
    if (activeTab === id) {
      setActiveTab(next.length ? next[Math.min(idx, next.length - 1)].id : null);
    }
  };

  const active = tabs.find(t => t.id === activeTab);
  const openedSourceIds = tabs.filter(t => t.type === 'source').map(t => t.sourceId);
  const openSourceTitles = openedSourceIds.map(id => paper.activeSources.find(s => s.id === id)?.name).filter(Boolean);

  return (
    <div style={{ display: 'flex', flex: 1, minHeight: 0, overflow: 'hidden' }}>
      {/* Side panel */}
      <div style={{
        width: 240, minWidth: 240, borderRight: '1px solid var(--border)',
        background: 'var(--bg)', display: 'flex', flexDirection: 'column', overflow: 'hidden',
      }}>
        <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
          <SectionTitle>Context Files</SectionTitle>
          <div style={{ padding: '0 10px 4px' }}>
            {paper.contextFiles.map(f => (
              <ContextFileItem key={f.name} file={f}
                expanded={expandedFile === f.name}
                onToggle={() => setExpandedFile(e => e === f.name ? null : f.name)}
                compact />
            ))}
          </div>

          <div style={{ height: 1, background: 'var(--border)', margin: '6px 14px' }} />

          <SectionTitle hint={`${tabs.filter(t => t.type === 'source').length} open`}>Sources</SectionTitle>
          <div style={{ padding: '0 10px 4px' }}>
            {paper.activeSources.map(s => (
              <SourceRow key={s.id} source={s}
                opened={openedSourceIds.includes(s.id)}
                onClick={() => openSource(s)}
                dense />
            ))}
            <div style={{
              marginTop: 6, padding: '7px 10px',
              border: '1px dashed var(--border)', borderRadius: 8,
              fontSize: 11.5, color: 'var(--muted)', textAlign: 'center',
              fontFamily: 'var(--font-ui)', cursor: 'pointer',
            }}>+ Add source</div>
          </div>

          <div style={{ height: 1, background: 'var(--border)', margin: '10px 14px' }} />

          <SectionTitle>Quick Notes</SectionTitle>
          <div style={{ padding: '0 12px 14px' }}>
            <textarea value={notes} onChange={e => setNotes(e.target.value)}
              placeholder="Jot down a thought..."
              style={{
                width: '100%', minHeight: 90, border: '1px solid var(--border)',
                borderRadius: 8, padding: '9px 11px', fontSize: 12,
                color: 'var(--text)', background: 'var(--surface)', resize: 'vertical',
                fontFamily: 'var(--font-ui)', outline: 'none',
                lineHeight: 1.5,
              }} />
          </div>
        </div>
      </div>

      {/* Workspace */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, background: 'var(--surface)' }}>
        {/* Tab bar */}
        <div style={{
          display: 'flex', alignItems: 'flex-end', gap: 0,
          background: 'var(--bg)', borderBottom: '1px solid var(--border)',
          height: 38, padding: '0 6px', flexShrink: 0,
        }}>
          {tabs.map(t => {
            const isActive = t.id === activeTab;
            const source = t.type === 'source' ? paper.activeSources.find(s => s.id === t.sourceId) : null;
            return (
              <div key={t.id} onClick={() => setActiveTab(t.id)} style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: isActive ? 'var(--surface)' : 'transparent',
                borderTop: isActive ? '1px solid var(--border)' : '1px solid transparent',
                borderLeft: isActive ? '1px solid var(--border)' : '1px solid transparent',
                borderRight: isActive ? '1px solid var(--border)' : '1px solid transparent',
                borderRadius: '8px 8px 0 0', padding: '7px 11px',
                marginBottom: -1, cursor: 'pointer',
                color: isActive ? 'var(--text)' : 'var(--muted)', fontSize: 12,
                fontFamily: 'var(--font-ui)',
                fontWeight: isActive ? 600 : 500, position: 'relative',
                animation: 'fadeIn 0.18s ease',
              }}>
                {t.type === 'source' && source && getSourceIcon(source.type, isActive ? 'var(--accent)' : 'var(--muted)', 11)}
                {t.type === 'chat' && <ChatIcon color={isActive ? 'var(--accent)' : 'var(--muted)'} size={11} />}
                {t.type === 'chart' && <ChartIcon color={isActive ? 'var(--accent)' : 'var(--muted)'} size={11} />}
                {t.type === 'canvas' && <CanvasIcon color={isActive ? 'var(--accent)' : 'var(--muted)'} size={11} />}
                {t.type === 'web' && <span style={{ fontSize: 11, lineHeight: 1 }}>🌐</span>}
                <span style={{ maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.title}</span>
                <button onClick={(e) => closeTab(t.id, e)} style={{
                  background: 'transparent', border: 'none', cursor: 'pointer',
                  color: 'var(--muted)', fontSize: 13, padding: '0 2px', marginLeft: 2,
                  borderRadius: 3, lineHeight: 1,
                }}>×</button>
              </div>
            );
          })}
          <div ref={pickerRef} style={{ position: 'relative' }}>
            <button onClick={() => setPickerOpen(o => !o)} style={{
              background: 'transparent', border: 'none', padding: '5px 9px',
              fontSize: 16, color: 'var(--muted)', cursor: 'pointer',
              marginBottom: -1, lineHeight: 1,
            }}>+</button>
            {pickerOpen && <NewTabPicker onPick={handlePick} sources={paper.activeSources} />}
          </div>
        </div>

        {/* Tab content */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden', minHeight: 0, position: 'relative' }}>
          {/* Web tabs are kept mounted (display:none when inactive) to preserve
              navigation history and process state across tab switches. */}
          {tabs.filter(t => t.type === 'web').map(t => (
            <div key={t.id} style={{
              position: 'absolute', inset: 0,
              display: t.id === activeTab ? 'flex' : 'none',
              flexDirection: 'column',
            }}>
              <WebBrowserTab
                tabId={t.id}
                initialUrl={t.url || 'https://scholar.google.com'}
                onTitleChange={(title) => updateTab(t.id, { title: title.slice(0, 60) })}
                onUrlChange={(url) => updateTab(t.id, { url })}
              />
            </div>
          ))}

          {!active && (
            <div style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexDirection: 'column', gap: 10, color: 'var(--muted)',
              fontFamily: 'var(--font-ui)',
            }}>
              <div style={{ opacity: 0.4 }}><PaperIcon color="var(--muted)" size={32} /></div>
              <div style={{ fontSize: 13 }}>Open a source from the panel to start</div>
              <div style={{ fontSize: 11.5, color: 'oklch(0.7 0.01 80)' }}>or use + to add a chat, web, chart, or canvas tab</div>
            </div>
          )}
          {active && active.type === 'source' && (() => {
            const s = paper.activeSources.find(x => x.id === active.sourceId);
            if (!s) return null;
            return s.type === 'code' ? <CodeViewer source={s} /> : <PaperTabContent source={s} />;
          })()}
          {active && active.type === 'chat' && <ChatPanel openSourceTitles={openSourceTitles} />}
          {active && active.type === 'chart' && <PlaceholderTab kind="chart" />}
          {active && active.type === 'canvas' && <PlaceholderTab kind="canvas" />}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { ResearchView });
