/**
 * Canonical section ids — the single source of truth for anchor targets.
 * Every nav link, footer link, and `<section id="...">` should import from
 * here instead of typing the string again, so a renamed section can't
 * silently break a link somewhere else in the app.
 */
export const SECTION_ID = {
  hero: 'top',
  console: 'console',
  providers: 'providers',
  howItWorks: 'how-it-works',
  security: 'security',
  faq: 'faq',
} as const

export type SectionId = (typeof SECTION_ID)[keyof typeof SECTION_ID]

/** DOM id of the console's primary input — the thing "jump to console" actions focus. */
export const SMART_INPUT_ID = 'smart-key-input'
