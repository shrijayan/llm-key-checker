import type { Provider } from './types'

/**
 * Builds a truthful, curl-style preview of the HTTP request this provider's
 * validator actually sends (method, host, auth header) — see src/lib/providers/validators/*.
 *
 * This is not decorative. It shows the real auth mechanism per provider so
 * a user can see, before clicking anything, exactly what "checking a key" means.
 */
export interface RequestPreview {
  /** e.g. "GET /v1/models HTTP/1.1" */
  requestLine: string
  /** e.g. "Host: api.openai.com" */
  hostLine: string
  /** Additional request lines (auth headers). Empty for query-param auth. */
  authLines: string[]
}

const PLACEHOLDER = '<paste your key below>'

/** Masks a secret value for display: shows a few edge characters, hides the rest. */
function mask(value: string | undefined): string {
  const v = value?.trim() ?? ''
  if (!v) return PLACEHOLDER
  if (v.length <= 10) return `${v.slice(0, 2)}${'•'.repeat(6)}`
  return `${v.slice(0, 5)}${'•'.repeat(8)}${v.slice(-4)}`
}

function safeHost(baseUrl: string | undefined): string {
  if (!baseUrl) return '<provider endpoint>'
  try {
    return new URL(baseUrl).host
  } catch {
    return baseUrl
  }
}

export function getRequestPreview(
  provider: Provider,
  credentials: Record<string, string>
): RequestPreview {
  switch (provider.authType) {
    case 'anthropic':
      return {
        requestLine: 'GET /v1/models HTTP/1.1',
        hostLine: 'Host: api.anthropic.com',
        authLines: [
          `x-api-key: ${mask(credentials.apiKey)}`,
          'anthropic-version: 2023-06-01',
        ],
      }

    case 'gemini':
      return {
        requestLine: `GET /v1beta/models?key=${mask(credentials.apiKey)} HTTP/1.1`,
        hostLine: 'Host: generativelanguage.googleapis.com',
        authLines: [],
      }

    case 'azure': {
      const resource = credentials.resourceName?.trim() || '<resource>'
      return {
        requestLine: 'GET /openai/models?api-version=2024-06-01 HTTP/1.1',
        hostLine: `Host: ${resource}.openai.azure.com`,
        authLines: [`api-key: ${mask(credentials.apiKey)}`],
      }
    }

    case 'aws-sigv4': {
      const region = credentials.region?.trim() || 'us-east-1'
      return {
        requestLine: 'GET /foundation-models HTTP/1.1',
        hostLine: `Host: bedrock.${region}.amazonaws.com`,
        authLines: [
          `Authorization: AWS4-HMAC-SHA256 Credential=${mask(credentials.accessKeyId)}/...`,
        ],
      }
    }

    case 'zhipu':
      return {
        requestLine: 'GET /api/paas/v4/models HTTP/1.1',
        hostLine: 'Host: open.bigmodel.cn',
        authLines: [`Authorization: Bearer <JWT signed from ${mask(credentials.apiKey)}>`],
      }

    case 'bearer':
    default:
      return {
        requestLine: 'GET /models HTTP/1.1',
        hostLine: `Host: ${safeHost(provider.baseUrl)}`,
        authLines: [`Authorization: Bearer ${mask(credentials.apiKey)}`],
      }
  }
}
