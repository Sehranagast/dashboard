export function toCSV(rows) {
    if(!rows?.length) return 'id,origin,destination,status,carrier,createdAt,eta,cost\n'
    const headers = Object.keys(rows[0])
    const esc = (v) => {
        if (v == null) return ''
        const s = String(v)
        return /[",\n"]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
    }

    const lines = [headers.join(',')]
    for (const r of rows) lines.push(headers.map((h) => esc(r[h])).join(','))
    return lines.join('\n')
}

export function downloadCSV(csvString, filename = 'data.csv') {
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
}