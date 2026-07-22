import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Services } from './Services'
import { WhyUs } from './WhyUs'
import { Process } from './Process'

describe('Services section', () => {
  it('renders the section with its id', () => {
    const { container } = render(<Services />)
    expect(container.querySelector('#services')).not.toBeNull()
  })

  it('renders all four service titles', () => {
    render(<Services />)
    for (const title of [
      'Software projects',
      'Access control',
      'CCTV & surveillance',
      'Hardware supply & tendering',
    ]) {
      expect(
        screen.getByRole('heading', { name: title }),
      ).toBeInTheDocument()
    }
  })
})

describe('WhyUs section', () => {
  it('renders the section with its id', () => {
    const { container } = render(<WhyUs />)
    expect(container.querySelector('#team')).not.toBeNull()
  })

  it('renders the three why-us card headings', () => {
    render(<WhyUs />)
    for (const title of [
      'Software delivered in production',
      'Security systems in the field',
      'Procurement done properly',
    ]) {
      expect(
        screen.getByRole('heading', { name: title }),
      ).toBeInTheDocument()
    }
  })
})

describe('Process section', () => {
  it('renders the section with its id', () => {
    const { container } = render(<Process />)
    expect(container.querySelector('#process')).not.toBeNull()
  })

  it('renders the three step names', () => {
    render(<Process />)
    for (const title of ['Consult', 'Deliver', 'Support']) {
      expect(
        screen.getByRole('heading', { name: title }),
      ).toBeInTheDocument()
    }
  })
})
