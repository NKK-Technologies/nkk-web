import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import Page from './page'

describe('Page JSON-LD', () => {
  it('embeds a ProfessionalService block with real contact data', () => {
    const { container } = render(<Page />)
    const script = container.querySelector('script[type="application/ld+json"]')
    expect(script).not.toBeNull()

    const data = JSON.parse(script!.textContent ?? '{}')
    expect(data['@type']).toBe('ProfessionalService')
    expect(data.name).toBe('NKK Tech Company Limited')
    expect(data.url).toBe('https://nkktech.co.tz')
    expect(data.telephone).toBe('+255746800951')
    expect(data.email).toBe('info@nkktech.co.tz')
    expect(data.address).toMatchObject({
      '@type': 'PostalAddress',
      streetAddress: 'Mikocheni',
      addressLocality: 'Dar es Salaam',
      addressCountry: 'TZ',
    })
    expect(data.areaServed).toBe('Tanzania')
  })
})
