📦 Dashboard de Envíos — Vite + React + JavaScript + CSS

Un panel web interactivo para visualizar, filtrar y analizar envíos. Incluye KPIs, tabla dinámica, gráficos con Recharts y exportación a CSV.
Construido con un stack simple y rápido: Vite + React + JavaScript + CSS puro.

🚀 Características principales

✅ Filtros en tiempo real
✅ Búsqueda por ID / Origen / Destino
✅ Filtro por estado, carrier y rango de fechas
✅ KPIs automáticos
✅ Gráficos responsivos (Barras y Líneas)
✅ Tabla con datos filtrados
✅ Exportación a CSV de los resultados filtrados
✅ Mock data generada dinámicamente
✅ Código limpio, modular y fácil de extender

🛠️ Tecnologías usadas

Vite – build rápido y liviano

React 18 – UI declarativa

Recharts – librería de gráficos simple y poderosa

CSS – estilos personalizados (sin Tailwind)

JavaScript – sin TypeScript para simplicidad
s
▶️ Instalación y ejecución
1. Clonar el repo
git clone 
cd envios-dashboard
2. Instalar dependencias
npm install
3. Ejecutar en modo desarrollo
npm run dev
4. Build de producción
npm run build
npm run preview

🔧 Explicación de cada parte del código
📌 App.jsx — El corazón del dashboard

Controla:

Estados de filtros

Lógica de filtrado (useMemo)

Renderiza KPIs, tabla, filtros y gráficos

Maneja exportación a CSV

Filtrado centralizado:

const filtered = useMemo(() => {
  return SEED.filter((s) => {
    const q = query.toLowerCase()
    const passQ = !q || s.id.toLowerCase().includes(q) ||
      s.origin.toLowerCase().includes(q) ||
      s.destination.toLowerCase().includes(q)

    const passStatus = !status || s.status === status
    const passCarrier = !carrier || s.carrier === carrier

    const created = new Date(s.createdAt)
    const passFrom = !fromDate || created >= new Date(fromDate)
    const passTo = !toDate || created <= new Date(toDate)

    return passQ && passStatus && passCarrier && passFrom && passTo
  })
}, [query, status, carrier, fromDate, toDate])

🔍 Filters.jsx — Panel de filtros

Incluye:

Input de búsqueda

Select de estado

Select de carrier

Filtro “desde / hasta” por fecha

Botón de “limpiar filtros”

Todo controlado por props → 100% reutilizable.

📊 KPIs.jsx — Métricas rápidas

Calcula en tiempo real:

Total de envíos

Entregados

Demorados

Costo promedio

Usa formateo con Intl.NumberFormat.

📈 Charts.jsx — Gráficos Recharts

Incluye dos gráficos:

Barras → Envíos por estado

Línea → Envíos por día (fecha de creación)

Ambos se recalculan con useMemo para no re-renderizar de más.

📄 ShipmentsTable.jsx — Tabla de resultados

Renderiza los envíos filtrados

Usa formateadores fmtDate() y fmtMoney()

Muestra cartel si no hay resultados

Pinta estado con “pill” de colores

Fácil de extender si querés agregar columnas.

🧪 utils/csv.js — Exportación a CSV

Convierte todo el array de resultados filtrados en un CSV válido y dispara descarga local.

downloadCSV(csv, `envios_${Date.now()}.csv`)

🗂️ data/shipments.js — Datos mockeados

Genera 120 envíos con:

ID

Origen / Destino

Estado

Carrier

createdAt

ETA

Costo

Ideal para testing o demos.

🎨 Estilos (CSS)

globals.css → paleta, tipografía, botones, tabla, inputs
dashboard.css → ajustes del layout general

Incluye diseño responsivo para móviles.

✅ Cómo extender el dashboard
Agregar columna nueva

Editar dataset (shipments.js)

Agregar <th> y <td> en ShipmentsTable.jsx

Opcional: actualizar KPIs o Charts

Conectar con API real
useEffect(() => {
  fetch('/api/shipments')
    .then(r => r.json())
    .then(setRows)
}, [])

Agregar paginación

react-window

react-virtualized

paginación manual usando slices

Modo oscuro/claro

alternar variables CSS

guardar preferencia en localStorage
🐞 Troubleshooting
✅ Pantalla en negro

Casi siempre es un error de:

Filtros (filter vs filters)

Typos (createdAt vs createAt)

Imports rotos

✅ Errores de chrome-extension://

No vienen del proyecto → es el navegador.
Probar en incógnito sin extensiones.

✅ CSV vacío

Asegurate de tener resultados filtrados.
Si no hay rows → genera encabezados solamente.

📝 Licencia

MIT — Podés usarlo, adaptarlo y mejorarlo libremente.
