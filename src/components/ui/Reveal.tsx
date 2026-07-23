'use client'

import { useEffect, useRef, useState } from 'react'
import type { ElementType, HTMLAttributes, JSX, ReactNode } from 'react'

/**
 * Reveal-on-scroll logic. Returns a ref to attach to the element and a `visible`
 * flag that flips true the first time the element intersects the viewport. The
 * observer fires once, then unobserves and disconnects. When IntersectionObserver
 * is unavailable, the element is visible immediately so content is never hidden.
 */
function useReveal() {
  const ref = useRef<HTMLElement | null>(null)
  // When IntersectionObserver is unavailable, start visible so content is never
  // hidden. Deriving the initial value here (rather than a setState in the
  // effect) keeps the effect free of synchronous cascading renders.
  const [visible, setVisible] = useState(
    () => typeof IntersectionObserver === 'undefined',
  )

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true)
            observer.unobserve(entry.target)
            observer.disconnect()
            break
          }
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' },
    )
    observer.observe(el)

    return () => observer.disconnect()
  }, [])

  return { ref, visible }
}

type RevealProps = {
  children?: ReactNode
  as?: keyof JSX.IntrinsicElements
  className?: string
  /** Stagger delay in ms; applied as an inline transition-delay. */
  delay?: number
} & Omit<HTMLAttributes<HTMLElement>, 'className' | 'children' | 'style'>

export function Reveal({
  children,
  as,
  className,
  delay = 0,
  ...rest
}: RevealProps) {
  const Tag = (as ?? 'div') as ElementType
  const { ref, visible } = useReveal()

  const classes = ['reveal', visible && 'is-visible', className]
    .filter(Boolean)
    .join(' ')

  return (
    <Tag
      ref={ref}
      className={classes}
      style={{ transitionDelay: delay ? `${delay}ms` : undefined }}
      {...rest}
    >
      {children}
    </Tag>
  )
}
