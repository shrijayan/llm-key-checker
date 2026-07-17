import { SiteHeader } from '@/components/layout/SiteHeader'
import { TrustBadge } from '@/components/TrustBadge'
import { KeyConsole } from '@/components/providers/KeyConsole'
import { ALL_PROVIDERS } from '@/lib/providers/registry'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-paper-50 dark:bg-ink-950">
      <SiteHeader providerCount={ALL_PROVIDERS.length} />

      <main className="flex flex-col items-center px-4 pt-12 sm:pt-16 pb-16">
        <div className="text-center mb-8 max-w-md">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-ink-900 dark:text-ink-50 mb-3 leading-tight">
            Validate any LLM API key.
          </h1>
          <p className="text-sm sm:text-base text-slate-500 dark:text-ink-400 leading-relaxed">
            Pick a provider, paste your key, see the real request and response.
            Nothing is stored.
          </p>
        </div>

        <div className="w-full max-w-2xl">
          <KeyConsole providers={ALL_PROVIDERS} />
        </div>

        <div className="mt-8">
          <TrustBadge />
        </div>
      </main>

      <footer className="text-center py-5 text-xs font-mono text-slate-400 dark:text-ink-400 border-t border-paper-200 dark:border-ink-700">
        open source ·{' '}
        <a
          href="https://github.com/shrijayan/llm-key-checker"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:text-slate-600 dark:hover:text-ink-100 transition-colors"
        >
          view source
        </a>{' '}
        · providers synced from{' '}
        <a
          href="https://github.com/BerriAI/litellm"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:text-slate-600 dark:hover:text-ink-100 transition-colors"
        >
          litellm
        </a>
      </footer>
    </div>
  )
}
