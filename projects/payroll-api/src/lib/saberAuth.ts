import crypto from 'crypto'

export function getSaberConfig() {
  const clientId = process.env.SABER_API_KEY || ''
  const clientSecret = process.env.SABER_API_SECRET || ''
  const baseUrl = (process.env.SABER_API_BASE_URL || 'https://mudrex.com/api/v1').replace(/\/$/, '')
  const sandboxUserId = process.env.SABER_SANDBOX_USER_ID || ''
  return {
    clientId,
    clientSecret,
    baseUrl,
    sandboxUserId,
    isConfigured: !!(clientId && clientSecret),
  }
}

export function newSaberRequestId(): string {
  return `pr_${crypto.randomUUID()}`
}

/** HMAC headers for Saber merchant APIs (see Saber authentication docs). */
export function saberRequestHeaders(opts: {
  clientId: string
  clientSecret: string
  userId: string
  requestId: string
}): Record<string, string> {
  const timestamp = String(Date.now())
  const payload = `${opts.clientId}${opts.requestId}${timestamp}`
  const signature = crypto.createHmac('sha256', opts.clientSecret).update(payload).digest('hex')
  return {
    'Content-Type': 'application/json',
    'X-API-KEY': opts.clientId,
    'X-Client-Id': opts.clientId,
    'X-Request-Id': opts.requestId,
    'X-Timestamp': timestamp,
    'X-SIGNATURE': signature,
    'X-Secret-Key': signature,
    'X-User-Id': opts.userId,
  }
}
