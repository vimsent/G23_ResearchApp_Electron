
```markdown
# G23 ResearchApp (Electron)

Aplicación de escritorio construida con Electron y backend Node.js.

## Requisitos previos

- **Git** (para clonar el repositorio)
- **Node.js** versión **20 LTS** (la aplicación usa Electron 31, que incluye Node 20.14.0)
- **npm** (viene con Node.js)

> ⚠️ **Importante**: Versiones superiores de Node (22, 23, 24) pueden causar errores en la instalación de Electron. Usa estrictamente Node 20 LTS.

## Instalación paso a paso

### 1. Clonar el repositorio

```bash
git clone https://github.com/vimsent/G23_ResearchApp_Electron.git
cd G23_ResearchApp_Electron
```

### 2. Instalar dependencias del sistema operativo

#### 🐧 Debian / Ubuntu (incluyendo Trixie/Bookworm)

```bash
sudo apt update
sudo apt install -y libxrandr2 libxcomposite1 libxcursor1 libxdamage1 \
  libxfixes3 libxi6 libxtst6 libgl1 libasound2t64 libnspr4 \
  libatk-bridge2.0-0t64 libcups2t64 libdrm2 xdg-utils
```

> Nota: `libgl1` reemplaza al antiguo `libgl1-mesa-glx` (ya obsoleto en versiones recientes).

#### 🐧 Fedora / RHEL

```bash
sudo dnf install -y libXrandr libXcomposite libXcursor libXdamage \
  libXfixes libXi libXtst mesa-libGL alsa-lib nspr \
  at-spi2-atk cups-libs libdrm xdg-utils
```

#### 🪟 Windows

Las dependencias del sistema se instalan automáticamente con Electron. Asegúrate de tener instalado:

- [Microsoft Visual C++ Redistributable](https://aka.ms/vs/17/release/vc_redist.x64.exe) (versión 2015-2022)
- [DirectX Runtime](https://www.microsoft.com/en-us/download/details.aspx?id=35) (opcional, para aceleración gráfica)

### 3. Instalar Node.js 20 LTS

#### En Debian/Fedora (recomendado: usar nvm)

```bash
# Instalar nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
source ~/.bashrc

# Instalar y usar Node 20
nvm install 20
nvm use 20
nvm alias default 20   # opcional
```

#### En Windows

Descarga el instalador oficial de [Node.js 20 LTS](https://nodejs.org/dist/v20.18.0/node-v20.18.0-x64.msi) y ejecútalo.

Verifica la instalación:

```bash
node --version   # debe mostrar v20.x.x
npm --version
```

### 4. Instalar dependencias del proyecto (npm)

```bash
npm install
```

Esto instalará todas las dependencias del frontend (Electron) y del backend (carpeta `backend/`).

### 5. Solución de problemas: “Electron failed to install correctly”

Si al ejecutar `npm start` aparece el error `Electron failed to install correctly`, significa que el binario nativo de Electron no se descargó/descomprimió automáticamente. Esto suele pasar en Linux con Node.js 20+.

**Solución manual (solo si ocurre el error):**

```bash
# 1. Descomprimir el archivo .zip que npm descargó en la caché
unzip -o ~/.cache/electron/*/electron-v*-linux-x64.zip -d node_modules/electron/dist/

# 2. Crear el archivo path.txt (sin salto de línea final)
printf "electron" > node_modules/electron/path.txt

# 3. Dar permisos de ejecución
chmod +x node_modules/electron/dist/electron
```

En **Windows**, el binario se descarga normalmente como `.exe`. Si falla, intenta:

```bash
npm explore electron -- npm run postinstall
```

### 6. Ejecutar la aplicación

```bash
npm start
```

La ventana principal de Electron debería abrirse.

## Comandos útiles adicionales

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | (si existe) Inicia en modo desarrollo con recarga en caliente |
| `npm run build` | (si existe) Genera el ejecutable para distribución |
| `npm audit fix` | Corrige vulnerabilidades en dependencias (ejecutar con cuidado) |

## Estructura del proyecto

```
G23_ResearchApp_Electron/
├── backend/          # API o servidor interno (Node.js)
├── frontend/         # Código renderizado por Electron
├── main.js           # Proceso principal de Electron
├── package.json
└── README.md
```

## Notas importantes

- Si cambias de sistema operativo o actualizas Node.js, **elimina `node_modules` y `package-lock.json`** y vuelve a ejecutar `npm install`.
- En Linux, si la ventana de Electron aparece en blanco, instala `libgbm1` y `libnotify4`:

  ```bash
  sudo apt install -y libgbm1 libnotify4   # Debian/Ubuntu
  sudo dnf install -y libgbm libnotify     # Fedora
  ```
- El proyecto fue desarrollado originalmente con Node 20; usar versiones superiores puede causar advertencias de `deprecated` (no críticas) pero se recomienda mantener la versión indicada.

## Soporte

Para cualquier problema, revisa la [sección de issues del repositorio](https://github.com/vimsent/G23_ResearchApp_Electron/issues) o crea uno nuevo con la salida completa de `npm start` y tu sistema operativo.

---

