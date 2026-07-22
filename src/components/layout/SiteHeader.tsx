'use client'

import { useEffect, useState, useSyncExternalStore } from 'react'
import { KeyRound, GitFork, Command as CommandIcon } from 'lucide-react'
import { motion } from 'motion/react'
import { ALL_PROVIDERS } from '@/lib/providers/registry'
import { NAV_LINKS, GITHUB_REPO_URL } from '@/lib/content/navigation'
import { SECTION_ID } from '@/lib/content/sections'
import { useScrollToSection } from '@/components/motion/useScrollToSection'
import { useJumpToConsole } from '@/components/motion/useJumpToConsole'
import { MagneticButton } from '@/components/motion/MagneticButton'
import { CommandPalette, useCommandPaletteShortcut } from '@/components/providers/CommandPalette'
import { ThemeToggle } from './ThemeToggle'

/** Scroll distance (px) before the header docks into its "scrolled" look. */
const SCROLL_THRESHOLD_PX = 24

export function SiteHeader() {
  const [isScrolled, setIsScrolled] = useState(false)
  const scrollToSection = useScrollToSection()
  const jumpToConsole = useJumpToConsole()
  const { open, setOpen } = useCommandPaletteShortcut()
  const isMac = useIsMac()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > SCROLL_THRESHOLD_PX)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <header className="sticky top-0 z-40 w-full">
        <div className="mx-auto max-w-6xl px-4 pt-3 sm:px-6">
          <motion.div
            animate={{
              paddingInline: isScrolled ? 20 : 8,
              paddingBlock: isScrolled ? 10 : 8,
            }}
            transition={{ duration: 0.25 }}
            className={[
              'flex items-center justify-between gap-3 rounded-2xl border transition-colors duration-300',
              isScrolled
                ? 'border-zinc-900/8 bg-white/80 shadow-lg shadow-zinc-900/5 backdrop-blur-xl dark:border-white/10 dark:bg-zinc-950/70'
                : 'border-transparent bg-transparent',
            ].join(' ')}
          >
            <button
              type="button"
              onClick={() => scrollToSection(SECTION_ID.hero)}
              className="flex items-center gap-1.5 rounded-lg text-sm font-semibold text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500/50 dark:text-zinc-50"
            >
              <KeyRound className="h-4 w-4 text-accent-500 dark:text-accent-400" />
              key-checker
              <span className="font-mono text-xs font-normal text-zinc-400 dark:text-zinc-500">
                /{ALL_PROVIDERS.length}
              </span>
            </button>

            <nav className="hidden items-center gap-6 lg:flex">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.sectionId}
                  type="button"
                  onClick={() => scrollToSection(link.sectionId)}
                  className="text-sm text-zinc-500 transition-colors hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500/50 rounded dark:text-zinc-400 dark:hover:text-zinc-50"
                >
                  {link.label}
                </button>
              ))}
            </nav>

            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="hidden items-center gap-1.5 rounded-lg border border-zinc-900/10 px-2.5 py-1.5 text-xs text-zinc-500 transition-colors hover:border-accent-500/50 hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500/50 sm:flex dark:border-white/10 dark:text-zinc-400 dark:hover:text-zinc-50"
                aria-label="Open command palette"
              >
                <CommandIcon className="h-3.5 w-3.5" />
                <kbd className="font-mono">{isMac ? '⌘K' : 'Ctrl K'}</kbd>
              </button>

              <a
                href={GITHUB_REPO_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="View source on GitHub"
                className="rounded-lg p-2 text-zinc-500 transition-colors hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500/50 dark:text-zinc-400 dark:hover:text-zinc-50"
              >
                <GitFork className="h-4 w-4" />
              </a>

              <ThemeToggle />

              <MagneticButton className="ml-1">
                <button
                  type="button"
                  onClick={jumpToConsole}
                  className="rounded-lg bg-accent-500 px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-300"
                >
                  Check a key
                </button>
              </MagneticButton>
            </div>
          </motion.div>
        </div>
      </header>

      <CommandPalette providers={ALL_PROVIDERS} open={open} onOpenChange={setOpen} />
    </>
  )
}

/** Cosmetic only (⌘ vs Ctrl in the shortcut hint) — never gates functionality. */
const subscribeNever = () => () => {}
function getIsMacSnapshot(): boolean {
  return /Mac|iPod|iPhone|iPad/.test(window.navigator.platform ?? navigator.userAgent)
}
function useIsMac(): boolean {
  // useSyncExternalStore (not useState+useEffect) so the "assume Mac on the
  // server, confirm on the client" split never calls setState by hand.
  return useSyncExternalStore(subscribeNever, getIsMacSnapshot, () => true)
}
