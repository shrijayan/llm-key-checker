'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import type { Provider } from '@/lib/providers/types'
import { KeyForm } from './KeyForm'
import { cn } from '@/lib/utils'

interface Props {
  provider: Provider
}

const CATEGORY_COLORS = {
  popular: 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400',
  chinese: 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400',
  cloud:   'bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400',
  local:   'bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-400',
  other:   'bg-gray-50 text-gray-600 dark:bg-gray-800/40 dark:text-gray-400',
}

const AUTH_LABELS: Record<string, string> = {
  bearer:    'API Key',
  anthropic: 'API Key',
  gemini:    'API Key',
  'aws-sigv4': '3 credentials',
  azure:     '2 credentials',
  zhipu:     'JWT key',
}

export function ProviderCard({ provider }: Props) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div
      className={cn(
        'rounded-xl border transition-all duration-200',
        expanded
          ? 'border-brand-300 dark:border-brand-700 shadow-md'
          : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 hover:shadow-sm'
      )}
    >
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full p-4 text-left flex items-start justify-between gap-3"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-gray-900 dark:text-white truncate">
              {provider.name}
            </span>
            <span
              className={cn(
                'text-xs px-2 py-0.5 rounded-full font-medium',
                CATEGORY_COLORS[provider.category]
              )}
            >
              {provider.category}
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {AUTH_LABELS[provider.authType] ?? 'API Key'} ·{' '}
            {provider.baseUrl
              ? new URL(provider.baseUrl).hostname
              : provider.isLocal
              ? 'localhost'
              : 'custom endpoint'}
          </p>
        </div>
        <div className="flex-shrink-0 text-gray-400 dark:text-gray-600 mt-0.5">
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 border-t border-gray-100 dark:border-gray-800">
          <KeyForm provider={provider} />
        </div>
      )}
    </div>
  )
}
