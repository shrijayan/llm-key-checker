import type { Provider } from './types'

/**
 * One row per recognizable key "shape". Ordered most-specific first: e.g.
 * Anthropic's `sk-ant-` and OpenRouter's `sk-or-` must be checked before the
 * bare `sk-` fallback that means OpenAI, or they'd never be reached.
 *
 * `fieldKey` says which form field the pasted value belongs in — almost
 * always `apiKey`, except AWS where the recognizable prefix (`AKIA`/`ASIA`)
 * identifies the *access key id*, not the secret.
 *
 * `unique` means the shape is distinctive enough to auto-select *and*
 * auto-run a check on paste. Bare `sk-` is not unique — DeepSeek, Moonshot,
 * and others issue the same prefix.
 */
interface KeySignature {
  pattern: RegExp
  providerId: string
  fieldKey: string
  unique: boolean
}

const KEY_SIGNATURES: readonly KeySignature[] = [
  { pattern: /^sk-ant-/, providerId: 'anthropic', fieldKey: 'apiKey', unique: true },
  { pattern: /^sk-or-/, providerId: 'openrouter', fieldKey: 'apiKey', unique: true },
  { pattern: /^sk-proj-/, providerId: 'openai', fieldKey: 'apiKey', unique: true },
  { pattern: /^sk-svcacct-/, providerId: 'openai', fieldKey: 'apiKey', unique: true },
  { pattern: /^gsk_/, providerId: 'groq', fieldKey: 'apiKey', unique: true },
  { pattern: /^xai-/, providerId: 'xai', fieldKey: 'apiKey', unique: true },
  { pattern: /^pplx-/, providerId: 'perplexity', fieldKey: 'apiKey', unique: true },
  { pattern: /^hf_/, providerId: 'huggingface', fieldKey: 'apiKey', unique: true },
  { pattern: /^nvapi-/, providerId: 'nvidia_nim', fieldKey: 'apiKey', unique: true },
  { pattern: /^fw_/, providerId: 'fireworks_ai', fieldKey: 'apiKey', unique: true },
  { pattern: /^csk[-_]/, providerId: 'cerebras', fieldKey: 'apiKey', unique: true },
  { pattern: /^AIzaSy/, providerId: 'gemini', fieldKey: 'apiKey', unique: true },
  { pattern: /^(AKIA|ASIA)/, providerId: 'bedrock', fieldKey: 'accessKeyId', unique: true },
  // Zhipu/GLM keys are a composite `{id}.{secret}` — one dot, no whitespace.
  { pattern: /^[\w-]{8,}\.[\w-]{8,}$/, providerId: 'zai', fieldKey: 'apiKey', unique: true },
  // Bare `sk-...` (no more specific prefix above matched) is OpenAI-shaped,
  // but several other providers issue the same prefix.
  { pattern: /^sk-/, providerId: 'openai', fieldKey: 'apiKey', unique: false },
]

/** Providers known to issue OpenAI-style `sk-` keys (not `sk-ant-` / `sk-or-` / …). */
export const SK_STYLE_PROVIDER_IDS = [
  'openai',
  'deepseek',
  'moonshot',
  'together_ai',
  'minimax',
  'stepfun',
] as const

/** Below this length we can't tell a real secret from someone typing a provider's name. */
const MIN_KEY_LENGTH = 20

/** True once input looks like a pasted credential rather than search text (e.g. "groq"). */
export function looksLikeApiKey(input: string): boolean {
  const value = input.trim()
  if (value.length < MIN_KEY_LENGTH) return false
  // Real keys don't contain spaces; provider-name searches usually don't need this many characters either.
  return !/\s/.test(value)
}

export interface DetectedProvider {
  provider: Provider
  /** The raw input, trimmed — the caller pre-fills this into the form. */
  rawValue: string
  /** Which form field `rawValue` belongs in (usually `apiKey`). */
  fieldKey: string
  /** Distinctive enough to auto-run a check without asking. */
  unique: boolean
}

function matchSignature(value: string): KeySignature | null {
  for (const signature of KEY_SIGNATURES) {
    if (signature.pattern.test(value)) return signature
  }
  return null
}

/**
 * Matches a pasted value against known key signatures and returns the
 * provider it belongs to, if any. Returns `null` when the shape isn't
 * recognized (still a valid outcome — the UI just asks the user to pick).
 */
export function detectProviderFromKey(
  input: string,
  providers: Provider[]
): DetectedProvider | null {
  const value = input.trim()
  if (!looksLikeApiKey(value)) return null

  const signature = matchSignature(value)
  if (!signature) return null

  const provider = providers.find((item) => item.id === signature.providerId)
  if (!provider) return null

  return {
    provider,
    rawValue: value,
    fieldKey: signature.fieldKey,
    unique: signature.unique,
  }
}

/** Bare `sk-` keys that several providers share — don't auto-check these. */
export function isGenericSkKey(input: string): boolean {
  const value = input.trim()
  const signature = matchSignature(value)
  return signature?.providerId === 'openai' && signature.unique === false
}

export function getSkStyleProviders(providers: Provider[]): Provider[] {
  const byId = new Map(providers.map((provider) => [provider.id, provider]))
  return SK_STYLE_PROVIDER_IDS.map((id) => byId.get(id)).filter(
    (provider): provider is Provider => provider !== undefined
  )
}

/** First secret field, else the first field — where a pasted key should land. */
export function getPrefillFieldKey(provider: Provider): string {
  return provider.fields.find((field) => field.secret)?.key ?? provider.fields[0]?.key ?? 'apiKey'
}
