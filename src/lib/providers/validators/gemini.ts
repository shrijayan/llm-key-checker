import type { ValidationResult } from '../types'

export async function validateGemini(apiKey: string): Promise<ValidationResult> {
  if (!apiKey?.trim()) {
    return { valid: false, message: 'API key is required', provider: 'Google Gemini' }
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(apiKey.trim())}`,
      {
        method: 'GET',
        signal: AbortSignal.timeout(10000),
      }
    )

    if (response.ok) {
      return { valid: true, message: 'Valid Google Gemini API key', provider: 'Google Gemini' }
    }

    if (response.status === 400 || response.status === 403) {
      return { valid: false, message: 'Invalid API key — authentication failed', provider: 'Google Gemini' }
    }

    if (response.status === 429) {
      return { valid: true, message: 'API key is valid (rate limited)', provider: 'Google Gemini' }
    }

    return { valid: false, message: `Unexpected response: HTTP ${response.status}`, provider: 'Google Gemini' }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Network error'
    return { valid: false, message: `Connection error: ${message}`, provider: 'Google Gemini' }
  }
}
