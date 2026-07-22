'use client'

import { AuroraBackground } from '@/components/decor/AuroraBackground'
import { MagneticButton } from '@/components/motion/MagneticButton'
import { Reveal } from '@/components/motion/Reveal'
import { ScrollLink } from '@/components/motion/ScrollLink'
import { useJumpToConsole } from '@/components/motion/useJumpToConsole'
import { SECTION_ID } from '@/lib/content/sections'

export function FinalCta() {
  const jumpToConsole = useJumpToConsole()

  return (
    <section className="relative overflow-hidden px-4 py-20 text-center sm:py-28">
      <AuroraBackground className="opacity-60" />

      <Reveal>
        <h2 className="text-balance-pretty mx-auto max-w-lg text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
          Ready when you are.
        </h2>
        <p className="mx-auto mt-3 max-w-sm text-sm text-zinc-500 dark:text-zinc-400">
          One paste. A real answer. Nothing kept.
        </p>

        <MagneticButton className="mt-8">
          <ScrollLink
            sectionId={SECTION_ID.console}
            onActivate={jumpToConsole}
            className="block rounded-xl bg-accent-500 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-accent-500/25 transition-all hover:scale-[1.02] hover:bg-accent-600 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-300"
          >
            Check a key now
          </ScrollLink>
        </MagneticButton>
      </Reveal>
    </section>
  )
}
