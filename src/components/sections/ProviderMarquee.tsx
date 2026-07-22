'use client'

import type { Provider } from '@/lib/providers/types'
import { useProviderSelection } from '@/components/providers/ProviderSelectionContext'
import { useJumpToConsole } from '@/components/motion/useJumpToConsole'
import { Reveal } from '@/components/motion/Reveal'
import { AnimatedCounter } from '@/components/motion/AnimatedCounter'
import { SECTION_ID } from '@/lib/content/sections'

interface ProviderMarqueeProps {
  providers: Provider[]
}

interface MarqueeRowProps {
  providers: Provider[]
  direction: 'left' | 'right'
  onPick: (provider: Provider) => void
}

function MarqueeRow({ providers, direction, onPick }: MarqueeRowProps) {
  // The list is duplicated back-to-back so the CSS translateX(-50%) loop
  // has no visible seam — see animate-marquee-left/-right in globals.css.
  const track = [...providers, ...providers]
  const animationClass = direction === 'left' ? 'animate-marquee-left' : 'animate-marquee-right'

  return (
    <div className="fade-edges-x overflow-hidden">
      <div
        className={`flex w-max gap-3 ${animationClass} hover:[animation-play-state:paused]`}
      >
        {track.map((provider, index) => (
          <button
            key={`${provider.id}-${index}`}
            type="button"
            onClick={() => onPick(provider)}
            className="flex-shrink-0 rounded-full border border-zinc-900/10 bg-white/60 px-4 py-2 text-sm text-zinc-600 backdrop-blur-sm transition-colors hover:border-accent-500/50 hover:text-accent-600 dark:border-white/10 dark:bg-white/[0.03] dark:text-zinc-300 dark:hover:text-accent-300"
          >
            {provider.name}
          </button>
        ))}
      </div>
    </div>
  )
}

/**
 * Two rows of every supported provider, drifting in opposite directions.
 * Each pill is a real shortcut: tapping one selects that provider and jumps
 * straight to its form in the console, so browsing here still ends in zero
 * extra clicks.
 */
export function ProviderMarquee({ providers }: ProviderMarqueeProps) {
  const { selectProvider } = useProviderSelection()
  const jumpToConsole = useJumpToConsole()

  const handlePick = (provider: Provider) => {
    selectProvider(provider, { source: 'manual' })
    jumpToConsole()
  }

  const midpoint = Math.ceil(providers.length / 2)
  const rowA = providers.slice(0, midpoint)
  const rowB = providers.slice(midpoint)

  return (
    <section id={SECTION_ID.providers} className="relative py-14 sm:py-20">
      <Reveal>
        <div className="mb-10 px-4 text-center">
          <p className="mb-2 font-mono text-xs uppercase tracking-widest text-accent-600 dark:text-accent-400">
            Coverage
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
            Works with <AnimatedCounter value={providers.length} suffix="+" /> providers
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-zinc-500 dark:text-zinc-400">
            Tap any provider to jump straight to its form.
          </p>
        </div>
      </Reveal>

      <div className="space-y-3">
        <MarqueeRow providers={rowA} direction="left" onPick={handlePick} />
        <MarqueeRow providers={rowB} direction="right" onPick={handlePick} />
      </div>
    </section>
  )
}
