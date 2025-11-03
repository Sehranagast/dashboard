import React from 'react'
import { fmtDate, fmtMoney } from '../utils/format'

export default function ShipmentsTable({ data }) {
    return (
        <div className='table-wrap'>
            <table className='table'>
                <thread>
                    <tr>
                        <th>ID</th>
                        <th>Origen</th>
                        <th>Estado</th>
                        <th>Carrier</th>
                        <th>Creado</th>
                        <th>ETA</th>
                        <th>Costo</th>
                    </tr>
                </thread>
            <tbody>
                {data.map((r) => (
                    <tr key={r.id}>
                        <td>{r.id}</td>
                        <td>{r.origin}</td>
                        <td>{r.destination}</td>
                        <td className={`pill ${r.status}`}>{labelStatus(r.status)}</td>
                        <td>{r.carrier}</td>
                        <td>{fmtDate(r.createdAt)}</td>
                        <td>{fmtDate(r.eta)}</td>
                        <td>{fmtMoney(r.cost)}</td>
                    </tr>
                ))}
            </tbody>
            </table>
            {!data.length && <div className='empty'>Sin resultados con los filtros actuales</div>}
        </div>
    )
}

function labelStatus(s) {
    switch (s) {
        case 'pending': return 'Pendiente'
        case 'in_transit': return 'En tránsito'
        case 'delivered': return 'Entregado'
        case 'delayed': return 'Demorado'
        default: return s
    }
}
