# Tutorial express — probar las 9 HDUs del MVP

Guía rápida para validar cada criterio de aceptación a mano. Las HDUs marcadas con **(parcial)** o **(no impl.)** se documentan tal cual están en el código a fecha de hoy.

---

## 0. Setup una vez

```bash
# 1. Dependencias
npm install
npm --prefix backend install

# 2. (Opcional para HDU 2/7) Ollama local — sólo si NO vas a usar OpenAI/Claude/Gemini
#    En otra terminal:
ollama serve
ollama pull deepseek-r1:1.5b   # ~1.1 GB, el modelo liviano por defecto

# 3. Lanzar la app
npm start
```

La primera vez se crea `~/.config/Lumen/` con `pdfs/`, `notes/`, `embeddings.json` y `keys.json`.

> Backend RAG se levanta solo cuando se abre la app, en puerto 3847. Ningún LLM se precarga en segundo plano.


---

## HDU 10 — Trabajar sobre fuentes dentro del paper  (parcial)

**Dónde:** Research → paper activo.

### Caso 1 — Abrir fuente desde el panel

1. En la sidebar izquierda hay **Sources**: click en cualquier `source-*` o presiona `+` → **Source** y elige una.
2. **Esperado:** la fuente se abre como nueva pestaña dentro del workspace del paper. No te lleva a la Library global.

### Caso 2 — Fragmento → cita en el paper

1. En la pestaña con la fuente abierta, en el panel de lectura, la barra superior muestra **Highlight / Note / Copy citation**.
2. Selecciona texto y prueba **Copy citation** → debería copiar al clipboard una cita estructurada.
3. En el editor del paper (vista **Write**), el autocomplete `\cite{` y `\citep{` sugiere los ids de las fuentes vinculadas.

> Limitación: el flujo "selecciono texto en la fuente → automáticamente se inserta como cita formateada en el paper en un solo click" no está completamente cableado. Requiere validación manual fina.

---

## HDU 13 — Asistente RAG sobre corpus personal

**Dónde:** Research → tab `+` → **Chat**.

### Caso 1 — Sin API key

1. Selecciona proveedor **Anthropic** (o OpenAI/Gemini) en Ajustes ⚙ del chat.
2. **Esperado:** el panel sigue visible y editable, sólo el botón **Send** queda gris. La sección "API Key" en Ajustes muestra el campo donde guardarla. No hay popup bloqueante.

### Caso 2 — Pregunta con corpus indexado

1. Deja PDFs en `~/.config/Lumen/pdfs/` (o usa el botón 📎 del composer para subir uno).
2. Una vez subido, espera el mensaje `✓ "x.pdf" subido. Índice reconstruido: N doc(s), M chunks.`
3. Pregunta algo presente en el PDF, ej. `¿En cuál fuente se menciona Diamond OA?`.
4. **Esperado:** respuesta del LLM seguida de pills (`source · score%`). El prompt del backend instruye al modelo a citar la fuente en cada afirmación.

> Limitación actual: las pills muestran sólo el nombre y score. El fragmento textual y enlace clicable directo al PDF **no están implementados** todavía.

### Caso 3 — Pregunta fuera del corpus

1. Sube un PDF cualquiera, pregunta algo deliberadamente off-topic.
2. **Esperado:** el modelo responde "no se encontró en el contexto" o similar. Si el modelo alucina, depende del LLM; el prompt está hecho para evitarlo.

### Caso 4 — Cambiar de proveedor sin reiniciar

1. Con un chat abierto, en Ajustes cambia el proveedor de Ollama a Anthropic (con API key guardada).
2. Envía un mensaje nuevo.
3. **Esperado:** la respuesta viene del nuevo proveedor (puedes verificarlo viendo el log del backend en Ajustes → `Backend log`).

---

## HDU 9 — Compilar LaTeX in-app  (revertido)

**Estado:** **revertido explícitamente** en commit `73b77f8` ("Revert HDU-G: roll back LaTeX editor / autocomplete / PDF export") a pedido del usuario.

Existe la vista **WriteView** con resaltado básico y autocomplete `\cite{}`, pero **no hay compilación pdflatex/xelatex ni preview PDF** en el código actual. No se puede validar este HDU sin reimplementar el subsistema LaTeX.

---

## HDU 6 — Líneas de investigación + hipótesis

**Dónde:** AKM → tab **Research Lines**.

### Caso 1 — Listado

1. Abre la vista.
2. **Esperado:** sidebar izquierda muestra cada línea con:
   - Pill de estado (Active / Suspended / Closed / In review / Refuted).
   - Pregunta orientadora.
   - Mini-rail SVG con hipótesis.
   - Conteo `N hyp.` y `M papers`.

### Caso 2 — Crear línea con estado inicial

1. Click `+` arriba a la izquierda del panel **Research Lines**.
2. Escribe la pregunta en el textarea.
3. **Esperado:** debajo del textarea aparece la fila `Estado: [Active] [Suspended] [Closed]` con chips clickeables. Click sobre uno cambia el resaltado.
4. Click **Add line**.
5. **Esperado:** nueva línea aparece en la lista con el estado seleccionado y fecha de creación = hoy.

### Caso 3 — Hipótesis asociadas

1. Selecciona la línea.
2. Click **+ New** en sección **Hypotheses**.
3. Escribe una proposición falsificable, click **Add hypothesis**.
4. **Esperado:** nueva hipótesis aparece en la lista y como punto en el rail superior. Click sobre la tarjeta permite cambiar estado (Active / In review / Suspended / Refuted).

---

## HDU V1 — Búsqueda full-text

**Dónde:** **`Ctrl/Cmd + K`** en cualquier vista.

### Caso 1 — Resultados en tiempo real

1. Abre la paleta, teclea `merge`.
2. **Esperado:** lista de matches se actualiza letra a letra. Cada fila muestra:
   - Título con `merge` resaltado en amarillo.
   - Badge del tipo (`Object` / `Free` / `Library` / `Vault`).
   - Snippet con el término resaltado.
   - Tercera línea: `📄 fuente` o `🌐 URL` y a la derecha la fecha.

### Caso 2 — Click a nota → abre en editor

1. Click sobre un resultado tipo `Vault` u `Object`.
2. **Esperado:** la paleta cierra, la app navega a AKM → Notes y abre la nota en una pestaña.

### Caso 3 — Click a fuente web → navega URL

1. Pega manualmente una nota Library con campo `url` (o usa la nota generada por HDU 1, que trae URL).
2. Busca por algo del título, click sobre el resultado.
3. **Esperado:** si tiene URL `http(s)://…`, se abre `window.open(url)` (nueva ventana o sistema operativo según config de Electron).

### Caso 4 — Sin resultados

1. Busca `zzzzzzz`.
2. **Esperado:** mensaje `Sin resultados para zzzzzzz` en lugar de lista vacía.

---



## HDU V2 — Contexto persistente lumen.md  (no impl.)

**Estado:** **no existe** en el código actual. No hay concepto de "proyecto" como entidad persistente ni archivo `lumen.md` por proyecto.

Lo que existe parcial: los paper-workspaces en `prototype/components/research/data.jsx` son objetos mockeados en memoria, sin persistencia ni archivo asociado.

**Para validar este HDU hay que implementarlo primero** (subsistema completo: `projectsVault.js`, IPC handlers, UI de creación, hook en linkeo de fuente/nota, inyección en prompt LLM).

---

## HDU V3 — Notas Markdown + backlinks bidireccionales

**Dónde:** AKM → tab **Notes** → sección **Vault** → `+ Nueva nota`.

### Caso 1 — Edición Markdown con live preview

1. Crea una nueva nota.
2. Escribe en el textarea izquierdo:
   ```
   # Mi título
   **negrita** y *itálica*
   - item uno
   - item dos
   > cita
   ```
3. **Esperado:** el panel derecho **Preview** muestra el render formateado en tiempo real.
4. Toggle `◧ Editor / ◨ Preview` arriba a la derecha apaga/enciende el preview (estado persiste en localStorage).

### Caso 2 — Autocomplete `[[ ]]`

1. En el textarea, escribe `[[al`.
2. **Esperado:** popup flotante bajo el caret con candidatos que contienen `al` (case-insensitive).
3. Navega con `↑↓`, confirma con `Enter` o `Tab` → se inserta `[[Algoritmos]]` completo y el caret queda después de `]]`. `Esc` cancela.

### Caso 3 — Backlinks bidireccionales

1. Crea **Nota A**, escribe `Ver [[Quick Sort]]`.
2. Abre **Quick Sort**.
3. **Esperado:** sección **Backlinks** al final de Quick Sort muestra "Nota A" con snippet `…Ver [[Quick Sort]]…` y es clickeable de vuelta.

### Caso 4 — Autoguardado

1. Edita una nota vault, **espera ~1s** sin teclear.
2. **Esperado:** indicador arriba a la derecha cambia: `Sin guardar` → `Guardando…` → `Guardado` (verde).
3. Verifica en disco: `cat ~/.config/Lumen/notes/vault-*.md` — el archivo refleja los cambios.

> Debounce real: 600 ms tras última tecla (criterio dice "más de 2s" — más rápido es mejor).

---
## HDU V4 — Captura web a nota

**Dónde:** sidebar izquierdo → **Research** (cualquier paper) → tab `+` → **Web**.

### Caso 1 — Captura con selección

1. En el webview, navega a un artículo (ej. `https://en.wikipedia.org/wiki/Open_access`).
2. Selecciona con el mouse un párrafo.
3. Presiona `Ctrl+Shift+S` **dentro del webview** (o haz click en el botón **Capturar** de la toolbar).
4. **Esperado:**
   - Toast `Captura guardada como nota .md` abajo a la derecha.
   - Aparece tarjeta en sidebar izquierdo bajo "Capturas web" con pill `.md`.
   - Se creó archivo en `~/.config/Lumen/notes/vault-<hash>.md` con frontmatter (`id`, `title`, `created`, `modified`) y body: cita en bloque `>`, URL, título, fecha y hora.

### Caso 2 — Captura sin selección

1. Sin seleccionar nada, presiona `Ctrl+Shift+S`.
2. **Esperado:** toast amarillo `Selecciona texto en la página primero`, ningún archivo creado.

### Caso 3 — Aparece sin recargar

1. Tras una captura exitosa, navega a otra URL en el mismo webview.
2. **Esperado:** la tarjeta sigue en la sidebar; no hubo reload.

### Caso 4 — Abrir y editar la nota capturada

1. Click sobre la tarjeta de captura en la sidebar.
2. **Esperado:** la app cambia a la sección **AKM → Notes**, abre la nota recién creada.
3. Bajo la cita, escribe `[[al` y espera medio segundo.
4. **Esperado:** popup flotante con candidatos (`Algoritmos`, etc.). `↓` y `Enter` inserta `[[Algoritmos]]`. Abrir esa otra nota muestra la nota capturada en su panel **Backlinks**.

---

## Resumen del estado

| HDU | Cumple criterios | Notas |
|----|---|---|
| 10 | Sí parcial | Apertura ✓, flujo de selección→cita necesita pulido |
| 13 |  Sí parcial | Falta fragmento + enlace clicable en pills |
| 9 | **Revertido** | No reimplementar sin pedido explícito |
| 6 | Sí | Selector de estado inicial agregado |
| V1 | Sí | Metadata visible + URL navega |
| V2 | **No** | Subsistema completo por implementar |
| V3 | Sí | Live preview + autocomplete + backlinks + autosave |
| V4 | Sí | Captura + persistencia + cascade + `[[]]` autocomplete |


---

## Tips si algo no funciona

- `View → Toggle Developer Tools` para ver errores en la consola del renderer.
- En el chat → `Ajustes` → `Backend log` muestra las últimas 15 líneas del proceso `nalanda-rag`.
- Si el backend no levanta: `lsof -i :3847` por si quedó otra instancia colgada.
- Para resetear todo: cierra la app y borra `~/.config/Lumen/` (te lleva al estado inicial).
