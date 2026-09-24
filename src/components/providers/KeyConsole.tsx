'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { ArrowLeft, Search, Sparkles, X } from 'lucide-react'
import type { Provider } from '@/lib/providers/types'
import {
  detectProviderFromKey,
  getPrefillFieldKey,
  getSkStyleProviders,
  isGenericSkKey,
  looksLikeApiKey,
} from '@/lib/providers/detectProvider'
import { SMART_INPUT_ID } from '@/lib/content/sections'
import { useProviderSelection } from './ProviderSelectionContext'
import { KeyForm } from './KeyForm'

interface Props {
  providers: Provider[]
}

const MAX_RESULTS = 8

/**
 * Curated quick-pick order — real-world usage prominence, not the registry's
 * `category` field and not alphabetical order.
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

export function KeyConsole({ providers }: Props) {
  const {
    selectedProvider,
    detectionSource,
    prefill,
    pendingKey,
    selectProvider,
    changeProvider,
    setPendingKey,
  } = useProviderSelection()
  const [query, setQuery] = useState(pendingKey ?? '')

  useEffect(() => {
    if (selectedProvider) return
    if (pendingKey) setQuery(pendingKey)
  }, [pendingKey, selectedProvider])

  const featured = useMemo(() => {
    const byId = new Map(providers.map((p) => [p.id, p]))
    return FEATURED_PROVIDER_IDS.map((id) => byId.get(id)).filter(
      (p): p is Provider => p !== undefined
    )
  }, [providers])

  const skStyleProviders = useMemo(() => getSkStyleProviders(providers), [providers])

  const allMatches = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q || looksLikeApiKey(query)) return []
    return providers.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        p.tags?.some((t) => t.toLowerCase().includes(q))
    )
  }, [providers, query])

  const searchResults = allMatches.slice(0, MAX_RESULTS)
  const remainingMatches = allMatches.length - searchResults.length
  const pastedKey = looksLikeApiKey(query)
  const detectedPasted = pastedKey ? detectProviderFromKey(query, providers) : null
  const unrecognizedKeyPasted = pastedKey && !detectedPasted

  const applyDetection = useCallback(
    (value: string, fromPaste: boolean) => {
      const detected = detectProviderFromKey(value, providers)
      if (detected) {
        selectProvider(detected.provider, {
          prefill: { fieldKey: detected.fieldKey, value: detected.rawValue },
          source: 'auto',
          autoCheck: fromPaste && detected.unique,
        })
        setQuery('')
        return
      }

      if (looksLikeApiKey(value)) {
        setPendingKey(value)
      } else {
        setPendingKey(null)
      }
    },
    [providers, selectProvider, setPendingKey]
  )

  const handleQueryChange = useCallback(
    (value: string) => {
      setQuery(value)
      applyDetection(value, false)
    },
    [applyDetection]
  )

  const pickProvider = useCallback(
    (p: Provider) => {
      const pasted = (pendingKey ?? query).trim()
      const hasKey = looksLikeApiKey(pasted)
      selectProvider(p, {
        source: hasKey ? 'auto' : 'manual',
        prefill: hasKey ? { fieldKey: getPrefillFieldKey(p), value: pasted } : undefined,
      })
      setQuery('')
    },
    [pendingKey, query, selectProvider]
  )

  useEffect(() => {
    if (!selectedProvider) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      if (document.querySelector('[role="dialog"]')) return
      event.preventDefault()
      changeProvider()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [selectedProvider, changeProvider])

  const hostname = getHost(selectedProvider?.baseUrl)
  const showSkAmbiguity =
    Boolean(selectedProvider) &&
    detectionSource === 'auto' &&
    Boolean(prefill?.value) &&
    isGenericSkKey(prefill?.value ?? '')

  return (
    <div className="w-full overflow-hidden rounded-3xl border border-zinc-900/10 bg-white/90 shadow-2xl shadow-zinc-900/10 ring-1 ring-black/5 backdrop-blur-xl dark:border-white/10 dark:bg-zinc-950/80 dark:shadow-black/40 dark:ring-white/10">
      <div className="flex items-center justify-between gap-3 border-b border-zinc-900/8 px-4 py-3 sm:px-5 dark:border-white/8">
        {selectedProvider ? (
          <button
            type="button"
            onClick={() => changeProvider()}
            className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-zinc-900/10 bg-white px-3 text-sm font-medium text-zinc-700 transition-colors hover:border-accent-500/40 hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500/50 dark:border-white/10 dark:bg-white/5 dark:text-zinc-200 dark:hover:text-zinc-50"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back
          </button>
        ) : (
          <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">Check an API key</p>
        )}

        {selectedProvider ? (
          <div className="min-w-0 text-right">
            <p className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              {selectedProvider.name}
            </p>
            <p className="truncate text-xs text-zinc-400">
              {detectionSource === 'auto' ? (
                <span className="inline-flex items-center gap-1 text-accent-600 dark:text-accent-300">
                  <Sparkles className="h-3 w-3" aria-hidden="true" />
                  auto-detected
                </span>
              ) : hostname ? (
                hostname
              ) : (
                'Ready to check'
              )}
            </p>
          </div>
        ) : (
          <p className="hidden text-xs text-zinc-400 sm:block">{providers.length}+ providers</p>
        )}
      </div>

      <div className="p-4 sm:p-5">
        {!selectedProvider ? (
          <div className="animate-fade-in">
            <label htmlFor={SMART_INPUT_ID} className="sr-only">
              Paste an API key, or search providers
            </label>
            <div className="relative">
              <textarea
                id={SMART_INPUT_ID}
                value={query}
                rows={3}
                onChange={(e) => handleQueryChange(e.target.value)}
                onPaste={(e) => {
                  const text = e.clipboardData.getData('text')
                  if (!text.trim()) return
                  e.preventDefault()
                  setQuery(text)
                  applyDetection(text, true)
                }}
                placeholder={`Paste your API key — we detect the provider. Or search ${providers.length} providers…`}
                aria-label="Paste an API key, or search providers by name"
                autoComplete="off"
                spellCheck={false}
                className="w-full resize-none rounded-2xl border border-zinc-900/10 bg-zinc-50 px-4 py-3.5 font-mono text-sm text-zinc-900 outline-none transition-colors placeholder:font-sans placeholder:text-zinc-400 focus-visible:border-accent-500 focus-visible:ring-2 focus-visible:ring-accent-500/30 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder:text-zinc-500"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery('')
                    setPendingKey(null)
                  }}
                  aria-label="Clear"
                  className="absolute right-3 top-3 rounded-lg p-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            {!query && (
              <p className="mt-2 text-xs leading-relaxed text-zinc-400">
                Paste first — we&apos;ll detect Anthropic, Groq, Gemini, OpenRouter, and more from
                the key itself. You can always go back and switch.
              </p>
            )}

            {pastedKey && (
              <div
                className={[
                  'mt-3 rounded-xl border px-3 py-2.5 text-sm',
                  unrecognizedKeyPasted
                    ? 'border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-200'
                    : 'border-accent-500/25 bg-accent-500/10 text-zinc-700 dark:text-zinc-200',
                ].join(' ')}
              >
                {unrecognizedKeyPasted ? (
                  <p>
                    Couldn&apos;t recognize this key&apos;s shape. Pick a provider below — we&apos;ll
                    fill the key in for you.
                  </p>
                ) : (
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <p>
                      Looks like{' '}
                      <span className="font-semibold">{detectedPasted?.provider.name}</span>. Pick
                      another provider, or continue.
                    </p>
                    {detectedPasted && (
                      <button
                        type="button"
                        onClick={() => pickProvider(detectedPasted.provider)}
                        className="flex-shrink-0 rounded-lg bg-accent-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-accent-600"
                      >
                        Continue with {detectedPasted.provider.name}
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            {query && !unrecognizedKeyPasted && (
              <div className="mt-3 overflow-hidden rounded-xl border border-zinc-900/10 dark:border-white/10">
                {searchResults.length === 0 ? (
                  <p className="px-3 py-3 text-sm text-zinc-500">No providers match “{query}”</p>
                ) : (
                  searchResults.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => pickProvider(p)}
                      className="flex w-full items-center justify-between gap-3 border-b border-zinc-900/8 px-3 py-2.5 text-left last:border-b-0 hover:bg-zinc-50 focus-visible:bg-zinc-50 focus-visible:outline-none dark:border-white/8 dark:hover:bg-white/5 dark:focus-visible:bg-white/5"
                    >
                      <span className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-50">
                        {p.name}
                      </span>
                      <span className="flex-shrink-0 text-xs capitalize text-zinc-400">
                        {p.category}
                      </span>
                    </button>
                  ))
                )}
                {remainingMatches > 0 && (
                  <p className="px-3 py-2 text-xs text-zinc-400">
                    +{remainingMatches} more — refine your search
                  </p>
                )}
              </div>
            )}

            <div className="mt-5">
              <div className="mb-2.5 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-zinc-400">
                <Search className="h-3 w-3" />
                Or pick a provider
              </div>
              <div className="flex flex-wrap gap-2">
                {featured.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => pickProvider(p)}
                    className="min-h-10 rounded-full border border-zinc-900/10 bg-white px-3.5 py-2 text-sm font-medium text-zinc-700 transition-colors hover:border-accent-500 hover:text-accent-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500/50 dark:border-white/10 dark:bg-white/5 dark:text-zinc-200 dark:hover:border-accent-400 dark:hover:text-accent-300"
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="animate-fade-in">
            {showSkAmbiguity && (
              <div className="mb-4 rounded-xl border border-zinc-900/10 bg-zinc-50 px-3.5 py-3 dark:border-white/10 dark:bg-white/5">
                <p className="text-sm text-zinc-600 dark:text-zinc-300">
                  This looks like an OpenAI-style <span className="font-mono">sk-</span> key.
                  DeepSeek, Moonshot, and others use the same prefix — switch if that isn&apos;t
                  OpenAI.
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {skStyleProviders
                    .filter((p) => p.id !== selectedProvider.id)
                    .map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() =>
                          selectProvider(p, {
                            source: 'manual',
                            prefill: prefill
                              ? { fieldKey: getPrefillFieldKey(p), value: prefill.value }
                              : undefined,
                          })
                        }
                        className="rounded-full border border-zinc-900/10 px-2.5 py-1 text-xs font-medium text-zinc-600 hover:border-accent-500 hover:text-accent-600 dark:border-white/10 dark:text-zinc-300 dark:hover:text-accent-300"
                      >
                        {p.name}
                      </button>
                    ))}
                </div>
              </div>
            )}

            <KeyForm key={selectedProvider.id} provider={selectedProvider} />
          </div>
        )}
      </div>
    </div>
  )
}
