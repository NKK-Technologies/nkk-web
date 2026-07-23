import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { sendQuoteRequest } from './quote'

const validInput = {
  name: 'Ada Lovelace',
  company: 'Analytical Engines Ltd',
  email: 'ada@example.co.tz',
  phone: '+255 700 111 222',
  message: 'A booking system',
  website: '',
}

function mockFetch(ok = true) {
  const fn = vi.fn().mockResolvedValue({ ok, status: ok ? 200 : 500 })
  vi.stubGlobal('fetch', fn)
  return fn
}

beforeEach(() => {
  vi.stubEnv('MAILTRAP_TOKEN', 'test-token')
  vi.stubEnv('MAILTRAP_SANDBOX_INBOX_ID', '')
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.unstubAllEnvs()
})

describe('sendQuoteRequest', () => {
  it('rejects when name is missing and does not call Mailtrap', async () => {
    const fetch = mockFetch()
    const result = await sendQuoteRequest({ ...validInput, name: '' })
    expect(result).toEqual({ ok: false })
    expect(fetch).not.toHaveBeenCalled()
  })

  it('rejects when message is missing', async () => {
    const fetch = mockFetch()
    const result = await sendQuoteRequest({ ...validInput, message: '  ' })
    expect(result).toEqual({ ok: false })
    expect(fetch).not.toHaveBeenCalled()
  })

  it('rejects when neither email nor phone is given', async () => {
    const fetch = mockFetch()
    const result = await sendQuoteRequest({ ...validInput, email: '', phone: '' })
    expect(result).toEqual({ ok: false })
    expect(fetch).not.toHaveBeenCalled()
  })

  it('rejects a malformed email when no phone is given', async () => {
    const fetch = mockFetch()
    const result = await sendQuoteRequest({
      ...validInput,
      email: 'not-an-email',
      phone: '',
    })
    expect(result).toEqual({ ok: false })
    expect(fetch).not.toHaveBeenCalled()
  })

  it('silently accepts honeypot submissions without sending', async () => {
    const fetch = mockFetch()
    const result = await sendQuoteRequest({ ...validInput, website: 'http://spam.example' })
    expect(result).toEqual({ ok: true })
    expect(fetch).not.toHaveBeenCalled()
  })

  it('sends a correctly shaped Mailtrap payload to production API', async () => {
    const fetch = mockFetch()
    const result = await sendQuoteRequest(validInput)
    expect(result).toEqual({ ok: true })
    expect(fetch).toHaveBeenCalledTimes(1)

    const [url, init] = fetch.mock.calls[0]
    expect(url).toBe('https://send.api.mailtrap.io/api/send')
    expect(init.method).toBe('POST')
    expect(init.headers).toMatchObject({
      Authorization: 'Bearer test-token',
      'Content-Type': 'application/json',
    })
    const body = JSON.parse(init.body)
    expect(body.to).toEqual([{ email: 'info@nkktech.co.tz' }])
    expect(body.from.email).toBe('website@nkktech.co.tz')
    expect(body.reply_to).toEqual({ email: 'ada@example.co.tz' })
    expect(body.subject).toContain('Ada Lovelace')
    expect(body.text).toContain('A booking system')
    expect(body.text).toContain('+255 700 111 222')
    expect(body.text).toContain('Analytical Engines Ltd')
  })

  it('uses the sandbox API when MAILTRAP_SANDBOX_INBOX_ID is set', async () => {
    vi.stubEnv('MAILTRAP_SANDBOX_INBOX_ID', '3752148')
    const fetch = mockFetch()
    await sendQuoteRequest(validInput)
    expect(fetch.mock.calls[0][0]).toBe(
      'https://sandbox.api.mailtrap.io/api/send/3752148',
    )
  })

  it('returns ok: false when Mailtrap responds non-2xx', async () => {
    mockFetch(false)
    const result = await sendQuoteRequest(validInput)
    expect(result).toEqual({ ok: false })
  })

  it('returns ok: false when fetch throws', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network down')))
    const result = await sendQuoteRequest(validInput)
    expect(result).toEqual({ ok: false })
  })

  it('returns ok: false without calling fetch when MAILTRAP_TOKEN is unset', async () => {
    vi.stubEnv('MAILTRAP_TOKEN', '')
    const fetch = mockFetch()
    const result = await sendQuoteRequest(validInput)
    expect(result).toEqual({ ok: false })
    expect(fetch).not.toHaveBeenCalled()
  })
})
