import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { WhatsAppButton } from './WhatsAppButton'

describe('WhatsAppButton', () => {
  it('links to the company WhatsApp with a prefilled message', () => {
    render(<WhatsAppButton />)
    const link = screen.getByRole('link', { name: 'Chat with NKK Tech on WhatsApp' })
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    const href = link.getAttribute('href')!
    expect(href.startsWith('https://wa.me/255746800951?text=')).toBe(true)
    expect(decodeURIComponent(href)).toContain('Hello NKK Tech')
  })
})
