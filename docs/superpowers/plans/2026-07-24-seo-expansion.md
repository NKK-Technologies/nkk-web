# SEO / LLMO Expansion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expand the single-page marketing site with four service pages (with FAQ + Service schema), an About page, a Privacy page, a WhatsApp click-to-chat button, Vercel Analytics/Speed Insights, an enriched Organization JSON-LD, and a complete sitemap.

**Architecture:** All new pages are statically prerendered App Router server components reusing the existing section components (`Nav`, `Footer`, `SectionHeader`, `Reveal`, `Button`). Service pages are data-driven from a single `src/lib/services.ts` content module rendered by one dynamic route `src/app/services/[slug]/page.tsx` (`generateStaticParams`, `dynamicParams = false`). FAQ answers are plain `<details>` disclosure elements (no client JS) mirrored into `FAQPage` JSON-LD from the same data.

**Tech Stack:** Next.js 16 App Router, Tailwind v4, Vitest + Testing Library, `@vercel/analytics`, `@vercel/speed-insights`.

## Global Constraints

- **Branch:** all commits on `feat/seo-expansion`. **Never push.**
- **Tailwind v4 utilities only**, tokens from `@theme` in `src/app/globals.css` (`bg-brand`, `text-muted`, `shadow-card`, `font-display`, `bg-ice`, `text-navy`, `text-sky-mist`, `text-ink`, `border-line`, `text-dark-body`, `ease-standard`). Arbitrary values fine where no token exists. No CSS modules, no inline `style=` except genuinely dynamic values.
- **New runtime dependencies allowed:** ONLY `@vercel/analytics` and `@vercel/speed-insights` (installed by the orchestrator between waves — task agents never run `npm install`).
- **Truthful copy only.** Never invent client names, employer names, team member names, certifications, project counts, years-of-experience numbers, brand partnerships, or geo coordinates. Copy in this plan is final — use it verbatim.
- **Layout conventions:** container `max-w-[1140px] mx-auto`, side padding `px-5 md:px-6`, section vertical padding `py-14 md:py-[88px]`. Headings `font-display` navy (white on navy bg), leading 1.2. Kickers: 13px bold italic uppercase tracking `.08em`. Cards: `rounded-2xl`, `shadow-card`, 1px `line` border on white.
- **Section anchors on the home page:** `#top`, `#services`, `#team`, `#process`, `#quote`. From subpages these are reached as `/#services` etc.
- **Service slugs (fixed, used verbatim everywhere):** `software-development`, `access-control`, `cctv-surveillance`, `hardware-supply`.
- **Verification for every task:** `npm test` and `npm run lint` pass before committing. **Task agents must NOT run `npm run build`** — parallel builds share `.next/` and corrupt it; the orchestrator builds at wave boundaries.
- **Commits:** `git add` ONLY the exact files your task touches (never `git add -A` — other agents work in the same tree). If `git commit` fails with an index.lock error, wait 2 seconds and retry (up to 3 times).
- **Existing test baseline:** one test is red before this plan starts (`src/app/page.test.tsx` asserts the pre-www URL); Task 1 fixes it. Other tasks: ignore that one known failure if it appears while Task 1 is still in flight; your own files' tests must pass.

---

## Wave 1 — independent tasks (run in parallel)

### Task 1: Fix red baseline test + housekeeping

**Files:**
- Modify: `src/app/page.test.tsx`
- Modify: `package.json` (name field only)
- Modify: `.gitignore`

**Interfaces:**
- Consumes: `SITE_URL`, `SITE_NAME`, `CONTACT` from `@/lib/site` (existing).
- Produces: green baseline for all other tasks.

- [ ] **Step 1: Run the failing test to confirm the known failure**

Run: `npx vitest run src/app/page.test.tsx`
Expected: FAIL — `expected 'https://www.nkktech.co.tz' to be 'https://nkktech.co.tz'`

- [ ] **Step 2: Fix the assertion to use the site constants instead of literals**

In `src/app/page.test.tsx`, add imports and replace the three hardcoded identity assertions:

```tsx
import { SITE_URL, SITE_NAME, CONTACT } from '@/lib/site'
```

and change:

```tsx
    expect(data.name).toBe(SITE_NAME)
    expect(data.url).toBe(SITE_URL)
    expect(data.telephone).toBe(CONTACT.phone)
    expect(data.email).toBe(CONTACT.email)
```

(Leave the `@type`, `address`, and `areaServed` assertions unchanged.)

- [ ] **Step 3: Run the test to verify it passes**

Run: `npx vitest run src/app/page.test.tsx`
Expected: PASS

- [ ] **Step 4: Rename the package**

In `package.json` change `"name": "my-app"` to `"name": "nkk-web"`. Touch nothing else in the file.

- [ ] **Step 5: Extend .gitignore**

Append to `.gitignore`:

```
*.tsbuildinfo
design_handoff_*/
```

- [ ] **Step 6: Full verification, then commit**

Run: `npm test` → all suites pass. Run: `npm run lint` → clean.

```bash
git add src/app/page.test.tsx package.json .gitignore
git commit -m "fix: assert JSON-LD against site constants; rename package; ignore build info and handoff dirs"
```

---

### Task 2: Services content library

**Files:**
- Create: `src/lib/services.ts`
- Test: `src/lib/services.test.ts`

**Interfaces:**
- Produces: `services: readonly Service[]`, `getService(slug: string): Service | undefined`, and types `Service`, `ServiceOffering`, `ServiceFaq` — consumed by Tasks 5 and 9 via `@/lib/services`. `Service` shape: `{ slug, name, metaTitle, metaDescription, kicker, headline, intro, offerings: {title, body}[], faqs: {question, answer}[] }`, all strings.

- [ ] **Step 1: Write the failing test**

`src/lib/services.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { services, getService } from './services'

describe('services content library', () => {
  it('defines exactly the four fixed slugs', () => {
    expect(services.map((s) => s.slug)).toEqual([
      'software-development',
      'access-control',
      'cctv-surveillance',
      'hardware-supply',
    ])
  })

  it('provides complete content for every service', () => {
    for (const service of services) {
      expect(service.name).not.toBe('')
      expect(service.metaTitle).toContain('NKK Tech')
      expect(service.metaDescription.length).toBeGreaterThan(50)
      expect(service.metaDescription.length).toBeLessThanOrEqual(160)
      expect(service.headline).not.toBe('')
      expect(service.intro).not.toBe('')
      expect(service.offerings.length).toBeGreaterThanOrEqual(4)
      expect(service.faqs.length).toBeGreaterThanOrEqual(4)
      for (const faq of service.faqs) {
        expect(faq.question.endsWith('?')).toBe(true)
        expect(faq.answer.length).toBeGreaterThan(40)
      }
    }
  })

  it('looks up services by slug', () => {
    expect(getService('cctv-surveillance')?.name).toBe('CCTV & surveillance')
    expect(getService('nope')).toBeUndefined()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/services.test.ts`
Expected: FAIL — cannot resolve `./services`

- [ ] **Step 3: Create the content module**

`src/lib/services.ts` (copy content verbatim — it is final, legally-reviewed-style copy that deliberately names no brands, clients, or invented numbers):

```ts
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/services.test.ts`
Expected: PASS (3 tests)

- [ ] **Step 5: Lint, then commit**

Run: `npm run lint` → clean.

```bash
git add src/lib/services.ts src/lib/services.test.ts
git commit -m "feat: services content library with per-service copy and FAQs"
```

---

### Task 3: Subpage UI primitives — PageHero and FaqList

**Files:**
- Create: `src/components/PageHero.tsx`
- Create: `src/components/FaqList.tsx`
- Test: `src/components/PageHero.test.tsx`
- Test: `src/components/FaqList.test.tsx`

**Interfaces:**
- Consumes: `Reveal`, `SectionHeader` (existing, `./ui/…`).
- Produces: `PageHero({ kicker, title, intro? }: { kicker: string; title: string; intro?: string })` and `FaqList({ faqs }: { faqs: readonly { question: string; answer: string }[] })` — consumed by Tasks 5, 6, 7. NOTE: `FaqList` defines its own local `Faq` type (structurally identical to `ServiceFaq`) so this task has NO dependency on Task 2.

- [ ] **Step 1: Write the failing tests**

`src/components/PageHero.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PageHero } from './PageHero'

describe('PageHero', () => {
  it('renders kicker, h1 title and intro', () => {
    render(<PageHero kicker="About us" title="Big headline" intro="Some intro." />)
    expect(screen.getByRole('heading', { level: 1, name: 'Big headline' })).toBeInTheDocument()
    expect(screen.getByText('About us')).toBeInTheDocument()
    expect(screen.getByText('Some intro.')).toBeInTheDocument()
  })

  it('omits the intro paragraph when not given', () => {
    const { container } = render(<PageHero kicker="K" title="T" />)
    expect(container.querySelector('p')).toBeNull()
  })
})
```

`src/components/FaqList.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { FaqList } from './FaqList'

const faqs = [
  { question: 'First question?', answer: 'First answer.' },
  { question: 'Second question?', answer: 'Second answer.' },
]

describe('FaqList', () => {
  it('renders a heading and one details element per FAQ', () => {
    const { container } = render(<FaqList faqs={faqs} />)
    expect(
      screen.getByRole('heading', { name: 'Frequently asked questions' }),
    ).toBeInTheDocument()
    expect(container.querySelectorAll('details')).toHaveLength(2)
    expect(screen.getByText('First question?')).toBeInTheDocument()
    expect(screen.getByText('Second answer.')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/components/PageHero.test.tsx src/components/FaqList.test.tsx`
Expected: FAIL — modules not found

- [ ] **Step 3: Implement PageHero**

`src/components/PageHero.tsx`:

```tsx
import { Reveal } from './ui/Reveal'

type PageHeroProps = {
  kicker: string
  title: string
  intro?: string
}

/** Ice-band page header for subpages — kicker, h1, optional intro. */
export function PageHero({ kicker, title, intro }: PageHeroProps) {
  return (
    <header className="bg-ice">
      <div className="max-w-[1140px] mx-auto px-5 md:px-6 pt-14 pb-12 md:pt-20 md:pb-16">
        <Reveal className="flex flex-col gap-3 md:gap-4 max-w-[720px]">
          <span className="font-display italic font-bold uppercase text-[13px] tracking-[.08em] text-brand">
            {kicker}
          </span>
          <h1 className="m-0 font-display font-extrabold text-navy leading-[1.15] text-[30px] md:text-[clamp(34px,4vw,44px)]">
            {title}
          </h1>
          {intro && (
            <p className="m-0 max-w-[620px] text-[17px] md:text-[19px] text-ink [text-wrap:pretty]">
              {intro}
            </p>
          )}
        </Reveal>
      </div>
    </header>
  )
}
```

- [ ] **Step 4: Implement FaqList**

`src/components/FaqList.tsx`:

```tsx
import { SectionHeader } from './ui/SectionHeader'
import { Reveal } from './ui/Reveal'

type Faq = { question: string; answer: string }

type FaqListProps = { faqs: readonly Faq[] }

/** No-JS FAQ accordion — plain <details> elements styled as cards. */
export function FaqList({ faqs }: FaqListProps) {
  return (
    <section className="bg-ice">
      <div className="max-w-[1140px] mx-auto px-5 md:px-6 py-14 md:py-[88px]">
        <Reveal>
          <SectionHeader
            kicker="Questions"
            title="Frequently asked questions"
            className="mb-6 md:mb-8"
          />
        </Reveal>
        <div className="flex flex-col gap-3 max-w-[760px]">
          {faqs.map((faq, i) => (
            <Reveal key={faq.question} delay={i * 60}>
              <details className="group bg-white border border-line rounded-2xl shadow-card">
                <summary className="flex items-center justify-between gap-4 cursor-pointer list-none [&::-webkit-details-marker]:hidden px-5 py-4 md:px-6 md:py-5 font-display font-bold text-navy text-base md:text-[17px] leading-[1.3]">
                  {faq.question}
                  <span
                    aria-hidden="true"
                    className="shrink-0 text-brand text-xl leading-none transition-transform duration-200 ease-standard group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="px-5 pb-4 md:px-6 md:pb-5 text-[15px] text-muted">
                  {faq.answer}
                </p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npx vitest run src/components/PageHero.test.tsx src/components/FaqList.test.tsx`
Expected: PASS

- [ ] **Step 6: Lint, then commit**

Run: `npm run lint` → clean.

```bash
git add src/components/PageHero.tsx src/components/FaqList.tsx src/components/PageHero.test.tsx src/components/FaqList.test.tsx
git commit -m "feat: PageHero and FaqList primitives for subpages"
```

---

### Task 4: Nav & Footer links work from subpages

**Files:**
- Modify: `src/components/Nav.tsx`
- Modify: `src/components/Footer.tsx`

**Interfaces:**
- Consumes: nothing new. Service page URLs are the plan-fixed slugs (hardcoded here on purpose — keeps this task independent of Task 2; the slugs are frozen in Global Constraints).
- Produces: Nav/Footer that route correctly from any page — consumed by every subpage task.

- [ ] **Step 1: Prefix Nav anchors with `/`**

In `src/components/Nav.tsx`:
- Change the `links` array hrefs to `'/#services'`, `'/#team'`, `'/#process'`, `'/#quote'` (labels unchanged).
- Change the logo link `href="#top"` to `href="/"`.
- Change both `Button href="#quote"` occurrences (desktop + mobile CTA) to `href="/#quote"`.

- [ ] **Step 2: Point Footer links at the new pages**

In `src/components/Footer.tsx` replace the two link arrays:

```tsx
const services: Link[] = [
  { label: 'Software projects', href: '/services/software-development' },
  { label: 'Access control', href: '/services/access-control' },
  { label: 'CCTV & surveillance', href: '/services/cctv-surveillance' },
  { label: 'Hardware supply & tendering', href: '/services/hardware-supply' },
]

const company: Link[] = [
  { label: 'About us', href: '/about' },
  { label: 'Why us', href: '/#team' },
  { label: 'How we work', href: '/#process' },
  { label: 'Request a quote', href: '/#quote' },
  { label: 'Privacy policy', href: '/privacy' },
]
```

Also change the services column `key={i}` to `key={label}` (labels are unique; index keys were only there because hrefs repeated).

- [ ] **Step 3: Verify tests and lint still pass**

Run: `npm test` → all suites pass except possibly the known Task-1 baseline failure (`page.test.tsx` — ignore only that one). Nav tests query by accessible name, not href, so they pass unchanged.
Run: `npm run lint` → clean.

- [ ] **Step 4: Commit**

```bash
git add src/components/Nav.tsx src/components/Footer.tsx
git commit -m "feat: root-relative nav anchors and footer links to service/about/privacy pages"
```

---

## Wave boundary (orchestrator, not a task agent)

1. Verify wave-1 commits present; run `npm test` (fully green now), `npm run lint`, `npm run build`.
2. Run `npm install @vercel/analytics @vercel/speed-insights` and commit `package.json` + `package-lock.json` as `chore: add Vercel analytics and speed insights dependencies`.
3. Dispatch wave 2.

---

## Wave 2 — independent tasks (run in parallel; require wave 1 merged)

### Task 5: Service pages route

**Files:**
- Create: `src/app/services/[slug]/page.tsx`
- Test: `src/app/services/[slug]/page.test.tsx`

**Interfaces:**
- Consumes: `services`, `getService`, `Service` from `@/lib/services` (Task 2); `PageHero`, `FaqList` (Task 3); `Nav`, `Footer`, `SectionHeader`, `Reveal`, `Button` (existing); `SITE_URL`, `SITE_NAME` from `@/lib/site`.
- Produces: static routes `/services/<slug>` for the four fixed slugs.

- [ ] **Step 1: Write the failing test**

`src/app/services/[slug]/page.test.tsx`:

```tsx
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run "src/app/services/[slug]/page.test.tsx"`
Expected: FAIL — module not found

- [ ] **Step 3: Implement the route**

`src/app/services/[slug]/page.tsx`:

```tsx
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run "src/app/services/[slug]/page.test.tsx"`
Expected: PASS (5 tests)

- [ ] **Step 5: Lint, then commit**

Run: `npm run lint` → clean.

```bash
git add "src/app/services/[slug]/page.tsx" "src/app/services/[slug]/page.test.tsx"
git commit -m "feat: four static service pages with Service and FAQPage schema"
```

---

### Task 6: About page

**Files:**
- Create: `src/app/about/page.tsx`
- Test: `src/app/about/page.test.tsx`

**Interfaces:**
- Consumes: `Nav`, `Footer`, `PageHero`, `SectionHeader`, `Reveal`, `Button` (existing + Task 3); `SITE_URL` from `@/lib/site`.
- Produces: static `/about` route.

- [ ] **Step 1: Write the failing test**

`src/app/about/page.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import AboutPage, { metadata } from './page'
import { SITE_URL } from '@/lib/site'

describe('about page', () => {
  it('renders the h1 and the three working principles', () => {
    render(<AboutPage />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'A new company, built by people who have done the work before',
    )
    expect(screen.getByText('Scope honestly')).toBeInTheDocument()
    expect(screen.getByText('Deliver in the open')).toBeInTheDocument()
    expect(screen.getByText('Support what we ship')).toBeInTheDocument()
  })

  it('embeds AboutPage JSON-LD pointing at the organization', () => {
    const { container } = render(<AboutPage />)
    const script = container.querySelector('script[type="application/ld+json"]')
    const data = JSON.parse(script?.textContent ?? '{}')
    expect(data['@type']).toBe('AboutPage')
    expect(data.mainEntity['@id']).toBe(`${SITE_URL}/#organization`)
  })

  it('sets title, description and canonical', () => {
    expect(metadata.title).toContain('About')
    expect(metadata.description).toBeTruthy()
    expect(metadata.alternates?.canonical).toBe('/about')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/app/about/page.test.tsx`
Expected: FAIL — module not found

- [ ] **Step 3: Implement the page**

`src/app/about/page.tsx` (copy verbatim — the "we can't always name past projects" paragraph is deliberate positioning around a legal constraint; do not embellish it):

```tsx
import type { Metadata } from 'next'
import { Nav } from '@/components/Nav'
import { Footer } from '@/components/Footer'
import { PageHero } from '@/components/PageHero'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Reveal } from '@/components/ui/Reveal'
import { Button } from '@/components/ui/Button'
import { SITE_URL } from '@/lib/site'

const TITLE = 'About NKK Tech — A New Company, A Seasoned Team'
const DESCRIPTION =
  'NKK Tech Company Limited is a Dar es Salaam technology company: software development, access control, CCTV and hardware supply under one roof.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/about' },
  openGraph: {
    type: 'website',
    url: '/about',
    siteName: 'NKK Tech',
    title: TITLE,
    description: DESCRIPTION,
    locale: 'en_US',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: TITLE }],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: ['/og-image.png'],
  },
}

const aboutJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  url: `${SITE_URL}/about`,
  mainEntity: { '@id': `${SITE_URL}/#organization` },
} as const

const principles = [
  {
    title: 'Scope honestly',
    body: 'We would rather lose a job by quoting accurately than win it by quoting low and renegotiating later. Every engagement starts with a written scope and a fixed price against it.',
  },
  {
    title: 'Deliver in the open',
    body: 'Work is broken into phases you can see and test. You always know what is done, what is next, and what it costs — no long silences, no big reveals.',
  },
  {
    title: 'Support what we ship',
    body: 'Handover is not goodbye. Installations get maintenance visits; software gets fixes and updates under a clear support arrangement.',
  },
]

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutJsonLd) }}
      />
      <Nav />
      <PageHero
        kicker="About us"
        title="A new company, built by people who have done the work before"
        intro="NKK Tech Company Limited is a Dar es Salaam technology company offering software development, access control, CCTV and hardware supply — under one roof."
      />

      <section className="bg-white">
        <div className="max-w-[1140px] mx-auto px-5 md:px-6 py-14 md:py-[88px] flex flex-col gap-10 md:gap-14">
          <Reveal className="flex flex-col gap-3 max-w-[720px]">
            <SectionHeader kicker="Why we exist" title="One accountable partner, not three vendors" />
            <p className="text-[15px] md:text-base text-ink">
              Most organisations in Tanzania end up juggling separate suppliers for
              software, security systems and hardware — three contracts, three
              schedules, and finger-pointing whenever something breaks at the seams.
              NKK Tech was founded to remove those seams: one team that scopes,
              supplies, installs and supports the whole job, and answers for all of it.
            </p>
          </Reveal>

          <Reveal className="flex flex-col gap-3 max-w-[720px]">
            <SectionHeader kicker="Our team" title="Newly registered. Not new to the work." />
            <p className="text-[15px] md:text-base text-ink">
              NKK Tech is a young company — our people are not. Before founding NKK
              Tech, our team spent years delivering software systems, installing and
              servicing security infrastructure, and handling procurement and tender
              supply for organisations across Tanzania.
            </p>
            <p className="text-[15px] md:text-base text-ink">
              We can&rsquo;t always name that past work: much of it was done under other
              banners, and we take confidentiality obligations seriously — yours will
              be treated the same way. We would rather earn new references than borrow
              old ones, which is why every engagement starts small enough to prove
              ourselves on.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-navy">
        <div className="max-w-[1140px] mx-auto px-5 md:px-6 py-14 md:py-[88px]">
          <Reveal>
            <SectionHeader
              dark
              kicker="How we work"
              title="Three rules we don't break"
              className="mb-6 md:mb-11"
            />
          </Reveal>
          <div className="grid gap-3 md:grid-cols-3 md:gap-5">
            {principles.map(({ title, body }, i) => (
              <Reveal key={title} delay={i * 80}>
                <article className="h-full bg-[rgba(230,243,250,.06)] border border-[rgba(230,243,250,.14)] rounded-2xl p-5 md:p-6">
                  <h3 className="font-display font-bold text-white leading-[1.2] text-base md:text-[17px]">
                    {title}
                  </h3>
                  <p className="mt-2 text-dark-body text-sm md:text-[15px]">{body}</p>
                </article>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-8 md:mt-11">
            <Button href="/#quote" variant="primary" size="lg">
              Start a conversation
            </Button>
          </Reveal>
        </div>
      </section>

      <Footer />
    </>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/app/about/page.test.tsx`
Expected: PASS (3 tests)

- [ ] **Step 5: Lint, then commit**

Run: `npm run lint` → clean.

```bash
git add src/app/about/page.tsx src/app/about/page.test.tsx
git commit -m "feat: about page — seasoned-team story with AboutPage schema"
```

---

### Task 7: Privacy policy page

**Files:**
- Create: `src/app/privacy/page.tsx`
- Test: `src/app/privacy/page.test.tsx`

**Interfaces:**
- Consumes: `Nav`, `Footer`, `PageHero` (existing + Task 3); `CONTACT` from `@/lib/site`.
- Produces: static `/privacy` route.

- [ ] **Step 1: Write the failing test**

`src/app/privacy/page.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import PrivacyPage, { metadata } from './page'
import { CONTACT } from '@/lib/site'

describe('privacy page', () => {
  it('renders the policy sections', () => {
    render(<PrivacyPage />)
    expect(screen.getByRole('heading', { level: 1, name: 'Privacy policy' })).toBeInTheDocument()
    for (const heading of [
      'Who we are',
      'What we collect',
      'How we use it',
      'Analytics',
      'Retention',
      'Your choices',
    ]) {
      expect(screen.getByRole('heading', { name: heading })).toBeInTheDocument()
    }
    expect(document.body.textContent).toContain(CONTACT.email)
  })

  it('sets title and canonical', () => {
    expect(metadata.title).toContain('Privacy')
    expect(metadata.alternates?.canonical).toBe('/privacy')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/app/privacy/page.test.tsx`
Expected: FAIL — module not found

- [ ] **Step 3: Implement the page**

`src/app/privacy/page.tsx`:

```tsx
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/app/privacy/page.test.tsx`
Expected: PASS (2 tests)

- [ ] **Step 5: Lint, then commit**

Run: `npm run lint` → clean.

```bash
git add src/app/privacy/page.tsx src/app/privacy/page.test.tsx
git commit -m "feat: privacy policy page"
```

---

### Task 8: WhatsApp button + analytics wiring

**Files:**
- Modify: `src/components/ui/icons.tsx` (append one icon)
- Create: `src/components/WhatsAppButton.tsx`
- Test: `src/components/WhatsAppButton.test.tsx`
- Modify: `src/app/layout.tsx`

**Interfaces:**
- Consumes: `CONTACT` from `@/lib/site`; `@vercel/analytics` and `@vercel/speed-insights` (already installed by the orchestrator at the wave boundary — do NOT run npm install).
- Produces: `WhatsAppButton` rendered site-wide from the root layout; `<Analytics />` + `<SpeedInsights />` active on all pages.

- [ ] **Step 1: Write the failing test**

`src/components/WhatsAppButton.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { WhatsAppButton } from './WhatsAppButton'

describe('WhatsAppButton', () => {
  it('links to the company WhatsApp with a prefilled message', () => {
    render(<WhatsAppButton />)
    const link = screen.getByRole('link', { name: 'Chat with NKK Tech on WhatsApp' })
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    const href = link.getAttribute('href')!
    expect(href.startsWith('https://wa.me/255746800951?text=')).toBe(true)
    expect(decodeURIComponent(href)).toContain('Hello NKK Tech')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/WhatsAppButton.test.tsx`
Expected: FAIL — module not found

- [ ] **Step 3: Add the WhatsApp glyph to icons.tsx**

Append to `src/components/ui/icons.tsx` (filled brand glyph — Simple Icons, CC0 — unlike the stroked feather icons above it):

```tsx
export function WhatsAppIcon({ size = 24, fill = '#fff' }: { size?: number; fill?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  )
}
```

- [ ] **Step 4: Implement the button**

`src/components/WhatsAppButton.tsx`:

```tsx
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
```

- [ ] **Step 5: Wire button + analytics into the root layout**

In `src/app/layout.tsx` add imports:

```tsx
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { WhatsAppButton } from '@/components/WhatsAppButton'
```

and change the body to:

```tsx
      <body>
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js')",
          }}
        />
        {children}
        <WhatsAppButton />
        <Analytics />
        <SpeedInsights />
      </body>
```

- [ ] **Step 6: Run tests to verify they pass**

Run: `npx vitest run src/components/WhatsAppButton.test.tsx`
Expected: PASS

- [ ] **Step 7: Lint, then commit**

Run: `npm run lint` → clean.

```bash
git add src/components/ui/icons.tsx src/components/WhatsAppButton.tsx src/components/WhatsAppButton.test.tsx src/app/layout.tsx
git commit -m "feat: floating WhatsApp click-to-chat button; wire Vercel Analytics and Speed Insights"
```

---

### Task 9: Enriched Organization JSON-LD + full sitemap

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/app/page.test.tsx`
- Modify: `src/app/sitemap.ts`
- Test: `src/app/sitemap.test.ts`

**Interfaces:**
- Consumes: `services` from `@/lib/services` (Task 2); site constants.
- Produces: home-page org schema with `@id` `${SITE_URL}/#organization` (referenced by Tasks 5 and 6 — the `@id` string is already fixed, do not change it); sitemap listing all 7 pages.

- [ ] **Step 1: Extend the failing tests first**

In `src/app/page.test.tsx`, extend the existing JSON-LD test (after Task 1 it asserts via constants) by adding these assertions at the end of the existing `it` block:

```tsx
    expect(data['@id']).toBe(`${SITE_URL}/#organization`)
    expect(data.logo).toBe(`${SITE_URL}/icon_app.png`)
    expect(data.image).toBe(`${SITE_URL}/og-image.png`)
    expect(data.slogan).toBe('The Missing Piece in Your Digital Transformation')
    expect(data.contactPoint).toMatchObject({
      '@type': 'ContactPoint',
      contactType: 'sales',
    })
    const offers = data.hasOfferCatalog.itemListElement
    expect(offers).toHaveLength(4)
    expect(offers[0].itemOffered.url).toBe(
      `${SITE_URL}/services/software-development`,
    )
```

Create `src/app/sitemap.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import sitemap from './sitemap'
import { services } from '@/lib/services'
import { SITE_URL } from '@/lib/site'

describe('sitemap', () => {
  it('lists home, all service pages, about and privacy', () => {
    const urls = sitemap().map((entry) => entry.url)
    expect(urls).toEqual([
      SITE_URL,
      ...services.map((s) => `${SITE_URL}/services/${s.slug}`),
      `${SITE_URL}/about`,
      `${SITE_URL}/privacy`,
    ])
  })

  it('uses a fixed lastModified date, not build time', () => {
    const dates = sitemap().map((e) => e.lastModified)
    for (const date of dates) {
      expect(date).toEqual(new Date('2026-07-24'))
    }
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/app/page.test.tsx src/app/sitemap.test.ts`
Expected: FAIL — missing `@id`/`logo`/catalog fields; sitemap has 1 entry with build-time date

- [ ] **Step 3: Enrich the home-page JSON-LD**

In `src/app/page.tsx`, add `import { services } from '@/lib/services'` and replace the `jsonLd` object with:

```tsx
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
```

- [ ] **Step 4: Rewrite the sitemap**

Replace `src/app/sitemap.ts` with:

```ts
import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site'
import { services } from '@/lib/services'

// Bump when page content meaningfully changes — a build-time `new Date()`
// would claim every page changed on every deploy.
const LAST_MODIFIED = new Date('2026-07-24')

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, lastModified: LAST_MODIFIED, changeFrequency: 'monthly', priority: 1 },
    ...services.map((service) => ({
      url: `${SITE_URL}/services/${service.slug}`,
      lastModified: LAST_MODIFIED,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    { url: `${SITE_URL}/about`, lastModified: LAST_MODIFIED, changeFrequency: 'yearly', priority: 0.6 },
    { url: `${SITE_URL}/privacy`, lastModified: LAST_MODIFIED, changeFrequency: 'yearly', priority: 0.2 },
  ]
}
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npx vitest run src/app/page.test.tsx src/app/sitemap.test.ts`
Expected: PASS

- [ ] **Step 6: Lint, then commit**

Run: `npm run lint` → clean.

```bash
git add src/app/page.tsx src/app/page.test.tsx src/app/sitemap.ts src/app/sitemap.test.ts
git commit -m "feat: enriched organization JSON-LD with offer catalog; complete sitemap"
```

---

## Final verification (orchestrator)

1. `npm test` — all suites green.
2. `npm run lint` — clean.
3. `npm run build` — all routes static: `/`, `/about`, `/privacy`, and 4 × `/services/[slug]` (SSG `●`), plus sitemap/robots.
4. `grep -c "FAQPage" .next/server/app/services/cctv-surveillance.html` ≥ 1 and `grep -c "wa.me/255746800951" .next/server/app/index.html` ≥ 1 — schema and WhatsApp button are in prerendered HTML.
5. Final code review of the full branch diff. Do not push.
