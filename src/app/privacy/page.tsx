import type { Metadata } from 'next'
import { Nav } from '@/components/Nav'
import { Footer } from '@/components/Footer'
import { PageHero } from '@/components/PageHero'
import { CONTACT } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Privacy Policy — NKK Tech',
  description:
    'How NKK Tech Company Limited handles the information you share through this website.',
  alternates: { canonical: '/privacy' },
}

type PolicySection = { heading: string; paragraphs: string[] }

const sections: PolicySection[] = [
  {
    heading: 'Who we are',
    paragraphs: [
      `NKK Tech Company Limited is a technology company based in ${CONTACT.location}. For anything related to this policy, contact ${CONTACT.email}.`,
    ],
  },
  {
    heading: 'What we collect',
    paragraphs: [
      'The only personal information this website collects is what you type into the quote form: your name, company, email address, phone number and message. There are no user accounts and no marketing mailing lists.',
    ],
  },
  {
    heading: 'How we use it',
    paragraphs: [
      'Your enquiry is delivered to our business inbox through an email delivery provider and used solely to respond to you. We do not sell your information or share it with anyone for marketing.',
    ],
  },
  {
    heading: 'Analytics',
    paragraphs: [
      'We use privacy-friendly, aggregate analytics to understand how the site is used (for example, which pages are visited). These measurements are cookieless and are not used to identify or track you across other websites.',
    ],
  },
  {
    heading: 'Retention',
    paragraphs: [
      'Enquiry emails are kept for as long as needed to handle your request and for ordinary business records, then deleted.',
    ],
  },
  {
    heading: 'Your choices',
    paragraphs: [
      `You can ask us at any time to see, correct or delete the information you sent us — email ${CONTACT.email} and we will act on it promptly.`,
    ],
  },
]

export default function PrivacyPage() {
  return (
    <>
      <Nav />
      <PageHero
        kicker="Legal"
        title="Privacy policy"
        intro="Effective 24 July 2026. The short version: the only data this site collects is what you put in the quote form, and we only use it to reply to you."
      />
      <section className="bg-white">
        <div className="max-w-[1140px] mx-auto px-5 md:px-6 py-14 md:py-[88px]">
          <div className="flex flex-col gap-8 md:gap-10 max-w-[720px]">
            {sections.map(({ heading, paragraphs }) => (
              <div key={heading} className="flex flex-col gap-2.5">
                <h2 className="font-display font-bold text-navy text-xl md:text-2xl leading-[1.2]">
                  {heading}
                </h2>
                {paragraphs.map((text) => (
                  <p key={text} className="text-[15px] md:text-base text-ink">
                    {text}
                  </p>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </>
  )
}
