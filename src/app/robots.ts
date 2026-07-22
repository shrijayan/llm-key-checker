import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/seo/config'

/**
 * Generates /robots.txt. Only the API route is excluded — it's a POST-only
 * JSON endpoint with no useful HTML for a crawler anyway, but disallowing
 * it explicitly (on top of the X-Robots-Tag header set in next.config.ts)
 * is cheap defense in depth against it ever showing up in results.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
