
function LumenLogoMark({ size = 26 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Open book */}
      <path d="M4 22 Q4 20 6 19 L15 17 L15 27 Q10 26 6 27 Q4 27 4 25 Z" fill="oklch(0.42 0.14 260)" opacity="0.15"/>
      <path d="M28 22 Q28 20 26 19 L17 17 L17 27 Q22 26 26 27 Q28 27 28 25 Z" fill="oklch(0.42 0.14 260)" opacity="0.15"/>
      <path d="M4 22 Q4 20 6 19 L15 17 L15 27 Q10 26 6 27 Q4 27 4 25 Z" stroke="oklch(0.42 0.14 260)" strokeWidth="1.2" strokeLinejoin="round"/>
      <path d="M28 22 Q28 20 26 19 L17 17 L17 27 Q22 26 26 27 Q28 27 28 25 Z" stroke="oklch(0.42 0.14 260)" strokeWidth="1.2" strokeLinejoin="round"/>
      <line x1="16" y1="17" x2="16" y2="27" stroke="oklch(0.42 0.14 260)" strokeWidth="1.2"/>
      {/* Tree trunk */}
      <line x1="16" y1="17" x2="16" y2="11" stroke="oklch(0.42 0.14 260)" strokeWidth="1.3" strokeLinecap="round"/>
      {/* Branches */}
      <path d="M16 15 Q13 13 11 11" stroke="oklch(0.42 0.14 260)" strokeWidth="1" strokeLinecap="round"/>
      <path d="M16 13 Q19 11 21 9" stroke="oklch(0.42 0.14 260)" strokeWidth="1" strokeLinecap="round"/>
      <path d="M16 11 Q14 9 13 7" stroke="oklch(0.42 0.14 260)" strokeWidth="1" strokeLinecap="round"/>
      {/* Canopy circles */}
      <circle cx="16" cy="7" r="3.5" fill="oklch(0.42 0.14 260)" opacity="0.18"/>
      <circle cx="16" cy="7" r="3.5" stroke="oklch(0.42 0.14 260)" strokeWidth="1.1"/>
      <circle cx="11" cy="10" r="2.5" fill="oklch(0.42 0.14 260)" opacity="0.15"/>
      <circle cx="11" cy="10" r="2.5" stroke="oklch(0.42 0.14 260)" strokeWidth="1"/>
      <circle cx="21" cy="8" r="2.5" fill="oklch(0.42 0.14 260)" opacity="0.15"/>
      <circle cx="21" cy="8" r="2.5" stroke="oklch(0.42 0.14 260)" strokeWidth="1"/>
    </svg>
  );
}

function Sidebar({ active, setActive, papers, activePaper, setActivePaper }) {
  const [papersExpanded, setPapersExpanded] = React.useState(active === 'editor');
  // Entering the Papers view from elsewhere (e.g. opening a paper from the library) expands the section.
  React.useEffect(() => { if (active === 'editor') setPapersExpanded(true); }, [active]);
  const handlePapersClick = () => {
    if (active === 'editor') setPapersExpanded(e => !e);
    else { setActive('editor'); setPapersExpanded(true); }
  };
  // Individual papers only show when the section is selected AND expanded.
  const showPapers = active === 'editor' && papersExpanded;

  const topNav = [
    { id: 'home', label: 'Home', icon: 'M2 7L8 2l6 5v8a1 1 0 01-1 1H9v-4H7v4H3a1 1 0 01-1-1z' },
    { id: 'library', label: 'Library', icon: 'M3 4h10v1H3zM3 7h10v1H3zM3 10h7v1H3zM3 13h4v1H3z' },
    { id: 'pkm', label: 'AKM', icon: 'M8 8m-2 0a2 2 0 104 0 2 2 0 10-4 0M3 4a1 1 0 102 0 1 1 0 10-2 0M11 4a1 1 0 102 0 1 1 0 10-2 0M3 12a1 1 0 102 0 1 1 0 10-2 0M11 12a1 1 0 102 0 1 1 0 10-2 0M5 4l3 4M11 4l-3 4M5 12l3-4M11 12l-3-4' },
  ];

  const bottomNav = [
    { id: 'alexandria', label: 'Alexandria', icon: 'M10 2a6 6 0 11-4.47 10.06L2 15.5l3.44-3.53A6 6 0 0110 2zm0 2a4 4 0 100 8 4 4 0 000-8z', badge: 'NEW' },
    { id: 'community', label: 'Community', icon: 'M13 6a3 3 0 11-6 0 3 3 0 016 0zM5 8a2 2 0 11-4 0 2 2 0 014 0zM15 8a2 2 0 11-4 0 2 2 0 014 0zM1 14s-1 0-1-1a7 7 0 0114 0c0 1-1 1-1 1H1zm8.5-2.5a5 5 0 00-9 0' },
  ];

  return (
    <div style={s.sidebar}>
      {/* Workspace indicator */}
      <div style={s.workspaceRow}>
        <svg width={11} height={11} viewBox="0 0 16 16" fill="none" stroke="oklch(0.62 0.01 80)" strokeWidth="1.5" strokeLinecap="round"><path d="M2 13V5l6-3 6 3v8M6 13V9h4v4"/></svg>
        <span style={s.workspacePath}>~/Documents/LumenWorkspace</span>
      </div>

      {/* Logo */}
      <div style={s.logo}>
        <LumenLogoMark size={28} />
        <div>
          <div style={s.logoText}>LUMEN</div>
          <div style={s.logoSub}>Lumen</div>
        </div>
      </div>

      {/* Top nav */}
      <nav style={s.topNav}>
        {topNav.map(item => (
          <button key={item.id} onClick={() => setActive(item.id)}
            style={{ ...s.navItem, ...(active === item.id ? s.navItemActive : {}) }}>
            <svg width={14} height={14} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
              <path d={item.icon} />
            </svg>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Divider */}
      <div style={s.divider} />

      {/* Papers — central section */}
      <div style={s.papersSection}>
        <button onClick={handlePapersClick}
          style={{ ...s.papersHeader, ...(active === 'editor' ? s.papersHeaderActive : {}) }}>
          <svg width={14} height={14} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 2h7l4 4v9a1 1 0 01-1 1H3a1 1 0 01-1-1V3a1 1 0 011-1zm7 0v4h4" />
          </svg>
          <span style={s.papersLabel}>Papers</span>
          <span style={s.papersCount}>{papers.length}</span>
          <svg width={11} height={11} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
            style={{ marginLeft: 2, opacity: 0.6, transform: showPapers ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.18s ease' }}>
            <path d="M6 4l4 4-4 4" />
          </svg>
        </button>
        {showPapers && (
          <div style={s.papersList}>
            {papers.map(p => (
              <button key={p.id}
                onClick={() => { setActivePaper(p.id); setActive('editor'); }}
                style={{ ...s.paperItem, ...(activePaper === p.id ? s.paperItemActive : {}) }}>
                <div style={{ ...s.paperBar, background: p.status === 'Draft' ? 'oklch(0.55 0.12 170)' : 'oklch(0.55 0.1 260)' }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={s.paperTitle}>{p.shortTitle}</div>
                  <div style={s.paperStatus}>{p.status}</div>
                </div>
              </button>
            ))}
            <button style={s.newPaperBtn}><span>+</span> New Paper</button>
          </div>
        )}
      </div>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Bottom nav */}
      <nav style={s.bottomNav}>
        {bottomNav.map(item => (
          <button key={item.id} onClick={() => setActive(item.id)}
            style={{ ...s.navItem, ...(active === item.id ? s.navItemActive : {}) }}>
            <svg width={14} height={14} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
              <path d={item.icon} />
            </svg>
            <span style={{ flex: 1 }}>{item.label}</span>
            {item.badge && <span style={s.badge}>{item.badge}</span>}
          </button>
        ))}
      </nav>

      {/* User / Profile */}
      <div style={s.userSection}>
        <button style={{ ...s.userRow, ...(active === 'profile' ? s.userRowActive : {}) }}
          onClick={() => setActive('profile')}>
          <div style={s.avatar}>MV</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={s.userName}>M. Vargas</div>
            <div style={s.userInst}>UC Chile · PhD Researcher</div>
          </div>
          <svg width={12} height={12} viewBox="0 0 16 16" fill="none" stroke="oklch(0.48 0.02 80)" strokeWidth="1.5" strokeLinecap="round"><path d="M4 6l4-4 4 4M4 10l4 4 4-4" /></svg>
        </button>
      </div>
    </div>
  );
}

const s = {
  sidebar: { width: 240, minWidth: 240, background: '#fff', borderRight: '1px solid oklch(0.91 0.008 80)', display: 'flex', flexDirection: 'column', height: '100%', fontFamily: 'var(--font-ui)' },
  workspaceRow: { display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px 6px', borderBottom: '1px solid oklch(0.93 0.006 80)', flexShrink: 0 },
  workspacePath: { fontSize: 10, fontFamily: 'var(--font-mono)', color: 'oklch(0.62 0.01 80)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  logo: { padding: '18px 16px 14px', display: 'flex', alignItems: 'center', gap: 14, borderBottom: '1px solid oklch(0.93 0.006 80)', flexShrink: 0 },
  logoText: { fontSize: 17, fontWeight: 800, color: 'oklch(0.13 0.015 80)', letterSpacing: '0.1em', fontFamily: 'var(--font-ui)', lineHeight: 1.1 },
  logoSub: { fontSize: 17, color: 'oklch(0.62 0.01 80)', letterSpacing: '0.05em', fontFamily: 'var(--font-ui)', marginTop: 1 },
  topNav: { padding: '10px 8px 6px', display: 'flex', flexDirection: 'column', gap: 1, flexShrink: 0 },
  divider: { height: 1, background: 'oklch(0.93 0.006 80)', margin: '4px 8px 8px', flexShrink: 0 },
  papersSection: { padding: '0 8px 8px', flexShrink: 0 },
  papersHeader: { display: 'flex', alignItems: 'center', gap: 7, width: '100%', padding: '18px 20px', borderRadius: 12, border: 'none', background: 'none', cursor: 'pointer', color: 'oklch(0.4 0.01 80)', fontSize: 16.5, fontWeight: 600, fontFamily: 'var(--font-ui)', transition: 'all 0.12s' },
  papersHeaderActive: { background: 'oklch(0.96 0.02 260)', color: 'oklch(0.42 0.14 260)' },
  papersLabel: { flex: 1, textAlign: 'left' },
  papersCount: { fontSize: 16, background: 'oklch(0.93 0.01 80)', color: 'oklch(0.55 0.01 80)', padding: '1px 6px', borderRadius: 12, fontWeight: 600 },
  papersList: { display: 'flex', flexDirection: 'column', gap: 1, paddingTop: 2 },
  paperItem: { display: 'flex', alignItems: 'center', gap: 9, padding: '7px 10px 7px 12px', borderRadius: 12, border: 'none', background: 'none', cursor: 'pointer', textAlign: 'left', width: '100%', fontFamily: 'var(--font-ui)', transition: 'background 0.12s' },
  paperItemActive: { background: 'oklch(0.96 0.02 260)' },
  paperBar: { width: 2, height: 28, borderRadius: 2, flexShrink: 0, opacity: 0.85 },
  paperTitle: { fontSize: 17.5, fontWeight: 500, color: 'oklch(0.25 0.01 80)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 140, lineHeight: 1.3 },
  paperStatus: { fontSize: 16, color: 'oklch(0.6 0.01 80)', marginTop: 1 },
  newPaperBtn: { display: 'flex', alignItems: 'center', gap: 5, padding: '7px 14px', borderRadius: 12, border: '1px dashed oklch(0.84 0.02 260)', background: 'none', cursor: 'pointer', fontSize: 17, color: 'oklch(0.55 0.08 260)', marginTop: 4, fontFamily: 'var(--font-ui)', transition: 'all 0.12s' },
  navItem: { display: 'flex', alignItems: 'center', gap: 14, padding: '9px 12px', borderRadius: 12, border: 'none', background: 'none', cursor: 'pointer', fontSize: 16.5, color: 'oklch(0.48 0.01 80)', textAlign: 'left', width: '100%', transition: 'all 0.12s', fontFamily: 'var(--font-ui)' },
  navItemActive: { background: 'oklch(0.96 0.02 260)', color: 'oklch(0.42 0.14 260)', fontWeight: 600 },
  badge: { fontSize: 8, fontWeight: 800, background: 'oklch(0.42 0.14 260)', color: '#fff', padding: '2px 5px', borderRadius: 3, letterSpacing: '0.06em' },
  bottomNav: { padding: '0 8px 6px', display: 'flex', flexDirection: 'column', gap: 1, flexShrink: 0 },
  userSection: { borderTop: '1px solid oklch(0.93 0.006 80)', padding: '10px 8px', flexShrink: 0 },
  userRow: { display: 'flex', alignItems: 'center', gap: 9, width: '100%', background: 'none', border: 'none', cursor: 'pointer', borderRadius: 12, padding: '7px 8px', transition: 'background 0.12s', textAlign: 'left' },
  userRowActive: { background: 'oklch(0.96 0.02 260)' },
  avatar: { width: 28, height: 28, borderRadius: '50%', background: 'oklch(0.42 0.14 260)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, flexShrink: 0 },
  userName: { fontSize: 16, fontWeight: 600, color: 'oklch(0.2 0.01 80)', fontFamily: 'var(--font-ui)' },
  userInst: { fontSize: 16, color: 'oklch(0.58 0.01 80)', fontFamily: 'var(--font-ui)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
};

Object.assign(window, { Sidebar });
