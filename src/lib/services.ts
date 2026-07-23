export type ServiceOffering = { title: string; body: string }
export type ServiceFaq = { question: string; answer: string }

export type Service = {
  slug: string
  /** Short name used in cards, footer links and the offer catalog. */
  name: string
  metaTitle: string
  metaDescription: string
  kicker: string
  headline: string
  intro: string
  offerings: ServiceOffering[]
  faqs: ServiceFaq[]
}

export const services: readonly Service[] = [
  {
    slug: 'software-development',
    name: 'Software projects',
    metaTitle: 'Custom Software Development in Tanzania — NKK Tech',
    metaDescription:
      'Web systems, mobile apps and integrations for Tanzanian organisations — scoped, built and supported by NKK Tech’s in-house engineers in Dar es Salaam.',
    kicker: 'Software projects',
    headline: 'Software that fits how your organisation actually works',
    intro:
      'Off-the-shelf tools rarely match local workflows. We scope, design and build web systems, mobile apps and integrations around your processes — then stay on to support what we ship.',
    offerings: [
      {
        title: 'Web systems',
        body: 'Internal tools, customer portals, booking and management systems — built for the browser, hosted reliably, usable on any device.',
      },
      {
        title: 'Mobile apps',
        body: 'Mobile applications for field teams and customers, designed for real network conditions in Tanzania.',
      },
      {
        title: 'Integrations & automation',
        body: 'Connecting the systems you already use — payments, SMS, accounting — so data moves without manual re-entry.',
      },
      {
        title: 'Support & maintenance',
        body: 'Bug fixes, updates and small improvements under a clear support arrangement, so the system keeps earning its keep after launch.',
      },
    ],
    faqs: [
      {
        question: 'How much does a custom system cost?',
        answer:
          'It depends on scope. After a short discovery call we produce a written, fixed quote broken into phases, so you can start small and expand. You will always know the price before we write a line of code.',
      },
      {
        question: 'How long does a typical project take?',
        answer:
          'Small internal tools can ship in a few weeks; larger systems are delivered in phases so you see working software early rather than waiting months for a big reveal.',
      },
      {
        question: 'Do you work with organisations outside Dar es Salaam?',
        answer:
          'Yes. Software work is delivered remotely across Tanzania, with on-site sessions for discovery and training where they help.',
      },
      {
        question: 'Who owns the code?',
        answer:
          'You do. Source code and accounts are handed over as part of delivery, and documentation is included so another team could take over if you ever wanted to.',
      },
    ],
  },
  {
    slug: 'access-control',
    name: 'Access control',
    metaTitle: 'Access Control Installation in Dar es Salaam — NKK Tech',
    metaDescription:
      'Biometric and card access control for offices and secure facilities in Tanzania — designed, installed, commissioned and maintained by NKK Tech.',
    kicker: 'Access control',
    headline: 'Control exactly who enters — and when',
    intro:
      'From a single office door to multi-site facilities, we design and install biometric and card entry systems, commission them properly, and train your team to run them.',
    offerings: [
      {
        title: 'Biometric entry',
        body: 'Fingerprint and face-recognition readers for doors, gates and turnstiles — enrolment, permissions and reporting configured for your organisation.',
      },
      {
        title: 'Card & fob systems',
        body: 'RFID card and fob access with per-door, per-person and per-time-window permissions, and instant deactivation of lost cards.',
      },
      {
        title: 'Time & attendance',
        body: 'The same readers can drive staff attendance reports, feeding payroll and HR instead of paper registers.',
      },
      {
        title: 'Maintenance & support',
        body: 'Preventive service visits, repairs and reconfiguration as your team and premises change.',
      },
    ],
    faqs: [
      {
        question: 'What does an access control installation cost?',
        answer:
          'It depends on the number of doors and the reader types. We start with a free site survey, then give a written fixed quote covering equipment, installation and commissioning.',
      },
      {
        question: 'Does access control keep working during power cuts?',
        answer:
          'Yes — systems are installed with battery backup so doors keep working through outages, and each door’s fail-safe or fail-secure behaviour is configured to meet fire-safety requirements.',
      },
      {
        question: 'Can it integrate with CCTV or attendance systems?',
        answer:
          'Yes. Access events can be linked with camera footage and exported to attendance and payroll systems — tell us what you run and we will confirm during the survey.',
      },
      {
        question: 'Do you maintain systems installed by another vendor?',
        answer:
          'Usually, yes. We assess the existing installation first and tell you honestly whether it is worth maintaining, upgrading or replacing.',
      },
    ],
  },
  {
    slug: 'cctv-surveillance',
    name: 'CCTV & surveillance',
    metaTitle: 'CCTV Installation in Dar es Salaam — IP Cameras & Monitoring — NKK Tech',
    metaDescription:
      'IP camera networks with remote monitoring, recording and maintenance — CCTV design, installation and support for Tanzanian businesses by NKK Tech.',
    kicker: 'CCTV & surveillance',
    headline: 'CCTV that still works a year after handover',
    intro:
      'Cameras are easy to sell and easy to neglect. We design IP camera networks around what you actually need to see, install them cleanly, and keep them recording with real maintenance.',
    offerings: [
      {
        title: 'System design & siting',
        body: 'A site survey determines camera positions, coverage and recording capacity — so you pay for the views you need, not the ones you don’t.',
      },
      {
        title: 'IP camera installation',
        body: 'Clean cabling, protected power and configured recorders, commissioned and documented before we hand over.',
      },
      {
        title: 'Remote monitoring',
        body: 'Secure viewing from phones and desktops for the people you authorise — at the office, at home or abroad.',
      },
      {
        title: 'Storage & retention',
        body: 'Recording capacity sized to your retention needs, with options for on-site and off-site storage.',
      },
    ],
    faqs: [
      {
        question: 'How much does CCTV installation cost in Tanzania?',
        answer:
          'The main drivers are camera count, camera type and storage. After a free site survey we quote a fixed written price covering equipment, installation and setup.',
      },
      {
        question: 'How long is footage kept?',
        answer:
          'That is a sizing decision, not luck: we calculate storage from your camera count, resolution and required retention period — commonly two weeks to three months — and size the recorder accordingly.',
      },
      {
        question: 'Can I view my cameras from my phone?',
        answer:
          'Yes. We configure secure remote viewing as standard, and set up accounts only for the people you authorise.',
      },
      {
        question: 'Do you service existing CCTV installations?',
        answer:
          'Yes. We take over maintenance of existing systems after an assessment visit, and tell you plainly which parts are worth keeping.',
      },
    ],
  },
  {
    slug: 'hardware-supply',
    name: 'Hardware supply & tendering',
    metaTitle: 'IT & Security Hardware Supply and Tendering in Tanzania — NKK Tech',
    metaDescription:
      'Specification-compliant supply of IT and security hardware for corporate and government tenders in Tanzania — sourcing, delivery and documentation by NKK Tech.',
    kicker: 'Hardware supply & tendering',
    headline: 'Hardware supplied to spec — on paper and on the loading dock',
    intro:
      'Tenders are won on compliance and lost on paperwork. We source IT and security hardware that matches the specification exactly, deliver on schedule, and keep the documentation clean.',
    offerings: [
      {
        title: 'Tender supply',
        body: 'Specification-compliant supply for corporate and government tenders, with the compliance paperwork done properly.',
      },
      {
        title: 'IT equipment',
        body: 'Computers, servers, networking and peripherals from established manufacturers, with genuine warranties.',
      },
      {
        title: 'Security equipment',
        body: 'Cameras, access control hardware, alarms and accessories — supplied alone or as part of an installed system.',
      },
      {
        title: 'Delivery & after-sales',
        body: 'Scheduled delivery, installation where required, and a single point of contact for warranty claims.',
      },
    ],
    faqs: [
      {
        question: 'Can you supply against an existing tender specification?',
        answer:
          'Yes — send us the specification and we will confirm item-by-item compliance and quote against it, flagging anything that needs a clarification request.',
      },
      {
        question: 'Do you only supply, or also install?',
        answer:
          'Both. You can buy hardware alone, or have the same team supply, install and commission it — one accountable partner either way.',
      },
      {
        question: 'Are products covered by warranty?',
        answer:
          'Yes. We supply equipment with genuine manufacturer warranties and handle claims on your behalf.',
      },
      {
        question: 'Which brands do you supply?',
        answer:
          'We source from established manufacturers based on your specification and budget rather than pushing one brand. If your organisation has an approved-brands list, we work within it.',
      },
    ],
  },
]

export function getService(slug: string): Service | undefined {
  return services.find((service) => service.slug === slug)
}
