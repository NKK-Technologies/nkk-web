import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Nav } from './Nav'

describe('Nav mobile menu', () => {
  it('keeps the menu closed initially', () => {
    const { container } = render(<Nav />)
    const toggle = screen.getByRole('button', { name: 'Menu' })
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    // Toggle points at the panel it controls
    expect(toggle).toHaveAttribute('aria-controls', 'mobile-menu')
    // Panel stays mounted but is hidden from AT when closed
    const panel = container.querySelector('#mobile-menu')
    expect(panel).toHaveAttribute('aria-hidden', 'true')
    // Hamburger (MenuIcon) shows three lines when closed
    expect(toggle.querySelectorAll('line')).toHaveLength(3)
  })

  it('marks the closed panel inert so its links are not tabbable', () => {
    const { container } = render(<Nav />)
    const panel = container.querySelector('#mobile-menu')
    expect(panel).toHaveAttribute('inert')
  })

  it('opens the menu and swaps to the close icon when toggled', async () => {
    const { container } = render(<Nav />)
    const toggle = screen.getByRole('button', { name: 'Menu' })
    await userEvent.click(toggle)
    expect(toggle).toHaveAttribute('aria-expanded', 'true')
    // Open panel is no longer hidden or inert
    const panel = container.querySelector('#mobile-menu')
    expect(panel).not.toHaveAttribute('aria-hidden', 'true')
    expect(panel).not.toHaveAttribute('inert')
    // Hamburger swaps to the CloseIcon (two lines)
    expect(toggle.querySelectorAll('line')).toHaveLength(2)
  })

  it('closes the menu when a menu link is tapped', async () => {
    const { container } = render(<Nav />)
    const toggle = screen.getByRole('button', { name: 'Menu' })
    await userEvent.click(toggle)
    const panel = container.querySelector('#mobile-menu') as HTMLElement
    const menuLink = within(panel).getByRole('link', { name: 'Services' })
    await userEvent.click(menuLink)
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    // Panel stays mounted, but is hidden + inert again
    expect(panel).toHaveAttribute('aria-hidden', 'true')
    expect(panel).toHaveAttribute('inert')
  })

  it('closes the menu when the CTA is tapped', async () => {
    const { container } = render(<Nav />)
    const toggle = screen.getByRole('button', { name: 'Menu' })
    await userEvent.click(toggle)
    const panel = container.querySelector('#mobile-menu') as HTMLElement
    const cta = within(panel).getByRole('link', { name: 'Request a quote' })
    await userEvent.click(cta)
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
  })
})
