# Next.js Migration + SEO Layer — Design

**Date:** 2026-07-23
**Status:** Approved
**Approach:** In-place migration on branch `feat/nextjs-migration` (approach A)

## Goal

Migrate the NKK Tech one-page marketing site from Vite + React SPA to Next.js
(App Router, TypeScript) so the page is fully prerendered at build time, and add
the complete SEO layer identified in the 2026-07-23 SEO assessment. Deployment
target is Vercel.

## Scope

- Single page, ported as-is (Nav, Hero, Services, WhyUs, Process, QuoteSection,
  Footer). No per-service routes in this project.
- Quote form wired to real email delivery via Mailtrap Send API.
- Real contact details replace placeholders.
- Out of scope: per-service pages, new copy, redesign, Google Business Profile.

## Stack

- Next.js latest stable, App Router, TypeScript, React 19.
- Tailwind CSS v4 via `@tailwindcss/postcss` (currently via `@tailwindcss/vite`).
- Vitest + Testing Library retained for tests (jsdom environment).
- Rendering: fully static page (SSG). The only server-side code is the quote
  form server action.

## Architecture

### App shell

The App Router directory lives at `src/app/` (consistent with existing
`src/components/`). Paths below are relative to `src/`.

- `app/layout.tsx`
  - Fonts via `next/font`:
    - Avenir Next: `next/font/local`, TTFs converted to WOFF2
      (Regular, Bold, BoldItalic, Heavy).
    - Space Grotesk: `next/font/google` (weights 400–700). Removes the
      render-blocking CSS `@import` chain.
  - Metadata API: title, description (current copy retained), canonical
    `https://nkktech.co.tz`, Open Graph (type website, locale, url, siteName,
    images), Twitter card `summary_large_image`, icons.
  - `metadataBase: new URL('https://nkktech.co.tz')` — single source of truth
    for the site URL, exported as a constant from `src/lib/site.ts`.
- `app/page.tsx` — server component composing the section components, plus
  JSON-LD (see below).
- `app/robots.ts` — allow all, point to sitemap.
- `app/sitemap.ts` — single URL entry.
- `app/opengraph-image.tsx` — generated 1200×630 branded card via
  `ImageResponse` (navy/brand palette, logo, tagline). Also serves as the
  Twitter image.

### Components

- Port unchanged where possible. Client boundaries (`'use client'`): `Nav`
  (menu state), `QuoteSection` (form state), `Reveal` (IntersectionObserver).
  All other sections remain server components.
- **Prerender visibility rule:** scroll-reveal animations must not hide content
  in the static HTML. Initial hidden state is applied only once JS runs
  (e.g. class added by the Reveal client component on mount, not present in
  server-rendered markup). Crawlers and no-JS users see full content.
- Static assets move to Next conventions: logos/icons imported via
  `next/image` where straightforward; decorative hero PNG keeps `alt=""`.

### Quote form

- Server action `sendQuoteRequest` in `src/app/actions/quote.ts` (or
  colocated per Next convention).
- Validation: server-side mirrors existing client rules (name + message
  required, email or phone required, email format check). Client-side
  validation and existing success/error UI retained.
- Anti-spam: hidden honeypot field; submissions with it filled are silently
  accepted (no email sent).
- Delivery: Mailtrap Send API (`https://send.api.mailtrap.io/api/send`) to
  `info@nkktech.co.tz`. Env vars: `MAILTRAP_TOKEN` (secret),
  `MAILTRAP_SANDBOX_INBOX_ID` (dev only).
- Until nkktech.co.tz DNS is verified in Mailtrap, use the sandbox API in
  non-production so the flow is testable end-to-end. Production switches to
  the real Send API by env config, not code change.
- Failure UX: if the action throws/rejects, show the existing error styling
  with a "please try again or email us directly" message.

## SEO content

### JSON-LD (`ProfessionalService`)

- name: NKK Tech Company Limited
- url: https://nkktech.co.tz
- email: info@nkktech.co.tz
- telephone: +255746800951
- address: Mikocheni, Dar es Salaam, Tanzania (`addressLocality` Dar es
  Salaam, `addressRegion` Dar es Salaam, `streetAddress` Mikocheni,
  `addressCountry` TZ)
- areaServed: Tanzania
- description: current meta description copy
- logo/image: absolute URL to logo asset
- Rendered as a `<script type="application/ld+json">` in `app/page.tsx`.

### Content fixes riding along

- Replace `+255 700 000 000` with `+255 746 800 951` (display) /
  `tel:+255746800951` (href) in `Footer` and `QuoteSection`.
- Footer location line: "Mikocheni, Dar es Salaam, Tanzania".

## Testing

- Existing component tests (Nav, QuoteSection, sections, Button, Reveal)
  ported to run under the Next setup with Vitest.
- New tests:
  - Server action: validation rejections, honeypot, Mailtrap payload shape
    (fetch mocked), error propagation.
  - Reveal prerender rule: server-rendered markup contains visible content
    (no hidden-state class before hydration).
- Build-output check in CI/verification: `next build` output HTML for `/`
  contains hero heading text, meta description, JSON-LD block.

## Deployment

- Vercel project linked to the repo; `MAILTRAP_TOKEN` set as env var.
- Verify preview deployment: prerendered HTML complete, form round-trip to
  Mailtrap sandbox, OG image resolves, robots/sitemap serve.
- Production promotion after verification. DNS/domain attachment for
  nkktech.co.tz happens on Vercel when the user is ready (out of band).

## Execution

- Subagent-driven development: Sonnet implementers, Opus per-task reviewers,
  Fable final whole-branch review.
- Independent tasks run in parallel.
