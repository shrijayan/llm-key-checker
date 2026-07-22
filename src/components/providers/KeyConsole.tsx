'use client'

import { useCallback, useMemo, useState } from 'react'
import { Search, X, Sparkles } from 'lucide-react'
import type { Provider } from '@/lib/providers/types'
import { detectProviderFromKey, looksLikeApiKey } from '@/lib/providers/detectProvider'
import { SMART_INPUT_ID } from '@/lib/content/sections'
import { useProviderSelection } from './ProviderSelectionContext'
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
 *
 * The single input doubles as search *and* paste target: paste a real key
 * and it is matched against known key shapes (see detectProvider.ts) and
 * routed straight to the right form — the single biggest friction cut on
 * this page, since picking a provider by hand is no longer required at all
 * for the common case.
 *
 * Deliberately no exit/enter transition (AnimatePresence) between the
 * picker and the form: this is the one interaction on the page that isn't
 * a marketing moment, it's the actual tool, done potentially many times in
 * a row. Speed matters more than polish here — the rest of the page gets
 * to be a little slower and prettier because this part isn't.
 */
export function KeyConsole({ providers }: Props) {
  const { selectedProvider, detectionSource, selectProvider, clearSelection } =
    useProviderSelection()
  const [query, setQuery] = useState('')

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
  const unrecognizedKeyPasted = allMatches.length === 0 && looksLikeApiKey(query)

  const handleQueryChange = useCallback(
    (value: string) => {
      setQuery(value)

      const detected = detectProviderFromKey(value, providers)
      if (detected) {
        selectProvider(detected.provider, {
          prefill: { fieldKey: detected.fieldKey, value: detected.rawValue },
          source: 'auto',
        })
        setQuery('')
      }
    },
    [providers, selectProvider]
  )

  const pickProvider = useCallback(
    (p: Provider) => {
      selectProvider(p, { source: 'manual' })
      setQuery('')
    },
    [selectProvider]
  )

  const hostname = getHost(selectedProvider?.baseUrl)

  return (
    <div className="w-full rounded-xl border border-ink-700 bg-ink-950 shadow-2xl shadow-black/30 ring-1 ring-white/5 overflow-hidden">
      {/* Title bar — always dark, like a terminal window regardless of site theme */}
      <div className="flex items-center gap-2 px-3.5 sm:px-4 py-2.5 border-b border-ink-700 bg-ink-900">
        <span className="w-2 h-2 rounded-full bg-ink-600 flex-shrink-0" aria-hidden="true" />
        <span className="text-xs font-mono text-ink-100 truncate">key-checker</span>
        {hostname && (
          <span className="ml-auto text-xs font-mono text-ink-400 truncate">{hostname}</span>
        )}
      </div>

      <div className="p-4 sm:p-5">
        {!selectedProvider ? (
          <div className="animate-fade-in">
            <p className="text-xs font-mono text-ink-400 mb-3">
              <span className="text-accent-400">$</span> select-provider
            </p>

            {/* Featured providers — always visible, zero clicks to see options */}
            <div className="flex flex-wrap gap-2 mb-4">
              {featured.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => pickProvider(p)}
                  className="min-h-10 px-3 py-2 rounded-md text-sm font-mono border border-ink-700 text-ink-100 hover:border-accent-500 hover:text-accent-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500/50 transition-colors"
                >
                  {p.name}
                </button>
              ))}
            </div>

            {/* Search-or-paste — always visible, results render inline below (no overlay) */}
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-md border border-ink-700 focus-within:border-accent-500 transition-colors">
              <Search className="w-3.5 h-3.5 text-ink-400 flex-shrink-0" />
              <input
                id={SMART_INPUT_ID}
                type="text"
                value={query}
                onChange={(e) => handleQueryChange(e.target.value)}
                placeholder={`paste a key, or search ${providers.length} providers...`}
                aria-label="Paste an API key, or search providers by name"
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
                  <p className="px-3 py-3 text-sm font-mono text-ink-400 leading-relaxed">
                    {unrecognizedKeyPasted
                      ? "Couldn't recognize this key's shape — pick your provider below, then paste the key into the form."
                      : `no providers match "${query}"`}
                  </p>
                ) : (
                  searchResults.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => pickProvider(p)}
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
                <span className="text-accent-400">$</span> paste-key --provider{' '}
                {selectedProvider.id}
                {detectionSource === 'auto' && (
                  <span className="ml-2 inline-flex items-center gap-1 text-accent-300">
                    <Sparkles className="w-3 h-3" aria-hidden="true" />
                    auto-detected
                  </span>
                )}
              </p>
              <button
                type="button"
                onClick={clearSelection}
                className="text-xs font-mono text-ink-400 hover:text-accent-300 underline underline-offset-2 flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500/50 rounded"
              >
                change
              </button>
            </div>

            <KeyForm key={selectedProvider.id} provider={selectedProvider} />
          </div>
        )}
      </div>
    </div>
  )
}
