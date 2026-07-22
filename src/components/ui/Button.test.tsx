import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from './Button'

describe('Button', () => {
  it('renders a <button> by default', () => {
    render(<Button>Click me</Button>)
    const el = screen.getByRole('button', { name: 'Click me' })
    expect(el.tagName).toBe('BUTTON')
  })

  it('renders an <a href> when href is given', () => {
    render(<Button href="#quote">Request a quote</Button>)
    const el = screen.getByRole('link', { name: 'Request a quote' })
    expect(el.tagName).toBe('A')
    expect(el).toHaveAttribute('href', '#quote')
  })

  it('applies primary classes by default', () => {
    render(<Button>Primary</Button>)
    const el = screen.getByRole('button', { name: 'Primary' })
    expect(el).toHaveClass('bg-brand')
    expect(el).toHaveClass('text-white')
  })

  it('applies outline classes for the outline variant', () => {
    render(<Button variant="outline">Outline</Button>)
    const el = screen.getByRole('button', { name: 'Outline' })
    expect(el).toHaveClass('text-brand')
    expect(el).not.toHaveClass('bg-brand')
  })

  it('adds w-full when fullWidth is set', () => {
    render(<Button fullWidth>Wide</Button>)
    const el = screen.getByRole('button', { name: 'Wide' })
    expect(el).toHaveClass('w-full')
  })

  it('does not add w-full by default', () => {
    render(<Button>Normal</Button>)
    const el = screen.getByRole('button', { name: 'Normal' })
    expect(el).not.toHaveClass('w-full')
  })

  it('forwards onClick', async () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Press</Button>)
    await userEvent.click(screen.getByRole('button', { name: 'Press' }))
    expect(onClick).toHaveBeenCalledTimes(1)
  })
})
