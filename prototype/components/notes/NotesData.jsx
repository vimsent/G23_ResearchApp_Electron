// NotesData.jsx — content model for the AKM Notes view
// Three note kinds: object (typed/structured), free (markdown in folders), library (source-linked)

// ── Object-note classes (typed notes with structured fields) ───────────────
const NOTE_CLASSES = {
  algoritmos: {
    label: 'Algoritmos',
    icon: 'algo',
    hue: 260,
    fields: ['Nombre', 'Complejidad temporal', 'Complejidad espacial', 'Estable', 'Descripción'],
    keyFields: ['Complejidad temporal', 'Complejidad espacial'],
    boolFields: ['Estable'],
  },
  estrellas: {
    label: 'Estrellas',
    icon: 'star',
    hue: 70,
    fields: ['Nombre', 'Tipo espectral', 'Masa (M☉)', 'Distancia (ly)', 'Descripción'],
    keyFields: ['Tipo espectral', 'Distancia (ly)'],
    boolFields: [],
  },
  proteinas: {
    label: 'Proteínas',
    icon: 'protein',
    hue: 170,
    fields: ['Nombre', 'Función', 'Peso molecular', 'Localización', 'Descripción'],
    keyFields: ['Función', 'Peso molecular'],
    boolFields: [],
  },
  vegetacion: {
    label: 'Vegetación',
    icon: 'leaf',
    hue: 145,
    fields: ['Nombre', 'Familia', 'Bioma', 'Hábito', 'Descripción'],
    keyFields: ['Familia', 'Bioma'],
    boolFields: [],
  },
};

// ── Object notes, grouped by class ─────────────────────────────────────────
const OBJECT_NOTES = {
  algoritmos: [
    {
      id: 'algo-merge', title: 'Merge Sort', date: '2026-05-12',
      fields: {
        'Nombre': 'Merge Sort',
        'Complejidad temporal': 'O(n log n)',
        'Complejidad espacial': 'O(n)',
        'Estable': true,
        'Descripción': 'Ordenamiento por división y mezcla',
      },
      body: `## Idea central

Merge Sort sigue el paradigma de [[Divide y vencerás]]: parte el arreglo en mitades, ordena cada mitad recursivamente y luego **mezcla** las dos mitades ordenadas en tiempo lineal.

## Frente a otros métodos

A diferencia de [[Quick Sort]], garantiza \`O(n log n)\` en el *peor caso*, pero paga memoria adicional proporcional a \`n\`.

- **Estable** — preserva el orden de elementos iguales
- **Predecible** — sin peor caso cuadrático
- **Paralelizable** — las mitades son independientes

> Conviene cuando la estabilidad importa o los datos no caben en memoria (merge sort externo).

Relacionado: [[Tim Sort]] · [[Complejidad asintótica]]`,
    },
    {
      id: 'algo-quick', title: 'Quick Sort', date: '2026-05-10',
      fields: {
        'Nombre': 'Quick Sort',
        'Complejidad temporal': 'O(n log n)',
        'Complejidad espacial': 'O(log n)',
        'Estable': false,
        'Descripción': 'Particionamiento alrededor de un pivote',
      },
      body: `## Idea central

Elige un **pivote**, particiona el arreglo en menores y mayores, y aplica recursión sobre cada partición. Comparte el espíritu de [[Divide y vencerás]] con [[Merge Sort]].

## Cuidado

El peor caso es \`O(n²)\` cuando el pivote está mal elegido (arreglo ya ordenado con pivote extremo). Mitigaciones:

- pivote *mediana de tres*
- pivote aleatorio
- *introsort* — cae a [[Heap Sort]] si la recursión se descontrola

> En la práctica suele ganar por su excelente localidad de caché.`,
    },
    {
      id: 'algo-dijkstra', title: 'Dijkstra', date: '2026-04-28',
      fields: {
        'Nombre': 'Dijkstra',
        'Complejidad temporal': 'O(E log V)',
        'Complejidad espacial': 'O(V)',
        'Estable': false,
        'Descripción': 'Camino más corto desde un origen',
      },
      body: `## Idea central

Encuentra el **camino más corto** desde un nodo origen hacia todos los demás en un grafo con pesos *no negativos*, expandiendo siempre el nodo más cercano pendiente.

Se apoya en una [[Cola de prioridad]] para elegir el siguiente nodo en \`O(log V)\`.

## Límite

No admite **aristas negativas** — para eso se usa [[Bellman-Ford]].`,
    },
  ],
  estrellas: [
    {
      id: 'star-betelgeuse', title: 'Betelgeuse', date: '2026-05-08',
      fields: {
        'Nombre': 'Betelgeuse (α Orionis)',
        'Tipo espectral': 'M1–2 Ia–ab',
        'Masa (M☉)': '~16',
        'Distancia (ly)': '~548',
        'Descripción': 'Supergigante roja en Orión',
      },
      body: `## Resumen

**Supergigante roja** y candidata cercana a [[Supernova]]. Su atenuación de 2019–2020 (*Great Dimming*) se atribuyó a una nube de polvo expulsada.

Comparte vecindario con [[Sirius A]] en el cielo de invierno.`,
    },
    {
      id: 'star-sirius', title: 'Sirius A', date: '2026-05-02',
      fields: {
        'Nombre': 'Sirius A (α CMa)',
        'Tipo espectral': 'A1 V',
        'Masa (M☉)': '2.06',
        'Distancia (ly)': '8.6',
        'Descripción': 'La estrella más brillante del cielo nocturno',
      },
      body: `## Resumen

La estrella más **brillante** del cielo nocturno. Forma un sistema binario con [[Sirius B]], una [[Enana blanca]].`,
    },
    {
      id: 'star-proxima', title: 'Proxima Centauri', date: '2026-04-20',
      fields: {
        'Nombre': 'Proxima Centauri',
        'Tipo espectral': 'M5.5 Ve',
        'Masa (M☉)': '0.12',
        'Distancia (ly)': '4.24',
        'Descripción': 'La estrella más cercana al Sol',
      },
      body: `## Resumen

**Enana roja** y la estrella más cercana al Sol. Alberga *Proxima b*, un exoplaneta en la zona habitable. Pertenece al sistema [[Alpha Centauri]].`,
    },
  ],
  proteinas: [
    {
      id: 'prot-hemoglobina', title: 'Hemoglobina', date: '2026-05-06',
      fields: {
        'Nombre': 'Hemoglobina',
        'Función': 'Transporte de O₂',
        'Peso molecular': '64.5 kDa',
        'Localización': 'Eritrocitos',
        'Descripción': 'Proteína tetramérica con grupos hemo',
      },
      body: `## Resumen

Proteína **tetramérica** (2α + 2β) que transporta oxígeno desde los pulmones a los tejidos. Cada subunidad contiene un grupo [[Hemo]] con hierro.

Exhibe **cooperatividad** — su curva de saturación es sigmoidea, no hiperbólica como en la [[Mioglobina]].`,
    },
    {
      id: 'prot-colageno', title: 'Colágeno', date: '2026-04-30',
      fields: {
        'Nombre': 'Colágeno tipo I',
        'Función': 'Estructural',
        'Peso molecular': '~300 kDa',
        'Localización': 'Matriz extracelular',
        'Descripción': 'Triple hélice; proteína más abundante',
      },
      body: `## Resumen

La proteína más **abundante** en mamíferos. Forma una *triple hélice* estabilizada por hidroxiprolina, cuya síntesis depende de la [[Vitamina C]].`,
    },
  ],
  vegetacion: [
    {
      id: 'veg-quercus', title: 'Quercus robur', date: '2026-05-01',
      fields: {
        'Nombre': 'Quercus robur (roble común)',
        'Familia': 'Fagaceae',
        'Bioma': 'Bosque templado',
        'Hábito': 'Árbol caducifolio',
        'Descripción': 'Roble europeo de larga vida',
      },
      body: `## Resumen

Roble caducifolio europeo, especie clave (**keystone**) de muchos [[Bosque templado|bosques templados]]. Soporta una enorme red trófica de insectos.`,
    },
    {
      id: 'veg-sphagnum', title: 'Sphagnum', date: '2026-04-22',
      fields: {
        'Nombre': 'Sphagnum spp.',
        'Familia': 'Sphagnaceae',
        'Bioma': 'Turbera',
        'Hábito': 'Musgo',
        'Descripción': 'Musgo formador de turba',
      },
      body: `## Resumen

Musgo que forma **turba** y acidifica su entorno. Las turberas de \`Sphagnum\` son sumideros de carbono clave — ver [[Ciclo del carbono]].`,
    },
  ],
};

// ── Free notes, in folders ─────────────────────────────────────────────────
const FREE_FOLDERS = {
  metodologia: {
    label: 'Metodología',
    notes: [
      { id: 'free-diseno', title: 'Diseño experimental', date: '2026-05-14',
        body: `# Diseño experimental

Notas sueltas sobre cómo estructurar el muestreo para el estudio de [[Diamond OA Framework|Diamond OA]].

- Definir la unidad de análisis
- Controlar por **disciplina** y región
- Pre-registrar las hipótesis → enlaza con [[Sesgo de selección]]

> Recordar: separar exploración de confirmación.` },
      { id: 'free-protocolo', title: 'Protocolo de muestreo', date: '2026-05-09',
        body: `# Protocolo de muestreo

Pasos para construir el corpus de revistas:

1. Filtrar por DOAJ + Sherpa Romeo
2. Excluir híbridas
3. Anotar modelo de financiación

Relacionado: [[Diseño experimental]].` },
      { id: 'free-sesgo', title: 'Sesgo de selección', date: '2026-04-25',
        body: `# Sesgo de selección

Riesgo central: las revistas Diamond *visibles* no son representativas del universo real. Mucho **dark diamond** queda fuera de los índices.` },
    ],
  },
  ideas: {
    label: 'Ideas',
    notes: [
      { id: 'free-grafo', title: 'Grafo de conceptos vivo', date: '2026-05-13',
        body: `# Grafo de conceptos vivo

¿Y si las notas se conectaran solas por *co-citación* en vez de [[wikilinks]] manuales?

- nodos = notas
- aristas = enlaces explícitos **+** similitud semántica
- color por clase de objeto` },
      { id: 'free-tipadas', title: 'Notas como objetos tipados', date: '2026-05-04',
        body: `# Notas como objetos tipados

Cada clase ([[Algoritmos]], [[Estrellas]]…) define un *esquema* de campos. La nota es una **instancia**.

Ventaja: consultas tipo base de datos sobre el vault.` },
    ],
  },
};

// ── Library notes, grouped by source ───────────────────────────────────────
const LIBRARY = {
  papers: {
    label: 'Papers',
    groups: [
      { source: 'Larivière et al. 2015', meta: 'PLOS ONE · DOI 10.1371/…', notes: [
        { id: 'lib-oligo', title: 'Oligopolio de publicadores', date: '2026-05-11',
          body: `Cinco editoriales controlan **más del 50%** de la producción revisada por pares.

Cita clave para la introducción de [[Diamond OA Framework]]. Conecta con [[Márgenes de beneficio]].` },
        { id: 'lib-margenes', title: 'Márgenes del 30–40%', date: '2026-05-11',
          body: `Los márgenes operativos rivalizan con los de las grandes tecnológicas. Sustenta el argumento de **fallo de mercado**.` },
      ]},
      { source: 'Chen et al. 2025', meta: 'arXiv:2503.04821', notes: [
        { id: 'lib-consorcio', title: 'Modelo de consorcio', date: '2026-05-07',
          body: `Propone financiación por **consorcio** institucional. Valida directamente [[H1]] de la línea Diamond OA.

Ver también [[SciELO]] como prueba de concepto.` },
      ]},
    ],
  },
  web: {
    label: 'Web',
    groups: [
      { source: 'coalition-s.org', meta: 'Plan S · cOAlition S', notes: [
        { id: 'lib-plans', title: 'Los 10 principios', date: '2026-04-29',
          body: `Resumen de los **10 principios** de Plan S. Relevante para la sección de política internacional.` },
      ]},
    ],
  },
  notes: {
    label: 'Notes',
    groups: [
      { source: 'Seminario interno · abril', meta: 'Nota de fuente tipo nota', notes: [
        { id: 'lib-seminario', title: 'Apuntes del seminario', date: '2026-04-18',
          body: `Comentarios de [[A. Lechuga]] sobre el marco. Sugiere comparar con el modelo **SCOAP³**.` },
      ]},
    ],
  },
};

// flat index of every note by id, plus its kind/owner
function buildStaticIndex() {
  const idx = {};
  Object.entries(OBJECT_NOTES).forEach(([cls, arr]) => arr.forEach(n => {
    idx[n.id] = { ...n, kind: 'object', classId: cls };
  }));
  Object.entries(FREE_FOLDERS).forEach(([fid, f]) => f.notes.forEach(n => {
    idx[n.id] = { ...n, kind: 'free', folderId: fid };
  }));
  Object.entries(LIBRARY).forEach(([sec, s]) => s.groups.forEach(g => g.notes.forEach(n => {
    idx[n.id] = { ...n, kind: 'library', section: sec, source: g.source };
  })));
  return idx;
}
const STATIC_INDEX = buildStaticIndex();

// NOTE_INDEX and TITLE_TO_ID are mutated whenever the vault changes (HDU-D).
// WikiPill and NoteList look up window.NOTE_INDEX / window.TITLE_TO_ID at render
// time, so reassigning these properties propagates on the next React re-render.
function applyVault(vaultNotes = []) {
  const merged = { ...STATIC_INDEX };
  for (const v of vaultNotes) {
    merged[v.id] = { ...v, kind: 'vault' };
  }
  window.NOTE_INDEX = merged;
  window.TITLE_TO_ID = Object.fromEntries(
    Object.values(merged).map(n => [n.title.toLowerCase(), n.id])
  );
}

// Find every note that links to `targetTitle` via [[Title]] or [[Title|alias]].
function findBacklinks(targetTitle, excludeId) {
  if (!targetTitle) return [];
  const esc = targetTitle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`\\[\\[\\s*${esc}\\s*(\\||\\])`, 'i');
  const hits = [];
  for (const n of Object.values(window.NOTE_INDEX || {})) {
    if (n.id === excludeId) continue;
    const text = n.body || '';
    const m = text.match(re);
    if (!m) continue;
    const idx = m.index;
    const snippet = text
      .slice(Math.max(0, idx - 50), Math.min(text.length, idx + 120))
      .replace(/\s+/g, ' ')
      .trim();
    hits.push({ id: n.id, title: n.title, kind: n.kind, snippet });
  }
  return hits;
}

applyVault([]);   // seed window.NOTE_INDEX / TITLE_TO_ID from static data on first load

Object.assign(window, {
  NOTE_CLASSES, OBJECT_NOTES, FREE_FOLDERS, LIBRARY,
  applyVault, findBacklinks,
});
