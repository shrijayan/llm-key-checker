'use client'

import { KeyRound, GitFork } from 'lucide-react'
import { NAV_LINKS, GITHUB_REPO_URL, LITELLM_REPO_URL } from '@/lib/content/navigation'
import { SECTION_ID } from '@/lib/content/sections'
import { ScrollLink } from '@/components/motion/ScrollLink'

const CURRENT_YEAR = new Date().getFullYear()

export function SiteFooter() {
  return (
    <footer className="relative border-t border-zinc-900/8 px-4 py-16 dark:border-white/10">
      <div className="mx-auto grid max-w-5xl gap-10 sm:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <ScrollLink
            sectionId={SECTION_ID.hero}
            className="flex items-center gap-1.5 text-sm font-semibold text-zinc-900 dark:text-zinc-50"
          >
            <KeyRound className="h-4 w-4 text-accent-500 dark:text-accent-400" />
            key-checker
          </ScrollLink>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
            Paste any LLM API key, get a real answer. No cookies. No tracking. No key storage.
          </p>
        </div>

        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            Product
          </p>
          <ul className="space-y-2.5">
            {NAV_LINKS.map((link) => (
              <li key={link.sectionId}>
                <ScrollLink
                  sectionId={link.sectionId}
                  className="text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
                >
                  {link.label}
                </ScrollLink>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            Resources
          </p>
          <ul className="space-y-2.5">
            <li>
              <a
                href={GITHUB_REPO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
              >
                View source
              </a>
            </li>
            <li>
              <a
                href={LITELLM_REPO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
              >
                Providers via LiteLLM
              </a>
            </li>
            <li>
              <a
                href={`${GITHUB_REPO_URL}/blob/main/LICENSE`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
              >
                MIT License
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-12 flex max-w-5xl flex-col items-center justify-between gap-3 border-t border-zinc-900/8 pt-6 text-xs text-zinc-400 sm:flex-row dark:border-white/10 dark:text-zinc-500">
        <span>© {CURRENT_YEAR} key-checker &middot; built in the open</span>
        <a
          href={GITHUB_REPO_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="View source on GitHub"
          className="transition-colors hover:text-zinc-700 dark:hover:text-zinc-300"
        >
          <GitFork className="h-4 w-4" />
        </a>
      </div>
    </footer>
  )
}
