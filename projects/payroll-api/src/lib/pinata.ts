const PINATA_JWT = process.env.PINATA_JWT || ''
const PINATA_API_KEY = process.env.PINATA_API_KEY || ''
const PINATA_SECRET_KEY = process.env.PINATA_SECRET_KEY || ''
const PINATA_GATEWAY = (process.env.PINATA_GATEWAY || 'https://gateway.pinata.cloud').replace(/\/$/, '')

export interface PinataUploadResult {
  cid: string
  url: string
}

export function isPinataConfigured(): boolean {
  return !!(PINATA_JWT || (PINATA_API_KEY && PINATA_SECRET_KEY))
}

export function buildPinataFetchUrl(cid: string): string {
  return `${PINATA_GATEWAY}/ipfs/${cid}`
}

/** Public gateway URL for display; empty when Pinata is not configured (use API proxy instead). */
export function buildPinataViewUrl(cid: string): string {
  if (!isPinataConfigured()) return ''
  return buildPinataFetchUrl(cid)
}

export async function uploadToPinata(
  fileBuffer: Buffer,
  fileName: string,
): Promise<PinataUploadResult> {
  if (!isPinataConfigured()) {
    const mockCid = `Qm${Buffer.from(fileName + Date.now()).toString('hex').slice(0, 44).padEnd(44, '0')}`
    return { cid: mockCid, url: '' }
  }

  const blob = new Blob([new Uint8Array(fileBuffer)])
  const formData = new FormData()
  formData.append('file', blob, fileName)
  formData.append('pinataMetadata', JSON.stringify({ name: fileName }))

  const headers: Record<string, string> = {}
  if (PINATA_JWT) {
    headers.Authorization = `Bearer ${PINATA_JWT}`
  } else {
    headers.pinata_api_key = PINATA_API_KEY
    headers.pinata_secret_api_key = PINATA_SECRET_KEY
  }

  const res = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
    method: 'POST',
    headers,
    body: formData,
  })

  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new Error(`Pinata upload failed: ${res.status} ${body.slice(0, 300)}`)
  }

  const json = (await res.json()) as { IpfsHash?: string }
  const cid = json.IpfsHash
  if (!cid) throw new Error('Pinata upload: missing IpfsHash')

  return { cid, url: buildPinataViewUrl(cid) }
}
