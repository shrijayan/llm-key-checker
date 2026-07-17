export type AuthType =
  | 'bearer'       // Standard: Authorization: Bearer {apiKey}
  | 'anthropic'    // x-api-key + anthropic-version + browser access header
  | 'gemini'       // ?key= query param (no auth header)
  | 'aws-sigv4'    // AWS Bedrock: access key + secret key + region
  | 'azure'        // Azure OpenAI: api-key header + custom endpoint URL
  | 'zhipu'        // Zhipu AI: local JWT from composite id.secret key

export type ProviderCategory = 'popular' | 'chinese' | 'local' | 'cloud' | 'other'

export interface ProviderField {
  key: string
  label: string
  placeholder?: string
  secret?: boolean
  default?: string
  required?: boolean
  hint?: string
}

export interface Provider {
  id: string
  name: string
  baseUrl?: string            // undefined = user must supply base URL
  authType: AuthType
  fields: ProviderField[]
  corsEnabled?: boolean
  category: ProviderCategory
  tags?: string[]
  isLocal?: boolean
}

export interface ValidationRequest {
  providerId: string
  credentials: Record<string, string>
}

export interface ValidationResult {
  valid: boolean
  message: string
  provider?: string
}

// Shape of entries in registry.generated.json
export interface GeneratedProvider {
  id: string
  name: string
  baseUrl?: string
  authType: AuthType
  corsEnabled: boolean
  category: ProviderCategory
  fields: ProviderField[]
}
