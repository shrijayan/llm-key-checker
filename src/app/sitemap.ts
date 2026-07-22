import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/seo/config'

/**
 * Generates /sitemap.xml. Just the one URL — this is a single page with
 * in-page anchor sections, not separate routes, and sitemaps should list
 * canonical page URLs rather than #fragment variants of the same page.
 * `changeFrequency: 'daily'` matches reality: the provider registry really
 * does sync from LiteLLM once a day (see sync-providers.yml).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
  ]
}
