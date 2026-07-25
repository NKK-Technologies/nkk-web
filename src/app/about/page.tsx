import type { Metadata } from 'next'
import { Nav } from '@/components/Nav'
import { Footer } from '@/components/Footer'
import { PageHero } from '@/components/PageHero'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Reveal } from '@/components/ui/Reveal'
import { Button } from '@/components/ui/Button'
import { SITE_URL } from '@/lib/site'

const TITLE = 'About NKK Tech — A New Company, A Seasoned Team'
const DESCRIPTION =
  'NKK Tech Company Limited is a Dar es Salaam technology company: software development, access control, CCTV and hardware supply under one roof.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/about' },
  openGraph: {
    type: 'website',
    url: '/about',
    siteName: 'NKK Tech',
    title: TITLE,
    description: DESCRIPTION,
    locale: 'en_US',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: TITLE }],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: ['/og-image.png'],
  },
}

const aboutJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  url: `${SITE_URL}/about`,
  mainEntity: { '@id': `${SITE_URL}/#organization` },
} as const

const principles = [
  {
    title: 'Scope honestly',
    body: 'We would rather lose a job by quoting accurately than win it by quoting low and renegotiating later. Every engagement starts with a written scope and a fixed price against it.',
  },
  {
    title: 'Deliver in the open',
    body: 'Work is broken into phases you can see and test. You always know what is done, what is next, and what it costs — no long silences, no big reveals.',
  },
  {
    title: 'Support what we ship',
    body: 'Handover is not goodbye. Installations get maintenance visits; software gets fixes and updates under a clear support arrangement.',
  },
]

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutJsonLd) }}
      />
      <Nav />
      <PageHero
        kicker="About us"
        title="A new company, built by people who have done the work before"
        intro="NKK Tech Company Limited is a Dar es Salaam technology company offering software development, access control, CCTV and hardware supply — under one roof."
      />

      <section className="bg-white">
        <div className="max-w-[1140px] mx-auto px-5 md:px-6 py-14 md:py-[88px] flex flex-col gap-10 md:gap-14">
          <Reveal className="flex flex-col gap-3 max-w-[720px]">
            <SectionHeader kicker="Why we exist" title="One accountable partner, not three vendors" />
            <p className="text-[15px] md:text-base text-ink">
              Most organisations in Tanzania end up juggling separate suppliers for
              software, security systems and hardware — three contracts, three
              schedules, and finger-pointing whenever something breaks at the seams.
              NKK Tech was founded to remove those seams: one team that scopes,
              supplies, installs and supports the whole job, and answers for all of it.
            </p>
          </Reveal>

          <Reveal className="flex flex-col gap-3 max-w-[720px]">
            <SectionHeader kicker="Our team" title="Newly registered. Not new to the work." />
            <p className="text-[15px] md:text-base text-ink">
              NKK Tech is a young company — our people are not. Before founding NKK
              Tech, our team spent years delivering software systems, installing and
              servicing security infrastructure, and handling procurement and tender
              supply for organisations across Tanzania.
            </p>
            <p className="text-[15px] md:text-base text-ink">
              We can&rsquo;t always name that past work: much of it was done under other
              banners, and we take confidentiality obligations seriously — yours will
              be treated the same way. We would rather earn new references than borrow
              old ones, which is why every engagement starts small enough to prove
              ourselves on.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-navy">
        <div className="max-w-[1140px] mx-auto px-5 md:px-6 py-14 md:py-[88px]">
          <Reveal>
            <SectionHeader
              dark
              kicker="How we work"
              title="Three rules we don't break"
              className="mb-6 md:mb-11"
            />
          </Reveal>
          <div className="grid gap-3 md:grid-cols-3 md:gap-5">
            {principles.map(({ title, body }, i) => (
              <Reveal key={title} delay={i * 80}>
                <article className="h-full bg-[rgba(230,243,250,.06)] border border-[rgba(230,243,250,.14)] rounded-2xl p-5 md:p-6">
                  <h3 className="font-display font-bold text-white leading-[1.2] text-base md:text-[17px]">
                    {title}
                  </h3>
                  <p className="mt-2 text-dark-body text-sm md:text-[15px]">{body}</p>
                </article>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-8 md:mt-11">
            <Button href="/#quote" variant="primary" size="lg">
              Start a conversation
            </Button>
          </Reveal>
        </div>
      </section>

      <Footer />
    </>
  )
}
