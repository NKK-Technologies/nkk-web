import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Nav } from '@/components/Nav'
import { Footer } from '@/components/Footer'
import { PageHero } from '@/components/PageHero'
import { FaqList } from '@/components/FaqList'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Reveal } from '@/components/ui/Reveal'
import { Button } from '@/components/ui/Button'
import { services, getService } from '@/lib/services'
import { SITE_URL, SITE_NAME } from '@/lib/site'

type Params = { slug: string }

export function generateStaticParams(): Params[] {
  return services.map(({ slug }) => ({ slug }))
}

export const dynamicParams = false

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>
}): Promise<Metadata> {
  const service = getService((await params).slug)
  if (!service) return {}
  const path = `/services/${service.slug}`
  return {
    title: service.metaTitle,
    description: service.metaDescription,
    alternates: { canonical: path },
    openGraph: {
      type: 'website',
      url: path,
      siteName: 'NKK Tech',
      title: service.metaTitle,
      description: service.metaDescription,
      locale: 'en_US',
      images: [{ url: '/og-image.png', width: 1200, height: 630, alt: service.metaTitle }],
    },
    twitter: {
      card: 'summary_large_image',
      title: service.metaTitle,
      description: service.metaDescription,
      images: ['/og-image.png'],
    },
  }
}

export default async function ServicePage({ params }: { params: Promise<Params> }) {
  const service = getService((await params).slug)
  if (!service) notFound()

  const others = services.filter((s) => s.slug !== service.slug)

  const serviceJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.metaDescription,
    url: `${SITE_URL}/services/${service.slug}`,
    areaServed: 'Tanzania',
    provider: {
      '@type': 'ProfessionalService',
      '@id': `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
    },
  }

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: service.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Nav />
      <PageHero kicker={service.kicker} title={service.headline} intro={service.intro} />

      <section className="bg-white">
        <div className="max-w-[1140px] mx-auto px-5 md:px-6 py-14 md:py-[88px]">
          <Reveal>
            <SectionHeader
              kicker="Scope"
              title="What we deliver"
              className="mb-6 md:mb-10"
            />
          </Reveal>
          <div className="grid gap-3.5 md:gap-5 md:grid-cols-2">
            {service.offerings.map(({ title, body }, i) => (
              <Reveal key={title} delay={i * 80}>
                <article className="h-full bg-white border border-line rounded-2xl shadow-card p-5 md:p-6">
                  <h3 className="font-display font-bold text-navy leading-[1.2] text-lg md:text-xl">
                    {title}
                  </h3>
                  <p className="mt-2 text-[15px] text-muted">{body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <FaqList faqs={service.faqs} />

      <section className="bg-white">
        <div className="max-w-[1140px] mx-auto px-5 md:px-6 py-10 md:py-14 flex flex-col gap-3">
          <span className="font-display italic font-bold uppercase text-[13px] tracking-[.08em] text-brand">
            More from NKK Tech
          </span>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {others.map((other) => (
              <a
                key={other.slug}
                href={`/services/${other.slug}`}
                className="text-[15px] font-medium text-ink no-underline hover:text-brand"
              >
                {other.name} →
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-navy">
        <div className="max-w-[1140px] mx-auto px-5 md:px-6 py-14 md:py-[88px] flex flex-col items-start gap-4 md:gap-5">
          <h2 className="font-display font-bold text-white text-2xl md:text-[28px] leading-[1.2]">
            Tell us what you need
          </h2>
          <p className="max-w-[560px] text-dark-body text-[15px] md:text-base">
            Describe your project and we&rsquo;ll come back within one business day with
            next steps — usually a short call, then a written quote.
          </p>
          <Button href="/#quote" variant="primary" size="lg">
            Request a quote
          </Button>
        </div>
      </section>

      <Footer />
    </>
  )
}
