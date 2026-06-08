# Nalanda — Academic Research Platform

Desktop app built with Electron wrapping the **Lumen** React prototype. Runs locally without a backend or build step — React components are transpiled at runtime by Babel.

![Platform](https://img.shields.io/badge/platform-Linux%20%7C%20Windows%20%7C%20macOS-blue)
![Electron](https://img.shields.io/badge/Electron-31-47848F?logo=electron)
![Node](https://img.shields.io/badge/Node.js-LTS-339933?logo=nodedotjs)

---

## Requirements

- **Node.js 20+ (LTS)** — install via nvm (see below)
- **Linux** — Fedora 38+, Debian 11+, or Ubuntu 22.04+
- **Git**
- Internet connection for the first run (Google Fonts + React CDN)

---

## 1 — Install Node.js via nvm

> nvm lets you manage Node versions without root. Works identically on Fedora, Debian, and Ubuntu.

```bash
# Download and run the nvm installer
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# Reload your shell config (or open a new terminal)
source ~/.zshrc     # zsh
# source ~/.bashrc  # bash

# Install the latest LTS and set it as default
nvm install --lts
nvm use --lts
nvm alias default node

# Verify
node --version   # v22.x or higher
npm --version    # 10.x or higher
```

---

## 2 — System dependencies

Electron needs a few system libraries. Most are already installed on a desktop Linux, but run this to be sure.

### Fedora

```bash
sudo dnf install -y libXrandr libXcomposite libXcursor libXdamage \
  libXfixes libXi libXtst mesa-libGL alsa-lib \
  nspr at-spi2-atk cups-libs libdrm xdg-utils
```

### Debian / Ubuntu

```bash
sudo apt-get update
sudo apt-get install -y libxrandr2 libxcomposite1 libxcursor1 libxdamage1 \
  libxfixes3 libxi6 libxtst6 libgl1-mesa-glx libasound2 \
  libnspr4 libatk-bridge2.0-0 libcups2 libdrm2 xdg-utils
```

---

## 3 — Clone and install

```bash
git clone https://github.com/Lettuce-UTFSM/Nalanda_ResearchApp.git
cd Nalanda_ResearchApp
npm install
```

`npm install` downloads Electron (~150 MB) on the first run. If it hangs or fails, see [Troubleshooting](#troubleshooting).

---

## 4 — Run in development

```bash
npm start
```

The Lumen window will open. To see the browser DevTools (React errors, console logs):

```bash
npm run dev
```

Or uncomment this line in `main.js`:

```js
// win.webContents.openDevTools()
```

---

## 5 — Project structure

```
Nalanda_ResearchApp/
├── main.js           # Electron main process — creates the window
├── preload.js        # Node ↔ renderer bridge (contextBridge)
├── package.json      # npm scripts + electron-builder config
└── prototype/        # React app (Babel transpiled at runtime, no build step)
    ├── index.html    # Entry point — loads React 18, Babel, and all components
    └── components/
        ├── Sidebar.jsx
        ├── HomeView.jsx
        ├── LibraryView.jsx
        ├── AKMView.jsx
        ├── EditorView.jsx
        ├── AlexandriaView.jsx
        ├── CommunityView.jsx
        ├── ProfileView.jsx
        ├── FilesView.jsx
        ├── PKMView.jsx
        ├── notes/
        │   ├── NotesData.jsx
        │   ├── NotesParts.jsx
        │   └── NotesView.jsx
        └── research/
            ├── data.jsx
            ├── Shared.jsx
            ├── Chrome.jsx          # Topbar + formatting toolbar
            ├── WriteView.jsx
            ├── ResearchView.jsx
            └── PaperWorkspace.jsx
```

### How the Babel + Electron setup works

`index.html` loads React 18 and Babel Standalone via CDN, then each `.jsx` file as `<script type="text/babel" src="...">`. Babel intercepts those `<script>` tags, fetches each file with XHR, and transpiles JSX to JS in the browser process.

In a regular browser this only works when served from HTTP. Electron loads from `file://`, where Chromium blocks cross-file XHR by default. Setting `webSecurity: false` in `main.js` allows it — safe here because the main window never loads remote HTML.

---

## 6 — Add the research web browser (optional)

To embed a real Chromium webview inside the Research tab (for Google Scholar, PubMed, arXiv):

### 6.1 Create `prototype/components/research/WebBrowserTab.jsx`

```jsx
function WebBrowserTab({ defaultUrl }) {
  const [addressBar, setAddressBar] = React.useState(defaultUrl)
  const [loading, setLoading] = React.useState(false)
  const viewRef = React.useRef(null)
  const isReady = React.useRef(false)

  React.useEffect(() => {
    const wv = viewRef.current
    if (!wv) return
    const onReady    = ()  => { isReady.current = true }
    const onStart    = ()  => setLoading(true)
    const onStop     = ()  => { setLoading(false); setAddressBar(wv.getURL()) }
    const onNavigate = (e) => setAddressBar(e.url)
    wv.addEventListener('dom-ready',            onReady)
    wv.addEventListener('did-start-loading',    onStart)
    wv.addEventListener('did-stop-loading',     onStop)
    wv.addEventListener('did-navigate',         onNavigate)
    wv.addEventListener('did-navigate-in-page', onNavigate)
    return () => {
      wv.removeEventListener('dom-ready',            onReady)
      wv.removeEventListener('did-start-loading',    onStart)
      wv.removeEventListener('did-stop-loading',     onStop)
      wv.removeEventListener('did-navigate',         onNavigate)
      wv.removeEventListener('did-navigate-in-page', onNavigate)
    }
  }, [])

  const loadUrl = (raw) => {
    let url = raw.trim()
    if (!/^https?:\/\//i.test(url)) url = 'https://' + url
    setAddressBar(url)
    const wv = viewRef.current
    if (wv && isReady.current) wv.loadURL(url)
  }

  const BOOKMARKS = [
    { label: 'Scholar', url: 'https://scholar.google.com' },
    { label: 'PubMed',  url: 'https://pubmed.ncbi.nlm.nih.gov' },
    { label: 'arXiv',   url: 'https://arxiv.org' },
    { label: 'SSRN',    url: 'https://www.ssrn.com' },
  ]

  const navBtn = {
    background: 'var(--surface)', border: '1px solid var(--border)',
    borderRadius: 6, width: 28, height: 28, cursor: 'pointer',
    color: 'var(--text)', fontSize: 17, lineHeight: 1,
    fontFamily: 'var(--font-ui)', padding: 0,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        padding: '6px 10px', borderBottom: '1px solid var(--border)',
        background: 'var(--bg)', flexShrink: 0,
      }}>
        <button style={navBtn} onClick={() => viewRef.current?.goBack()}    title="Back">‹</button>
        <button style={navBtn} onClick={() => viewRef.current?.goForward()} title="Forward">›</button>
        <button style={navBtn} onClick={() => viewRef.current?.reload()}    title="Reload">↺</button>
        <div style={{
          flex: 1, display: 'flex', alignItems: 'center', gap: 8,
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 8, padding: '4px 10px',
        }}>
          <input
            value={addressBar}
            onChange={e => setAddressBar(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && loadUrl(addressBar)}
            onFocus={e => e.target.select()}
            style={{
              flex: 1, border: 'none', outline: 'none', fontSize: 12.5,
              color: 'var(--text)', fontFamily: 'var(--font-mono)',
              background: 'transparent',
            }}
          />
          {loading && <span style={{ fontSize: 11, color: 'var(--muted)', flexShrink: 0 }}>loading…</span>}
        </div>
        {BOOKMARKS.map(b => (
          <button key={b.label} onClick={() => loadUrl(b.url)} style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 6, padding: '3px 9px', fontSize: 11, fontWeight: 500,
            color: 'var(--muted)', cursor: 'pointer', fontFamily: 'var(--font-ui)',
          }}>{b.label}</button>
        ))}
      </div>
      <webview
        ref={viewRef}
        src={defaultUrl}
        partition="persist:research"
        style={{ flex: 1, width: '100%', height: '100%' }}
      />
    </div>
  )
}

Object.assign(window, { WebBrowserTab })
```

### 6.2 Add the script tag to `prototype/index.html`

Find the research script block and add one line:

```diff
  <script type="text/babel" src="components/research/ResearchView.jsx"></script>
+ <script type="text/babel" src="components/research/WebBrowserTab.jsx"></script>
```

### 6.3 Add the Web tab to `prototype/components/research/ResearchView.jsx`

**In `NewTabPicker`** — add after the Chat button:
```diff
  <button onClick={() => onPick({ type: 'chat' })} style={pickerBtn}>
    <ChatIcon size={12} /> Chat
  </button>
+ <button onClick={() => onPick({ type: 'web' })} style={pickerBtn}>
+   🌐 <span style={{ flex: 1 }}>Browse web</span>
+ </button>
```

**In `handlePick`** — add `web` to the titles map:
```diff
- const titles = { chat: 'New chat', chart: 'New chart', canvas: 'New canvas' };
+ const titles = { chat: 'New chat', chart: 'New chart', canvas: 'New canvas', web: 'Browser' };
```

**In the tab content area** — add the render:
```diff
  {active && active.type === 'canvas' && <PlaceholderTab kind="canvas" />}
+ {active && active.type === 'web' && (
+   <WebBrowserTab defaultUrl="https://scholar.google.com" />
+ )}
```

---

## 7 — Build for distribution

```bash
# AppImage — portable, runs on any Linux distro without installing
npm run dist:appimage

# .deb — Debian/Ubuntu package
npm run dist:deb

# Both at once
npm run dist
```

Output goes to `dist/`:

```
dist/
├── Lumen-0.1.0.AppImage      # ~150 MB, portable
└── lumen_0.1.0_amd64.deb     # Debian package
```

### Run the AppImage

```bash
chmod +x dist/Lumen-0.1.0.AppImage
./dist/Lumen-0.1.0.AppImage
```

### Install the .deb

```bash
# Debian / Ubuntu
sudo dpkg -i dist/lumen_0.1.0_amd64.deb

# Fedora (via alien)
sudo dnf install alien -y
sudo alien -r dist/lumen_0.1.0_amd64.deb
sudo rpm -i lumen-*.rpm
```

---

## Troubleshooting

### `Electron failed to install correctly`

The Electron binary (~170 MB) failed to download during `npm install`. The zip is cached but extraction silently failed.

**Fix:**

```bash
# Step 1: extract the cached zip manually
unzip -o ~/.cache/electron/*/electron-v*-linux-x64.zip \
  -d node_modules/electron/dist/

# Step 2: write path.txt WITHOUT a trailing newline (important)
printf "electron" > node_modules/electron/path.txt

# Step 3: make the binary executable
chmod +x node_modules/electron/dist/electron

# Verify
ls node_modules/electron/dist/electron   # should exist
cat node_modules/electron/path.txt       # should print: electron  (no newline)
```

Then run `npm start` again.

> **Why this happens:** Electron's `install.js` verifies the SHA256 of the downloaded zip before extracting. If the download came from a mirror (e.g. `npmmirror.com`), the checksum may not match the one expected by the installer, causing a silent abort. The zip itself is valid — it just needs to be extracted manually.

### AppImage fails with FUSE error

```bash
# Fedora
sudo dnf install fuse fuse-libs

# Debian / Ubuntu
sudo apt-get install fuse libfuse2

# Or run without FUSE
./Lumen-0.1.0.AppImage --appimage-extract-and-run
```

### Blank window on startup

Open DevTools (`npm run dev`) and check the console. Common causes:

| Console error | Fix |
|---|---|
| `Failed to fetch` on a `.jsx` file | A component path in `index.html` doesn't match the actual filename |
| `X is not defined` | A component's `<script>` tag is loaded before its dependency |
| Fonts missing | No internet — app still works, just uses fallback fonts |

---

## npm scripts reference

| Command | Description |
|---|---|
| `npm start` | Launch the app |
| `npm run dev` | Launch with verbose Electron logs |
| `npm run dist` | Build AppImage + .deb |
| `npm run dist:appimage` | Build AppImage only |
| `npm run dist:deb` | Build .deb only |
