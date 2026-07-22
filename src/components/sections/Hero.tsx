'use client'

import { ArrowDown, GitFork } from 'lucide-react'
import { motion } from 'motion/react'
import { ALL_PROVIDERS } from '@/lib/providers/registry'
import { GITHUB_REPO_URL } from '@/lib/content/navigation'
import { SECTION_ID } from '@/lib/content/sections'
import { AuroraBackground } from '@/components/decor/AuroraBackground'
import { MagneticButton } from '@/components/motion/MagneticButton'
import { useJumpToConsole } from '@/components/motion/useJumpToConsole'
import { useScrollToSection } from '@/components/motion/useScrollToSection'
import { EASE_OUT } from '@/lib/motion/variants'
import { TrustBadge } from '@/components/TrustBadge'

export function Hero() {
  const jumpToConsole = useJumpToConsole()
  const scrollToSection = useScrollToSection()
  const providerCount = ALL_PROVIDERS.length

  return (
    <section
      id={SECTION_ID.hero}
      className="relative flex min-h-[92svh] flex-col items-center justify-center overflow-hidden px-4 pb-20 pt-28 text-center sm:pt-32"
    >
      <AuroraBackground />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE_OUT }}
        className="mb-6 inline-flex items-center gap-2 rounded-full border border-zinc-900/10 bg-white/60 px-4 py-1.5 text-xs font-medium text-zinc-600 backdrop-blur-sm dark:border-white/10 dark:bg-white/5 dark:text-zinc-300"
      >
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success-400 opacity-75" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success-400" />
        </span>
        open source &middot; {providerCount}+ providers &middot; zero storage
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.05 }}
        className="text-balance-pretty max-w-3xl text-4xl font-semibold tracking-tight text-zinc-900 sm:text-6xl dark:text-zinc-50"
      >
        Does your API key
        <br />
        <span className="bg-gradient-to-r from-accent-500 via-violet-500 to-cyan-500 bg-clip-text text-transparent">
          actually work?
        </span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.12 }}
        className="text-balance-pretty mt-5 max-w-xl text-base leading-relaxed text-zinc-500 sm:text-lg dark:text-zinc-400"
      >
        Paste it once. We call the real endpoint for OpenAI, Anthropic, Gemini, or any of the{' '}
        {providerCount}+ providers below, and tell you the truth. No accounts, no guessing.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.2 }}
        className="mt-9 flex flex-col items-center gap-4 sm:flex-row"
      >
        <MagneticButton>
          <button
            type="button"
            onClick={jumpToConsole}
            className="rounded-xl bg-accent-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-accent-500/25 transition-colors hover:bg-accent-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-300"
          >
            Check a key
          </button>
        </MagneticButton>

        <MagneticButton>
          <a
            href={GITHUB_REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-xl border border-zinc-900/10 px-6 py-3.5 text-sm font-semibold text-zinc-700 transition-colors hover:border-zinc-900/20 hover:bg-zinc-900/[0.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500/50 dark:border-white/15 dark:text-zinc-200 dark:hover:bg-white/5"
          >
            <GitFork className="h-4 w-4" />
            View source
          </a>
        </MagneticButton>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        className="mt-8"
      >
        <TrustBadge />
      </motion.div>

      <button
        type="button"
        onClick={() => scrollToSection(SECTION_ID.console)}
        aria-label="Scroll to the console"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-zinc-400 transition-colors hover:text-zinc-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500/50 rounded-full dark:text-zinc-600 dark:hover:text-zinc-300"
      >
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="flex"
        >
          <ArrowDown className="h-5 w-5" />
        </motion.span>
      </button>
    </section>
  )
}
