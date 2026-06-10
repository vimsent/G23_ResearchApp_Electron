// Shared bits: file/source icons, ContextFileItem, SourceItem, MarkdownView

function FileIcon({ color = 'var(--muted)', size = 13 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 2h7l3 3v9a1 1 0 01-1 1H3a1 1 0 01-1-1V3a1 1 0 011-1z" />
      <path d="M10 2v3h3" />
    </svg>
  );
}

function PaperIcon({ color = 'var(--muted)', size = 12 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="1.4" strokeLinecap="round">
      <rect x="3" y="2" width="10" height="12" rx="1" />
      <path d="M5.5 5h5M5.5 7.5h5M5.5 10h3" />
    </svg>
  );
}

function CodeIcon({ color = 'var(--muted)', size = 12 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5.5 4l-3.5 4 3.5 4M10.5 4l3.5 4-3.5 4" />
    </svg>
  );
}

function WebIcon({ color = 'var(--muted)', size = 12 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="1.4">
      <circle cx="8" cy="8" r="6" />
      <path d="M2 8h12M8 2c2 2.5 2 9.5 0 12M8 2c-2 2.5-2 9.5 0 12" />
    </svg>
  );
}

function ChatIcon({ color = 'var(--muted)', size = 12 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.5 4a1 1 0 011-1h9a1 1 0 011 1v6a1 1 0 01-1 1H6l-3 2.5V11h-.5a1 1 0 01-1-1V4z" />
    </svg>
  );
}

function ChartIcon({ color = 'var(--muted)', size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="1.4" strokeLinecap="round">
      <path d="M2 13h12M3 13V8M6 13V5M9 13V9M12 13V3" />
    </svg>
  );
}

function CanvasIcon({ color = 'var(--muted)', size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="1.4">
      <rect x="2" y="3" width="12" height="10" rx="1" />
      <path d="M5 6h2.5M5 9h5" strokeLinecap="round" />
    </svg>
  );
}

function getSourceIcon(type, color, size) {
  if (type === 'paper') return <PaperIcon color={color} size={size} />;
  if (type === 'code') return <CodeIcon color={color} size={size} />;
  if (type === 'web') return <WebIcon color={color} size={size} />;
  return <FileIcon color={color} size={size} />;
}

// Texture layer for Style-B chips (CSS-only, low opacity)
function ctxTextureLayer(kind) {
  if (kind === 'grid') return {
    image: 'linear-gradient(rgba(40,40,60,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(40,40,60,0.07) 1px, transparent 1px)',
    size: '9px 9px',
  };
  if (kind === 'dots') return {
    image: 'radial-gradient(rgba(40,40,60,0.11) 1.1px, transparent 1.5px)',
    size: '11px 11px',
  };
  // default: diagonal thin 45° lines
  return {
    image: 'repeating-linear-gradient(45deg, rgba(50,35,20,0.06) 0, rgba(50,35,20,0.06) 1px, transparent 1px, transparent 7px)',
    size: 'auto',
  };
}

function LoadBadge({ file, isAlways, onPastel }) {
  return (
    <span style={{
      fontSize: 10, padding: '2px 6px', borderRadius: 4,
      background: onPastel ? 'rgba(255,255,255,0.62)' : (isAlways ? 'oklch(0.94 0.05 170)' : 'var(--surface-2)'),
      color: isAlways ? 'oklch(0.34 0.12 170)' : 'var(--muted)',
      fontWeight: 600, letterSpacing: '0.01em',
      fontFamily: 'var(--font-ui)', whiteSpace: 'nowrap',
    }}>{isAlways && file.name === 'LUMEN.md' ? (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
        <span style={{
          width: 5, height: 5, borderRadius: '50%', background: 'oklch(0.5 0.13 170)',
          animation: 'pulse 2s ease-in-out infinite', display: 'inline-block',
        }} />
        live
      </span>
    ) : file.loadStatus}</span>
  );
}

function ContextFileItem({ file, expanded, onToggle, compact, styleMode = 'A', colorHex, deepHex, texture = 'lines' }) {
  const isAlways = file.loadStatus === 'always loaded';
  const accent = deepHex || file.color;
  const pastel = colorHex || file.colorSoft || '#F3F1EC';
  const styleB = styleMode === 'B';
  const tex = ctxTextureLayer(texture);

  return (
    <div style={{
      borderRadius: 9, overflow: 'hidden', marginBottom: 2,
      background: !styleB && expanded ? 'var(--bg)' : 'transparent',
      transition: 'background 0.1s ease',
    }}>
      {styleB ? (
        /* ===== Style B — pastel pill + texture overlay, no folder icon ===== */
        <button onClick={onToggle} style={{
          display: 'flex', alignItems: 'center', gap: 8, width: '100%',
          padding: '9px 11px', cursor: 'pointer', textAlign: 'left',
          border: `1px solid ${accent}3A`, borderRadius: 9,
          background: `${tex.image}, ${pastel}`,
          backgroundSize: `${tex.size}, auto`,
          boxShadow: expanded ? `inset 0 0 0 1px ${accent}55` : 'none',
          transition: 'box-shadow 0.12s ease',
        }}>
          <span style={{
            width: 6, height: 6, borderRadius: '50%', background: accent, flexShrink: 0,
          }} />
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 600,
            color: 'var(--text)', flex: 1,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>{file.name}</span>
          <LoadBadge file={file} isAlways={isAlways} onPastel />
          <span style={{ fontSize: 9, color: 'var(--text-soft)' }}>{expanded ? '▾' : '▸'}</span>
        </button>
      ) : (
        /* ===== Style A — folder icon + left accent bar ===== */
        <button onClick={onToggle} style={{
          display: 'flex', alignItems: 'stretch', gap: 0, width: '100%',
          background: 'transparent', border: 'none', padding: 0,
          cursor: 'pointer', textAlign: 'left', borderRadius: 8, overflow: 'hidden',
        }}
        onMouseEnter={(e) => { if (!expanded) e.currentTarget.style.background = 'var(--surface-2)'; }}
        onMouseLeave={(e) => { if (!expanded) e.currentTarget.style.background = 'transparent'; }}
        >
          <div style={{ width: 3, background: accent, flexShrink: 0 }} />
          <div style={{
            flex: 1, padding: '8px 9px 8px 10px',
            display: 'flex', alignItems: 'center', gap: 8, minWidth: 0,
          }}>
            <FileIcon color={accent} size={12} />
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: 12,
              fontWeight: 600, color: 'var(--text)', flex: 1,
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>{file.name}</span>
            <LoadBadge file={file} isAlways={isAlways} />
            <span style={{ fontSize: 9, color: 'var(--muted)' }}>{expanded ? '▾' : '▸'}</span>
          </div>
        </button>
      )}
      <div style={{
        maxHeight: expanded ? 220 : 0,
        opacity: expanded ? 1 : 0,
        overflow: 'hidden',
        transition: 'max-height 0.2s ease, opacity 0.15s ease',
      }}>
        <div style={{
          maxHeight: 220, overflowY: 'auto',
          padding: styleB ? '8px 12px 12px 13px' : '0 12px 12px 17px',
        }}>
          <MarkdownView md={file.content} accent={accent} />
        </div>
      </div>
    </div>
  );
}

function MarkdownView({ md, accent }) {
  const blocks = renderMarkdown(md);
  return (
    <div style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: 'var(--text-soft)', lineHeight: 1.55 }}>
      {blocks.map(b => {
        if (b.kind === 'h1') return <div key={b.key} style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--text)', margin: '8px 0 5px', fontFamily: 'var(--font-mono)' }}>{b.text}</div>;
        if (b.kind === 'h2') return <div key={b.key} style={{ fontSize: 11, fontWeight: 700, color: accent || 'var(--muted)', margin: '7px 0 3px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{b.text}</div>;
        if (b.kind === 'h3') return <div key={b.key} style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--text-soft)', margin: '5px 0 2px' }}>{b.text}</div>;
        if (b.kind === 'li') return <div key={b.key} style={{ paddingLeft: b.indent ? 18 : 8, position: 'relative', margin: '1px 0' }}>
          <span style={{ position: 'absolute', left: b.indent ? 8 : 0, color: 'var(--muted)' }}>·</span>
          {renderInlineMd(b.text)}
        </div>;
        if (b.kind === 'sub') return <div key={b.key} style={{ paddingLeft: 16, color: 'var(--muted)', fontSize: 11.5, fontStyle: 'italic' }}>{b.text}</div>;
        if (b.kind === 'br') return <div key={b.key} style={{ height: 4 }} />;
        return <div key={b.key} style={{ margin: '2px 0' }}>{renderInlineMd(b.text)}</div>;
      })}
    </div>
  );
}

function renderInlineMd(text) {
  // bold **x**
  const parts = [];
  const re = /\*\*(.+?)\*\*/g;
  let last = 0, m, i = 0;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push(<span key={i++}>{text.slice(last, m.index)}</span>);
    parts.push(<strong key={i++} style={{ color: 'var(--text)', fontWeight: 600 }}>{m[1]}</strong>);
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push(<span key={i++}>{text.slice(last)}</span>);
  return parts;
}

function SectionPill({ children, soft }) {
  return (
    <span style={{
      display: 'inline-block', padding: '1px 6px',
      background: soft || 'var(--accent-light)', color: 'var(--accent)',
      borderRadius: 4, fontSize: 10, fontWeight: 600,
      fontFamily: 'var(--font-mono)',
      lineHeight: 1.5,
    }}>{children}</span>
  );
}

function SourceRow({ source, onClick, expanded, opened, dense }) {
  return (
    <div style={{
      borderRadius: 8, overflow: 'hidden',
      background: expanded || opened ? 'var(--bg)' : 'transparent',
    }}>
      <button onClick={onClick} style={{
        display: 'flex', alignItems: 'center', gap: 8, width: '100%',
        background: 'transparent', border: 'none',
        padding: dense ? '7px 9px' : '8px 10px',
        cursor: 'pointer', textAlign: 'left',
        borderLeft: opened ? '2px solid var(--accent)' : '2px solid transparent',
      }}
      onMouseEnter={(e) => { if (!expanded && !opened) e.currentTarget.style.background = 'var(--surface-2)'; }}
      onMouseLeave={(e) => { if (!expanded && !opened) e.currentTarget.style.background = 'transparent'; }}
      >
        {getSourceIcon(source.type, source.accessible ? 'var(--muted)' : 'var(--muted)', 12)}
        <span style={{
          flex: 1, fontSize: 12, color: source.accessible ? 'var(--text)' : 'var(--muted)',
          fontFamily: 'var(--font-ui)', fontWeight: 500,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>{source.name}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          {source.sections && source.sections.map(s => <SectionPill key={s}>{s}</SectionPill>)}
          {source.note && (
            <span style={{
              padding: '1px 6px', background: 'var(--surface-2)', color: 'var(--muted)',
              borderRadius: 4, fontSize: 10, fontWeight: 600,
              fontFamily: 'var(--font-ui)',
            }}>{source.note}</span>
          )}
          <span style={{
            display: 'inline-block', width: 6, height: 6, borderRadius: '50%',
            background: source.accessible ? 'oklch(0.55 0.12 170)' : 'var(--muted)', marginLeft: 4,
          }} title={source.accessible ? 'Accessible' : 'Restricted'} />
        </div>
      </button>
      <div style={{
        maxHeight: expanded ? 200 : 0,
        opacity: expanded ? 1 : 0,
        overflow: 'hidden',
        transition: 'max-height 0.2s ease, opacity 0.15s ease',
      }}>
        <div style={{ maxHeight: 200, overflowY: 'auto', padding: '6px 12px 12px 22px', borderTop: '1px solid var(--border)' }}>
          <SourcePreview source={source} />
        </div>
      </div>
    </div>
  );
}

function SourcePreview({ source }) {
  return (
    <div style={{ fontFamily: 'var(--font-ui)' }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', marginBottom: 2 }}>
        {source.fullTitle || source.name}
      </div>
      <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 6, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        <span>{source.authors}</span>
        <span>·</span>
        <span>{source.year}</span>
        <span>·</span>
        <span style={{
          padding: '0 5px',
          background: source.license === 'restricted' ? 'oklch(0.96 0.04 25)' : 'oklch(0.94 0.05 170)',
          color: source.license === 'restricted' ? 'oklch(0.5 0.16 25)' : 'oklch(0.38 0.12 170)',
          borderRadius: 3, fontSize: 10, fontWeight: 600,
        }}>{source.license}</span>
      </div>
      {source.type === 'code' && source.code ? (
        <pre style={{
          fontFamily: 'var(--font-mono)', fontSize: 11,
          background: 'var(--bg)', padding: '8px 10px', borderRadius: 6,
          color: 'var(--text-soft)', lineHeight: 1.55, margin: 0, overflow: 'auto',
          border: '1px solid var(--border)',
        }}>{source.code}</pre>
      ) : (
        <>
          <div style={{ fontSize: 11.5, color: 'var(--text-soft)', lineHeight: 1.55, marginBottom: 6 }}>
            {source.abstract}
          </div>
          {source.citations && (
            <div style={{ borderLeft: '2px solid var(--accent-light)', paddingLeft: 8, marginTop: 6 }}>
              {source.citations.map((c, i) => (
                <div key={i} style={{ fontSize: 11, color: 'var(--muted)', fontStyle: 'italic', marginBottom: 3 }}>{c}</div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function SectionTitle({ children, hint, action }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '14px 16px 6px', gap: 6,
    }}>
      <span style={{
        fontSize: 10.5, fontWeight: 700, color: 'var(--muted)',
        textTransform: 'uppercase', letterSpacing: '0.08em',
        fontFamily: 'var(--font-ui)',
      }}>{children}</span>
      {hint && (
        <span style={{
          fontSize: 10.5, color: 'var(--muted)', fontStyle: 'italic',
          fontFamily: 'var(--font-ui)', marginLeft: 'auto',
        }}>{hint}</span>
      )}
      {action}
    </div>
  );
}

Object.assign(window, {
  FileIcon, PaperIcon, CodeIcon, WebIcon, ChatIcon, ChartIcon, CanvasIcon,
  getSourceIcon, ContextFileItem, MarkdownView, renderInlineMd, ctxTextureLayer,
  SectionPill, SourceRow, SourcePreview, SectionTitle,
});
