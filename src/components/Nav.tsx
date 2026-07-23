import { useEffect, useState } from 'react'
import { Button } from './ui/Button'
import { MenuIcon, CloseIcon } from './ui/icons'
import logoMain from '../assets/logo_main.png'

const links = [
  { href: '#services', label: 'Services' },
  { href: '#team', label: 'Why us' },
  { href: '#process', label: 'How we work' },
  { href: '#quote', label: 'Contact' },
]

export function Nav() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const closeMenu = () => setMenuOpen(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className={`sticky top-0 z-50 bg-[rgba(255,255,255,.94)] backdrop-blur-[8px] border-b border-line transition-shadow duration-200 ease-standard ${
        scrolled
          ? 'shadow-[0_1px_2px_rgba(10,25,47,.06),0_4px_12px_rgba(10,25,47,.08)]'
          : ''
      }`}
    >
      <div className="max-w-[1140px] mx-auto flex items-center justify-between gap-3 md:gap-6 py-2.5 px-4 md:py-3.5 md:px-6">
        <a href="#top" className="flex items-center">
          <img src={logoMain} alt="NKK Tech" className="block h-8 md:h-[38px]" />
        </a>

        {/* Desktop navigation */}
        <div className="hidden md:flex items-center gap-7 text-[15px] font-medium">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="relative text-ink no-underline hover:text-brand after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-full after:bg-brand after:origin-left after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-200 after:ease-standard"
            >
              {link.label}
            </a>
          ))}
          <Button href="#quote" variant="primary" size="md">
            Request a quote
          </Button>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          aria-label="Menu"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen((open) => !open)}
          className="md:hidden flex items-center justify-center w-11 h-11 rounded-xl cursor-pointer active:bg-ice"
        >
          {menuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      {/* Mobile slide-down panel — stays mounted, animates open/closed */}
      <div
        id="mobile-menu"
        aria-hidden={!menuOpen}
        inert={!menuOpen}
        className={`md:hidden grid transition-[grid-template-rows,opacity] duration-[250ms] ease-standard ${
          menuOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <div className="flex flex-col border-t border-line bg-white py-2">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className="px-5 py-3.5 text-base font-medium text-ink no-underline active:bg-ice"
              >
                {link.label}
              </a>
            ))}
            <div className="px-5 pt-2.5 pb-3">
              <Button
                href="#quote"
                variant="primary"
                size="lg"
                fullWidth
                onClick={closeMenu}
              >
                Request a quote
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
