import { CheckCircle, XCircle, Loader2 } from 'lucide-react'
import type { ValidationResult as ValidationResultType } from '@/lib/providers/types'

interface Props {
  result: ValidationResultType | null
  isLoading: boolean
}

export function ValidationResult({ result, isLoading }: Props) {
  if (isLoading) {
    return (
      <div className="flex items-center gap-2 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 text-sm">
        <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" />
        <span>Checking key...</span>
      </div>
    )
  }

  if (!result) return null

  if (result.valid) {
    return (
      <div className="flex items-start gap-2 p-3 rounded-lg bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 text-sm">
        <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
        <span>{result.message}</span>
      </div>
    )
  }

  return (
    <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 text-sm">
      <XCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
      <span>{result.message}</span>
    </div>
  )
}
