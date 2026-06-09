import { describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from './app.js'

const TEST_ADDRESS = '6E4TQUG4TINPMQMO3LKSQG5WRYE6CBWE6N3PCVVJRG7Y66UBSRAIQ66LKY'

describe('wallet auth', () => {
  it('GET /api/auth/challenge returns nonce', async () => {
    const res = await request(app)
      .get('/api/auth/challenge')
      .query({ address: TEST_ADDRESS, role: 'employer' })
    expect(res.status).toBe(200)
    expect(res.body.nonce).toBeDefined()
    expect(res.body.address).toBe(TEST_ADDRESS)
  })

  it('POST /api/auth/verify rejects invalid signature', async () => {
    const challenge = await request(app)
      .get('/api/auth/challenge')
      .query({ address: TEST_ADDRESS, role: 'employee' })
    const res = await request(app)
      .post('/api/auth/verify')
      .send({
        address: TEST_ADDRESS,
        role: 'employee',
        nonce: challenge.body.nonce,
        signedTxnB64: Buffer.from('invalid').toString('base64'),
      })
    expect(res.status).toBeGreaterThanOrEqual(400)
    expect(res.status).toBeLessThan(500)
  })
})
