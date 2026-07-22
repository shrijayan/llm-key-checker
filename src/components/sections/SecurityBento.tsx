import { SECURITY_ITEMS } from '@/lib/content/security'
import { SECTION_ID } from '@/lib/content/sections'
import { Reveal } from '@/components/motion/Reveal'

export function SecurityBento() {
  return (
    <section id={SECTION_ID.security} className="relative px-4 py-14 sm:py-20">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <div className="mb-14 text-center">
            <p className="mb-2 font-mono text-xs uppercase tracking-widest text-accent-600 dark:text-accent-400">
              Security
            </p>
            <h2 className="text-balance-pretty text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
              Built to be trusted with a secret.
            </h2>
          </div>
        </Reveal>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SECURITY_ITEMS.map((item, index) => (
            <Reveal key={item.title} index={index}>
              <div className="glass-panel group h-full rounded-2xl p-6 transition-colors hover:border-accent-500/30">
                <item.icon className="h-5 w-5 text-accent-600 dark:text-accent-400" />
                <h3 className="mt-4 text-base font-semibold text-zinc-900 dark:text-zinc-50">
                  {item.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
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
