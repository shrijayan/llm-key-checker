import { ALL_PROVIDERS } from '@/lib/providers/registry'
import { Reveal } from '@/components/motion/Reveal'
import { AnimatedCounter } from '@/components/motion/AnimatedCounter'

interface Stat {
  value: number
  suffix?: string
  label: string
}

/** Every number here is real and derivable from the repo — no invented metrics. */
function buildStats(providerCount: number): Stat[] {
  return [
    { value: providerCount, suffix: '+', label: 'LLM providers supported' },
    { value: 0, label: 'API keys stored, ever' },
    { value: 100, suffix: '%', label: 'Open source, MIT licensed' },
    { value: 24, suffix: 'h', label: 'Registry sync interval' },
  ]
}

export function StatsBand() {
  const stats = buildStats(ALL_PROVIDERS.length)

  return (
    <section className="relative border-y border-zinc-900/8 bg-zinc-50/60 py-16 dark:border-white/10 dark:bg-white/[0.02]">
      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 px-4 sm:grid-cols-4">
        {stats.map((stat, index) => (
          <Reveal key={stat.label} index={index} variant="scaleIn">
            <div className="text-center">
              <div className="font-mono text-3xl font-semibold text-zinc-900 sm:text-4xl dark:text-zinc-50">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </div>
              <p className="mt-1.5 text-xs leading-snug text-zinc-500 sm:text-sm dark:text-zinc-400">
                {stat.label}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
