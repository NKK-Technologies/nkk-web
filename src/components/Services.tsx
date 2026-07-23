import type { ComponentType } from 'react'
import { SectionHeader } from './ui/SectionHeader'
import { Reveal } from './ui/Reveal'
import { CodeIcon, LockIcon, CctvIcon, PackageIcon } from './ui/icons'

type Service = {
  icon: ComponentType<{ size?: number }>
  title: string
  body: string
}

const services: Service[] = [
  {
    icon: CodeIcon,
    title: 'Software projects',
    body: 'Web systems, mobile apps and integrations — scoped, built and maintained by our own engineers.',
  },
  {
    icon: LockIcon,
    title: 'Access control',
    body: 'Biometric and card entry systems for offices and secure facilities — designed, installed and commissioned.',
  },
  {
    icon: CctvIcon,
    title: 'CCTV & surveillance',
    body: 'IP camera networks with remote monitoring and storage — and maintenance that keeps working after handover.',
  },
  {
    icon: PackageIcon,
    title: 'Hardware supply & tendering',
    body: 'Specification-compliant supply of IT and security hardware for corporate and government tenders.',
  },
]

export function Services() {
  return (
    <section id="services" className="bg-white">
      <div className="max-w-[1140px] mx-auto px-5 md:px-6 py-14 md:py-[88px]">
        <Reveal>
          <SectionHeader
            kicker="What we do"
            title="Four services. One accountable partner."
            sub="Scope, supply, installation and support handled by the same team — no finger-pointing between vendors."
            className="mb-6 md:mb-10"
          />
        </Reveal>
        <div className="grid gap-3.5 md:gap-5 md:grid-cols-2 lg:grid-cols-4">
          {services.map(({ icon: Icon, title, body }, i) => (
            <Reveal key={title} delay={i * 80}>
              <article className="group h-full flex items-start gap-4 md:flex-col md:gap-3.5 bg-white border border-line rounded-2xl shadow-card p-5 md:p-6 transition-[transform,box-shadow] duration-200 ease-[var(--ease-standard)] hover:-translate-y-1 hover:shadow-[0_4px_8px_rgba(10,25,47,.1),0_12px_32px_rgba(10,25,47,.14)]">
                <span className="shrink-0 flex items-center justify-center w-11 h-11 rounded-xl bg-ice transition-[transform,background-color] duration-200 group-hover:scale-[1.08] group-hover:bg-[#D2E9F7]">
                  <Icon />
                </span>
                <div className="flex flex-col gap-1.5 md:gap-3.5">
                  <h3 className="font-display font-bold text-navy leading-[1.2] text-lg md:text-xl">
                    {title}
                  </h3>
                  <p className="text-[15px] text-muted">{body}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
