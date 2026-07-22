import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Nav } from './Nav'

describe('Nav mobile menu', () => {
  it('keeps the menu closed initially', () => {
    render(<Nav />)
    const toggle = screen.getByRole('button', { name: 'Menu' })
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    // Only the always-rendered desktop link exists; the mobile menu is not open
    expect(screen.getAllByRole('link', { name: 'Services' })).toHaveLength(1)
    // Hamburger (MenuIcon) shows three lines when closed
    expect(toggle.querySelectorAll('line')).toHaveLength(3)
  })

  it('opens the menu and swaps to the close icon when toggled', async () => {
    render(<Nav />)
    const toggle = screen.getByRole('button', { name: 'Menu' })
    await userEvent.click(toggle)
    expect(toggle).toHaveAttribute('aria-expanded', 'true')
    // Desktop link + mobile menu link are both present now
    expect(screen.getAllByRole('link', { name: 'Services' })).toHaveLength(2)
    // Hamburger swaps to the CloseIcon (two lines)
    expect(toggle.querySelectorAll('line')).toHaveLength(2)
  })

  it('closes the menu when a menu link is tapped', async () => {
    render(<Nav />)
    const toggle = screen.getByRole('button', { name: 'Menu' })
    await userEvent.click(toggle)
    const links = screen.getAllByRole('link', { name: 'Services' })
    // The mobile menu link is the second one
    await userEvent.click(links[1])
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(screen.getAllByRole('link', { name: 'Services' })).toHaveLength(1)
  })

  it('closes the menu when the CTA is tapped', async () => {
    render(<Nav />)
    const toggle = screen.getByRole('button', { name: 'Menu' })
    await userEvent.click(toggle)
    // Desktop CTA + mobile menu CTA both present
    const ctas = screen.getAllByRole('link', { name: 'Request a quote' })
    await userEvent.click(ctas[ctas.length - 1])
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
  })
})
