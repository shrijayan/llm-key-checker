'use client'

import { useEffect, useRef, useState } from 'react'
import { animate, useInView } from 'motion/react'
import { EASE_OUT } from '@/lib/motion/variants'

interface AnimatedCounterProps {
  value: number
  prefix?: string
  suffix?: string
  duration?: number
  className?: string
}

/**
 * Counts up from 0 to `value` once it scrolls into view. Used for the stats
 * band — every number it shows is real (provider count, etc.), the
 * animation just makes the moment you notice it more satisfying.
 *
 * Initial state is `value` itself, not 0: search engine crawlers and
 * anyone browsing with JavaScript disabled only ever see the server-
 * rendered output, and that output must be the real number, not a
 * placeholder "0" waiting to be animated. The count-up-from-zero effect is
 * layered on afterward, client-side only, once the element is actually
 * in view — a progressive enhancement on top of correct content, not a
 * replacement for it.
 */
export function AnimatedCounter({
  value,
  prefix = '',
  suffix = '',
  duration = 1.4,
  className,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: '0px 0px -5% 0px' })
  const [display, setDisplay] = useState(value)

  useEffect(() => {
    if (!isInView) return

    const controls = animate(0, value, {
      duration,
      ease: EASE_OUT,
      onUpdate: (latest) => setDisplay(Math.round(latest)),
    })

    return () => controls.stop()
  }, [isInView, value, duration])

  return (
    <span ref={ref} className={className}>
      {prefix}
      {display}
      {suffix}
    </span>
  )
}
