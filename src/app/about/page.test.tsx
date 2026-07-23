import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import AboutPage, { metadata } from './page'
import { SITE_URL } from '@/lib/site'

describe('about page', () => {
  it('renders the h1 and the three working principles', () => {
    render(<AboutPage />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'A new company, built by people who have done the work before',
    )
    expect(screen.getByText('Scope honestly')).toBeInTheDocument()
    expect(screen.getByText('Deliver in the open')).toBeInTheDocument()
    expect(screen.getByText('Support what we ship')).toBeInTheDocument()
  })

  it('embeds AboutPage JSON-LD pointing at the organization', () => {
    const { container } = render(<AboutPage />)
    const script = container.querySelector('script[type="application/ld+json"]')
    const data = JSON.parse(script?.textContent ?? '{}')
    expect(data['@type']).toBe('AboutPage')
    expect(data.mainEntity['@id']).toBe(`${SITE_URL}/#organization`)
  })

  it('sets title, description and canonical', () => {
    expect(metadata.title).toContain('About')
    expect(metadata.description).toBeTruthy()
    expect(metadata.alternates?.canonical).toBe('/about')
  })
})
