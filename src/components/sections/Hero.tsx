'use client'

import { GitFork } from 'lucide-react'
import { motion } from 'motion/react'
import { ALL_PROVIDERS } from '@/lib/providers/registry'
import { GITHUB_REPO_URL } from '@/lib/content/navigation'
import { SECTION_ID } from '@/lib/content/sections'
import { AuroraBackground } from '@/components/decor/AuroraBackground'
import { MagneticButton } from '@/components/motion/MagneticButton'
import { KeyConsole } from '@/components/providers/KeyConsole'
import { EASE_OUT } from '@/lib/motion/variants'
import { TrustBadge } from '@/components/TrustBadge'

export function Hero() {
  const providerCount = ALL_PROVIDERS.length

  return (
    <section
      id={SECTION_ID.hero}
      className="relative flex flex-col items-center overflow-hidden px-4 pb-16 pt-28 text-center sm:pb-20 sm:pt-32"
    >
      <AuroraBackground />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE_OUT }}
        className="mb-5 inline-flex items-center gap-2 rounded-full border border-zinc-900/10 bg-white/60 px-4 py-1.5 text-xs font-medium text-zinc-600 backdrop-blur-sm dark:border-white/10 dark:bg-white/5 dark:text-zinc-300"
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
        className="text-balance-pretty max-w-3xl text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl dark:text-zinc-50"
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
        className="text-balance-pretty mt-4 max-w-xl text-base leading-relaxed text-zinc-500 sm:text-lg dark:text-zinc-400"
      >
        Paste a key. We detect OpenAI, Anthropic, Gemini, Groq, and {providerCount}+ other
        providers, then call the real API. No accounts. Nothing stored.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.18 }}
        id={SECTION_ID.console}
        className="mt-8 w-full max-w-2xl scroll-mt-28 text-left"
      >
        <KeyConsole providers={ALL_PROVIDERS} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.28 }}
        className="mt-6 flex flex-col items-center gap-4"
      >
        <TrustBadge />
        <MagneticButton>
          <a
            href={GITHUB_REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500/50 dark:text-zinc-400 dark:hover:text-zinc-200"
          >
            <GitFork className="h-4 w-4" />
            View source
          </a>
        </MagneticButton>
      </motion.div>
    </section>
  )
}
