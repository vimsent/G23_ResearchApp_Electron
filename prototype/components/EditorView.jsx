
const LUMEN_MD_CONTENT = `# LUMEN.md — Open Knowledge Infrastructure: A Framework for Diamond OA

## ESTADO
- Estado: Draft
- Creado: 2026-02-14
- Última actualización: 2026-04-29 · 09:14

## LÍNEAS DE INVESTIGACIÓN
- Can Diamond OA models eliminate APC dependency while preserving quality signals?
- How can verified contributor identity decouple researcher reputation from journal prestige?

## HIPÓTESIS
- H1: Diamond OA reduces systemic APC dependency when consortia fund ≥60% of costs — activa
- H2: Researcher identity platforms can decouple prestige within 10-year horizon — activa
- H3: LATAM consortia can replace subscriptions without net budget increase — en revisión
- H5: h-index can be fully replaced by composite metric — REFUTADA
  ↳ Sinatra et al. 2016: citation metrics have predictive validity role-based metrics cannot replicate short-term

## FUENTES ACTIVAS
- Larivière et al. 2015   — tipo: paper   — relevancia: alta   — sección: Introducción
- cOAlition S, Plan S 2021 — tipo: paper  — relevancia: alta   — sección: Background
- citation_graph_analysis.py — tipo: código — lenguaje: Python — sección: Metodología
- Bohannon 2016 (Sci-Hub) — tipo: paper   — relevancia: media  — sección: Related Work

## ÍNDICE DEL PAPER
- Abstract:       ✓ completada — argumenta eliminación de APCs vía infraestructura Diamond
- §1 Introducción: ✓ completada — establece paradoja de privatización del conocimiento público
- §2 Background:  ⟳ en progreso — concentración editorial, mecanismo oligopólico, APC trap
- §3 Framework:   ○ pendiente
- §4 Implementation: ○ pendiente
- §5 Discussion:  ○ pendiente

## ALERTAS
⚠ 2 fuentes semánticamente relacionadas en librería no asociadas al paper:
  — Sinatra et al. 2016 (citas en contexto relevante)
  — arXiv preprint: "Consortium funding models for OA journals" (2025)
⚠ H3 (en revisión) usada como soporte en §2 — verificar antes de enviar
⚠ §3 Framework no tiene fuentes de respaldo asignadas`;

const SOURCES_MD = `# SOURCES.md — Open Knowledge Infrastructure

## Larivière, Haustein & Mongeon (2015)
**Título:** The oligopoly of academic publishers in the digital era
**Fuente:** PLOS ONE · DOI: 10.1371/journal.pone.0127502
**Licencia:** CC BY · **Relevancia:** Alta
**Resumen propio:** Demuestra que entre 1973 y 2013 los Big Five pasaron del 20% al 53% de toda la literatura científica revisada por pares. Establece la base empírica del argumento de concentración. Clave para §1 y §2.
**Fragmentos clave:**
- "Reed-Elsevier, Wiley-Blackwell, Springer, and Taylor & Francis… now publish more than half of all academic papers"
- Márgenes de 35-40% consistentes 2000-2013
**Notas:** Datos de Web of Science — posible sesgo hacia disciplinas STEM. Complementar con SciELO para LATAM.

---

## cOAlition S — Plan S (2021)
**Título:** Making full and immediate Open Access a reality
**Fuente:** coalition-s.org · Capturado: 2026-01-08
**Licencia:** CC BY · **Relevancia:** Alta
**Resumen propio:** El mandato más ambicioso de OA institucional. Define "rights retention strategy" como mecanismo para que autores mantengan copyright bajo CC BY. Relevante para el argumento de que los mandatos institucionales son condición necesaria pero no suficiente para Diamond OA.
**Notas:** Plan S cubre Europa y algunos financiadores de EE.UU. — cobertura limitada en LATAM.

---

## citation_graph_analysis.py
**Tipo:** Código · **Lenguaje:** Python 3.11
**Repositorio:** local — /LumenWorkspace/library/code/
**Descripción:** Script de análisis de red de citas usando NetworkX. Calcula centralidad, clustering y distribución de grado para el corpus de papers de las 5 editoriales. Output: CSV con métricas por nodo + visualización D3.
**Estado:** Funcional — última ejecución 2026-04-15`;

const CONCEPTS_MD = `# CONCEPTS.md — Open Knowledge Infrastructure

## Líneas de investigación vinculadas

### → Diamond OA & APC Dependency
**Pregunta:** Can Diamond OA models eliminate APC dependency while preserving quality signals?
**Hipótesis activas:** H1, H2, H3
**Hilo narrativo relevante:** La tensión central es entre sostenibilidad del financiamiento institucional y la función de prestigio que hoy proveen las editoriales comerciales. Diamond OA debe ofrecer una alternativa creíble de prestigio — no solo más barata.

### → Researcher Identity & Reputation
**Pregunta:** How can verified contributor identity decouple researcher reputation from journal prestige?
**Hipótesis:** H4 (activa), H5 (REFUTADA — ver LUMEN.md)

## Hipótesis refutadas relevantes
**H5 — REFUTADA:** El h-index puede ser reemplazado completamente por métrica compuesta.
**Razón:** Sinatra et al. 2016 demuestra que métricas de cita tienen validez predictiva a largo plazo que las métricas basadas en roles no pueden replicar a corto plazo. Implicación para este paper: el argumento del §3 debe posicionar el perfil alternativo como *complemento* del h-index a corto plazo, no como reemplazo.`;

const LATEX_CONTENT = `\\documentclass[12pt]{article}
\\usepackage[utf8]{inputenc}
\\usepackage{natbib}
\\usepackage{hyperref}
\\usepackage{amsmath}

\\title{Open Knowledge Infrastructure:\\\\
  A Framework for Diamond Open Access}
\\author{M. Vargas\\\\
  Pontificia Universidad Católica de Chile}
\\date{April 2026}

\\begin{document}
\\maketitle

\\begin{abstract}
The academic publishing ecosystem is structurally dominated by five commercial
entities controlling over 50\\% of peer-reviewed literature. This paper proposes
a framework for Diamond Open Access infrastructure that eliminates Article
Processing Charges while preserving quality signals through institutional
consortia and verified contributor identity systems.
\\end{abstract}

\\section{Introduction}

Academic publishing operates under a paradox: publicly-funded research is
systematically privatized at the point of publication. The researcher produces
content, submits to peer review---also unpaid---and transfers copyright
permanently to commercial publishers \\citep{lariviere2015oligopoly}.

The emergence of open-access mandates \\citep{coalition2021plans} has not
resolved this tension. Gold OA replaces reader-side paywalls with author-side
Article Processing Charges (APCs), preserving publisher margins while
shifting financial burden onto researchers and institutions.

\\section{Background: The Publishing Oligopoly}

\\subsection{Market Concentration}

Between 1973 and 2013, the share of papers published by the five largest
commercial publishers grew from 20\\% to over 50\\% of all indexed scientific
literature \\citep{lariviere2015oligopoly}.

\\subsection{The APC Trap}

The Article Processing Charge model generates a new form of exclusion:
researchers at underfunded institutions face APCs ranging from
\\$150 to \\$10{,}100 USD per article.

% TODO: §3 Framework — pending sources

\\end{document}`;

const CONTEXT_FILES = {
  'LUMEN.md': LUMEN_MD_CONTENT,
  'SOURCES.md': SOURCES_MD,
  'CONCEPTS.md': CONCEPTS_MD,
};

const ACTIVE_SOURCES = [
  { title: 'Larivière et al. 2015', type: 'paper', section: '§1, §2' },
  { title: 'Plan S — cOAlition S', type: 'paper', section: '§2' },
  { title: 'citation_graph_analysis.py', type: 'code', section: '§4' },
  { title: 'Bohannon 2016 (Sci-Hub)', type: 'paper', section: 'Related' },
];

const ALERTS = [
  { text: '2 library sources semantically related but not linked', level: 'warn' },
  { text: 'H3 (in-review) used as support in §2 — verify before submission', level: 'warn' },
  { text: '§3 Framework has no sources assigned', level: 'error' },
];

function EditorView({ papers, activePaperId }) {
  const [activeCtxTab, setActiveCtxTab] = React.useState('LUMEN.md');
  const [latexContent, setLatexContent] = React.useState(LATEX_CONTENT);
  const [aiQuery, setAiQuery] = React.useState('');
  const [aiMessages, setAiMessages] = React.useState([
    { role: 'system', text: 'Context loaded: LUMEN.md · 4 active sources · H1, H2, H3 active · H5 refuted · 3 alerts.' },
  ]);
  const [sending, setSending] = React.useState(false);
  const [showPDF, setShowPDF] = React.useState(false);
  const [ctxLoading, setCtxLoading] = React.useState(null);

  const paper = papers.find(p => p.id === activePaperId) || papers[0];

  const loadCtxTab = (tab) => {
    if (tab === activeCtxTab) return;
    setCtxLoading(tab);
    setTimeout(() => { setActiveCtxTab(tab); setCtxLoading(null); }, 320);
  };

  const sendAI = async () => {
    if (!aiQuery.trim() || sending) return;
    const q = aiQuery;
    setAiQuery('');
    setAiMessages(m => [...m, { role: 'user', text: q }]);
    setSending(true);
    try {
      const ctx = `You are Lumen, an academic research assistant. The researcher is writing: "${paper?.title}". Active hypotheses: H1 (Diamond OA reduces APC dependency), H2 (identity decouples prestige), H3 (LATAM consortia, in-review). H5 is REFUTED — do not use as support. Active sources: Larivière 2015, Plan S 2021, citation analysis script. Answer concisely and academically. If relevant, cite active sources or flag hypothesis tensions.`;
      const reply = await window.claude.complete({ messages: [{ role: 'user', content: ctx + '\n\nResearcher: ' + q }] });
      setAiMessages(m => [...m, { role: 'assistant', text: reply }]);
    } catch {
      setAiMessages(m => [...m, { role: 'assistant', text: 'Connection error. Please try again.' }]);
    }
    setSending(false);
  };

  const ctxTabs = ['LUMEN.md', 'SOURCES.md', 'CONCEPTS.md'];
  const ctxColors = { 'LUMEN.md': 'var(--accent)', 'SOURCES.md': 'oklch(0.45 0.12 170)', 'CONCEPTS.md': 'oklch(0.48 0.11 300)' };

  return (
    <div style={ed.root}>
      {/* Header */}
      <div style={ed.header}>
        <div>
          <div style={ed.breadcrumb}>Papers</div>
          <h1 style={ed.title}>{paper?.shortTitle || 'Paper'}</h1>
        </div>
        <div style={ed.headerRight}>
          <div style={ed.statusBadge}>
            <div style={ed.statusDot} />
            {paper?.status || 'Draft'}
          </div>
          <button style={ed.headerBtn} onClick={() => setShowPDF(!showPDF)}>
            {showPDF ? 'Hide PDF' : '⚙ Compile PDF'}
          </button>
          <button style={ed.publishBtn}>↑ Publish to arXiv</button>
          <div style={ed.licenseTag}>
            <svg width={11} height={11} viewBox="0 0 16 16" fill="none" stroke="oklch(0.38 0.12 160)" strokeWidth="1.5"><circle cx="8" cy="8" r="6" /><path d="M8 7v4M8 5v.5" /></svg>
            CC BY 4.0
          </div>
        </div>
      </div>

      {/* 3-panel layout */}
      <div style={ed.workspace}>

        {/* LEFT PANEL — Context files + active sources */}
        <div style={ed.leftPanel}>
          {/* Context file tabs */}
          <div style={ed.ctxTabBar}>
            {ctxTabs.map(tab => (
              <button key={tab} onClick={() => loadCtxTab(tab)}
                style={{
                  ...ed.ctxTab,
                  ...(activeCtxTab === tab ? { ...ed.ctxTabActive, color: ctxColors[tab], borderBottomColor: ctxColors[tab] } : {}),
                }}>
                {tab}
                {tab === 'LUMEN.md' && <span style={ed.liveTag}>live</span>}
              </button>
            ))}
          </div>

          {/* Context file content */}
          <div style={ed.ctxContent}>
            {ctxLoading ? (
              <div style={ed.ctxLoading}>
                <div style={ed.ctxLoadingDot} />
                Loading {ctxLoading}…
              </div>
            ) : (
              <pre style={{ ...ed.ctxPre, color: activeCtxTab === 'LUMEN.md' ? 'oklch(0.22 0.04 260)' : activeCtxTab === 'SOURCES.md' ? 'oklch(0.22 0.04 170)' : 'oklch(0.22 0.04 300)' }}>
                {CONTEXT_FILES[activeCtxTab]}
              </pre>
            )}
          </div>

          {/* Active sources */}
          <div style={ed.sourcesSection}>
            <div style={ed.sourcesSectionHeader}>
              <span style={ed.sourcesSectionTitle}>Active sources</span>
              <span style={ed.sourcesHint}>drag from library to add</span>
            </div>
            {ACTIVE_SOURCES.map((s, i) => (
              <div key={i} style={ed.sourceRow}>
                <div style={{ ...ed.sourceTypeIcon, background: s.type === 'code' ? 'oklch(0.93 0.06 170)' : 'oklch(0.94 0.03 260)' }}>
                  <svg width={10} height={10} viewBox="0 0 16 16" fill="none" stroke={s.type === 'code' ? 'oklch(0.42 0.12 170)' : 'var(--accent)'} strokeWidth="1.5" strokeLinecap="round">
                    {s.type === 'code'
                      ? <path d="M8 3l-5 5 5 5M16 3l-5 5 5 5" />
                      : <path d="M3 2h7l4 4v9a1 1 0 01-1 1H3a1 1 0 01-1-1V3a1 1 0 011-1zm7 0v4h4" />}
                  </svg>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={ed.sourceTitle}>{s.title}</div>
                  <div style={ed.sourceSection}>{s.section}</div>
                </div>
              </div>
            ))}
            <div style={ed.dropZone}>
              <svg width={13} height={13} viewBox="0 0 16 16" fill="none" stroke="oklch(0.65 0.04 260)" strokeWidth="1.5" strokeLinecap="round"><path d="M8 2v10M4 8l4 4 4-4" /><path d="M2 14h12" /></svg>
              Drop source from library
            </div>
          </div>
        </div>

        {/* CENTER PANEL — LaTeX editor + optional PDF */}
        <div style={ed.centerPanel}>
          <div style={ed.editorArea}>
            <div style={ed.lineNums}>
              {latexContent.split('\n').map((_, i) => (
                <div key={i} style={ed.lineNum}>{i + 1}</div>
              ))}
            </div>
            <textarea
              style={ed.textarea}
              value={latexContent}
              onChange={e => setLatexContent(e.target.value)}
              spellCheck={false}
            />
          </div>
          {showPDF && (
            <div style={ed.pdfPreview}>
              <div style={ed.pdfHeader}>PDF Preview — compiled output</div>
              <div style={ed.pdfMock}>
                <div style={ed.pdfTitle}>Open Knowledge Infrastructure:</div>
                <div style={ed.pdfTitle}>A Framework for Diamond Open Access</div>
                <div style={ed.pdfAuthor}>M. Vargas · Pontificia Universidad Católica de Chile · April 2026</div>
                <div style={ed.pdfRule} />
                <div style={ed.pdfAbstractLabel}>Abstract</div>
                <div style={ed.pdfAbstract}>The academic publishing ecosystem is structurally dominated by five commercial entities controlling over 50% of peer-reviewed literature. This paper proposes a framework for Diamond Open Access infrastructure that eliminates Article Processing Charges while preserving quality signals through institutional consortia and verified contributor identity systems.</div>
                <div style={ed.pdfRule} />
                <div style={ed.pdfSection}>1   Introduction</div>
                <div style={ed.pdfBody}>Academic publishing operates under a paradox: publicly-funded research is systematically privatized at the point of publication…</div>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT PANEL — AI assistant */}
        <div style={ed.rightPanel}>
          <div style={ed.aiHeader}>
            <div style={ed.aiTitle}>
              <svg width={13} height={13} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M8 2v2M8 12v2M2 8h2M12 8h2M4.22 4.22l1.41 1.41M10.36 10.36l1.41 1.41M4.22 11.78l1.41-1.41M10.36 5.64l1.41-1.41" /></svg>
              Lumen Assistant
            </div>
            <div style={ed.aiModel}>claude-haiku</div>
          </div>

          {/* Context load indicator */}
          <div style={ed.ctxIndicator}>
            <div style={ed.ctxIndRow}>
              <span style={{ ...ed.ctxDot, background: 'var(--accent)' }} />
              <span style={ed.ctxIndLabel}>LUMEN.md</span>
              <span style={ed.ctxIndStatus}>always loaded</span>
            </div>
            <div style={ed.ctxIndRow}>
              <span style={{ ...ed.ctxDot, background: 'oklch(0.45 0.12 170)' }} />
              <span style={ed.ctxIndLabel}>SOURCES.md</span>
              <span style={ed.ctxIndStatus}>on demand</span>
            </div>
            <div style={ed.ctxIndRow}>
              <span style={{ ...ed.ctxDot, background: 'oklch(0.48 0.11 300)' }} />
              <span style={ed.ctxIndLabel}>CONCEPTS.md</span>
              <span style={ed.ctxIndStatus}>on demand</span>
            </div>
          </div>

          {/* Alerts */}
          {ALERTS.length > 0 && (
            <div style={ed.alertsBox}>
              {ALERTS.map((a, i) => (
                <div key={i} style={{ ...ed.alertRow, borderLeftColor: a.level === 'error' ? 'oklch(0.55 0.14 20)' : 'oklch(0.65 0.12 60)' }}>
                  <span style={{ ...ed.alertDot, background: a.level === 'error' ? 'oklch(0.55 0.14 20)' : 'oklch(0.65 0.12 60)' }} />
                  {a.text}
                </div>
              ))}
            </div>
          )}

          {/* Messages */}
          <div style={ed.messages}>
            {aiMessages.map((m, i) => (
              <div key={i} style={{ ...ed.message, ...(m.role === 'user' ? ed.msgUser : m.role === 'system' ? ed.msgSystem : ed.msgAI) }}>
                {m.role !== 'system' && <div style={ed.msgRole}>{m.role === 'user' ? 'You' : 'Lumen'}</div>}
                <div style={ed.msgText}>{m.text}</div>
              </div>
            ))}
            {sending && (
              <div style={{ ...ed.message, ...ed.msgAI }}>
                <div style={ed.msgRole}>Lumen</div>
                <div style={{ ...ed.msgText, color: 'oklch(0.6 0.05 260)' }}>Thinking…</div>
              </div>
            )}
          </div>

          {/* Input */}
          <div style={ed.inputRow}>
            <input style={ed.aiInput}
              placeholder="Draft a section, check sources, verify hypotheses…"
              value={aiQuery}
              onChange={e => setAiQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendAI()} />
            <button style={ed.sendBtn} onClick={sendAI} disabled={sending}>→</button>
          </div>
        </div>
      </div>
    </div>
  );
}

const ed = {
  root: { display: 'flex', flexDirection: 'column', height: '100%', background: '#fefefe', overflow: 'hidden' },
  header: { padding: '22px 24px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexShrink: 0 },
  breadcrumb: { fontSize: 12, color: 'var(--muted)', marginBottom: 3, fontFamily: 'var(--font-ui)' },
  title: { fontSize: 20, fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--font-display)', margin: 0, letterSpacing: '-0.02em', maxWidth: 480, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  headerRight: { display: 'flex', gap: 8, alignItems: 'center', paddingBottom: 2 },
  statusBadge: { display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'oklch(0.38 0.12 170)', background: 'oklch(0.93 0.06 170)', padding: '4px 10px', borderRadius: 6, fontFamily: 'var(--font-ui)', fontWeight: 600 },
  statusDot: { width: 6, height: 6, borderRadius: '50%', background: 'oklch(0.52 0.14 170)' },
  headerBtn: { background: 'none', border: '1px solid var(--border)', borderRadius: 6, padding: '5px 12px', fontSize: 12, color: 'var(--text-soft)', cursor: 'pointer', fontFamily: 'var(--font-ui)' },
  publishBtn: { background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-ui)' },
  licenseTag: { display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'oklch(0.38 0.12 160)', background: 'oklch(0.94 0.06 160)', padding: '4px 10px', borderRadius: 6, fontFamily: 'var(--font-ui)', fontWeight: 600 },

  workspace: { display: 'flex', flex: 1, overflow: 'hidden', padding: '14px 0 0', gap: 0 },

  // LEFT panel
  leftPanel: { width: 260, minWidth: 260, borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'var(--surface)' },
  ctxTabBar: { display: 'flex', borderBottom: '1px solid var(--border)', flexShrink: 0 },
  ctxTab: { flex: 1, background: 'none', border: 'none', borderBottom: '2px solid transparent', padding: '9px 4px 10px', fontSize: 11, color: 'var(--muted)', cursor: 'pointer', fontFamily: 'var(--font-mono)', transition: 'all 0.12s', position: 'relative' },
  ctxTabActive: { fontWeight: 700 },
  liveTag: { position: 'absolute', top: 5, right: 2, fontSize: 8, background: 'oklch(0.52 0.14 170)', color: '#fff', padding: '1px 4px', borderRadius: 3, fontWeight: 700, letterSpacing: '0.04em', fontFamily: 'var(--font-ui)' },
  ctxContent: { flex: 1, overflow: 'auto' },
  ctxLoading: { display: 'flex', alignItems: 'center', gap: 8, padding: '20px 16px', fontSize: 12, color: 'var(--muted)', fontFamily: 'var(--font-ui)' },
  ctxLoadingDot: { width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)', animation: 'pulse 1s ease-in-out infinite' },
  ctxPre: { fontSize: 11, lineHeight: 1.7, fontFamily: 'var(--font-mono)', margin: 0, padding: '14px 16px', whiteSpace: 'pre-wrap', wordBreak: 'break-word' },
  sourcesSection: { borderTop: '1px solid var(--border)', padding: '12px 14px', flexShrink: 0, background: 'var(--bg)' },
  sourcesSectionHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  sourcesSectionTitle: { fontSize: 11, fontWeight: 700, color: 'var(--text-soft)', letterSpacing: '0.05em', textTransform: 'uppercase', fontFamily: 'var(--font-ui)' },
  sourcesHint: { fontSize: 10, color: 'var(--muted)', fontFamily: 'var(--font-ui)', fontStyle: 'italic' },
  sourceRow: { display: 'flex', alignItems: 'center', gap: 8, padding: '5px 0', borderBottom: '1px solid var(--surface-2)' },
  sourceTypeIcon: { width: 22, height: 22, borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  sourceTitle: { fontSize: 11.5, fontWeight: 500, color: 'var(--text)', fontFamily: 'var(--font-ui)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  sourceSection: { fontSize: 10, color: 'var(--muted)', fontFamily: 'var(--font-ui)' },
  dropZone: { display: 'flex', alignItems: 'center', gap: 6, marginTop: 6, padding: '7px 10px', border: '1.5px dashed oklch(0.84 0.04 260)', borderRadius: 7, fontSize: 11, color: 'oklch(0.6 0.05 260)', fontFamily: 'var(--font-ui)', cursor: 'pointer', justifyContent: 'center' },

  // CENTER panel
  centerPanel: { flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' },
  editorArea: { display: 'flex', flex: 1, overflow: 'auto', background: 'var(--surface)' },
  lineNums: { padding: '16px 0', background: 'var(--bg)', borderRight: '1px solid var(--border)', minWidth: 44, userSelect: 'none', flexShrink: 0 },
  lineNum: { fontSize: 12, color: 'var(--muted)', textAlign: 'right', padding: '0 10px', lineHeight: '21px', height: 21 },
  textarea: { flex: 1, border: 'none', outline: 'none', resize: 'none', fontFamily: 'var(--font-mono)', fontSize: 13, lineHeight: '21px', padding: '16px 20px', color: 'var(--text)', background: 'transparent', whiteSpace: 'pre', overflowX: 'auto' },
  pdfPreview: { height: '45%', borderTop: '1px solid var(--border)', overflow: 'auto', background: 'var(--bg)' },
  pdfHeader: { padding: '8px 16px', fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-ui)', fontWeight: 600, background: 'var(--surface-2)', borderBottom: '1px solid var(--border)' },
  pdfMock: { padding: '24px 32px', maxWidth: 560, margin: '0 auto' },
  pdfTitle: { fontSize: 16, fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--font-display)', textAlign: 'center', lineHeight: 1.4 },
  pdfAuthor: { fontSize: 12, color: 'var(--muted)', textAlign: 'center', marginTop: 6, fontFamily: 'var(--font-ui)' },
  pdfRule: { height: 1, background: 'var(--border)', margin: '16px 0' },
  pdfAbstractLabel: { fontSize: 12, fontWeight: 700, color: 'var(--text-soft)', marginBottom: 6, fontFamily: 'var(--font-ui)' },
  pdfAbstract: { fontSize: 12, color: 'var(--text-soft)', lineHeight: 1.7, fontFamily: 'Georgia, serif', fontStyle: 'italic' },
  pdfSection: { fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 8, marginTop: 16, fontFamily: 'var(--font-ui)' },
  pdfBody: { fontSize: 13, color: 'var(--text-soft)', lineHeight: 1.7, fontFamily: 'Georgia, serif' },

  // RIGHT panel
  rightPanel: { width: 280, minWidth: 280, borderLeft: '1px solid var(--border)', display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'var(--surface)' },
  aiHeader: { padding: '12px 16px 10px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 },
  aiTitle: { fontSize: 13, fontWeight: 700, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-ui)' },
  aiModel: { fontSize: 10, background: 'oklch(0.94 0.02 260)', color: 'oklch(0.42 0.12 260)', padding: '2px 7px', borderRadius: 4, fontFamily: 'var(--font-mono)', fontWeight: 600 },
  ctxIndicator: { padding: '10px 14px', borderBottom: '1px solid var(--surface-2)', display: 'flex', flexDirection: 'column', gap: 5, flexShrink: 0, background: 'var(--bg)' },
  ctxIndRow: { display: 'flex', alignItems: 'center', gap: 7 },
  ctxDot: { width: 6, height: 6, borderRadius: '50%', flexShrink: 0 },
  ctxIndLabel: { fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-soft)', flex: 1 },
  ctxIndStatus: { fontSize: 10, color: 'var(--muted)', fontFamily: 'var(--font-ui)' },
  alertsBox: { padding: '10px 14px', borderBottom: '1px solid var(--surface-2)', display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0, background: 'oklch(0.99 0.01 60)' },
  alertRow: { display: 'flex', alignItems: 'flex-start', gap: 7, fontSize: 11.5, color: 'oklch(0.3 0.02 60)', fontFamily: 'var(--font-ui)', lineHeight: 1.5, borderLeft: '3px solid', paddingLeft: 8 },
  alertDot: { width: 5, height: 5, borderRadius: '50%', flexShrink: 0, marginTop: 5 },
  messages: { flex: 1, overflow: 'auto', padding: '14px 14px', display: 'flex', flexDirection: 'column', gap: 10 },
  message: { borderRadius: 10 },
  msgUser: { alignSelf: 'flex-end', maxWidth: '85%', background: 'var(--accent)', color: '#fff', padding: '10px 14px' },
  msgAI: { alignSelf: 'flex-start', maxWidth: '90%', background: 'oklch(0.97 0.01 260)', border: '1px solid oklch(0.91 0.03 260)', padding: '10px 14px' },
  msgSystem: { alignSelf: 'stretch', background: 'oklch(0.95 0.04 170)', border: '1px solid oklch(0.87 0.07 170)', padding: '9px 12px', borderRadius: 8 },
  msgRole: { fontSize: 10, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 4, opacity: 0.6, fontFamily: 'var(--font-ui)' },
  msgText: { fontSize: 13, lineHeight: 1.6, fontFamily: 'var(--font-ui)', color: 'var(--text)' },
  inputRow: { borderTop: '1px solid var(--border)', padding: '12px 14px', display: 'flex', gap: 8, background: 'var(--surface)', flexShrink: 0 },
  aiInput: { flex: 1, border: '1px solid oklch(0.88 0.02 260)', borderRadius: 8, padding: '9px 13px', fontSize: 13, outline: 'none', fontFamily: 'var(--font-ui)', color: 'var(--text)' },
  sendBtn: { background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 8, padding: '9px 16px', fontSize: 15, cursor: 'pointer' },
};

Object.assign(window, { EditorView });
