import { SECTION_ID } from './sections'

export interface NavLink {
  label: string
  sectionId: string
}

/** Primary in-page navigation, shown in the header and reused in the footer. */
export const NAV_LINKS: NavLink[] = [
  { label: 'Console', sectionId: SECTION_ID.console },
  { label: 'Providers', sectionId: SECTION_ID.providers },
  { label: 'How it works', sectionId: SECTION_ID.howItWorks },
  { label: 'Security', sectionId: SECTION_ID.security },
  { label: 'FAQ', sectionId: SECTION_ID.faq },
]

export const GITHUB_REPO_URL = 'https://github.com/shrijayan/llm-key-checker'
export const LITELLM_REPO_URL = 'https://github.com/BerriAI/litellm'
