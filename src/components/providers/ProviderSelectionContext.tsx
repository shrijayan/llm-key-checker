'use client'

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Provider } from '@/lib/providers/types'
import { looksLikeApiKey } from '@/lib/providers/detectProvider'

interface Prefill {
  fieldKey: string
  value: string
}

interface SelectOptions {
  prefill?: Prefill
  source?: 'auto' | 'manual'
  /** Run the check as soon as the form mounts (unique paste detection only). */
  autoCheck?: boolean
}

interface ProviderSelectionValue {
  selectedProvider: Provider | null
  /** Set when the provider was auto-detected from a pasted key, vs. picked by hand. */
  detectionSource: 'auto' | 'manual' | null
  /** Field key + value to pre-fill in the form (only set for auto-detection). */
  prefill: Prefill | null
  /** Paste that didn't match a known shape — filled in after the user picks a provider. */
  pendingKey: string | null
  /** Latest secret typed in the form, so Back can keep it. */
  draftKey: string | null
  autoCheck: boolean
  selectProvider: (provider: Provider, options?: SelectOptions) => void
  clearSelection: () => void
  /** Leave the form, keep the key in the paste box so changing providers isn't a re-paste. */
  changeProvider: (currentKey?: string) => void
  setPendingKey: (value: string | null) => void
  setDraftKey: (value: string | null) => void
  consumeAutoCheck: () => void
}

const ProviderSelectionContext = createContext<ProviderSelectionValue | null>(null)

/**
 * Shared "which provider is active" state. Several independent surfaces —
 * the console itself, the header's command palette, and the provider
 * marquee — all need to read and write this, so it lives above all of them
 * instead of being passed down as props through components that don't
 * otherwise care about it.
 */
export function ProviderSelectionProvider({ children }: { children: ReactNode }) {
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null)
  const [detectionSource, setDetectionSource] = useState<'auto' | 'manual' | null>(null)
  const [prefill, setPrefill] = useState<Prefill | null>(null)
  const [pendingKey, setPendingKey] = useState<string | null>(null)
  const [draftKey, setDraftKey] = useState<string | null>(null)
  const [autoCheck, setAutoCheck] = useState(false)

  const clearSelection = useCallback(() => {
    setSelectedProvider(null)
    setPrefill(null)
    setDetectionSource(null)
    setAutoCheck(false)
    setPendingKey(null)
    setDraftKey(null)
  }, [])

  const selectProvider = useCallback((provider: Provider, options?: SelectOptions) => {
    setSelectedProvider(provider)
    setPrefill(options?.prefill ?? null)
    setDetectionSource(options?.source ?? 'manual')
    setAutoCheck(options?.autoCheck === true)
    setPendingKey(null)
    if (options?.prefill?.value) setDraftKey(options.prefill.value)
  }, [])

  const changeProvider = useCallback((currentKey?: string) => {
    const kept = (currentKey ?? draftKey)?.trim() ?? ''
    setSelectedProvider(null)
    setPrefill(null)
    setDetectionSource(null)
    setAutoCheck(false)
    setDraftKey(null)
    setPendingKey(looksLikeApiKey(kept) ? kept : null)
  }, [draftKey])

  const consumeAutoCheck = useCallback(() => {
    setAutoCheck(false)
  }, [])

  const value = useMemo<ProviderSelectionValue>(
    () => ({
      selectedProvider,
      detectionSource,
      prefill,
      pendingKey,
      draftKey,
      autoCheck,
      selectProvider,
      clearSelection,
      changeProvider,
      setPendingKey,
      setDraftKey,
      consumeAutoCheck,
    }),
    [
      selectedProvider,
      detectionSource,
      prefill,
      pendingKey,
      draftKey,
      autoCheck,
      selectProvider,
      clearSelection,
      changeProvider,
      consumeAutoCheck,
    ]
  )

  return (
    <ProviderSelectionContext.Provider value={value}>{children}</ProviderSelectionContext.Provider>
  )
}

export function useProviderSelection(): ProviderSelectionValue {
  const context = useContext(ProviderSelectionContext)
  if (!context) {
    throw new Error('useProviderSelection must be used within a ProviderSelectionProvider')
  }
  return context
}
