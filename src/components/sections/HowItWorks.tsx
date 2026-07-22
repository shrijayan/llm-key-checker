import { HOW_IT_WORKS_STEPS } from '@/lib/content/howItWorks'
import { SECTION_ID } from '@/lib/content/sections'
import { Reveal } from '@/components/motion/Reveal'

export function HowItWorks() {
  return (
    <section id={SECTION_ID.howItWorks} className="relative px-4 py-14 sm:py-20">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <div className="mb-14 text-center">
            <p className="mb-2 font-mono text-xs uppercase tracking-widest text-accent-600 dark:text-accent-400">
              How it works
            </p>
            <h2 className="text-balance-pretty text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
              Three steps. No accounts.
            </h2>
          </div>
        </Reveal>

        <div className="relative grid gap-8 sm:grid-cols-3">
          {/* Connecting line, desktop only — purely decorative. */}
          <div
            aria-hidden="true"
            className="absolute top-6 left-0 right-0 hidden h-px bg-gradient-to-r from-transparent via-zinc-900/10 to-transparent sm:block dark:via-white/10"
          />

          {HOW_IT_WORKS_STEPS.map((item, index) => (
            <Reveal key={item.step} index={index} variant="fadeUp">
              <div className="relative flex flex-col items-center text-center sm:items-start sm:text-left">
                <span className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full border border-accent-500/30 bg-white font-mono text-sm font-semibold text-accent-600 dark:border-accent-400/30 dark:bg-zinc-950 dark:text-accent-300">
                  {item.step}
                </span>
                <h3 className="mt-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                  {item.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
