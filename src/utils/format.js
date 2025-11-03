export function fmtDate(iso) {
    const d = new Date(iso)
    return d.toLocaleDateString('es-AR', { year: 'numeric', month: '2-digit', day: '2-digit' })
}

export function fmtMoney(n) {
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0}).format(n)
}