'use client'

import { useId, useState } from 'react'
import type { ReactNode } from 'react'
import { CONTACT } from '@/lib/site'
import { SectionHeader } from './ui/SectionHeader'
import { Reveal } from './ui/Reveal'
import { Button } from './ui/Button'
import { CheckIcon, MailIcon, MapPinIcon, PhoneIcon } from './ui/icons'

const ERROR_MESSAGE =
  'Please add your name, what you need, and an email or phone number.'

const inputClasses =
  'w-full rounded-md border border-line-strong bg-white px-3 py-2.5 text-[15px] text-ink placeholder:text-muted transition hover:border-brand focus:border-brand focus:outline-none focus:shadow-[0_0_0_3px_rgba(0,136,204,.35)]'

type FieldProps = {
  label: string
  children: (id: string) => ReactNode
}

function Field({ label, children }: FieldProps) {
  const id = useId()
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[13px] font-medium text-navy">
        {label}
      </label>
      {children(id)}
    </div>
  )
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function QuoteSection() {
  const [sent, setSent] = useState(false)
  const [error, setError] = useState(false)
  const [errorCount, setErrorCount] = useState(0)

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const name = String(data.get('name') ?? '').trim()
    const email = String(data.get('email') ?? '').trim()
    const phone = String(data.get('phone') ?? '').trim()
    const message = String(data.get('message') ?? '').trim()

    const hasContact = email !== '' || phone !== ''
    const emailOk = email === '' || isValidEmail(email)

    if (!name || !message || !hasContact || !emailOk) {
      setError(true)
      setErrorCount((count) => count + 1)
      return
    }

    setError(false)
    setSent(true)
  }

  return (
    <section id="quote" className="bg-white">
      <div className="max-w-[1140px] mx-auto px-5 md:px-6 py-14 md:py-[88px] flex flex-col gap-6 md:grid md:grid-cols-[1fr_1.1fr] md:gap-14 md:items-start">
        <Reveal>
          <SectionHeader
            kicker="Get in touch"
            title="Tell us about your project"
            sub="Describe what you need and we'll come back within one business day with next steps — usually a short call, then a written quote."
          />
          <div className="hidden md:flex flex-col gap-3 mt-2 text-[15px] text-ink">
            <div className="flex items-center gap-2.5">
              <PhoneIcon size={18} />
              <span>{CONTACT.phoneDisplay}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <MailIcon size={18} />
              <span>{CONTACT.email}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <MapPinIcon size={18} />
              <span>{CONTACT.location}</span>
            </div>
          </div>
        </Reveal>

        <Reveal delay={120} className="bg-ice rounded-2xl p-5 md:p-8">
          {sent ? (
            <div role="status" className="flex flex-col items-start gap-2.5 py-4 px-1 md:py-6 md:px-2">
              <span className="anim-pop motion-safe-anim flex h-11 w-11 items-center justify-center rounded-full bg-brand">
                <CheckIcon size={22} />
              </span>
              <h3 className="font-display font-bold text-navy leading-[1.2] text-lg md:text-xl">
                Request received
              </h3>
              <p className="text-[15px] text-muted">
                Thank you — we'll reply within one business day.
              </p>
            </div>
          ) : (
            <form
              noValidate
              onSubmit={handleSubmit}
              className="flex flex-col gap-3.5 md:gap-4"
            >
              <div className="flex flex-col gap-3.5 md:grid md:grid-cols-2 md:gap-4">
                <Field label="Your name">
                  {(id) => (
                    <input
                      id={id}
                      name="name"
                      autoComplete="name"
                      placeholder="Full name"
                      className={inputClasses}
                    />
                  )}
                </Field>
                <Field label="Company / organisation">
                  {(id) => (
                    <input
                      id={id}
                      name="company"
                      autoComplete="organization"
                      placeholder="Company name"
                      className={inputClasses}
                    />
                  )}
                </Field>
              </div>
              <div className="flex flex-col gap-3.5 md:grid md:grid-cols-2 md:gap-4">
                <Field label="Email">
                  {(id) => (
                    <input
                      id={id}
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@company.co.tz"
                      className={inputClasses}
                    />
                  )}
                </Field>
                <Field label="Phone">
                  {(id) => (
                    <input
                      id={id}
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      placeholder="+255 …"
                      className={inputClasses}
                    />
                  )}
                </Field>
              </div>
              <Field label="What do you need?">
                {(id) => (
                  <textarea
                    id={id}
                    name="message"
                    placeholder="e.g. CCTV for a 3-floor office, or a custom booking system…"
                    className={`${inputClasses} min-h-24 resize-y`}
                  />
                )}
              </Field>
              {error && (
                <p
                  key={errorCount}
                  role="alert"
                  className="anim-shake motion-safe-anim text-[13px] text-[#D64545]"
                >
                  {ERROR_MESSAGE}
                </p>
              )}
              <Button type="submit" variant="primary" size="lg" fullWidth>
                Send request
              </Button>
            </form>
          )}
        </Reveal>

        <div className="flex flex-col gap-2.5 text-[15px] md:hidden">
          <a
            href={CONTACT.phoneHref}
            className="flex items-center gap-2.5 min-h-11 text-ink no-underline"
          >
            <PhoneIcon size={18} />
            <span>{CONTACT.phoneDisplay}</span>
          </a>
          <a
            href={`mailto:${CONTACT.email}`}
            className="flex items-center gap-2.5 min-h-11 text-ink no-underline"
          >
            <MailIcon size={18} />
            <span>{CONTACT.email}</span>
          </a>
          <span className="flex items-center gap-2.5 min-h-11 text-ink">
            <MapPinIcon size={18} />
            <span>{CONTACT.location}</span>
          </span>
        </div>
      </div>
    </section>
  )
}
