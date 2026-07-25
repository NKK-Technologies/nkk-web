import { describe, it, expect } from 'vitest'
import sitemap from './sitemap'
import { services } from '@/lib/services'
import { SITE_URL } from '@/lib/site'

describe('sitemap', () => {
  it('lists home, all service pages, about and privacy', () => {
    const urls = sitemap().map((entry) => entry.url)
    expect(urls).toEqual([
      SITE_URL,
      ...services.map((s) => `${SITE_URL}/services/${s.slug}`),
      `${SITE_URL}/about`,
      `${SITE_URL}/privacy`,
    ])
  })

  it('uses a fixed lastModified date, not build time', () => {
    const dates = sitemap().map((e) => e.lastModified)
    for (const date of dates) {
      expect(date).toEqual(new Date('2026-07-24'))
    }
  })
})
