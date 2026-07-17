import { KeyRound } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'

interface Props {
  providerCount?: number
}

export function SiteHeader({ providerCount }: Props) {
  return (
    <header className="sticky top-0 z-40 border-b border-paper-200 dark:border-ink-700 bg-paper-50/90 dark:bg-ink-950/90 backdrop-blur-sm">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-sm font-semibold text-ink-900 dark:text-ink-50">
          <KeyRound className="w-4 h-4 text-accent-500 dark:text-accent-400" />
          key-checker
          {providerCount != null && (
            <span className="font-mono text-xs font-normal text-slate-500 dark:text-ink-400">
              /{providerCount}
            </span>
          )}
        </div>

        <div className="flex items-center gap-4">
          <a
            href="https://github.com/shrijayan/llm-key-checker"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-mono text-slate-500 hover:text-ink-900 dark:text-ink-400 dark:hover:text-ink-100 transition-colors"
          >
            github
          </a>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
