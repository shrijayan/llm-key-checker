'use client'

import { useEffect, useRef, useState } from 'react'
import { ChevronDown, Eye, EyeOff, Loader2 } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import type { Provider, ValidationResult } from '@/lib/providers/types'
import { ALL_PROVIDERS } from '@/lib/providers/registry'
import {
  detectProviderFromKey,
  getPrefillFieldKey,
  isGenericSkKey,
  SK_STYLE_PROVIDER_IDS,
} from '@/lib/providers/detectProvider'
import { getRequestPreview } from '@/lib/providers/requestPreview'
import { useProviderSelection } from './ProviderSelectionContext'
import { ValidationResult as ValidationResultDisplay } from './ValidationResult'

interface Props {
  provider: Provider
}

export function KeyForm({ provider }: Props) {
  const {
    prefill,
    autoCheck,
    consumeAutoCheck,
    selectProvider,
    changeProvider,
    clearSelection,
    setDraftKey,
  } = useProviderSelection()

  const [credentials, setCredentials] = useState<Record<string, string>>(() => {
    const defaults: Record<string, string> = {}
    for (const field of provider.fields) {
      if (field.default) defaults[field.key] = field.default
    }
    if (prefill) defaults[prefill.fieldKey] = prefill.value
    return defaults
  })
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<ValidationResult | null>(null)
  const firstFieldRef = useRef<HTMLInputElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const didAutoCheck = useRef(false)

  useEffect(() => {
    firstFieldRef.current?.focus({ preventScroll: true })
  }, [])

  useEffect(() => {
    if (!autoCheck || didAutoCheck.current) return
    didAutoCheck.current = true
    consumeAutoCheck()
    formRef.current?.requestSubmit()
  }, [autoCheck, consumeAutoCheck])

  const runCheck = async () => {
    setIsLoading(true)
    setResult(null)

    try {
      const response = await fetch('/api/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ providerId: provider.id, credentials }),
      })
      const data = await response.json()
      setResult(data)
    } catch {
      setResult({ valid: false, message: 'Network error — check your connection' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await runCheck()
  }

  const secretFieldKey = getPrefillFieldKey(provider)
  const currentSecret = credentials[secretFieldKey] ?? ''

  useEffect(() => {
    setDraftKey(currentSecret || null)
  }, [currentSecret, setDraftKey])

  const retargetIfDetected = (fieldKey: string, value: string) => {
    if (fieldKey !== secretFieldKey) return
    const detected = detectProviderFromKey(value, ALL_PROVIDERS)
    if (!detected || detected.provider.id === provider.id) return
    // Don't steal a generic sk- key away from another sk-style provider the user already picked.
    if (
      isGenericSkKey(value) &&
      (SK_STYLE_PROVIDER_IDS as readonly string[]).includes(provider.id)
    ) {
      return
    }
    selectProvider(detected.provider, {
      prefill: { fieldKey: detected.fieldKey, value: detected.rawValue },
      source: 'auto',
      autoCheck: detected.unique,
    })
  }

  const toggleSecret = (key: string) =>
    setShowSecrets((prev) => ({ ...prev, [key]: !prev[key] }))

  const preview = getRequestPreview(provider, credentials)
  const focusFieldKey = prefill ? prefill.fieldKey : provider.fields[0]?.key
  const resultRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (result && !isLoading) {
      resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }, [result, isLoading])

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
      {provider.fields.map((field) => {
        const inputId = `${provider.id}-${field.key}`
        return (
          <div key={field.key}>
            <label
              htmlFor={inputId}
              className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-zinc-700 dark:text-zinc-200"
            >
              {field.label}
              {field.required === false && (
                <span className="text-xs font-normal text-zinc-400">(optional)</span>
              )}
            </label>

            {field.hint && (
              <p className="mb-1.5 text-xs text-zinc-500 dark:text-zinc-400">{field.hint}</p>
            )}

            <div className="relative">
              <input
                id={inputId}
                ref={field.key === focusFieldKey ? firstFieldRef : undefined}
                type={field.secret && !showSecrets[field.key] ? 'password' : 'text'}
                value={credentials[field.key] ?? ''}
                onChange={(e) => {
                  const value = e.target.value
                  setCredentials((prev) => ({ ...prev, [field.key]: value }))
                  setResult(null)
                  retargetIfDetected(field.key, value)
                }}
                placeholder={field.placeholder ?? ''}
                required={field.required !== false}
                autoComplete="off"
                spellCheck={false}
                className={[
                  'w-full rounded-xl border px-3.5 py-3 text-sm outline-none transition-colors',
                  'border-zinc-900/10 bg-white placeholder:text-zinc-400',
                  'focus-visible:border-accent-500 focus-visible:ring-2 focus-visible:ring-accent-500/30',
                  'dark:border-white/10 dark:bg-zinc-900 dark:placeholder:text-zinc-600',
                  field.secret
                    ? 'pr-11 font-mono text-zinc-800 dark:text-gold-300'
                    : 'text-zinc-900 dark:text-zinc-100',
                ].join(' ')}
              />
              {field.secret && (
                <button
                  type="button"
                  onClick={() => toggleSecret(field.key)}
                  aria-label={showSecrets[field.key] ? 'Hide key' : 'Show key'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 transition-colors hover:text-zinc-700 dark:hover:text-zinc-200"
                >
                  {showSecrets[field.key] ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              )}
            </div>
          </div>
        )
      })}

      <details className="group rounded-xl border border-zinc-900/8 bg-zinc-50/80 px-3.5 py-2.5 dark:border-white/8 dark:bg-white/[0.03]">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-2 text-xs font-medium text-zinc-500 marker:content-none [&::-webkit-details-marker]:hidden dark:text-zinc-400">
          What we&apos;ll send
          <ChevronDown className="h-3.5 w-3.5 flex-shrink-0 transition-transform group-open:rotate-180" />
        </summary>
        <div className="mt-2 overflow-x-auto font-mono text-[11px] leading-relaxed text-zinc-500 dark:text-zinc-400">
          <div className="whitespace-nowrap">{preview.requestLine}</div>
          <div className="whitespace-nowrap">{preview.hostLine}</div>
          {preview.authLines.map((line) => (
            <div key={line} className="whitespace-nowrap text-zinc-700 dark:text-gold-400">
              {line}
            </div>
          ))}
        </div>
      </details>

      <button
        type="submit"
        disabled={isLoading}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent-500 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-600 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-300"
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
        {isLoading ? 'Checking…' : 'Check key'}
      </button>

      <AnimatePresence mode="wait">
        {(isLoading || result) && (
          <motion.div
            key={isLoading ? 'loading' : 'result'}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.18 }}
            className="space-y-3"
            ref={resultRef}
          >
            <ValidationResultDisplay
              result={result}
              isLoading={isLoading}
              providerName={provider.name}
            />
            {result && !isLoading && (
              <div className="flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={clearSelection}
                  className="flex-1 rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500/50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
                >
                  Check another key
                </button>
                <button
                  type="button"
                  onClick={() => changeProvider(currentSecret)}
                  className="flex-1 rounded-xl border border-zinc-900/10 px-4 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500/50 dark:border-white/10 dark:text-zinc-200 dark:hover:bg-white/5"
                >
                  Change provider
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  )
}
