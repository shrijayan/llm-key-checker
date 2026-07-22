'use client'

import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { fadeUp, fadeIn, scaleIn, staggerDelay, DURATION, EASE_OUT } from '@/lib/motion/variants'

const VARIANTS = { fadeUp, fadeIn, scaleIn } as const

interface RevealProps {
  children: ReactNode
  /** Position within a group — multiplies the stagger step into a delay. */
  index?: number
  variant?: keyof typeof VARIANTS
  className?: string
}

/**
 * Fades/slides content into place the first time it scrolls into view.
 * This is the one building block every marketing section on the page uses,
 * so motion stays consistent instead of every section rolling its own.
 */
export function Reveal({ children, index = 0, variant = 'fadeUp', className }: RevealProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-10% 0px -10% 0px' }}
      variants={VARIANTS[variant]}
      transition={{ duration: DURATION.base, ease: EASE_OUT, delay: staggerDelay(index) }}
    >
      {children}
    </motion.div>
  )
}
