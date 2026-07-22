import { ALL_PROVIDERS } from '@/lib/providers/registry'
import { SECTION_ID } from '@/lib/content/sections'
import { Reveal } from '@/components/motion/Reveal'
import { KeyConsole } from '@/components/providers/KeyConsole'

export function ConsoleSection() {
  return (
    <section id={SECTION_ID.console} className="relative px-4 py-14 sm:py-20">
      <div className="mx-auto max-w-2xl">
        <Reveal>
          <div className="mb-8 text-center">
            <p className="mb-2 font-mono text-xs uppercase tracking-widest text-accent-600 dark:text-accent-400">
              Try it now
            </p>
            <h2 className="text-balance-pretty text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
              Validate in one paste.
            </h2>
          </div>
        </Reveal>

        <Reveal index={1}>
          <KeyConsole providers={ALL_PROVIDERS} />
        </Reveal>
      </div>
    </section>
  )
}
