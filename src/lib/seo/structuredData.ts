import { ALL_PROVIDERS } from '@/lib/providers/registry'
import { FAQ_ITEMS } from '@/lib/content/faq'
import { SECURITY_ITEMS } from '@/lib/content/security'
import { GITHUB_REPO_URL, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from './config'

/**
 * JSON-LD (schema.org) builders. Every field here is derived from content
 * that's already visible on the page (same FAQ copy, same security list,
 * same provider count) — structured data is supposed to describe what's
 * really on the page, not a separate marketing pitch, and Google's own
 * guidelines penalize markup that doesn't match visible content.
 *
 * Deliberately omitted: `aggregateRating` / `review` on the SoftwareApplication
 * entry. There's no real rating data behind this tool, and Google requires
 * one of those two for "Software App" rich results — faking either to
 * unlock a star rating would be exactly the kind of invented claim this
 * project has avoided everywhere else (see devxdocs/agentlog.md). The
 * structured data below is still fully valid without it; it just isn't
 * eligible for that one specific rich-result treatment.
 */

function buildWebSiteNode() {
  return {
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    inLanguage: 'en',
  }
}

function buildOrganizationNode() {
  return {
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    logo: {
      '@type': 'ImageObject',
      url: `${SITE_URL}/icon`,
    },
    sameAs: [GITHUB_REPO_URL],
  }
}

function buildSoftwareApplicationNode() {
  const featureList = [
    `Validates API keys for ${ALL_PROVIDERS.length}+ LLM providers`,
    "Detects a provider automatically from a pasted key's shape",
    ...SECURITY_ITEMS.map((item) => item.title),
  ]

  return {
    '@type': 'SoftwareApplication',
    '@id': `${SITE_URL}/#software`,
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Any (runs in the browser)',
    browserRequirements: 'Requires JavaScript',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    featureList,
  }
}

function buildFaqPageNode() {
  return {
    '@type': 'FAQPage',
    '@id': `${SITE_URL}/#faq`,
    mainEntity: FAQ_ITEMS.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }
}

/** The full graph injected once, site-wide, via <JsonLd /> in the root layout. */
export function buildJsonLdGraph() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      buildWebSiteNode(),
      buildOrganizationNode(),
      buildSoftwareApplicationNode(),
      buildFaqPageNode(),
    ],
  }
}
