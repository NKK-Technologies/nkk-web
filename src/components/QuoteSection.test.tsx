import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QuoteSection } from './QuoteSection'
import { sendQuoteRequest } from '@/app/actions/quote'

vi.mock('@/app/actions/quote', () => ({
  sendQuoteRequest: vi.fn().mockResolvedValue({ ok: true }),
}))

beforeEach(() => {
  vi.mocked(sendQuoteRequest).mockClear()
  vi.mocked(sendQuoteRequest).mockResolvedValue({ ok: true })
})

const ERROR = 'Please add your name, what you need, and an email or phone number.'

describe('QuoteSection form', () => {
  it('shows an error and no success when submitting empty', async () => {
    render(<QuoteSection />)
    await userEvent.click(screen.getByRole('button', { name: 'Send request' }))
    expect(screen.getByText(ERROR)).toBeInTheDocument()
    expect(
      screen.queryByRole('heading', { name: 'Request received' }),
    ).toBeNull()
  })

  it('flips to the success state and removes the form when name + message + phone are valid', async () => {
    render(<QuoteSection />)
    await userEvent.type(screen.getByLabelText('Your name'), 'Ada Lovelace')
    await userEvent.type(
      screen.getByLabelText('What do you need?'),
      'A booking system',
    )
    await userEvent.type(screen.getByLabelText('Phone'), '+255 700 000 000')
    await userEvent.click(screen.getByRole('button', { name: 'Send request' }))

    expect(
      screen.getByRole('heading', { name: 'Request received' }),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: 'Send request' }),
    ).toBeNull()
  })

  it('shows an error when the email is malformed and no phone is given', async () => {
    render(<QuoteSection />)
    await userEvent.type(screen.getByLabelText('Your name'), 'Ada Lovelace')
    await userEvent.type(
      screen.getByLabelText('What do you need?'),
      'A booking system',
    )
    await userEvent.type(screen.getByLabelText('Email'), 'not-an-email')
    await userEvent.click(screen.getByRole('button', { name: 'Send request' }))

    expect(screen.getByText(ERROR)).toBeInTheDocument()
    expect(
      screen.queryByRole('heading', { name: 'Request received' }),
    ).toBeNull()
  })

  it('renders the exact success heading', async () => {
    render(<QuoteSection />)
    await userEvent.type(screen.getByLabelText('Your name'), 'Ada Lovelace')
    await userEvent.type(
      screen.getByLabelText('What do you need?'),
      'A booking system',
    )
    await userEvent.type(screen.getByLabelText('Email'), 'ada@nkktech.co.tz')
    await userEvent.click(screen.getByRole('button', { name: 'Send request' }))

    expect(
      screen.getByRole('heading', { name: 'Request received' }),
    ).toBeInTheDocument()
  })

  it('passes the form values to sendQuoteRequest', async () => {
    render(<QuoteSection />)
    await userEvent.type(screen.getByLabelText('Your name'), 'Ada Lovelace')
    await userEvent.type(screen.getByLabelText('What do you need?'), 'A booking system')
    await userEvent.type(screen.getByLabelText('Phone'), '+255 746 800 951')
    await userEvent.click(screen.getByRole('button', { name: 'Send request' }))

    expect(sendQuoteRequest).toHaveBeenCalledWith({
      name: 'Ada Lovelace',
      company: '',
      email: '',
      phone: '+255 746 800 951',
      message: 'A booking system',
      website: '',
    })
  })

  it('shows a send error and keeps the form when the action fails', async () => {
    vi.mocked(sendQuoteRequest).mockResolvedValue({ ok: false })
    render(<QuoteSection />)
    await userEvent.type(screen.getByLabelText('Your name'), 'Ada Lovelace')
    await userEvent.type(screen.getByLabelText('What do you need?'), 'A booking system')
    await userEvent.type(screen.getByLabelText('Phone'), '+255 746 800 951')
    await userEvent.click(screen.getByRole('button', { name: 'Send request' }))

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Something went wrong sending your request. Please try again, or email us directly.',
    )
    expect(screen.getByRole('button', { name: 'Send request' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Request received' })).toBeNull()
  })

  it('does not call the action when validation fails', async () => {
    render(<QuoteSection />)
    await userEvent.click(screen.getByRole('button', { name: 'Send request' }))
    expect(sendQuoteRequest).not.toHaveBeenCalled()
  })
})
