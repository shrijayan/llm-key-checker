import type { MetadataRoute } from 'next'
import { SITE_DESCRIPTION, SITE_NAME, SITE_SHORT_NAME } from '@/lib/seo/config'

/**
 * Generates /manifest.webmanifest. Mostly a "properly finished site"
 * signal (installability, correct theme color on Android's task switcher)
 * rather than a direct ranking factor, but it's a one-time cost to get
 * right and rounds out the technical-SEO checklist.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: SITE_SHORT_NAME,
    description: SITE_DESCRIPTION,
    start_url: '/',
    display: 'standalone',
    background_color: '#08090c',
    theme_color: '#08090c',
    icons: [
      {
        src: '/icon',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
