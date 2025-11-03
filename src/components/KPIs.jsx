import React, { useMemo } from 'react'
import { fmtMoney } from '../utils/format'

export default function KPIs({ data }) {
    const totals = useMemo(() => {
        const total = data.length
        const delivered = data.filter(d => d.status === 'delivered').length
        const delayed = data.filter(d => d.status === 'delayed').length
        const avgCost = data.length ? Math.round(data.reduce((a, b) => a + b.cost, 0) / data.length) : 0
        return { total, delivered, delayed, avgCost }
    }, [data])

    return (

     <div className='kpis'>
      <div className='kpi card'>
      <div className='kpi-label'>Envíos</div>
      <div className='kpi-value'>{totals.total}</div>
     </div>

     <div className='kpi card'>
      <div className='kpi-label'>Entregados</div>
      <div className='kpi-value'>{totals.delivered}</div>
     </div>

     <div className='kpi card'>
      <div className='kpi-label'>Demorados</div>
      <div className='kpi-value'>{totals.delayed}</div>
     </div>

     <div className='kpi card'>
      <div className='kpi-label'>Costo promedio</div>
      <div className='kpi-value'>{fmtMoney(totals.avgCost)}</div>
     </div>

     </div>
    )
}