import type { ValidationResult } from '../types'

export async function validateAzure(
  resourceName: string,
  apiKey: string
): Promise<ValidationResult> {
  if (!resourceName?.trim() || !apiKey?.trim()) {
    return { valid: false, message: 'Resource name and API key are required', provider: 'Azure OpenAI' }
  }

  const url = `https://${resourceName.trim()}.openai.azure.com/openai/models?api-version=2024-06-01`

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'api-key': apiKey.trim(),
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(10000),
    })

    if (response.ok) {
      return { valid: true, message: `Valid Azure OpenAI credentials (resource: ${resourceName})`, provider: 'Azure OpenAI' }
    }

    if (response.status === 401) {
      return { valid: false, message: 'Invalid API key — authentication failed', provider: 'Azure OpenAI' }
    }

    if (response.status === 404) {
      return { valid: false, message: `Resource "${resourceName}" not found — check resource name`, provider: 'Azure OpenAI' }
    }

    if (response.status === 429) {
      return { valid: true, message: 'Credentials valid (rate limited)', provider: 'Azure OpenAI' }
    }

    return { valid: false, message: `Unexpected response: HTTP ${response.status}`, provider: 'Azure OpenAI' }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Network error'
    return { valid: false, message: `Connection error: ${message}`, provider: 'Azure OpenAI' }
  }
}
