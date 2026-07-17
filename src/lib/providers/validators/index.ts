import type { Provider, ValidationRequest, ValidationResult } from '../types'
import { validateGenericBearer } from './generic-bearer'
import { validateAnthropic } from './anthropic'
import { validateGemini } from './gemini'
import { validateBedrock } from './bedrock'
import { validateAzure } from './azure'
import { validateZhipu } from './zhipu'

export async function validate(
  provider: Provider,
  request: ValidationRequest
): Promise<ValidationResult> {
  const { credentials } = request

  switch (provider.authType) {
    case 'anthropic':
      return validateAnthropic(credentials.apiKey ?? '')

    case 'gemini':
      return validateGemini(credentials.apiKey ?? '')

    case 'aws-sigv4':
      return validateBedrock(
        credentials.accessKeyId ?? '',
        credentials.secretAccessKey ?? '',
        credentials.region ?? 'us-east-1'
      )

    case 'azure':
      return validateAzure(
        credentials.resourceName ?? '',
        credentials.apiKey ?? ''
      )

    case 'zhipu':
      return validateZhipu(credentials.apiKey ?? '')

    case 'bearer':
    default: {
      // For local providers, user supplies their own base URL
      const baseUrl = credentials.baseUrl || provider.baseUrl
      if (!baseUrl) {
        return { valid: false, message: 'Base URL is required for this provider', provider: provider.name }
      }
      return validateGenericBearer(baseUrl, credentials.apiKey ?? '', provider.name)
    }
  }
}
