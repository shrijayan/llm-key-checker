import { SiteHeader } from '@/components/layout/SiteHeader'
import { TrustBadge } from '@/components/TrustBadge'
import { ProviderGrid } from '@/components/providers/ProviderGrid'
import { ALL_PROVIDERS } from '@/lib/providers/registry'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
      <SiteHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero */}
        <div className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
            LLM Key Checker
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Instantly verify any LLM API key across {ALL_PROVIDERS.length}+ providers.
            Select your provider, paste your key, done.
          </p>
        </div>

        <TrustBadge />

        <ProviderGrid providers={ALL_PROVIDERS} />
      </main>

      <footer className="text-center py-8 text-sm text-gray-500 dark:text-gray-500">
        <p>
          Open source ·{' '}
          <a
            href="https://github.com/shrijayan/llm-key-checker"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-gray-700 dark:hover:text-gray-300"
          >
            View source on GitHub
          </a>{' '}
          · Provider list auto-synced from{' '}
          <a
            href="https://github.com/BerriAI/litellm"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-gray-700 dark:hover:text-gray-300"
          >
            LiteLLM
          </a>
        </p>
      </footer>
    </div>
  )
}
