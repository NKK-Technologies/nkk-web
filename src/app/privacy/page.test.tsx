import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import PrivacyPage, { metadata } from './page'
import { CONTACT } from '@/lib/site'

describe('privacy page', () => {
  it('renders the policy sections', () => {
    render(<PrivacyPage />)
    expect(screen.getByRole('heading', { level: 1, name: 'Privacy policy' })).toBeInTheDocument()
    for (const heading of [
      'Who we are',
      'What we collect',
      'How we use it',
      'Analytics',
      'Retention',
      'Your choices',
    ]) {
      expect(screen.getByRole('heading', { name: heading })).toBeInTheDocument()
    }
    expect(document.body.textContent).toContain(CONTACT.email)
  })

  it('sets title and canonical', () => {
    expect(metadata.title).toContain('Privacy')
    expect(metadata.alternates?.canonical).toBe('/privacy')
  })
})
