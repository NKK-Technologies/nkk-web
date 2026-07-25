import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PageHero } from './PageHero'

describe('PageHero', () => {
  it('renders kicker, h1 title and intro', () => {
    render(<PageHero kicker="About us" title="Big headline" intro="Some intro." />)
    expect(screen.getByRole('heading', { level: 1, name: 'Big headline' })).toBeInTheDocument()
    expect(screen.getByText('About us')).toBeInTheDocument()
    expect(screen.getByText('Some intro.')).toBeInTheDocument()
  })

  it('omits the intro paragraph when not given', () => {
    const { container } = render(<PageHero kicker="K" title="T" />)
    expect(container.querySelector('p')).toBeNull()
  })
})
