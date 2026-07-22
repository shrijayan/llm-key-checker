import type { Transition, Variants } from 'motion/react'

/**
 * Single source of truth for motion timing across the site.
 * Every scroll-reveal, hover, and counter animation pulls from here so the
 * whole page feels like it belongs to one system instead of a pile of
 * one-off tweaks.
 */

/** A gentle "decelerate into place" curve — used for anything entering the screen. */
export const EASE_OUT: Transition['ease'] = [0.16, 1, 0.3, 1]

/** A snappier curve for hover/press feedback on interactive elements. */
export const EASE_SNAPPY: Transition['ease'] = [0.34, 1.56, 0.64, 1]

export const DURATION = {
  fast: 0.25,
  base: 0.6,
  slow: 0.9,
} as const

/** Stagger step (seconds) between siblings in a revealed group. */
export const STAGGER_STEP = 0.08

/*
 * Variants intentionally omit their own `transition` — Reveal.tsx supplies a
 * single shared transition (built from the constants above) so every reveal
 * on the site animates with the exact same feel, and a per-item stagger
 * delay can be layered on without fighting variant-level overrides.
 */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
}

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
}

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: { opacity: 1, scale: 1 },
}

/** Builds a per-index transition delay so a list reveals in a staggered wave. */
export function staggerDelay(index: number, step: number = STAGGER_STEP): number {
  return index * step
}
