import type { ValidationResult } from '../types'

export async function validateAnthropic(apiKey: string): Promise<ValidationResult> {
  if (!apiKey?.trim()) {
    return { valid: false, message: 'API key is required', provider: 'Anthropic' }
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/models', {
      method: 'GET',
      headers: {
        'x-api-key': apiKey.trim(),
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      signal: AbortSignal.timeout(10000),
    })

    if (response.ok) {
      return { valid: true, message: 'Valid Anthropic API key', provider: 'Anthropic' }
    }

    if (response.status === 401) {
      return { valid: false, message: 'Invalid API key — authentication failed', provider: 'Anthropic' }
    }

    if (response.status === 429) {
      return { valid: true, message: 'API key is valid (rate limited)', provider: 'Anthropic' }
    }

    return { valid: false, message: `Unexpected response: HTTP ${response.status}`, provider: 'Anthropic' }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Network error'
    return { valid: false, message: `Connection error: ${message}`, provider: 'Anthropic' }
  }
}
