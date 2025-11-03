import React, { useMemo } from 'react'
import {
    ResponsiveContainer,
    BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip,
    LineChart, Line
} from 'recharts'

export default function Charts({ data }) {
    const byStatus = useMemo(() => {
        const map = {}
        for (const r of data) map[r.status] = (map[r.status] || 0) + 1
        return [
            { status: 'Pendiente', count: map['pending'] || 0},
            { status: 'En tránsito', count: map['in_transit'] || 0},
            { status: 'Entregado', count: map['delivered'] || 0},
            { status: 'Demorado', count: map['delayed'] || 0},
        ]
    }, [data])

    const byDay = useMemo(() => {
        const map = {}
        for (const r of data) {
            const k = new Date(r.createdAt).toISOString().slice(0, 10)
            map[k] = (map[k] || 0) +1
        }
        return Object.keys(map).sort().map(d => ({ date: d, count: map[d]}))
}, [data])

   return (
    <div className="charts">
      <div className="chart-item">
        <h3>Envíos por estado</h3>
        <div className="chart-box">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={byStatus}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="status" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
  <div className="chart-item">
        <h3>Envíos por día (creación)</h3>
        <div className="chart-box">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={byDay}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line type="monotone" dataKey="count" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}