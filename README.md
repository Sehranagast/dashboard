# Dashboard de Envíos

Panel web minimalista construido con **Vite + React + JavaScript + CSS**. Muestra KPIs, filtros en tiempo real, tablas y gráficos (Recharts), además de **exportación a CSV** de los resultados filtrados.

> Este README explica en detalle la **arquitectura**, **cómo correrlo**, **cómo funciona cada parte**, cómo **extenderlo** y cómo **deployarlo**.

---

## 1) Objetivos del proyecto

* Tener un **dashboard de envíos** listo para usar como demo o base de un proyecto real.
* Proveer **filtros** de búsqueda (texto, estado, carrier y rango de fechas) que afecten a **KPIs**, **gráficos** y **tabla** de manera sincronizada.
* Permitir **exportar a CSV** los resultados filtrados.
* Mantener un stack simple (sin TypeScript, sin Tailwind) y **rendimiento** decente con React + Vite.

---

## 2) Tecnologías

* **Vite**: bundler/dev server extremadamente rápido.
* **React 18**: librería para UI (hooks, renderización eficiente).
* **Recharts**: librería de gráficos basada en D3, simple y declarativa.
* **CSS**: hojas de estilo planas (`globals.css` y `dashboard.css`).

---

## 3) Requisitos previos

* Node.js ≥ 18
* npm ≥ 9 (o pnpm/yarn si preferís)

Verificá versiones:

```bash
node -v
npm -v
```

---

## 4) Instalación y ejecución local

```bash
# 1) Crear proyecto (si aún no existe)
npm create vite@latest envios-dashboard -- --template react
cd envios-dashboard

# 2) Instalar dependencias
npm i recharts

# 3) Copiar el código fuente dentro de /src (ver estructura de archivos abajo)

# 4) Correr en desarrollo
npm run dev
```

Scripts útiles (en `package.json`):

* `dev`: levanta el servidor de desarrollo con HMR.
* `build`: genera la versión optimizada en `dist/`.
* `preview`: sirve el build localmente para validar el deploy.

```bash
npm run build
npm run preview
```

---

## 5) Estructura de archivos

```
envios-dashboard/
├─ index.html
├─ package.json
├─ vite.config.js
└─ src/
   ├─ main.jsx                # Punto de entrada React
   ├─ App.jsx                 # Layout principal y orquestación
   ├─ data/
   │  └─ shipments.js         # Datos mockeados (semilla)
   ├─ utils/
   │  ├─ csv.js               # toCSV() y downloadCSV()
   │  └─ format.js            # fmtDate() y fmtMoney()
   ├─ components/
   │  ├─ Topbar.jsx           # Encabezado con botón Exportar
   │  ├─ KPIs.jsx             # Tarjetas de métrica
   │  ├─ Filters.jsx          # Controles de filtrado
   │  ├─ ShipmentsTable.jsx   # Tabla de resultados
   │  └─ Charts.jsx           # Gráficos (Bar + Line)
   └─ styles/
      ├─ globals.css          # Tema base y utilidades
      └─ dashboard.css        # Ajustes específicos
```

---

## 6) Flujo de datos y estado

* El componente **App** mantiene el estado de filtros: `query`, `status`, `carrier`, `fromDate`, `toDate`.
* Los datos base provienen de `data/shipments.js` (exporta un array `shipments`).
* Con `useMemo`, **App** calcula `filtered` aplicando todos los criterios. Ese array filtrado se pasa a:

  * `KPIs` (para contar totales, demorados, entregados y promedio de costo)
  * `Charts` (para armar series agregadas por `status` y por día de creación)
  * `ShipmentsTable` (para renderizar filas)

```mermaid
graph LR
  SEED(Shipments seed) --> useMemo[useMemo(filters)] --> KPIs & Charts & Table
  Filters --> useState --> useMemo
```

**Ventaja**: un único cálculo (`filtered`) alimenta todas las vistas, evitando duplicar lógica.

---

## 7) Filtros: cómo funcionan

En `App.jsx`:

* **Texto (`query`)**: busca coincidencias en `id`, `origin`, `destination` (case-insensitive).
* **Estado (`status`)**: compara igualdad exacta ("pending", "in_transit", "delivered", "delayed").
* **Carrier (`carrier`)**: compara igualdad exacta ("Correo Argentino", "Andreani", "DHL", "UPS").
* **Fechas (`fromDate`, `toDate`)**: se convierten a `Date` y se comparan con `createdAt` de cada envío.

Fragmento clave:

```js
const filtered = useMemo(() => {
  return SEED.filter((s) => {
    const q = query.trim().toLowerCase()
    const passQ = !q || s.id.toLowerCase().includes(q) ||
      s.origin.toLowerCase().includes(q) || s.destination.toLowerCase().includes(q)

    const passStatus = !status || s.status === status
    const passCarrier = !carrier || s.carrier === carrier

    const created = new Date(s.createdAt)
    const passFrom = !fromDate || created >= new Date(fromDate)
    const passTo   = !toDate   || created <= new Date(toDate)

    return passQ && passStatus && passCarrier && passFrom && passTo
  })
}, [query, status, carrier, fromDate, toDate])
```

El botón **“Limpiar filtros”** setea todos los estados a `''`.

---

## 8) KPIs: qué muestran

En `components/KPIs.jsx`:

* **Envíos**: `data.length`.
* **Entregados**: cantidad con `status === 'delivered'`.
* **Demorados**: cantidad con `status === 'delayed'`.
* **Costo promedio**: promedio de `cost` redondeado y formateado con `fmtMoney`.

```js
const total = data.length
const delivered = data.filter(d => d.status === 'delivered').length
const delayed = data.filter(d => d.status === 'delayed').length
const avgCost = data.length ? Math.round(data.reduce((a,b) => a + b.cost, 0) / data.length) : 0
```

---

## 9) Gráficos (Recharts)

En `components/Charts.jsx`:

* **Barras por estado**: agrega `count` por `status` y los etiqueta en español.
* **Línea por día** (creación): agrupa por `YYYY-MM-DD` según `createdAt`.

Recharts utilizado:

* `ResponsiveContainer`: se adapta al ancho del contenedor.
* `BarChart` + `Bar` con `CartesianGrid`, `XAxis`, `YAxis`, `Tooltip`.
* `LineChart` + `Line` con los mismos ejes y tooltip.

Si `data` cambia (por filtros), se regeneran las series con `useMemo`.

---

## 10) Tabla de envíos

En `components/ShipmentsTable.jsx`:

* Renderiza columnas: `ID`, `Origen`, `Destino`, `Estado`, `Carrier`, `Creado`, `ETA`, `Costo`.
* `labelStatus()` traduce los valores técnicos a etiquetas amigables.
* Usa utilidades de formato: `fmtDate` y `fmtMoney`.
* Muestra un estado vacío si no hay filas filtradas.

> Sugerencia de mejora: agregar **paginación** y **ordenamiento** por columna.

---

## 11) Utilidades

### 11.1 `utils/format.js`

* `fmtDate(iso: string)`: convierte ISO a `DD/MM/YYYY` según `es-AR`.
* `fmtMoney(n: number)`: formatea moneda en ARS sin decimales.

### 11.2 `utils/csv.js`

* `toCSV(rows: Array<Object>)`: serializa el array a CSV (escapando comillas, comas y saltos de línea).
* `downloadCSV(csvString, filename)`: dispara la descarga creando un Blob y un link temporal.

> Exporta exactamente **lo filtrado** en la UI.

---

## 12) Datos de ejemplo (`data/shipments.js`)

* Genera 120 envíos aleatorios con:

  * `id` (`SHP-0001`, ...)
  * `origin`/`destination` (ciudades predefinidas)
  * `status` (uno de `pending | in_transit | delivered | delayed`)
  * `carrier` (uno de `Correo Argentino | Andreani | DHL | UPS`)
  * `createdAt` (fecha entre agosto 2025 y hoy)
  * `eta` (2 a 12 días después de `createdAt`)
  * `cost` (entre 15k y 22k ARS aprox.)

> En un proyecto real, reemplazá este archivo por un **fetch a tu API**.

---

## 13) Estilos (CSS)

* `globals.css`: define **tema** (variables CSS), tipografía, layout base y componentes UI (botones, cards, pills, etc.).
* `dashboard.css`: ajustes menores del layout raíz.

Diseño:

* Paleta **oscura** con contraste suficiente.
* Layout **responsive**: grids que colapsan de 2→1 columna en móviles.
* Componentes simples (sin dependencias de UI externas).

---

## 14) Accesibilidad (a11y) y UX

* Labels conectados a inputs/selects.
* Tamaños de toque adecuados (padding en botones y celdas).
* Contraste pensado para tema oscuro.
* Tooltips en gráficos proveídos por Recharts.

Posibles mejoras:

* Navegación por teclado y focus-styles más visibles.
* Anunciar cantidad de resultados filtrados con `aria-live`.

---

## 15) Rendimiento y buenas prácticas

* `useMemo` evita recomputar filtros y agregaciones si no cambian dependencias.
* Evitar crear objetos/funciones nuevas en cada render innecesariamente.
* Para datasets grandes, considerar:

  * Paginación/virtualización de filas (ej.: `react-virtualized` / `react-window`).
  * Mover filtros y agregaciones pesadas a **Web Workers** o al servidor.

---

## 16) Errores comunes (troubleshooting)

* **Pantalla negra + error `SEED.filters is not a function`**: usaste `.filters` en vez de `.filter` en `App.jsx`.
* **`newDate is not defined`**: typo; debe ser `new Date(...)`.
* **`createdAt` vs `createAt`**: el nombre de la propiedad debe ser **`createdAt`** (lo usa la tabla y charts).
* Mensajes sobre `chrome-extension://...` en consola: provienen de **extensiones del navegador**; usar incógnito sin extensiones si molestan.

---

## 17) Cómo integrar una API real

1. Reemplazá la importación del seed por un estado local:

   ```jsx
   const [rows, setRows] = useState([])
   useEffect(() => {
     fetch('/api/shipments')
       .then(r => r.json())
       .then(setRows)
       .catch(console.error)
   }, [])
   ```
2. Cambiá `SEED` por `rows` en el `useMemo` de filtrado.
3. Asegurate de que tu API devuelva campos con **los mismos nombres** (`createdAt`, `status`, etc.).

> Si usás `json-server` para mockear: definí `db.json` con un array `shipments` y montalo en un puerto, luego hacé `fetch('http://localhost:3000/shipments')`.

---

## 18) Extensiones sugeridas (roadmap)

* **Paginación y ordenamiento** de tabla.
* **Importación CSV** con validaciones y mapeo de columnas.
* **Modo claro/oscuro** con toggle (guardar preferencia en `localStorage`).
* **Roles/login** (solo visual, o integrados con backend).
* **Atajos de teclado** (limpiar filtros, exportar, enfocar búsqueda).
* **Tests** de unidad (Jest + React Testing Library).
* **Error Boundaries** para manejo de errores de render.

---

## 19) Deploy

### 19.1 Netlify

```bash
npm run build
# Arrastrá la carpeta dist/ al dashboard de Netlify, o conectá el repo.
# Build command: npm run build
# Publish directory: dist
```

### 19.2 Vercel

* Importá el repo desde Vercel y aceptá los defaults (framework: Vite).

### 19.3 GitHub Pages

```bash
npm run build
# Publicá la carpeta dist/ con GitHub Pages (branch gh-pages o /docs).
```

> Tras el deploy, probá `npm run preview` localmente para validar que los assets se sirvan bien.

---

## 20) FAQ

**¿Puedo cambiar las ciudades/carriers/estados?**
Sí, editá `data/shipments.js` (o tu API) y/o los `<option>` de `Filters.jsx`.

**¿Cómo cambio el formato de moneda/fecha?**
En `utils/format.js` modificá `Intl.NumberFormat` y `toLocaleDateString`.

**¿Se puede usar TypeScript o Tailwind?**
Sí. Este proyecto es minimalista, pero se puede portar a TS y reemplazar CSS por Tailwind.

**¿Cómo agrego una columna nueva (p. ej., peso)?**

1. Añadí el campo al dataset.
2. Sumá la columna en `ShipmentsTable.jsx`.
3. Si corresponde, incluílo en filtros/KPIs/Charts.

---

## 21) Licencia

MIT — libre para usar y modificar. Agradecimientos son bienvenidos 😊
