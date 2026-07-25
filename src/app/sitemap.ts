import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site'
import { services } from '@/lib/services'

// Bump when page content meaningfully changes — a build-time `new Date()`
// would claim every page changed on every deploy.
const LAST_MODIFIED = new Date('2026-07-24')

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, lastModified: LAST_MODIFIED, changeFrequency: 'monthly', priority: 1 },
    ...services.map((service) => ({
      url: `${SITE_URL}/services/${service.slug}`,
      lastModified: LAST_MODIFIED,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    { url: `${SITE_URL}/about`, lastModified: LAST_MODIFIED, changeFrequency: 'yearly', priority: 0.6 },
    { url: `${SITE_URL}/privacy`, lastModified: LAST_MODIFIED, changeFrequency: 'yearly', priority: 0.2 },
  ]
}
