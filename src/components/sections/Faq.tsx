import { Plus } from 'lucide-react'
import { FAQ_ITEMS } from '@/lib/content/faq'
import { SECTION_ID } from '@/lib/content/sections'
import { Reveal } from '@/components/motion/Reveal'

/**
 * Native <details>/<summary> — an accordion that works with zero JavaScript
 * and no ARIA to get right by hand, which matters here more than usual: if
 * scripts fail to load, the questions people have right before pasting a
 * secret into a text box should still be readable.
 */
export function Faq() {
  return (
    <section id={SECTION_ID.faq} className="relative px-4 py-14 sm:py-20">
      <div className="mx-auto max-w-2xl">
        <Reveal>
          <div className="mb-12 text-center">
            <p className="mb-2 font-mono text-xs uppercase tracking-widest text-accent-600 dark:text-accent-400">
              FAQ
            </p>
            <h2 className="text-balance-pretty text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
              Before you paste a secret in here.
            </h2>
          </div>
        </Reveal>

        <div className="divide-y divide-zinc-900/8 dark:divide-white/10">
          {FAQ_ITEMS.map((item, index) => (
            <Reveal key={item.question} index={index}>
              <details className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-base font-medium text-zinc-900 marker:content-none [&::-webkit-details-marker]:hidden dark:text-zinc-50">
                  {item.question}
                  <Plus className="h-4 w-4 flex-shrink-0 text-zinc-400 transition-transform duration-200 group-open:rotate-45" />
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                  {item.answer}
                </p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
