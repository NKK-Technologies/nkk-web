import { Nav } from '@/components/Nav'
import { Hero } from '@/components/Hero'
import { Services } from '@/components/Services'
import { WhyUs } from '@/components/WhyUs'
import { Process } from '@/components/Process'
import { QuoteSection } from '@/components/QuoteSection'
import { Footer } from '@/components/Footer'
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION, CONTACT } from '@/lib/site'
import { services } from '@/lib/services'

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  '@id': `${SITE_URL}/#organization`,
  name: SITE_NAME,
  url: SITE_URL,
  email: CONTACT.email,
  telephone: CONTACT.phone,
  description: SITE_DESCRIPTION,
  slogan: 'The Missing Piece in Your Digital Transformation',
  logo: `${SITE_URL}/icon_app.png`,
  image: `${SITE_URL}/og-image.png`,
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Mikocheni',
    addressLocality: 'Dar es Salaam',
    addressCountry: 'TZ',
  },
  areaServed: 'Tanzania',
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'sales',
    telephone: CONTACT.phone,
    email: CONTACT.email,
    availableLanguage: ['English', 'Swahili'],
  },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Services',
    itemListElement: services.map((service) => ({
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Service',
        name: service.name,
        url: `${SITE_URL}/services/${service.slug}`,
      },
    })),
  },
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
