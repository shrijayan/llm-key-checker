'use client'

import { useState } from 'react'
import { Eye, EyeOff, Send } from 'lucide-react'
import type { Provider, ValidationResult } from '@/lib/providers/types'
import { ValidationResult as ValidationResultDisplay } from './ValidationResult'

interface Props {
  provider: Provider
}

export function KeyForm({ provider }: Props) {
  const [credentials, setCredentials] = useState<Record<string, string>>(() => {
    const defaults: Record<string, string> = {}
    for (const field of provider.fields) {
      if (field.default) defaults[field.key] = field.default
    }
    return defaults
  })
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<ValidationResult | null>(null)

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

  return (
    <form onSubmit={handleSubmit} className="space-y-3 mt-3">
      {provider.fields.map((field) => (
        <div key={field.key}>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
            {field.label}
            {field.required === false && (
              <span className="ml-1 text-gray-400 font-normal">(optional)</span>
            )}
          </label>

          {field.hint && (
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">{field.hint}</p>
          )}

          <div className="relative">
            <input
              type={field.secret && !showSecrets[field.key] ? 'password' : 'text'}
              value={credentials[field.key] ?? ''}
              onChange={(e) =>
                setCredentials((prev) => ({ ...prev, [field.key]: e.target.value }))
              }
              placeholder={field.placeholder ?? ''}
              required={field.required !== false}
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 pr-10"
            />
            {field.secret && (
              <button
                type="button"
                onClick={() => toggleSecret(field.key)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
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
      ))}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors"
      >
        <Send className="w-4 h-4" />
        {isLoading ? 'Checking...' : 'Check Key'}
      </button>

      <ValidationResultDisplay result={result} isLoading={isLoading} />
    </form>
  )
}
