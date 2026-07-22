'use client'

import { useCallback } from 'react'
import { useScrollToSection } from './useScrollToSection'
import { SECTION_ID, SMART_INPUT_ID } from '@/lib/content/sections'

/**
 * Used by every "check a key" call to action across the site (hero, final
 * CTA, command palette, provider marquee): scroll to the console and put
 * the cursor in its input in one motion. `preventScroll` on the focus call
 * is what stops the browser's native focus-scroll from fighting with the
 * Lenis-driven smooth scroll already in flight.
 */
export function useJumpToConsole() {
  const scrollToSection = useScrollToSection()

  return useCallback(() => {
    scrollToSection(SECTION_ID.console)
    document.getElementById(SMART_INPUT_ID)?.focus({ preventScroll: true })
  }, [scrollToSection])
}
