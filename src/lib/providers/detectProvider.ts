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
 * This is intentionally a small, honest list. Not every provider has a
 * distinctive enough key format to guess from — that's fine. When nothing
 * matches, the caller falls back to normal search, which is still correct,
 * just not automatic.
 */
const KEY_SIGNATURES: ReadonlyArray<{ pattern: RegExp; providerId: string; fieldKey: string }> = [
  { pattern: /^sk-ant-/, providerId: 'anthropic', fieldKey: 'apiKey' },
  { pattern: /^sk-or-/, providerId: 'openrouter', fieldKey: 'apiKey' },
  { pattern: /^sk-proj-/, providerId: 'openai', fieldKey: 'apiKey' },
  { pattern: /^sk-svcacct-/, providerId: 'openai', fieldKey: 'apiKey' },
  { pattern: /^gsk_/, providerId: 'groq', fieldKey: 'apiKey' },
  { pattern: /^xai-/, providerId: 'xai', fieldKey: 'apiKey' },
  { pattern: /^pplx-/, providerId: 'perplexity', fieldKey: 'apiKey' },
  { pattern: /^hf_/, providerId: 'huggingface', fieldKey: 'apiKey' },
  { pattern: /^nvapi-/, providerId: 'nvidia_nim', fieldKey: 'apiKey' },
  { pattern: /^fw_/, providerId: 'fireworks_ai', fieldKey: 'apiKey' },
  { pattern: /^AIzaSy/, providerId: 'gemini', fieldKey: 'apiKey' },
  { pattern: /^(AKIA|ASIA)/, providerId: 'bedrock', fieldKey: 'accessKeyId' },
  // Zhipu/GLM keys are a composite `{id}.{secret}` — one dot, no whitespace.
  { pattern: /^[\w-]{8,}\.[\w-]{8,}$/, providerId: 'zai', fieldKey: 'apiKey' },
  // Bare `sk-...` (no more specific prefix above matched) means OpenAI.
  { pattern: /^sk-/, providerId: 'openai', fieldKey: 'apiKey' },
]

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

  const providerById = new Map(providers.map((p) => [p.id, p]))

  for (const { pattern, providerId, fieldKey } of KEY_SIGNATURES) {
    if (!pattern.test(value)) continue
    const provider = providerById.get(providerId)
    if (provider) return { provider, rawValue: value, fieldKey }
  }

  return null
}
