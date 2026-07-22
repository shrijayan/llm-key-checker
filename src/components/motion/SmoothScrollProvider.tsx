'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { ReactLenis } from 'lenis/react'
import { MotionConfig } from 'motion/react'

interface Props {
  children: ReactNode
}

/**
 * Wraps the whole app in buttery-smooth inertia scrolling (the same
 * technique used by most modern product sites — Lenis eases the native
 * scroll instead of replacing it, so browser features like find-in-page,
 * anchor links, and screen readers keep working normally).
 *
 * Also sets `reducedMotion="user"` once, globally, for every `motion.*`
 * component on the site — so individual sections never have to remember to
 * check `prefers-reduced-motion` themselves.
 *
 * Automatically disables Lenis's smoothing when the user's OS asks for
 * reduced motion (native scrolling still works perfectly).
 */
export function SmoothScrollProvider({ children }: Props) {
  const [smoothScrollEnabled, setSmoothScrollEnabled] = useState(false)

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const applyPreference = () => setSmoothScrollEnabled(!query.matches)

    applyPreference()
    query.addEventListener('change', applyPreference)
    return () => query.removeEventListener('change', applyPreference)
  }, [])

  const content = smoothScrollEnabled ? (
    <ReactLenis
      root
      options={{
        duration: 1.15,
        lerp: 0.11,
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.2,
      }}
    >
      {children}
    </ReactLenis>
  ) : (
    children
  )

  return <MotionConfig reducedMotion="user">{content}</MotionConfig>
}
