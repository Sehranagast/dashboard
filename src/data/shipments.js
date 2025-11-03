const carriers = ['Correo Argentino', 'Andreani', 'DHL', 'UPS']
const statuses = ['pending', 'in_transit', 'delivered', 'delayed']

function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

function pad(n) { return String(n).padStart(4, '0') }

export const shipments = Array.from({ length: 120 }).map((_, i) => {
  const createdAt = randomDate(new Date(2025, 7, 1), new Date())
  const eta = new Date(createdAt.getTime() + (2 + Math.random() * 10) * 24 * 60 * 60 * 1000)
  const status = statuses[Math.floor(Math.random() * statuses.length)]
  const carrier = carriers[Math.floor(Math.random() * carriers.length)]
  const cost = Math.round(15000 + Math.random() * 7000)
  const cities = ['CABA', 'La Plata', 'Mar del Plata', 'Córdoba', 'Rosario', 'Mendoza', 'Neuquén']
  const origin = cities[Math.floor(Math.random() * cities.length)]
  let dest = cities[Math.floor(Math.random() * cities.length)]
  if (dest === origin) dest = cities[(cities.indexOf(dest) + 1) % cities.length]

  return {
    id: `SHP-${pad(i + 1)}`,
    origin,
    destination: dest,
    status,
    carrier,
    createdAt: createdAt.toISOString(),
    eta: eta.toISOString(),
    cost
  }
})
