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
  const re = /(%[^\n]*)|(\\begin\{[^}]*\}|\\end\{[^}]*\})|(\\[a-zA-Z]+\*?)|([{}])|([^\\%{}]+)|(.)/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    if (m[1]) tokens.push({ text: m[1], kind: 'comment' });
    else if (m[2]) tokens.push({ text: m[2], kind: 'env' });
    else if (m[3]) tokens.push({ text: m[3], kind: 'cmd' });
    else if (m[4]) tokens.push({ text: m[4], kind: 'brace' });
    else if (m[5]) tokens.push({ text: m[5], kind: 'text' });
    else if (m[6]) tokens.push({ text: m[6], kind: 'text' });
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

// LaTeX → HTML renderer for the PDF preview / compile output
function parseLatexToHtml(tex, paperTitle = 'Untitled Paper') {
  if (!tex) return { title: paperTitle, author: '—', date: '', abstract: '', bodyHtml: '' };

  // Clean comments
  const cleanTex = tex.replace(/%[^\n]*/g, '');

  const titleMatch = cleanTex.match(/\\title\{([\s\S]*?)\}/);
  const authorMatch = cleanTex.match(/\\author\{([\s\S]*?)\}/);
  const dateMatch = cleanTex.match(/\\date\{([\s\S]*?)\}/);
  const absMatch = cleanTex.match(/\\begin\{abstract\}([\s\S]*?)\\end\{abstract\}/);

  const inlineFmt = (s) => s
    .replace(/\\\\/g, '<br/>')
    .replace(/\\textbf\{([^}]+)\}/g, '<strong>$1</strong>')
    .replace(/\\textit\{([^}]+)\}/g, '<em>$1</em>')
    .replace(/\\underline\{([^}]+)\}/g, '<u>$1</u>')
    .trim();

  const title = titleMatch ? inlineFmt(titleMatch[1]) : paperTitle;
  const author = authorMatch ? inlineFmt(authorMatch[1]) : '—';
  const date = dateMatch ? dateMatch[1].trim() : '';
  const abstract = absMatch ? absMatch[1].trim() : '';

  // Parse sections and paragraphs
  let bodyContent = cleanTex;
  const docStart = cleanTex.indexOf('\\begin{document}');
  if (docStart !== -1) {
    bodyContent = cleanTex.substring(docStart + 16);
  }
  const docEnd = bodyContent.indexOf('\\end{document}');
  if (docEnd !== -1) {
    bodyContent = bodyContent.substring(0, docEnd);
  }

  // Remove maketitle and abstract from body content
  bodyContent = bodyContent.replace(/\\maketitle/g, '');
  bodyContent = bodyContent.replace(/\\begin\{abstract\}[\s\S]*?\\end\{abstract\}/g, '');

  const lines = bodyContent.split('\n');
  let html = '';
  let currentParagraph = '';
  let sectionCounter = 0;
  let subsectionCounter = 0;
  const flushParagraph = () => {
    if (currentParagraph) {
      html += `<p style="font-size: 12.5px; margin-bottom: 12px; text-align: justify; text-indent: 1.5em; line-height: 1.6;">${currentParagraph}</p>`;
      currentParagraph = '';
    }
  };

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();
    if (!line) { flushParagraph(); continue; }

    const secMatch = line.match(/\\section(\*?)\s*\{\s*([^}]+?)\s*\}/);
    if (secMatch) {
      flushParagraph();
      const isStarred = secMatch[1] === '*';
      let headingText = secMatch[2];
      if (!isStarred) {
        sectionCounter++;
        subsectionCounter = 0;
        headingText = `${sectionCounter}  ${headingText}`;
      }
      html += `<h2 style="font-size: 15px; font-weight: 600; margin-top: 24px; margin-bottom: 8px; font-family: 'Lora', Georgia, serif;">${headingText}</h2>`;
      continue;
    }

    const subMatch = line.match(/\\subsection(\*?)\s*\{\s*([^}]+?)\s*\}/);
    if (subMatch) {
      flushParagraph();
      const isStarred = subMatch[1] === '*';
      let headingText = subMatch[2];
      if (!isStarred) {
        subsectionCounter++;
        headingText = `${sectionCounter}.${subsectionCounter}  ${headingText}`;
      }
      html += `<h3 style="font-size: 13.5px; font-weight: 600; margin-top: 18px; margin-bottom: 6px; font-family: 'Lora', Georgia, serif; font-style: italic;">${headingText}</h3>`;
      continue;
    }

    const subsubMatch = line.match(/\\subsubsection(\*?)\s*\{\s*([^}]+?)\s*\}/);
    if (subsubMatch) {
      flushParagraph();
      html += `<h4 style="font-size: 12.5px; font-weight: 600; margin-top: 14px; margin-bottom: 4px; font-family: 'Lora', Georgia, serif;">${subsubMatch[2]}</h4>`;
      continue;
    }

    // Inline LaTeX → HTML
    line = line.replace(/\\\\/g, '<br/>');
    line = line.replace(/\\href\s*\{\s*([^}]+?)\s*\}\s*\{\s*([^}]+?)\s*\}/g, '<a href="$1" target="_blank" style="color: var(--accent); text-decoration: underline;">$2</a>');
    line = line.replace(/\\url\s*\{\s*([^}]+?)\s*\}/g, '<a href="$1" target="_blank" style="color: var(--accent); text-decoration: underline;">$1</a>');
    line = line.replace(/\\citep\s*\{\s*([^}]+?)\s*\}/g, '[$1]');
    line = line.replace(/\\cite\s*\{\s*([^}]+?)\s*\}/g, '[$1]');
    line = line.replace(/\\ref\s*\{\s*([^}]+?)\s*\}/g, '<span style="color: var(--accent); font-weight: 600;">$1</span>');
    line = line.replace(/\\footnote\s*\{\s*([^}]+?)\s*\}/g, '<span style="font-size: 8.5px; vertical-align: super; color: var(--accent); cursor: help; font-weight: bold;" title="$1">[nota]</span>');
    line = line.replace(/\\textbf\s*\{\s*([^}]+?)\s*\}/g, '<strong>$1</strong>');
    line = line.replace(/\\textit\s*\{\s*([^}]+?)\s*\}/g, '<em>$1</em>');
    line = line.replace(/\\underline\s*\{\s*([^}]+?)\s*\}/g, '<u>$1</u>');
    line = line.replace(/\\[a-zA-Z]+\*?/g, '');
    line = line.replace(/\\\{/g, '&#123;');
    line = line.replace(/\\\}/g, '&#125;');
    line = line.replace(/[{}]/g, '');

    currentParagraph += (currentParagraph ? ' ' : '') + line;
  }
  flushParagraph();

  return { title, author, date, abstract, bodyHtml: html };
}

Object.assign(window, { PAPER_DATA, highlightLatex, renderMarkdown, parseLatexToHtml });
