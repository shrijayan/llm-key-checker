import type { Provider } from './types'
import { STATIC_PROVIDERS, STATIC_PROVIDER_MAP } from './registry.static'
import generatedRaw from './registry.generated.json'

const generated = generatedRaw as Provider[]

/**
 * Merged registry: static providers take priority over generated ones.
 * Generated providers not in static are appended.
 * This ensures auto-synced providers from LiteLLM appear automatically,
 * while known providers retain their curated configs.
 */
function buildRegistry(): Provider[] {
  const merged: Provider[] = [...STATIC_PROVIDERS]
  const seenIds = new Set(STATIC_PROVIDERS.map((p) => p.id))

  for (const gen of generated) {
    if (!seenIds.has(gen.id)) {
      merged.push(gen)
      seenIds.add(gen.id)
    }
  }

  return merged.sort((a, b) => {
    // Popular first, then alphabetical within category
    const order: Record<string, number> = { popular: 0, chinese: 1, cloud: 2, local: 3, other: 4 }
    const catDiff = (order[a.category] ?? 4) - (order[b.category] ?? 4)
    if (catDiff !== 0) return catDiff
    return a.name.localeCompare(b.name)
  })
}

export const ALL_PROVIDERS: Provider[] = buildRegistry()

export function getProvider(id: string): Provider | undefined {
  return ALL_PROVIDERS.find((p) => p.id === id) ?? STATIC_PROVIDER_MAP.get(id)
}

export function getProvidersByCategory(category: string): Provider[] {
  if (category === 'all') return ALL_PROVIDERS
  return ALL_PROVIDERS.filter((p) => p.category === category)
}

export const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'popular', label: 'Popular' },
  { id: 'chinese', label: 'Chinese' },
  { id: 'cloud', label: 'Cloud' },
  { id: 'local', label: 'Local' },
  { id: 'other', label: 'Other' },
] as const
