import React from 'react'


export default function Filters({
query, onQuery,
status, onStatus,
carrier, onCarrier,
fromDate, onFromDate,
toDate, onToDate,
onReset
}) {
return (
<div className="filters">
<div className="field">
<label>Buscar</label>
<input
type="text"
placeholder="ID / Origen / Destino"
value={query}
onChange={(e) => onQuery(e.target.value)}
/>
</div>


<div className="field">
<label>Estado</label>
<select value={status} onChange={(e) => onStatus(e.target.value)}>
<option value="">Todos</option>
<option value="pending">Pendiente</option>
<option value="in_transit">En tránsito</option>
<option value="delivered">Entregado</option>
<option value="delayed">Demorado</option>
</select>
</div>


<div className="field">
<label>Carrier</label>
<select value={carrier} onChange={(e) => onCarrier(e.target.value)}>
<option value="">Todos</option>
<option value="Correo Argentino">Correo Argentino</option>
<option value="Andreani">Andreani</option>
<option value="DHL">DHL</option>
<option value="UPS">UPS</option>
</select>
</div>


<div className="field">
<label>Desde</label>
<input type="date" value={fromDate} onChange={(e) => onFromDate(e.target.value)} />
</div>


<div className="field">
<label>Hasta</label>
<input type="date" value={toDate} onChange={(e) => onToDate(e.target.value)} />
</div>


<div className="field end">
<button className="btn ghost" onClick={onReset}>Limpiar filtros</button>
</div>
</div>
)
}