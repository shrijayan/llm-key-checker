'use client'

import { useCallback } from 'react'
import { useLenis } from 'lenis/react'

/** Height of the sticky header, so anchored sections land below it instead of underneath it. */
const HEADER_OFFSET_PX = 76

/**
 * Returns a function that smooth-scrolls to a section by id.
 * Prefers the shared Lenis instance (buttery inertia scroll); falls back to
 * native smooth scrolling if Lenis is disabled (e.g. reduced-motion users).
 */
export function useScrollToSection() {
  const lenis = useLenis()

  return useCallback(
    (sectionId: string) => {
      const target = document.getElementById(sectionId)
      if (!target) return

      if (lenis) {
        lenis.scrollTo(target, { offset: -HEADER_OFFSET_PX, duration: 1.3 })
        return
      }

      const top = target.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET_PX
      window.scrollTo({ top, behavior: 'smooth' })
    },
    [lenis]
  )
}
