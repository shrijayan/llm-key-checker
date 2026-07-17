import { Loader2 } from 'lucide-react'
import type { ValidationResult as ValidationResultType } from '@/lib/providers/types'

interface Props {
  result: ValidationResultType | null
  isLoading: boolean
}

/**
 * Mirrors curl -v response conventions: '*' for progress, '<' for the
 * actual response. Kept truthful — we only ever know valid/invalid + a
 * message, so we never fabricate a specific HTTP status code we don't have.
 */
export function ValidationResult({ result, isLoading }: Props) {
  if (isLoading) {
    return (
      <div className="flex items-center gap-2 rounded-md bg-ink-900 border border-ink-700 px-3 py-2.5 font-mono text-xs text-ink-400">
        <Loader2 className="w-3.5 h-3.5 animate-spin flex-shrink-0" />
        * sending request...
      </div>
    )
  }

  if (!result) return null

  const isValid = result.valid

  return (
    <div
      role="status"
      className={[
        'rounded-md border px-3 py-2.5 font-mono text-xs leading-relaxed',
        isValid ? 'bg-success-600/10 border-success-600/40' : 'bg-error-600/10 border-error-600/40',
      ].join(' ')}
    >
      <div className={isValid ? 'text-success-400' : 'text-error-400'}>
        &lt; result: {isValid ? 'valid ✓' : 'invalid ✗'}
      </div>
      <div className="text-ink-100 mt-0.5">&lt; {result.message}</div>
    </div>
  )
}
