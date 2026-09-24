'use client'

import { useCallback } from 'react'
import { useScrollToSection } from './useScrollToSection'
import { SECTION_ID, SMART_INPUT_ID } from '@/lib/content/sections'

/**
 * Used by every "check a key" call to action across the site: scroll to the
 * checker and put the cursor in its paste field (or the active key field).
 */
export function useJumpToConsole() {
  const scrollToSection = useScrollToSection()

  return useCallback(() => {
    scrollToSection(SECTION_ID.console)
    const preferred = document.getElementById(SMART_INPUT_ID)
    const fallback = document.querySelector<HTMLElement>(
      '#console input, #console textarea'
    )
    ;(preferred ?? fallback)?.focus({ preventScroll: true })
  }, [scrollToSection])
}
