import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { render, screen, act, cleanup } from '@testing-library/react'
import { renderToString } from 'react-dom/server'
import { Reveal } from './Reveal'

beforeEach(() => {
  globalThis.__io = []
})

afterEach(() => {
  cleanup()
})

/** Fire the most recently created observer's callback for its observed element. */
function fireIntersection(isIntersecting: boolean) {
  const io = globalThis.__io.at(-1)
  if (!io) throw new Error('no IntersectionObserver was constructed')
  const target = io.elements.at(-1) as Element
  act(() => {
    io.callback([{ isIntersecting, target }], io)
  })
}

describe('Reveal', () => {
  it('renders its children', () => {
    render(<Reveal>Hello</Reveal>)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })

  it('starts with the reveal class but not is-visible', () => {
    render(<Reveal>content</Reveal>)
    const el = screen.getByText('content')
    expect(el).toHaveClass('reveal')
    expect(el).not.toHaveClass('is-visible')
  })

  it('adds is-visible and unobserves when the element intersects', () => {
    render(<Reveal>reveal me</Reveal>)
    const el = screen.getByText('reveal me')
    expect(el).not.toHaveClass('is-visible')

    fireIntersection(true)

    expect(el).toHaveClass('is-visible')
    const io = globalThis.__io.at(-1)!
    expect(io.unobserve).toHaveBeenCalledTimes(1)
  })

  it('does not add is-visible when the element is not intersecting', () => {
    render(<Reveal>still hidden</Reveal>)
    const el = screen.getByText('still hidden')

    fireIntersection(false)

    expect(el).not.toHaveClass('is-visible')
    const io = globalThis.__io.at(-1)!
    expect(io.unobserve).not.toHaveBeenCalled()
  })

  it('merges a custom className alongside reveal', () => {
    render(<Reveal className="mt-6 grid">boxed</Reveal>)
    const el = screen.getByText('boxed')
    expect(el).toHaveClass('reveal')
    expect(el).toHaveClass('mt-6')
    expect(el).toHaveClass('grid')
  })

  it('sets transition-delay from the delay prop', () => {
    render(<Reveal delay={80}>delayed</Reveal>)
    const el = screen.getByText('delayed')
    expect(el.style.transitionDelay).toBe('80ms')
  })

  it('omits transition-delay when delay is 0 or unset', () => {
    render(<Reveal>no delay</Reveal>)
    const el = screen.getByText('no delay')
    expect(el.style.transitionDelay).toBe('')
  })

  it('renders the tag given by the as prop', () => {
    render(
      <Reveal as="section" aria-label="feature">
        section content
      </Reveal>,
    )
    const el = screen.getByLabelText('feature')
    expect(el.tagName).toBe('SECTION')
  })

  it('defaults to a div', () => {
    render(<Reveal>plain</Reveal>)
    expect(screen.getByText('plain').tagName).toBe('DIV')
  })

  it('forwards arbitrary rest props to the element', () => {
    render(<Reveal data-testid="rev">payload</Reveal>)
    expect(screen.getByTestId('rev')).toHaveTextContent('payload')
  })

  it('is visible immediately when IntersectionObserver is unavailable', () => {
    const original = globalThis.IntersectionObserver
    // @ts-expect-error deliberately removing the global for this scenario
    delete globalThis.IntersectionObserver
    try {
      render(<Reveal>no observer</Reveal>)
      expect(screen.getByText('no observer')).toHaveClass('is-visible')
    } finally {
      globalThis.IntersectionObserver = original
    }
  })
})

describe('Reveal SSR', () => {
  it('server markup is plain reveal — visible content, no is-visible, no hidden state', () => {
    const original = globalThis.IntersectionObserver
    // @ts-expect-error simulating a server environment without IntersectionObserver
    delete globalThis.IntersectionObserver
    try {
      const html = renderToString(<Reveal>ssr content</Reveal>)
      expect(html).toContain('ssr content')
      expect(html).toContain('class="reveal"')
      expect(html).not.toContain('is-visible')
    } finally {
      globalThis.IntersectionObserver = original
    }
  })
})
