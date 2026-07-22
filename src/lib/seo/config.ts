import { ALL_PROVIDERS } from '@/lib/providers/registry'
import { GITHUB_REPO_URL } from '@/lib/content/navigation'

/**
 * Single source of truth for every SEO-facing fact about the site: the
 * canonical URL, name, and description used in metadata, JSON-LD,
 * robots.txt, sitemap.xml, and the generated share images. Change it once
 * here instead of hunting down every place a title or URL got typed again.
 *
 * `NEXT_PUBLIC_SITE_URL` is the one thing that genuinely differs per
 * deployment (a fork running on someone else's domain, a preview URL,
 * production) — everything reads it from here rather than each file
 * reaching for `process.env` (and getting a different fallback) on its own.
 */

const providerCount = ALL_PROVIDERS.length

function resolveSiteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  if (configured) return configured.replace(/\/$/, '')
  // Fails safe to a real, working placeholder rather than an invented
  // domain — set NEXT_PUBLIC_SITE_URL once this is deployed somewhere real.
  return 'https://llm-key-checker.vercel.app'
}

export const SITE_URL = resolveSiteUrl()
export const SITE_NAME = 'LLM Key Checker'
export const SITE_SHORT_NAME = 'key-checker'
export const SITE_TAGLINE = 'Does your API key actually work?'

export const SITE_DESCRIPTION = `Paste any LLM API key and get a real answer in seconds. Supports ${providerCount}+ providers including OpenAI, Anthropic, Gemini, Groq and AWS Bedrock. Open source. Zero storage, ever.`

export const SITE_KEYWORDS = [
  'LLM API key checker',
  'API key validator',
  'OpenAI API key test',
  'Anthropic API key test',
  'Gemini API key test',
  'Groq API key',
  'AWS Bedrock API key',
  'validate API key online',
  'check API key valid',
  'LLM provider status',
]

export { GITHUB_REPO_URL, providerCount }
