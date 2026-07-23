'use server'

import { CONTACT } from '@/lib/site'

export type QuoteRequestInput = {
  name: string
  company: string
  email: string
  phone: string
  message: string
  /** Honeypot — humans never fill this. */
  website: string
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export async function sendQuoteRequest(
  input: QuoteRequestInput,
): Promise<{ ok: boolean }> {
  const name = input.name.trim()
  const company = input.company.trim()
  const email = input.email.trim()
  const phone = input.phone.trim()
  const message = input.message.trim()

  // Honeypot: pretend success, send nothing.
  if (input.website.trim() !== '') return { ok: true }

  const hasContact = email !== '' || phone !== ''
  const emailOk = email === '' || isValidEmail(email)
  if (!name || !message || !hasContact || !emailOk) return { ok: false }

  const token = process.env.MAILTRAP_TOKEN
  if (!token) {
    console.error('sendQuoteRequest: MAILTRAP_TOKEN is not set')
    return { ok: false }
  }

  const sandboxInboxId = process.env.MAILTRAP_SANDBOX_INBOX_ID
  const endpoint = sandboxInboxId
    ? `https://sandbox.api.mailtrap.io/api/send/${sandboxInboxId}`
    : 'https://send.api.mailtrap.io/api/send'

  const headerLines = [
    `Name: ${name}`,
    company && `Company: ${company}`,
    email && `Email: ${email}`,
    phone && `Phone: ${phone}`,
  ].filter(Boolean)
  const lines = [...headerLines, '', message]

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: { email: 'website@nkktech.co.tz', name: 'NKK Tech Website' },
        to: [{ email: CONTACT.email }],
        ...(email ? { reply_to: { email } } : {}),
        subject: `Quote request — ${name}`,
        text: lines.join('\n'),
        category: 'quote-request',
      }),
    })
    if (!res.ok) {
      console.error(`sendQuoteRequest: Mailtrap responded ${res.status}`)
      return { ok: false }
    }
    return { ok: true }
  } catch (error) {
    console.error('sendQuoteRequest: request failed', error)
    return { ok: false }
  }
}
