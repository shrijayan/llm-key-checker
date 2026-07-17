import type { ValidationResult } from '../types'

/**
 * Validates any OpenAI-compatible provider by calling GET /models.
 * Used for 90%+ of all providers (Groq, Mistral, Together, DeepSeek, etc.)
 */
export async function validateGenericBearer(
  baseUrl: string,
  apiKey: string,
  providerName: string
): Promise<ValidationResult> {
  if (!apiKey?.trim()) {
    return { valid: false, message: 'API key is required', provider: providerName }
  }

  const url = `${baseUrl.replace(/\/$/, '')}/models`

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${apiKey.trim()}`,
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(10000),
    })

    if (response.ok) {
      return { valid: true, message: `Valid ${providerName} API key`, provider: providerName }
    }

    if (response.status === 401 || response.status === 403) {
      return { valid: false, message: 'Invalid API key — authentication failed', provider: providerName }
    }

    if (response.status === 429) {
      // Rate limited = key is valid but quota exceeded
      return { valid: true, message: 'API key is valid (rate limited — quota may be exhausted)', provider: providerName }
    }

    return {
      valid: false,
      message: `Unexpected response: HTTP ${response.status}`,
      provider: providerName,
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Network error'
    if (message.includes('timeout') || message.includes('abort')) {
      return { valid: false, message: 'Request timed out — check your network', provider: providerName }
    }
    return { valid: false, message: `Connection error: ${message}`, provider: providerName }
  }
}
