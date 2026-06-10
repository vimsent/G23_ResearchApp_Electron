// Shared data for Research Assistant v3
const PAPER_DATA = {
  title: "Diamond OA Framework",
  fullTitle: "Open Knowledge Infrastructure: A Framework for Diamond Open Access",
  status: "Draft",
  created: "2026-02-14",
  lastUpdated: "2026-04-29 · 09:14",
  workspacePath: "~/Documents/LumenWorkspace / papers / diamond-oa-framework",

  researchLines: [
    "Can Diamond OA models eliminate APC dependency while preserving quality signals?",
    "How can verified contributor identity decouple researcher reputation from journal prestige?"
  ],

  hypotheses: [
    { id: "H1", text: "Diamond OA reduces systemic APC dependency when consortia fund ≥60% of costs", status: "active" },
    { id: "H2", text: "Researcher identity platforms can decouple prestige within 10-year horizon", status: "active" },
    { id: "H3", text: "LATAM consortia can replace subscriptions without net budget increase", status: "revision" },
    { id: "H5", text: "h-index can be fully replaced by composite metric", status: "refuted",
      reason: "Sinatra et al. 2016: citation metrics have predictive validity that role-based metrics cannot replicate short-term" }
  ],

  activeSources: [
    { id: "lariviere2015", name: "Larivière et al. 2015", type: "paper",
      sections: ["§1", "§2"], file: "lariviere2015.pdf", accessible: true, license: "CC BY",
      authors: "Larivière, Haustein & Mongeon", year: 2015,
      fullTitle: "The oligopoly of academic publishers in the digital era",
      abstract: "Between 1973 and 2013, the share of papers published by the five largest commercial publishers grew from 20% to over 50% of all indexed scientific literature. We trace the historical emergence of this concentration and quantify its consequences for the academic ecosystem.",
      citations: [
        "\"…grew from 20% to over 50% of all indexed scientific literature.\" — used in §1",
        "\"Reed-Elsevier, Wiley-Blackwell, Springer, and Taylor & Francis…\" — used in §2"
      ]
    },
    { id: "plan-s-2021", name: "Plan S — cOAlition S", type: "paper",
      sections: ["§2"], file: "plan-s-2021.pdf", accessible: true, license: "CC BY",
      authors: "cOAlition S", year: 2021,
      fullTitle: "Making full and immediate Open Access a reality",
      abstract: "Plan S requires that, from 2021, all scholarly publications resulting from research funded by participating funders must be published in compliant Open Access journals or platforms, or made immediately available through OA repositories without embargo.",
      citations: [
        "Mandate for immediate OA — referenced in §2 as policy framework"
      ]
    },
    { id: "citation-graph", name: "citation_graph_analysis.py", type: "code",
      sections: ["§4"], file: "citation_graph_analysis.py", accessible: true, license: "own",
      authors: "M. Vargas", year: 2026,
      code: `import networkx as nx
import pandas as pd
from pathlib import Path

# Load citation corpus
df = pd.read_csv("library/papers/citations_corpus.csv")
G = nx.from_pandas_edgelist(df, "citing", "cited", create_using=nx.DiGraph())

# Concentration metrics
big_five = ["Elsevier", "Wiley", "Springer", "Taylor&F", "SAGE"]
share = sum(G.in_degree(p) for p in big_five) / G.number_of_edges()
print(f"Big-Five inbound share: {share:.2%}")`
    },
    { id: "bohannon2016", name: "Bohannon 2016 (Sci-Hub)", type: "paper",
      sections: [], file: "bohannon2016.pdf", accessible: false, license: "restricted", note: "Related",
      authors: "John Bohannon", year: 2016,
      fullTitle: "Who's downloading pirated papers? Everyone",
      abstract: "[Source restricted — not currently accessible. Cached metadata only. Score reports show downloads originating from every continent and every academic discipline, including from researchers at well-funded institutions with paid subscriptions.]"
    }
  ],

  alerts: [
    { type: "info", text: "2 library sources semantically related but not linked" },
    { type: "warning", text: "H3 (in-review) used as support in §2 — verify before submission" },
    { type: "error", text: "§3 Framework has no sources assigned" }
  ],

  contextFiles: [
    {
      name: "LUMEN.md",
      color: "#F59E0B",
      colorSoft: "#FEF3C7",
      loadStatus: "always loaded",
      content: `# LUMEN.md — Open Knowledge Infrastructure

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
  └─ Sinatra et al. 2016: citation metrics have predictive validity...

## ACTIVE SOURCES
- lariviere2015 → §1, §2
- plan-s-2021 → §2
- citation_graph_analysis → §4
- bohannon2016 → Related`
    },
    {
      name: "SOURCES.md",
      color: "#3B82F6",
      colorSoft: "#DBEAFE",
      loadStatus: "on demand",
      content: `# SOURCES.md

## Larivière et al. 2015
**Título:** The oligopoly of academic publishers in the digital era
**Journal:** PLOS ONE · CC BY
**Resumen:** Muestra que 5 editoriales controlan >50% de la literatura revisada por pares.
**Relevancia:** Fundamento empírico central para §1 y §2.
**Citas usadas:** "grew from 20% to over 50% of all indexed scientific literature"

## Plan S — cOAlition S 2021
**Título:** Making full and immediate Open Access a reality
**Fuente:** cOAlition S · CC BY
**Resumen:** Mandato de OA inmediato para investigación financiada públicamente en Europa.
**Relevancia:** Marco político que justifica la propuesta en §2.`
    },
    {
      name: "CONCEPTS.md",
      color: "#7C3AED",
      colorSoft: "#EDE9FE",
      loadStatus: "on demand",
      content: `# CONCEPTS.md

## Líneas de investigación activas
→ Diamond OA Economics
→ Researcher Identity & Prestige

## Hipótesis vinculadas al AKM
- H1 conecta con: línea "Diamond OA Economics" (AKM global)
- H2 conecta con: línea "Researcher Identity" (AKM global)
- H5 REFUTADA: documentado en AKM con justificación completa

## Conceptos propios del investigador
- "Prestige decoupling" — definición propia, 2025
- "Consortia threshold model" — hipótesis en desarrollo`
    }
  ],

  tex: `\\documentclass[12pt]{article}
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

% Anchor on Larivière 2015 oligopoly framing
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

Gold OA has not eliminated the financial burden---it has redistributed it.
APCs at major publishers range from \\$150 to \\$10,100 per article \\citep{elsevier2024apc}.

\\section{A Framework for Diamond OA}

\\subsection{Core Principles}

Diamond OA eliminates APCs entirely. Costs are absorbed by institutional
consortia, academic societies, or public funders---not individual authors.

\\subsection{Implementation Model}

We propose a three-tier consortia model where institutions contribute
proportionally to their research output, creating a sustainable funding
mechanism without author-side charges.`
};

// LaTeX syntax highlighter — returns array of {text, kind} tokens
function highlightLatex(text) {
  const tokens = [];
  const re = /(%[^\n]*)|(\\begin\{[^}]*\}|\\end\{[^}]*\})|(\\[a-zA-Z]+\*?)|([{}])|([^\\%{}]+)/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    if (m[1]) tokens.push({ text: m[1], kind: 'comment' });
    else if (m[2]) tokens.push({ text: m[2], kind: 'env' });
    else if (m[3]) tokens.push({ text: m[3], kind: 'cmd' });
    else if (m[4]) tokens.push({ text: m[4], kind: 'brace' });
    else tokens.push({ text: m[5], kind: 'text' });
  }
  return tokens;
}

// Markdown render — minimal: headings, bold, lists
function renderMarkdown(md) {
  return md.split('\n').map((line, i) => {
    if (line.startsWith('# ')) return { kind: 'h1', text: line.slice(2), key: i };
    if (line.startsWith('## ')) return { kind: 'h2', text: line.slice(3), key: i };
    if (line.startsWith('### ')) return { kind: 'h3', text: line.slice(4), key: i };
    if (line.startsWith('- ') || line.startsWith('  - ')) return { kind: 'li', text: line.replace(/^\s*-\s/, ''), key: i, indent: line.startsWith('  ') };
    if (line.startsWith('  └─') || line.startsWith('  ↳')) return { kind: 'sub', text: line.trim(), key: i };
    if (line.trim() === '') return { kind: 'br', text: '', key: i };
    return { kind: 'p', text: line, key: i };
  });
}

// ── HDU-G: LaTeX integration ───────────────────────────────────────────────

// Autocomplete dictionary triggered by '\' inside the editor.
// `snippet` lets the inserter place the caret intelligently (see insertTexAtCursor).
const LATEX_COMMANDS = [
  // Greek
  { cmd: '\\alpha',   label: '\\alpha — α',    kind: 'greek',  snippet: '\\alpha' },
  { cmd: '\\beta',    label: '\\beta — β',     kind: 'greek',  snippet: '\\beta' },
  { cmd: '\\gamma',   label: '\\gamma — γ',    kind: 'greek',  snippet: '\\gamma' },
  { cmd: '\\delta',   label: '\\delta — δ',    kind: 'greek',  snippet: '\\delta' },
  { cmd: '\\epsilon', label: '\\epsilon — ε',  kind: 'greek',  snippet: '\\epsilon' },
  { cmd: '\\theta',   label: '\\theta — θ',    kind: 'greek',  snippet: '\\theta' },
  { cmd: '\\lambda',  label: '\\lambda — λ',   kind: 'greek',  snippet: '\\lambda' },
  { cmd: '\\mu',      label: '\\mu — μ',       kind: 'greek',  snippet: '\\mu' },
  { cmd: '\\pi',      label: '\\pi — π',       kind: 'greek',  snippet: '\\pi' },
  { cmd: '\\sigma',   label: '\\sigma — σ',    kind: 'greek',  snippet: '\\sigma' },
  { cmd: '\\phi',     label: '\\phi — φ',      kind: 'greek',  snippet: '\\phi' },
  { cmd: '\\omega',   label: '\\omega — ω',    kind: 'greek',  snippet: '\\omega' },
  // Math operators
  { cmd: '\\sum',     label: '\\sum — sumatoria',     kind: 'math',  snippet: '\\sum_{i=0}^{n}' },
  { cmd: '\\int',     label: '\\int — integral',      kind: 'math',  snippet: '\\int_{a}^{b}' },
  { cmd: '\\prod',    label: '\\prod — producto',     kind: 'math',  snippet: '\\prod_{i=1}^{n}' },
  { cmd: '\\frac',    label: '\\frac — fracción',     kind: 'math',  snippet: '\\frac{}{}' },
  { cmd: '\\sqrt',    label: '\\sqrt — raíz',         kind: 'math',  snippet: '\\sqrt{}' },
  { cmd: '\\lim',     label: '\\lim — límite',        kind: 'math',  snippet: '\\lim_{x \\to \\infty}' },
  { cmd: '\\infty',   label: '\\infty — ∞',           kind: 'math',  snippet: '\\infty' },
  { cmd: '\\partial', label: '\\partial — ∂',         kind: 'math',  snippet: '\\partial' },
  { cmd: '\\nabla',   label: '\\nabla — ∇',           kind: 'math',  snippet: '\\nabla' },
  // Structure
  { cmd: '\\section',       label: '\\section{}',       kind: 'struct', snippet: '\\section{}' },
  { cmd: '\\subsection',    label: '\\subsection{}',    kind: 'struct', snippet: '\\subsection{}' },
  { cmd: '\\subsubsection', label: '\\subsubsection{}', kind: 'struct', snippet: '\\subsubsection{}' },
  { cmd: '\\paragraph',     label: '\\paragraph{}',     kind: 'struct', snippet: '\\paragraph{}' },
  // Text style
  { cmd: '\\textbf',  label: '\\textbf — negrita',    kind: 'text', snippet: '\\textbf{}' },
  { cmd: '\\textit',  label: '\\textit — cursiva',    kind: 'text', snippet: '\\textit{}' },
  { cmd: '\\underline', label: '\\underline',         kind: 'text', snippet: '\\underline{}' },
  { cmd: '\\emph',    label: '\\emph — énfasis',      kind: 'text', snippet: '\\emph{}' },
  // References
  { cmd: '\\cite',    label: '\\cite{}',              kind: 'ref',  snippet: '\\cite{}' },
  { cmd: '\\citep',   label: '\\citep{} (paren.)',    kind: 'ref',  snippet: '\\citep{}' },
  { cmd: '\\citet',   label: '\\citet{} (textual)',   kind: 'ref',  snippet: '\\citet{}' },
  { cmd: '\\ref',     label: '\\ref{}',               kind: 'ref',  snippet: '\\ref{}' },
  { cmd: '\\label',   label: '\\label{}',             kind: 'ref',  snippet: '\\label{}' },
  { cmd: '\\href',    label: '\\href{url}{text}',     kind: 'ref',  snippet: '\\href{}{}' },
  { cmd: '\\url',     label: '\\url{}',               kind: 'ref',  snippet: '\\url{}' },
  // Environments
  { cmd: '\\begin{equation}',  label: 'equation env',  kind: 'env', snippet: '\\begin{equation}\n  \n\\end{equation}' },
  { cmd: '\\begin{itemize}',   label: 'itemize env',   kind: 'env', snippet: '\\begin{itemize}\n  \\item \n\\end{itemize}' },
  { cmd: '\\begin{enumerate}', label: 'enumerate env', kind: 'env', snippet: '\\begin{enumerate}\n  \\item \n\\end{enumerate}' },
  { cmd: '\\begin{figure}',    label: 'figure env',    kind: 'env', snippet: '\\begin{figure}[h]\n  \\centering\n  \\includegraphics[width=0.8\\textwidth]{}\n  \\caption{}\n  \\label{fig:}\n\\end{figure}' },
  { cmd: '\\begin{table}',     label: 'table env',     kind: 'env', snippet: '\\begin{table}[h]\n  \\centering\n  \\begin{tabular}{cc}\n    a & b \\\\\n    c & d \\\\\n  \\end{tabular}\n  \\caption{}\n\\end{table}' },
  { cmd: '\\item',    label: '\\item — entrada lista', kind: 'env', snippet: '\\item ' },
];

const KIND_HUE = { greek: 70, math: 260, struct: 170, text: 145, ref: 30, env: 305 };

// ── parseLatexToHtml ───────────────────────────────────────────────────────
// Translates the main LaTeX commands into semantic HTML so PdfPreview can
// render a "compiled" view. Math (inline $...$ and display $$...$$ or
// equation/align envs) is left untouched so MathJax can typeset it afterwards.
// Designed to tolerate spaces between command name and braces: \section { x }.
function parseLatexToHtml(tex) {
  if (!tex) return '';

  // Strip preamble (everything before \begin{document}) but capture title meta.
  let title = '', author = '', date = '';
  const titleM   = tex.match(/\\title\s*\{([^}]*)\}/);
  const authorM  = tex.match(/\\author\s*\{([\s\S]*?)\}/);
  const dateM    = tex.match(/\\date\s*\{([^}]*)\}/);
  if (titleM)  title  = titleM[1].replace(/\\\\/g, '<br/>');
  if (authorM) author = authorM[1].replace(/\\\\/g, '<br/>');
  if (dateM)   date   = dateM[1];

  const docStart = tex.indexOf('\\begin{document}');
  let body = docStart === -1 ? tex : tex.slice(docStart + '\\begin{document}'.length);
  const docEnd = body.indexOf('\\end{document}');
  if (docEnd !== -1) body = body.slice(0, docEnd);

  // Strip comments (% ... end of line, but not \%).
  body = body.replace(/(^|[^\\])%[^\n]*/g, '$1');

  // Escape HTML entities first so we don't break MathJax.
  body = body.replace(/</g, '&lt;').replace(/>/g, '&gt;');

  // \maketitle → render the captured title block.
  body = body.replace(/\\maketitle/g, () => `
    <header class="lx-title-block">
      <h1 class="lx-title">${title}</h1>
      ${author ? `<div class="lx-author">${author}</div>` : ''}
      ${date   ? `<div class="lx-date">${date}</div>`     : ''}
    </header>
  `);

  // abstract env
  body = body.replace(/\\begin\{abstract\}([\s\S]*?)\\end\{abstract\}/g,
    (_, inner) => `<section class="lx-abstract"><div class="lx-abstract-label">Abstract</div>${inner}</section>`);

  // Section headings (tolerant of spaces and starred forms).
  body = body.replace(/\\subsubsection\*?\s*\{\s*([^}]*?)\s*\}/g, '<h3 class="lx-h3">$1</h3>');
  body = body.replace(/\\subsection\*?\s*\{\s*([^}]*?)\s*\}/g,    '<h2 class="lx-h2">$1</h2>');
  body = body.replace(/\\section\*?\s*\{\s*([^}]*?)\s*\}/g,       '<h1 class="lx-h1">$1</h1>');
  body = body.replace(/\\paragraph\*?\s*\{\s*([^}]*?)\s*\}/g,     '<h4 class="lx-h4">$1</h4>');

  // Text style
  body = body.replace(/\\textbf\s*\{\s*([^}]*?)\s*\}/g, '<strong>$1</strong>');
  body = body.replace(/\\textit\s*\{\s*([^}]*?)\s*\}/g, '<em>$1</em>');
  body = body.replace(/\\emph\s*\{\s*([^}]*?)\s*\}/g,   '<em>$1</em>');
  body = body.replace(/\\underline\s*\{\s*([^}]*?)\s*\}/g, '<u>$1</u>');
  body = body.replace(/\\texttt\s*\{\s*([^}]*?)\s*\}/g, '<code>$1</code>');

  // References — render as styled inline citations
  body = body.replace(/\\citep\s*\{\s*([^}]*?)\s*\}/g, '<span class="lx-cite">($1)</span>');
  body = body.replace(/\\citet\s*\{\s*([^}]*?)\s*\}/g, '<span class="lx-cite">$1</span>');
  body = body.replace(/\\cite\s*\{\s*([^}]*?)\s*\}/g,  '<span class="lx-cite">[$1]</span>');
  body = body.replace(/\\ref\s*\{\s*([^}]*?)\s*\}/g,   '<span class="lx-ref">§$1</span>');
  body = body.replace(/\\label\s*\{\s*([^}]*?)\s*\}/g, ''); // drop labels from rendered output
  body = body.replace(/\\href\s*\{\s*([^}]*?)\s*\}\s*\{\s*([^}]*?)\s*\}/g, '<a class="lx-link" href="$1">$2</a>');
  body = body.replace(/\\url\s*\{\s*([^}]*?)\s*\}/g,   '<a class="lx-link" href="$1">$1</a>');
  body = body.replace(/\\footnote\s*\{\s*([^}]*?)\s*\}/g, '<sup class="lx-foot">[$1]</sup>');

  // Lists
  body = body.replace(/\\begin\{itemize\}([\s\S]*?)\\end\{itemize\}/g, (_, inner) => {
    const items = inner.split(/\\item\s*/).filter(s => s.trim()).map(s => `<li>${s.trim()}</li>`).join('');
    return `<ul class="lx-ul">${items}</ul>`;
  });
  body = body.replace(/\\begin\{enumerate\}([\s\S]*?)\\end\{enumerate\}/g, (_, inner) => {
    const items = inner.split(/\\item\s*/).filter(s => s.trim()).map(s => `<li>${s.trim()}</li>`).join('');
    return `<ol class="lx-ol">${items}</ol>`;
  });

  // Figure / table envs — render a placeholder with the caption.
  body = body.replace(/\\begin\{figure\}[\s\S]*?\\caption\s*\{\s*([^}]*?)\s*\}[\s\S]*?\\end\{figure\}/g,
    (_, cap) => `<figure class="lx-figure"><div class="lx-fig-ph">[figure]</div><figcaption>${cap}</figcaption></figure>`);
  body = body.replace(/\\begin\{table\}([\s\S]*?)\\end\{table\}/g, (_, inner) => {
    const cap = (inner.match(/\\caption\s*\{\s*([^}]*?)\s*\}/) || [, ''])[1];
    return `<figure class="lx-figure"><div class="lx-fig-ph">[table]</div><figcaption>${cap}</figcaption></figure>`;
  });

  // Equation env → wrap in $$...$$ so MathJax handles it.
  body = body.replace(/\\begin\{(equation\*?|align\*?|gather\*?)\}([\s\S]*?)\\end\{\1\}/g,
    (_, env, inner) => `<div class="lx-eq">$$${inner.trim()}$$</div>`);

  // Inline em-dash convention LaTeX --- and --
  body = body.replace(/---/g, '—').replace(/--/g, '–');

  // Escaped percent
  body = body.replace(/\\%/g, '%').replace(/\\\$/g, '$').replace(/\\&amp;/g, '&').replace(/\\#/g, '#').replace(/\\_/g, '_');

  // Paragraphs: split on blank lines, wrap raw text segments in <p>.
  // Don't wrap anything already inside a block element we generated.
  const HTML_BLOCK_RE = /^\s*<(?:header|section|h1|h2|h3|h4|ul|ol|figure|div)/;
  body = body.split(/\n\s*\n/).map(seg => {
    const t = seg.trim();
    if (!t) return '';
    if (HTML_BLOCK_RE.test(t)) return t;
    return `<p class="lx-p">${t.replace(/\n/g, ' ')}</p>`;
  }).join('\n');

  return body;
}

Object.assign(window, { PAPER_DATA, highlightLatex, renderMarkdown, LATEX_COMMANDS, KIND_HUE, parseLatexToHtml });
