import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import Page from './page'
import { SITE_URL, SITE_NAME, CONTACT } from '@/lib/site'

describe('Page JSON-LD', () => {
  it('embeds a ProfessionalService block with real contact data', () => {
    const { container } = render(<Page />)
    const script = container.querySelector('script[type="application/ld+json"]')
    expect(script).not.toBeNull()

    const data = JSON.parse(script!.textContent ?? '{}')
    expect(data['@type']).toBe('ProfessionalService')
    expect(data.name).toBe(SITE_NAME)
    expect(data.url).toBe(SITE_URL)
    expect(data.telephone).toBe(CONTACT.phone)
    expect(data.email).toBe(CONTACT.email)
    expect(data.address).toMatchObject({
      '@type': 'PostalAddress',
      streetAddress: 'Mikocheni',
      addressLocality: 'Dar es Salaam',
      addressCountry: 'TZ',
    })
    expect(data.areaServed).toBe('Tanzania')
  })
})
