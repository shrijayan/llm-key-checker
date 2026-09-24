import { CheckCircle2, Loader2, XCircle } from 'lucide-react'
import type { ValidationResult as ValidationResultType } from '@/lib/providers/types'

interface Props {
  result: ValidationResultType | null
  isLoading: boolean
  providerName?: string
}

/**
 * Plain-language result of a check. We only ever know valid/invalid + a
 * message from the provider — never a fabricated HTTP status.
 */
export function ValidationResult({ result, isLoading, providerName }: Props) {
  if (isLoading) {
    return (
      <div
        role="status"
        className="flex items-center gap-3 rounded-2xl border border-zinc-900/10 bg-zinc-50 px-4 py-3.5 text-sm text-zinc-600 dark:border-white/10 dark:bg-white/5 dark:text-zinc-300"
      >
        <Loader2 className="h-4 w-4 flex-shrink-0 animate-spin text-accent-500" />
        {providerName ? `Calling ${providerName}…` : 'Checking your key…'}
      </div>
    )
  }

  if (!result) return null

  const isValid = result.valid

  return (
    <div
      role="status"
      className={[
        'rounded-2xl border px-4 py-4',
        isValid
          ? 'border-success-600/30 bg-success-600/10'
          : 'border-error-600/30 bg-error-600/10',
      ].join(' ')}
    >
      <div className="flex items-start gap-3">
        {isValid ? (
          <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-success-600 dark:text-success-400" />
        ) : (
          <XCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-error-600 dark:text-error-400" />
        )}
        <div className="min-w-0">
          <p
            className={[
              'text-base font-semibold',
              isValid ? 'text-success-600 dark:text-success-400' : 'text-error-600 dark:text-error-400',
            ].join(' ')}
          >
            {isValid ? 'This key works' : 'This key was rejected'}
          </p>
          {providerName && (
            <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">{providerName}</p>
          )}
          <p className="mt-2 text-sm leading-relaxed text-zinc-700 dark:text-zinc-200">
            {result.message}
          </p>
        </div>
      </div>
    </div>
  )
}
