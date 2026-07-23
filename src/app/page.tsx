import { Nav } from '@/components/Nav'
import { Hero } from '@/components/Hero'
import { Services } from '@/components/Services'
import { WhyUs } from '@/components/WhyUs'
import { Process } from '@/components/Process'
import { QuoteSection } from '@/components/QuoteSection'
import { Footer } from '@/components/Footer'
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION, CONTACT } from '@/lib/site'

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: SITE_NAME,
  url: SITE_URL,
  email: CONTACT.email,
  telephone: CONTACT.phone,
  description: SITE_DESCRIPTION,
  image: `${SITE_URL}/icon_app.png`,
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Mikocheni',
    addressLocality: 'Dar es Salaam',
    addressCountry: 'TZ',
  },
  areaServed: 'Tanzania',
} as const

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Nav />
      <Hero />
      <Services />
      <WhyUs />
      <Process />
      <QuoteSection />
      <Footer />
    </>
  )
}
