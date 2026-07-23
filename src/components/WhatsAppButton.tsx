import { CONTACT } from '@/lib/site'
import { WhatsAppIcon } from './ui/icons'

const WHATSAPP_HREF = `https://wa.me/${CONTACT.phone.replace('+', '')}?text=${encodeURIComponent(
  'Hello NKK Tech — I’d like to ask about your services.',
)}`

/** Floating click-to-chat button, fixed bottom-right on every page. */
export function WhatsAppButton() {
  return (
    <a
      href={WHATSAPP_HREF}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with NKK Tech on WhatsApp"
      className="fixed bottom-5 right-5 md:bottom-7 md:right-7 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-[0_4px_8px_rgba(10,25,47,.18),0_12px_32px_rgba(10,25,47,.22)] transition-transform duration-200 ease-standard hover:scale-[1.06] active:scale-[.96] focus-visible:outline-none focus-visible:shadow-[0_0_0_3px_rgba(0,136,204,.35)]"
    >
      <WhatsAppIcon size={28} />
    </a>
  )
}
