'use client'

import { useEffect, useRef, useState } from 'react'
import { Eye, EyeOff, CornerDownLeft, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import type { Provider, ValidationResult } from '@/lib/providers/types'
import { getRequestPreview } from '@/lib/providers/requestPreview'
import { useProviderSelection } from './ProviderSelectionContext'
import { ValidationResult as ValidationResultDisplay } from './ValidationResult'

interface Props {
  provider: Provider
}

export function KeyForm({ provider }: Props) {
  const { prefill } = useProviderSelection()

  const [credentials, setCredentials] = useState<Record<string, string>>(() => {
    const defaults: Record<string, string> = {}
    for (const field of provider.fields) {
      if (field.default) defaults[field.key] = field.default
    }
    // A key detected from a paste (e.g. sk-ant-...) is seeded into its field
    // so the user never has to paste it a second time.
    if (prefill) defaults[prefill.fieldKey] = prefill.value
    return defaults
  })
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<ValidationResult | null>(null)
  const firstFieldRef = useRef<HTMLInputElement>(null)

  // Focus the most relevant field the moment this form appears — the
  // pre-filled one if a key was auto-detected, otherwise the first field.
  // `preventScroll` keeps this from fighting the in-flight Lenis scroll that
  // usually brought the console into view a moment earlier.
  useEffect(() => {
    firstFieldRef.current?.focus({ preventScroll: true })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
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

  const toggleSecret = (key: string) =>
    setShowSecrets((prev) => ({ ...prev, [key]: !prev[key] }))

  // Live-updates as credentials change — this is the real request the validator sends.
  const preview = getRequestPreview(provider, credentials)
  const focusFieldKey = prefill ? prefill.fieldKey : provider.fields[0]?.key

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* curl -v convention: '>' prefixes outgoing request lines */}
      <div className="rounded-lg bg-ink-900 border border-ink-700 px-3.5 py-3 font-mono text-[11px] sm:text-xs leading-relaxed overflow-x-auto">
        <div className="text-ink-100 whitespace-nowrap">&gt; {preview.requestLine}</div>
        <div className="text-ink-400 whitespace-nowrap">&gt; {preview.hostLine}</div>
        {preview.authLines.map((line) => (
          <div key={line} className="text-gold-400 whitespace-nowrap">
            &gt; {line}
          </div>
        ))}
      </div>

      {provider.fields.map((field) => {
        const inputId = `${provider.id}-${field.key}`
        return (
          <div key={field.key}>
            <label
              htmlFor={inputId}
              className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-ink-400 mb-1.5"
            >
              {field.label}
              {field.required === false && (
                <span className="normal-case text-ink-600">(optional)</span>
              )}
            </label>

            {field.hint && <p className="text-xs text-ink-400 mb-1.5">{field.hint}</p>}

            <div className="relative">
              <input
                id={inputId}
                ref={field.key === focusFieldKey ? firstFieldRef : undefined}
                type={field.secret && !showSecrets[field.key] ? 'password' : 'text'}
                value={credentials[field.key] ?? ''}
                onChange={(e) =>
                  setCredentials((prev) => ({ ...prev, [field.key]: e.target.value }))
                }
                placeholder={field.placeholder ?? ''}
                required={field.required !== false}
                className={[
                  'w-full px-3 py-2.5 text-sm font-mono rounded-md border outline-none transition-colors',
                  'bg-ink-800 border-ink-700 placeholder:text-ink-600',
                  'focus-visible:border-accent-500 focus-visible:ring-2 focus-visible:ring-accent-500/30',
                  field.secret ? 'text-gold-300 pr-10' : 'text-ink-100',
                ].join(' ')}
              />
              {field.secret && (
                <button
                  type="button"
                  onClick={() => toggleSecret(field.key)}
                  aria-label={showSecrets[field.key] ? 'Hide key' : 'Show key'}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-100 transition-colors"
                >
                  {showSecrets[field.key] ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              )}
            </div>
          </div>
        )
      })}

      <motion.button
        type="submit"
        disabled={isLoading}
        whileHover={{ scale: isLoading ? 1 : 1.01 }}
        whileTap={{ scale: isLoading ? 1 : 0.98 }}
        className="group w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-md bg-accent-500 hover:bg-accent-400 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-mono font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-300"
      >
        {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
        {isLoading ? 'checking...' : 'run check'}
        {!isLoading && (
          <CornerDownLeft className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity" />
        )}
      </motion.button>

      <AnimatePresence mode="wait">
        {(isLoading || result) && (
          <motion.div
            key={isLoading ? 'loading' : 'result'}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
          >
            <ValidationResultDisplay result={result} isLoading={isLoading} />
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  )
}
