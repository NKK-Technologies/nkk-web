import { vi } from 'vitest'
import '@testing-library/jest-dom/vitest'

/**
 * Minimal IntersectionObserver mock for jsdom (which has no IO implementation).
 * Each constructed instance is pushed onto `globalThis.__io` so tests can grab
 * it and fire the stored callback manually. observe/unobserve/disconnect are
 * vi.fn spies (observe also records the observed element for convenience).
 */
type MockIOEntry = { isIntersecting: boolean; target: Element }

class MockIntersectionObserver {
  callback: (entries: MockIOEntry[], observer: MockIntersectionObserver) => void
  elements: Element[] = []
  observe = vi.fn((el: Element) => {
    this.elements.push(el)
  })
  unobserve = vi.fn()
  disconnect = vi.fn()
  takeRecords = vi.fn(() => [] as MockIOEntry[])
  root: Element | null = null
  rootMargin = ''
  thresholds: number[] = []

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback as unknown as typeof this.callback
    globalThis.__io.push(this)
  }
}

declare global {
  var __io: MockIntersectionObserver[]
}

globalThis.__io = []
globalThis.IntersectionObserver =
  MockIntersectionObserver as unknown as typeof IntersectionObserver
