'use client'

import type { MouseEvent, ReactNode } from 'react'
import { useScrollToSection } from './useScrollToSection'

interface ScrollLinkProps {
  /** Section to link to — also becomes the real `href="#id"`. */
  sectionId: string
  /** Overrides the default scroll-only behavior (e.g. jumpToConsole also focuses the input). */
  onActivate?: () => void
  children: ReactNode
  className?: string
  'aria-label'?: string
}

/**
 * A real `<a href="#section">`, not a JS-only button. Every piece of
 * in-page navigation on the site (header nav, footer nav, "Check a key"
 * CTAs) renders through this instead of a plain `<button onClick>` so that:
 *
 * - it works with JavaScript disabled or failed to load (native anchor
 *   jump still fires — see the print/no-scroll robustness note on
 *   `Reveal.tsx`, same principle),
 * - search engine crawlers see real, followable links instead of opaque
 *   click handlers,
 * - it behaves like a link for anyone who wants that (open in new tab,
 *   copy link address, middle-click).
 *
 * `preventDefault` + the Lenis-driven scroll is a progressive *enhancement*
 * layered on top of that real link, not a replacement for it.
 */
export function ScrollLink({
  sectionId,
  onActivate,
  children,
  className,
  'aria-label': ariaLabel,
}: ScrollLinkProps) {
  const scrollToSection = useScrollToSection()
  const activate = onActivate ?? (() => scrollToSection(sectionId))

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    // Let real modified clicks (open in new tab/window, etc.) behave natively.
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    event.preventDefault()
    activate()
  }

  return (
    <a href={`#${sectionId}`} onClick={handleClick} className={className} aria-label={ariaLabel}>
      {children}
    </a>
  )
}
