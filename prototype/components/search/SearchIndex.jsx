// HDU-E: in-memory inverted index over every note in window.NOTE_INDEX.
// Pure-JS (no native deps, no WASM). Drop-in replaceable by SQLite FTS5
// later — the rebuild() / search() interface is what other code consumes.

(() => {
  const STOP = new Set([
    'a','al','de','del','la','el','los','las','un','una','unos','unas',
    'y','o','en','por','para','con','sin','es','son','que','se','su','sus',
    'lo','le','les','no','si','sí','ni','ya','muy','más','mas','como','pero',
    'the','a','an','of','to','in','on','for','and','or','but','is','are','it','this','that','as',
  ]);

  const TOKEN_RE = /[\p{L}\p{N}]+/gu;
  function tokenize(text) {
    const out = [];
    const m = (text || '').toLowerCase().match(TOKEN_RE);
    if (!m) return out;
    for (const t of m) if (t.length >= 2 && !STOP.has(t)) out.push(t);
    return out;
  }

  let state = { tokens: new Map(), docs: new Map(), builtAt: 0 };

  function rebuild() {
    const tokens = new Map();   // token → Map<docId, freq>
    const docs   = new Map();   // docId → { id, title, kind, body }
    const idx = window.NOTE_INDEX || {};
    for (const n of Object.values(idx)) {
      const body = n.body || '';
      const text = (n.title || '') + ' ' + body;
      docs.set(n.id, { id: n.id, title: n.title || 'Untitled', kind: n.kind, body });
      for (const tok of tokenize(text)) {
        let postings = tokens.get(tok);
        if (!postings) { postings = new Map(); tokens.set(tok, postings); }
        postings.set(n.id, (postings.get(n.id) || 0) + 1);
      }
    }
    state = { tokens, docs, builtAt: Date.now() };
    return state;
  }

  function makeSnippet(text, queryTokens) {
    if (!text) return '';
    const lower = text.toLowerCase();
    let pos = -1;
    for (const qt of queryTokens) {
      const i = lower.indexOf(qt);
      if (i !== -1 && (pos === -1 || i < pos)) pos = i;
    }
    if (pos === -1) pos = 0;
    const start = Math.max(0, pos - 50);
    const end   = Math.min(text.length, pos + 130);
    return (start > 0 ? '…' : '') + text.slice(start, end).replace(/\s+/g, ' ').trim() + (end < text.length ? '…' : '');
  }

  // Returns up to `limit` ranked results: [{ id, title, kind, snippet, score, queryTokens }]
  function search(query, limit = 20) {
    const queryTokens = tokenize(query);
    if (!queryTokens.length) return [];
    if (state.builtAt === 0) rebuild();

    const scores = new Map();         // docId → numeric score
    const matched = new Map();        // docId → Set<token> (for AND check)

    for (const qt of queryTokens) {
      const direct = state.tokens.get(qt);
      let hit = false;
      if (direct) {
        hit = true;
        for (const [docId, count] of direct) {
          scores.set(docId, (scores.get(docId) || 0) + count * 2);
          let ms = matched.get(docId);
          if (!ms) { ms = new Set(); matched.set(docId, ms); }
          ms.add(qt);
        }
      }
      // Prefix match (lighter weight) — so "merg" finds "merge".
      for (const [tok, postings] of state.tokens) {
        if (tok !== qt && tok.startsWith(qt)) {
          hit = true;
          for (const [docId, count] of postings) {
            scores.set(docId, (scores.get(docId) || 0) + count);
            let ms = matched.get(docId);
            if (!ms) { ms = new Set(); matched.set(docId, ms); }
            ms.add(qt);
          }
        }
      }
      // No matches for this token → AND semantics zero this out next pass.
      if (!hit) return [];
    }

    // Require every query token to have produced *some* match for each doc (AND).
    const required = queryTokens.length;
    const final = [];
    for (const [docId, score] of scores) {
      if ((matched.get(docId)?.size || 0) === required) {
        const doc = state.docs.get(docId);
        if (doc) final.push({ ...doc, score, queryTokens, snippet: makeSnippet(doc.body || doc.title, queryTokens) });
      }
    }
    final.sort((a, b) => b.score - a.score);
    return final.slice(0, limit);
  }

  function status() {
    return { docs: state.docs.size, tokens: state.tokens.size, builtAt: state.builtAt };
  }

  window.SearchIndex = { rebuild, search, status, tokenize };
})();
