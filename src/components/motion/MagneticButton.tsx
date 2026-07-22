'use client'

import { useRef, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react'
import { cn } from '@/lib/utils'

const SPRING = { stiffness: 150, damping: 14, mass: 0.2 }
/** Fraction of the cursor's offset from center the element travels — subtle, not gimmicky. */
const PULL_STRENGTH = 0.25

interface MagneticButtonProps {
  children: ReactNode
  className?: string
}

/**
 * Wraps a button so it drifts gently toward the cursor while hovered.
 * A small, tasteful micro-interaction — skipped entirely for touch input
 * and for users who've asked their OS for reduced motion.
 */
export function MagneticButton({ children, className }: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, SPRING)
  const springY = useSpring(y, SPRING)

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || event.pointerType !== 'mouse' || !ref.current) return
    const bounds = ref.current.getBoundingClientRect()
    x.set((event.clientX - (bounds.left + bounds.width / 2)) * PULL_STRENGTH)
    y.set((event.clientY - (bounds.top + bounds.height / 2)) * PULL_STRENGTH)
  }

  const handlePointerLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{ x: springX, y: springY }}
      className={cn('inline-block', className)}
    >
      {children}
    </motion.div>
  )
}
