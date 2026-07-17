'use client'

import { useState, useMemo, useCallback } from 'react'
import { Search, X } from 'lucide-react'
import type { Provider } from '@/lib/providers/types'
import { KeyForm } from './KeyForm'

interface Props {
  providers: Provider[]
}

const MAX_RESULTS = 8

/**
 * Curated quick-pick order — real-world usage prominence, not the registry's
 * `category` field (which is a data-source grouping, e.g. DeepSeek is filed
 * under "chinese" despite being one of the most widely used APIs) and not
 * alphabetical order (which would cut off "OpenAI" for starting with O).
 * Falls back gracefully: any id no longer in the registry is just skipped.
 */
const FEATURED_PROVIDER_IDS = [
  'openai',
  'anthropic',
  'gemini',
  'groq',
  'deepseek',
  'mistral',
  'openrouter',
  'xai',
] as const

function getHost(baseUrl: string | undefined): string | undefined {
  if (!baseUrl) return undefined
  try {
    return new URL(baseUrl).host
  } catch {
    return undefined
  }
}

/**
 * The core interaction surface: a single terminal-style console.
 * Everything renders in normal document flow — no absolutely-positioned
 * overlay, no conditionally-unmounted dropdown. Popular providers are
 * always visible so there's nothing hidden that can silently fail to appear.
 */
export function KeyConsole({ providers }: Props) {
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<Provider | null>(null)

  const featured = useMemo(() => {
    const byId = new Map(providers.map((p) => [p.id, p]))
    return FEATURED_PROVIDER_IDS.map((id) => byId.get(id)).filter(
      (p): p is Provider => p !== undefined
    )
  }, [providers])

  const allMatches = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    return providers.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        p.tags?.some((t) => t.toLowerCase().includes(q))
    )
  }, [providers, query])

  const searchResults = allMatches.slice(0, MAX_RESULTS)
  const remainingMatches = allMatches.length - searchResults.length

  const selectProvider = useCallback((p: Provider) => {
    setSelected(p)
    setQuery('')
  }, [])

  const changeProvider = useCallback(() => setSelected(null), [])

  const hostname = getHost(selected?.baseUrl)

  return (
    <div className="w-full rounded-lg border border-ink-700 bg-ink-950 shadow-xl shadow-ink-950/10 overflow-hidden">
      {/* Title bar — always dark, like a terminal window regardless of site theme */}
      <div className="flex items-center gap-2 px-3.5 sm:px-4 py-2.5 border-b border-ink-700 bg-ink-900">
        <span className="w-2 h-2 rounded-full bg-ink-600 flex-shrink-0" aria-hidden="true" />
        <span className="text-xs font-mono text-ink-100 truncate">key-checker</span>
        {hostname && (
          <span className="ml-auto text-xs font-mono text-ink-400 truncate">{hostname}</span>
        )}
      </div>

      <div className="p-4 sm:p-5">
        {!selected ? (
          <div>
            <p className="text-xs font-mono text-ink-400 mb-3">
              <span className="text-accent-400">$</span> select-provider
            </p>

            {/* Featured providers — always visible, zero clicks to see options */}
            <div className="flex flex-wrap gap-2 mb-4">
              {featured.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => selectProvider(p)}
                  className="min-h-10 px-3 py-2 rounded-md text-sm font-mono border border-ink-700 text-ink-100 hover:border-accent-500 hover:text-accent-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500/50 transition-colors"
                >
                  {p.name}
                </button>
              ))}
            </div>

            {/* Search — always visible, results render inline below (no overlay) */}
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-md border border-ink-700 focus-within:border-accent-500 transition-colors">
              <Search className="w-3.5 h-3.5 text-ink-400 flex-shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={`search all ${providers.length} providers...`}
                aria-label="Search providers"
                className="flex-1 bg-transparent text-sm font-mono text-ink-50 placeholder:text-ink-500 outline-none min-w-0"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  aria-label="Clear search"
                  className="text-ink-400 hover:text-ink-100 flex-shrink-0"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {query && (
              <div className="mt-2 rounded-md border border-ink-700 divide-y divide-ink-700 max-h-56 overflow-y-auto">
                {searchResults.length === 0 ? (
                  <p className="px-3 py-3 text-sm font-mono text-ink-400">
                    no providers match &quot;{query}&quot;
                  </p>
                ) : (
                  searchResults.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => selectProvider(p)}
                      className="w-full flex items-center justify-between gap-3 px-3 py-2.5 text-left hover:bg-ink-900 focus-visible:outline-none focus-visible:bg-ink-900 transition-colors"
                    >
                      <span className="text-sm font-mono text-ink-100 truncate">{p.name}</span>
                      <span className="text-xs font-mono text-ink-400 flex-shrink-0">
                        {p.category}
                      </span>
                    </button>
                  ))
                )}
                {remainingMatches > 0 && (
                  <p className="px-3 py-2 text-xs font-mono text-ink-400">
                    +{remainingMatches} more — refine your search
                  </p>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="animate-fade-in">
            <div className="flex items-center justify-between gap-3 mb-4">
              <p className="text-xs font-mono text-ink-400 truncate">
                <span className="text-accent-400">$</span> paste-key --provider {selected.id}
              </p>
              <button
                type="button"
                onClick={changeProvider}
                className="text-xs font-mono text-ink-400 hover:text-accent-300 underline underline-offset-2 flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500/50 rounded"
              >
                change
              </button>
            </div>

            <KeyForm key={selected.id} provider={selected} />
          </div>
        )}
      </div>
    </div>
  )
}
