import type { ValidationResult } from '../types'

async function generateZhipuJWT(apiKey: string): Promise<string> {
  const parts = apiKey.trim().split('.')
  if (parts.length < 2) throw new Error('Invalid Zhipu API key format. Expected: {id}.{secret}')

  const id = parts[0]
  const secret = parts.slice(1).join('.')

  const now = Math.floor(Date.now() / 1000)
  const header = { alg: 'HS256', sign_type: 'SIGN' }
  const payload = { api_key: id, exp: now + 3600, timestamp: now }

  const encode = (obj: object) =>
    btoa(JSON.stringify(obj)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')

  const headerB64 = encode(header)
  const payloadB64 = encode(payload)
  const signingInput = `${headerB64}.${payloadB64}`

  const keyBytes = new TextEncoder().encode(secret)
  const dataBytes = new TextEncoder().encode(signingInput)

  const cryptoKey = await crypto.subtle.importKey(
    'raw', keyBytes, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  )
  const signature = await crypto.subtle.sign('HMAC', cryptoKey, dataBytes)
  const sigB64 = btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')

  return `${signingInput}.${sigB64}`
}

export async function validateZhipu(apiKey: string): Promise<ValidationResult> {
  if (!apiKey?.trim() || !apiKey.includes('.')) {
    return { valid: false, message: 'Invalid key format. Expected: {id}.{secret}', provider: 'Zhipu AI' }
  }

  try {
    const jwt = await generateZhipuJWT(apiKey)

    const response = await fetch('https://open.bigmodel.cn/api/paas/v4/models', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwt}`,
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(10000),
    })

    if (response.ok) {
      return { valid: true, message: 'Valid Zhipu AI API key', provider: 'Zhipu AI' }
    }

    if (response.status === 401 || response.status === 403) {
      return { valid: false, message: 'Invalid API key — authentication failed', provider: 'Zhipu AI' }
    }

    return { valid: false, message: `Unexpected response: HTTP ${response.status}`, provider: 'Zhipu AI' }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return { valid: false, message: `Error: ${message}`, provider: 'Zhipu AI' }
  }
}
