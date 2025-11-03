import React, { useMemo, useState } from 'react'
import Topbar from './components/Topbar.jsx'
import KPIs from './components/KPIs.jsx'
import Filters from './components/Filters.jsx'
import ShipmentsTable from './components/ShipmentsTable.jsx'
import Charts from './components/Charts.jsx'
import { shipments as SEED } from './data/shipments.js'
import { toCSV, downloadCSV } from './utils/csv.js'

export default function App() {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('')
  const [carrier, setCarrier] = useState('')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')

  const filtered = useMemo(() => {
    return SEED.filter((s) => {
      const q = query.trim().toLowerCase()
      const passQ =
        !q ||
        s.id.toLowerCase().includes(q) ||
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

  const resetFilters = () => {
    setQuery('')
    setStatus('')
    setCarrier('')
    setFromDate('')
    setToDate('')
  }

  const handleExport = () => {
    const csv = toCSV(filtered)
    downloadCSV(csv, `envios_${Date.now()}.csv`)
  }

  return (
    <div className="app">
      <Topbar onExport={handleExport} />

      <main className="container">
        <section className="filters-card card">
          <Filters
            query={query} onQuery={setQuery}
            status={status} onStatus={setStatus}
            carrier={carrier} onCarrier={setCarrier}
            fromDate={fromDate} onFromDate={setFromDate}
            toDate={toDate} onToDate={setToDate}
            onReset={resetFilters}
          />
        </section>

        <section className="kpis-grid">
          <KPIs data={filtered} />
        </section>

        <section className="charts-grid card">
          <Charts data={filtered} />
        </section>

        <section className="table-card card">
          <ShipmentsTable data={filtered} />
        </section>
      </main>
    </div>
  )
}
