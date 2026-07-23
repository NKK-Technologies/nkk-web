import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { FaqList } from './FaqList'

const faqs = [
  { question: 'First question?', answer: 'First answer.' },
  { question: 'Second question?', answer: 'Second answer.' },
]

describe('FaqList', () => {
  it('renders a heading and one details element per FAQ', () => {
    const { container } = render(<FaqList faqs={faqs} />)
    expect(
      screen.getByRole('heading', { name: 'Frequently asked questions' }),
    ).toBeInTheDocument()
    expect(container.querySelectorAll('details')).toHaveLength(2)
    expect(screen.getByText('First question?')).toBeInTheDocument()
    expect(screen.getByText('Second answer.')).toBeInTheDocument()
  })
})
