'use client'

import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Provider } from '@/lib/providers/types'

interface ProviderSelectionValue {
  selectedProvider: Provider | null
  /** Set when the provider was auto-detected from a pasted key, vs. picked by hand. */
  detectionSource: 'auto' | 'manual' | null
  /** Field key + value to pre-fill in the form (only set for auto-detection). */
  prefill: { fieldKey: string; value: string } | null
  selectProvider: (
    provider: Provider,
    options?: { prefill?: { fieldKey: string; value: string }; source?: 'auto' | 'manual' }
  ) => void
  clearSelection: () => void
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
  const [prefill, setPrefill] = useState<{ fieldKey: string; value: string } | null>(null)

  const value = useMemo<ProviderSelectionValue>(
    () => ({
      selectedProvider,
      detectionSource,
      prefill,
      selectProvider: (provider, options) => {
        setSelectedProvider(provider)
        setPrefill(options?.prefill ?? null)
        setDetectionSource(options?.source ?? 'manual')
      },
      clearSelection: () => {
        setSelectedProvider(null)
        setPrefill(null)
        setDetectionSource(null)
      },
    }),
    [selectedProvider, detectionSource, prefill]
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
