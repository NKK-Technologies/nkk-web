import { describe, it, expect } from 'vitest'
import { services, getService } from './services'

describe('services content library', () => {
  it('defines exactly the four fixed slugs', () => {
    expect(services.map((s) => s.slug)).toEqual([
      'software-development',
      'access-control',
      'cctv-surveillance',
      'hardware-supply',
    ])
  })

  it('provides complete content for every service', () => {
    for (const service of services) {
      expect(service.name).not.toBe('')
      expect(service.metaTitle).toContain('NKK Tech')
      expect(service.metaDescription.length).toBeGreaterThan(50)
      expect(service.metaDescription.length).toBeLessThanOrEqual(160)
      expect(service.headline).not.toBe('')
      expect(service.intro).not.toBe('')
      expect(service.offerings.length).toBeGreaterThanOrEqual(4)
      expect(service.faqs.length).toBeGreaterThanOrEqual(4)
      for (const faq of service.faqs) {
        expect(faq.question.endsWith('?')).toBe(true)
        expect(faq.answer.length).toBeGreaterThan(40)
      }
    }
  })

  it('looks up services by slug', () => {
    expect(getService('cctv-surveillance')?.name).toBe('CCTV & surveillance')
    expect(getService('nope')).toBeUndefined()
  })
})
