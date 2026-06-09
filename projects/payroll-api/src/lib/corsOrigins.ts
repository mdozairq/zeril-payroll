/** Default dev origins; append FRONTEND_ORIGIN (comma-separated) for deployed frontends. */
export function getCorsOrigins(): string[] {
  const defaults = ['http://localhost:5173', 'http://localhost:3000']
  const extra = (process.env.FRONTEND_ORIGIN || '')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean)
  return [...defaults, ...extra]
}
