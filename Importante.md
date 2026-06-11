
# Los 3 archivos base están creados. Ahora la guía completa paso a paso:
                                                                                          
  ---
  Paso 1 — Instalar Node.js LTS y dependencias de Electron en Linux                                                                  
                                                                                                                                     
  Usa nvm (funciona igual en Fedora y Debian, sin permisos root):                                                                    
                                                                                                                                     
  # 1. Instalar nvm                                         
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash                                                    
                                                                                                                                     
  # 2. Recargar el shell (o abre una terminal nueva)                                                                                 
  source ~/.bashrc   # si usas bash                                                                                                  
  source ~/.zshrc    # si usas zsh                                                                                                   
                                                            
  # 3. Instalar Node.js LTS y activarlo                                                                                              
  nvm install --lts
  nvm use --lts                                                                                                                      
  nvm alias default node                                    
                                                                                                                                     
  # 4. Verificar
  node --version   # debe mostrar v22.x o superior                                                                                   
  npm --version                                             

  Dependencias de sistema que Electron necesita en Linux (instalar una sola vez):                                                    
   
  Fedora:                                                                                                                            
  sudo dnf install -y libX11 libXrandr libXcomposite libXcursor libXdamage \
    libXext libXfixes libXi libXrender libXtst mesa-libGL alsa-lib \        
    nss nspr at-spi2-atk cups-libs libdrm xdg-utils                                                                                  
                                                                                                                                     
  Debian/Ubuntu:                                                                                                                     
  sudo apt-get install -y libx11-dev libxrandr-dev libxcomposite1 libxcursor1 \                                                      
    libxdamage1 libxext-dev libxfixes3 libxi-dev libxrender1 libxtst6 \                                                              
    libgl1-mesa-glx libasound2 libnss3 libnspr4 libatk-bridge2.0-0 \                                                                 
    libcups2 libdrm2 xdg-utils                                                                                                       
                                                                                                                                     
  ---                                                                                                                                
  Paso 2 — Estructura del proyecto Electron                                                                                          
                                                                                                                                     
  Los archivos package.json, main.js y preload.js ya fueron creados en este directorio (G23_ResearchApp_Electron/). La estructura
  final será:                                                                                                                        
                                                            
  G23_ResearchApp_Electron/                                                                                                          
  ├── package.json        ✅ creado                         
  ├── main.js             ✅ creado
  ├── preload.js          ✅ creado
  └── prototype/          ← aquí va el contenido de G23_Prototype/v2/                                                                
      ├── index.html                                                                                                                 
      └── components/                                                                                                                
          ├── Sidebar.jsx                                                                                                            
          ├── HomeView.jsx                                  
          └── research/                                                                                                              
              ├── Chrome.jsx
              ├── ResearchView.jsx                                                                                                   
              └── ...                                       
                                                                                                                                     
  Cómo copiar el prototipo:
                                                                                                                                     
  # Opción A: clonar el repo completo y enlazar la carpeta v2
  cd /home/vicente/Escritorio/USM/FERIA/G23_ResearchApp_Electron                                                                     
  git clone https://github.com/Lettuce-UTFSM/G23_ResearchApp.git _repo                                                               
  cp -r _repo/G23_Prototype/v2 prototype                                                                                             
  rm -rf _repo   # borrar el repo clonado si no lo necesitas                                                                         
                                                                                                                                     
  # Opción B (más limpia): si ya tienes el repo clonado en otro lugar                                                                
  cp -r /ruta/al/repo/G23_Prototype/v2 ./prototype          
                                                                                                                                     
  Por qué funciona sin cambiar index.html:                                                                                           
                                                                                                                                     
  main.js carga prototype/index.html con win.loadFile(...). Ese HTML ya tiene <script type="text/babel" src="components/Sidebar.jsx">
   con rutas relativas — todas resuelven correctamente porque Electron las sirve como file:// desde el mismo directorio. La opción
  webSecurity: false es necesaria para que Babel pueda hacer XHR a esos archivos .jsx locales (Chromium bloquea esas peticiones por  
  defecto desde file://).                                   

  ---                                                                                                                                
  Paso 3 — Instalar, correr y verificar
                                                                                                                                     
  cd /home/vicente/Escritorio/USM/FERIA/G23_ResearchApp_Electron
                                                                                                                                     
  # 1. Instalar dependencias (descarga Electron ~150MB, solo la primera vez)                                                         
  npm install                                                                                                                        
                                                                                                                                     
  # 2. Verificar que el directorio quedó bien                                                                                        
  ls prototype/           # debe mostrar index.html y components/
  ls prototype/components/ # debe mostrar Sidebar.jsx, HomeView.jsx, etc.                                                            
                                                            
  # 3. Lanzar la app                                                                                                                 
  npm start
                                                                                                                                     
  Deberías ver una ventana de escritorio nativa con la app Lumen completa. Si algo falla, lanza con logs:                            
   
  npm run dev 2>&1 | head -50                                                                                                        
                                                                                                                                     
  Errores comunes:
                                                                                                                                     
  ┌───────────────────────────────┬─────────────────────────────────────┬─────────────────────────────────────────────────────┐
  │             Error             │                Causa                │                      Solución                       │
  ├───────────────────────────────┼─────────────────────────────────────┼─────────────────────────────────────────────────────┤
  │ Cannot find module 'electron' │ npm install no corrió               │ Correr npm install                                  │
  ├───────────────────────────────┼─────────────────────────────────────┼─────────────────────────────────────────────────────┤
  │ Pantalla en blanco            │ prototype/ no existe o está vacía   │ Verificar que prototype/index.html existe           │      
  ├───────────────────────────────┼─────────────────────────────────────┼─────────────────────────────────────────────────────┤      
  │ ERR_FILE_NOT_FOUND en consola │ Ruta relativa de un componente rota │ Revisar que todos los .jsx están en sus subcarpetas │      
  ├───────────────────────────────┼─────────────────────────────────────┼─────────────────────────────────────────────────────┤      
  │ Fuentes no cargan             │ Sin internet (Google Fonts es CDN)  │ Normal, funciona sin fuentes como fallback          │
  └───────────────────────────────┴─────────────────────────────────────┴─────────────────────────────────────────────────────┘      
                                                            
  Para ver la consola del renderer (errores de React/Babel): View > Toggle Developer Tools o descomenta openDevTools() en main.js.   
                                                            
  ---                                                                                                                                
  Paso 4 — Webview real de Chromium para investigación      
                                                                                                                                     
  Aclaración sobre Chrome.jsx: ese archivo es el "chrome" de la interfaz (barra superior de Topbar y el VerticalToolbar de formato
  LaTeX). No es un navegador. El webview va como un nuevo tipo de tab dentro de ResearchView.                                        
                                                            
  4a. Crear WebBrowserTab.jsx                                                                                                        
                                                            
  Crea el archivo prototype/components/research/WebBrowserTab.jsx:                                                                   
                                                            
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
      wv.addEventListener('dom-ready',           onReady)                                                                            
      wv.addEventListener('did-start-loading',   onStart)                                                                            
      wv.addEventListener('did-stop-loading',    onStop)    
      wv.addEventListener('did-navigate',        onNavigate)                                                                         
      wv.addEventListener('did-navigate-in-page',onNavigate)
      return () => {                                                                                                                 
        wv.removeEventListener('dom-ready',           onReady)
        wv.removeEventListener('did-start-loading',   onStart)                                                                       
        wv.removeEventListener('did-stop-loading',    onStop)
        wv.removeEventListener('did-navigate',        onNavigate)                                                                    
        wv.removeEventListener('did-navigate-in-page',onNavigate)                                                                    
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
      { label: 'Scholar',  url: 'https://scholar.google.com' },
      { label: 'PubMed',   url: 'https://pubmed.ncbi.nlm.nih.gov' },                                                                 
      { label: 'arXiv',    url: 'https://arxiv.org' },                                                                               
      { label: 'SSRN',     url: 'https://www.ssrn.com' },                                                                            
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
        {/* Toolbar de navegación */}                                                                                                
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,                                                                             
          padding: '6px 10px', borderBottom: '1px solid var(--border)',                                                              
          background: 'var(--bg)', flexShrink: 0,
        }}>                                                                                                                          
          <button style={navBtn} onClick={() => viewRef.current?.goBack()}    title="Atrás">‹</button>
          <button style={navBtn} onClick={() => viewRef.current?.goForward()} title="Adelante">›</button>                            
          <button style={navBtn} onClick={() => viewRef.current?.reload()}    title="Recargar">↺</button>
                                                                                                                                     
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
            {loading && (                                   
              <span style={{ fontSize: 11, color: 'var(--muted)', flexShrink: 0 }}>cargando…</span>
            )}                                                                                                                       
          </div>
                                                                                                                                     
          {BOOKMARKS.map(b => (                             
            <button key={b.label} onClick={() => loadUrl(b.url)} style={{                                                            
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 6, padding: '3px 9px', fontSize: 11, fontWeight: 500,                                                    
              color: 'var(--muted)', cursor: 'pointer', fontFamily: 'var(--font-ui)',                                                
            }}>{b.label}</button>                                                                                                    
          ))}                                                                                                                        
        </div>                                              
                                                                                                                                     
        {/* webview: proceso Chromium real, con cookies/sesión aisladas */}                                                          
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
   
  4b. Agregar el <script> en index.html                                                                                              
                                                            
  Busca el bloque de scripts del research (justo antes de </body>) y agrega UNA línea:                                               
   
    <script type="text/babel" src="components/research/Chrome.jsx"></script>                                                         
    <script type="text/babel" src="components/research/WriteView.jsx"></script>                                                      
    <script type="text/babel" src="components/research/ResearchView.jsx"></script>
  + <script type="text/babel" src="components/research/WebBrowserTab.jsx"></script>                                                  
                                                            
  4c. Modificar ResearchView.jsx — 3 cambios quirúrgicos                                                                             
                                                            
  Cambio 1: En NewTabPicker, agrega el botón Web (después del botón de Chat):                                                        
                                                            
            <button onClick={() => onPick({ type: 'chat' })} style={pickerBtn}>                                                      
              <ChatIcon size={12} /> Chat                                                                                            
            </button>                                                                                                                
  +         <button onClick={() => onPick({ type: 'web' })} style={pickerBtn}>                                                       
  +           🌐 <span style={{ flex: 1 }}>Navegar web</span>                                                                        
  +         </button>                                                                                                                
            <button onClick={() => onPick({ type: 'chart' })} style={pickerBtn}>
                                                                                                                                     
  Cambio 2: En handlePick dentro de ResearchView, agrega el caso web:

        const id = `${pick.type}-${Date.now()}`;
  -     const titles = { chat: 'New chat', chart: 'New chart', canvas: 'New canvas' };
  +     const titles = { chat: 'New chat', chart: 'New chart', canvas: 'New canvas', web: 'Browser' };
        setTabs(t => [...t, { id, type: pick.type, title: titles[pick.type] }]);

  Cambio 3: En la sección de contenido de tabs, agrega el render del webview:

            {active && active.type === 'canvas' && <PlaceholderTab kind="canvas" />}
  +         {active && active.type === 'web' && (
  +           <WebBrowserTab defaultUrl="https://scholar.google.com" />
  +         )}

  Por qué funciona

  - webviewTag: true en main.js habilita el elemento <webview> en el renderer
  - <webview> crea un proceso Chromium real separado (no un <iframe>)
  - partition="persist:research" da al browser su propia sesión con cookies persistentes (útil para login en Scholar, PubMed, etc.)
  - wv.loadURL() navega programáticamente; getURL() lee la URL actual para actualizar la barra de dirección
  - webSecurity de la ventana principal no afecta al webview — este tiene su propia seguridad habilitada

  ---
  Paso 5 — Empaquetar como ejecutable Linux

  cd /home/vicente/Escritorio/USM/FERIA/G23_ResearchApp_Electron

  # Solo AppImage (funciona en cualquier distro, sin instalar)
  npm run dist:appimage

  # Solo .deb (para Debian/Ubuntu/Fedora con dpkg)
  npm run dist:deb

  # Ambos a la vez
  npm run dist

  Los ejecutables quedan en dist/:

  Cambio 2: En handlePick dentro de ResearchView, agrega el caso web:

        const id = `${pick.type}-${Date.now()}`;
  -     const titles = { chat: 'New chat', chart: 'New chart', canvas: 'New canvas' };
  +     const titles = { chat: 'New chat', chart: 'New chart', canvas: 'New canvas', web: 'Browser' };
        setTabs(t => [...t, { id, type: pick.type, title: titles[pick.type] }]);

  Cambio 3: En la sección de contenido de tabs, agrega el render del webview:

            {active && active.type === 'canvas' && <PlaceholderTab kind="canvas" />}
  +         {active && active.type === 'web' && (
  +           <WebBrowserTab defaultUrl="https://scholar.google.com" />
  +         )}

  Por qué funciona

  - webviewTag: true en main.js habilita el elemento <webview> en el renderer
  - <webview> crea un proceso Chromium real separado (no un <iframe>)
  - partition="persist:research" da al browser su propia sesión con cookies persistentes (útil para login en Scholar, PubMed, etc.)
  - wv.loadURL() navega programáticamente; getURL() lee la URL actual para actualizar la barra de dirección
  - webSecurity de la ventana principal no afecta al webview — este tiene su propia seguridad habilitada

  ---
  Paso 5 — Empaquetar como ejecutable Linux

  cd /home/vicente/Escritorio/USM/FERIA/G23_ResearchApp_Electron

  # Solo AppImage (funciona en cualquier distro, sin instalar)
  npm run dist:appimage

  # Solo .deb (para Debian/Ubuntu/Fedora con dpkg)
  npm run dist:deb

  # Ambos a la vez
  npm run dist

  Los ejecutables quedan en dist/:

  dist/
  ├── Lumen-0.1.0.AppImage    # ejecutable portable (~150MB)
  ├── lumen_0.1.0_amd64.deb   # paquete Debian
  └── linux-unpacked/         # carpeta con binarios sin empaquetar

  Para correr el AppImage:

  chmod +x dist/Lumen-0.1.0.AppImage
  ./dist/Lumen-0.1.0.AppImage

  Si el AppImage falla con error de FUSE:

  # Fedora
  sudo dnf install fuse fuse-libs

  # Debian
  sudo apt-get install fuse libfuse2

  # O correr sin FUSE (extrae temporalmente)
  ./dist/Lumen-0.1.0.AppImage --appimage-extract-and-run

  Para instalar el .deb:

  # Debian/Ubuntu
  sudo dpkg -i dist/lumen_0.1.0_amd64.deb

  # Fedora (vía alien)
  sudo dnf install alien
  sudo alien -r dist/lumen_0.1.0_amd64.deb
  sudo rpm -i lumen-*.rpm

  ---
  Resumen del flujo completo

  # Una sola vez: setup
  npm install
  cp -r /path/to/G23_Prototype/v2 ./prototype

  # Desarrollo diario
  npm start

  # Cuando quieras distribuir
  npm run dist

  Los únicos archivos que Electron necesita entender son main.js y preload.js. Todo lo demás (index.html, .jsx, fonts CDN) lo maneja
  Chromium exactamente igual que un navegador — sin build step, sin Vite, sin webpack.
