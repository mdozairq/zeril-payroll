import { describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from './app.js'
import { calculateTax } from './lib/tax.js'

describe('tax module', () => {
  it('calculateTax applies India rates', () => {
    const t = calculateTax(1000, 'IN')
    expect(t.grossAmount).toBe(1000)
    expect(t.tds).toBe(100)
    expect(t.netAmount).toBeLessThan(1000)
  })
})

describe('POST /api/tax/calculate', () => {
  it('returns breakdown for valid input', async () => {
    const res = await request(app)
      .post('/api/tax/calculate')
      .send({ amountUsd: 5000, countryCode: 'US' })
    expect(res.status).toBe(200)
    expect(res.body.grossAmount).toBe(5000)
    expect(res.body.totalTax).toBeGreaterThan(0)
  })

  it('rejects negative amount', async () => {
    const res = await request(app).post('/api/tax/calculate').send({ amountUsd: -1 })
    expect(res.status).toBe(400)
  })
})

describe('GET /api/countries', () => {
  it('lists supported countries', async () => {
    const res = await request(app).get('/api/countries')
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
    expect(res.body.some((c: { code: string }) => c.code === 'IN')).toBe(true)
  })
})
