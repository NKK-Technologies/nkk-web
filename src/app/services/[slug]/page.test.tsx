import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import ServicePage, { generateMetadata, generateStaticParams } from './page'
import { services, getService } from '@/lib/services'
import { SITE_URL } from '@/lib/site'

const params = (slug: string) => ({ params: Promise.resolve({ slug }) })

describe('service page', () => {
  it('generates static params for all four services', () => {
    expect(generateStaticParams()).toEqual(services.map(({ slug }) => ({ slug })))
  })

  it('renders headline, offerings and FAQs for a service', async () => {
    const service = getService('cctv-surveillance')!
    render(await ServicePage(params(service.slug)))
    expect(
      screen.getByRole('heading', { level: 1, name: service.headline }),
    ).toBeInTheDocument()
    for (const offering of service.offerings) {
      expect(screen.getByText(offering.title)).toBeInTheDocument()
    }
    expect(screen.getByText(service.faqs[0].question)).toBeInTheDocument()
  })

  it('embeds Service and FAQPage JSON-LD', async () => {
    const service = getService('access-control')!
    const { container } = render(await ServicePage(params(service.slug)))
    const blocks = Array.from(
      container.querySelectorAll('script[type="application/ld+json"]'),
    ).map((s) => JSON.parse(s.textContent ?? '{}'))
    const serviceLd = blocks.find((b) => b['@type'] === 'Service')
    const faqLd = blocks.find((b) => b['@type'] === 'FAQPage')
    expect(serviceLd?.url).toBe(`${SITE_URL}/services/${service.slug}`)
    expect(serviceLd?.provider['@id']).toBe(`${SITE_URL}/#organization`)
    expect(faqLd?.mainEntity).toHaveLength(service.faqs.length)
    expect(faqLd?.mainEntity[0].name).toBe(service.faqs[0].question)
  })

  it('links to the other three services and the quote form', async () => {
    const service = getService('software-development')!
    render(await ServicePage(params(service.slug)))
    for (const other of services.filter((s) => s.slug !== service.slug)) {
      expect(screen.getByRole('link', { name: `${other.name} →` })).toHaveAttribute(
        'href',
        `/services/${other.slug}`,
      )
    }
  })

  it('produces per-service metadata with canonical', async () => {
    const service = getService('hardware-supply')!
    const metadata = await generateMetadata(params(service.slug))
    expect(metadata.title).toBe(service.metaTitle)
    expect(metadata.description).toBe(service.metaDescription)
    expect(metadata.alternates?.canonical).toBe(`/services/${service.slug}`)
  })
})
