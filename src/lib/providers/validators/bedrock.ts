import type { ValidationResult } from '../types'

export async function validateBedrock(
  accessKeyId: string,
  secretAccessKey: string,
  region: string
): Promise<ValidationResult> {
  if (!accessKeyId?.trim() || !secretAccessKey?.trim()) {
    return { valid: false, message: 'Access Key ID and Secret Access Key are required', provider: 'AWS Bedrock' }
  }

  const awsRegion = region?.trim() || 'us-east-1'

  try {
    // Dynamic import to avoid bundle bloat when not used
    const { BedrockClient, ListFoundationModelsCommand } = await import('@aws-sdk/client-bedrock')

    const client = new BedrockClient({
      region: awsRegion,
      credentials: {
        accessKeyId: accessKeyId.trim(),
        secretAccessKey: secretAccessKey.trim(),
      },
    })

    await client.send(new ListFoundationModelsCommand({}))
    return { valid: true, message: `Valid AWS Bedrock credentials (region: ${awsRegion})`, provider: 'AWS Bedrock' }
  } catch (err: unknown) {
    const error = err as { name?: string; message?: string; $metadata?: { httpStatusCode?: number } }
    const status = error.$metadata?.httpStatusCode
    const name = error.name ?? ''

    if (name === 'UnrecognizedClientException' || status === 401) {
      return { valid: false, message: 'Invalid Access Key ID — not recognized by AWS', provider: 'AWS Bedrock' }
    }
    if (name === 'InvalidSignatureException' || status === 403) {
      return { valid: false, message: 'Invalid Secret Access Key — signature verification failed', provider: 'AWS Bedrock' }
    }
    if (name === 'AccessDeniedException') {
      // Credentials are valid but lack bedrock permission — key works!
      return { valid: true, message: 'Credentials valid but lack Bedrock permissions (bedrock:ListFoundationModels needed)', provider: 'AWS Bedrock' }
    }

    return { valid: false, message: `AWS error: ${error.message ?? name}`, provider: 'AWS Bedrock' }
  }
}
