import logoDarkBg from '../assets/logo_dark_bg.png'
import { Reveal } from './ui/Reveal'

const headingClasses =
  'font-display font-bold italic uppercase text-[13px] tracking-[.08em] text-sky-mist'
const linkClasses =
  'text-sm text-dark-body no-underline hover:text-white min-h-8 md:min-h-0 flex items-center'

type Link = {
  label: string
  href: string
}

const services: Link[] = [
  { label: 'Software projects', href: '#services' },
  { label: 'Access control', href: '#services' },
  { label: 'CCTV & surveillance', href: '#services' },
  { label: 'Hardware supply & tendering', href: '#services' },
]

const company: Link[] = [
  { label: 'Why us', href: '#team' },
  { label: 'How we work', href: '#process' },
  { label: 'Request a quote', href: '#quote' },
]

export function Footer() {
  return (
    <footer className="bg-navy">
      <div className="max-w-[1140px] mx-auto px-5 md:px-6 pt-10 md:pt-14 pb-7 md:pb-10">
        <Reveal className="flex flex-col gap-7 md:grid md:grid-cols-[1.4fr_1fr_1fr_1fr] md:gap-10 md:items-start">
          <div className="flex flex-col gap-3 md:gap-3.5">
            <img
              src={logoDarkBg}
              alt="NKK Tech"
              className="h-[30px] md:h-[34px] self-start"
            />
            <p className="text-[13px] text-dark-body md:max-w-[280px]">
              The Missing Piece in Your Digital Transformation — software,
              security systems and hardware supply under one roof.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-7 md:contents">
            <div className="flex flex-col gap-2.5">
              <span className={headingClasses}>Services</span>
              {services.map(({ label, href }, i) => (
                <a key={i} href={href} className={linkClasses}>
                  {label}
                </a>
              ))}
            </div>
            <div className="flex flex-col gap-2.5">
              <span className={headingClasses}>Company</span>
              {company.map(({ label, href }) => (
                <a key={label} href={href} className={linkClasses}>
                  {label}
                </a>
              ))}
            </div>
          </div>

          <div className="hidden md:flex flex-col gap-2.5">
            <span className={headingClasses}>Contact</span>
            <a href="tel:+255700000000" className={linkClasses}>
              +255 700 000 000
            </a>
            <a href="mailto:info@nkktech.co.tz" className={linkClasses}>
              info@nkktech.co.tz
            </a>
            <span className="text-sm text-dark-body min-h-8 flex items-center">
              Dar es Salaam, Tanzania
            </span>
          </div>
        </Reveal>

        <div className="mt-7 pt-4 md:pt-5 border-t border-[rgba(230,243,250,.14)] flex flex-col gap-1.5 md:flex-row md:items-center md:justify-between md:gap-6">
          <span className="order-2 text-[11px] md:order-none md:text-[13px] text-dark-body">
            <span className="md:hidden">
              © 2026 NKK Tech Company Limited · Dar es Salaam, Tanzania
            </span>
            <span className="hidden md:inline">
              © 2026 NKK Tech Company Limited
            </span>
          </span>
          <span className="order-1 md:order-none font-display font-bold italic text-white text-[15px]">
            www.nkktech.co.tz
          </span>
        </div>
      </div>
      <div className="h-2 bg-brand" />
    </footer>
  )
}
