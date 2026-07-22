# NKK Tech Marketing Website — Implementation Plan

Replace the current "Coming Soon" placeholder with the full single-page marketing site
specified by the design handoff in `design_handoff_nkk_website/` (read its `README.md`
first — it is the spec). The handoff contains two high-fidelity design references:

- `design_handoff_nkk_website/NKK Tech Website.dc.html` — desktop (≥1000px)
- `design_handoff_nkk_website/NKK Tech Website (Mobile).dc.html` — mobile (390–430px)
- `design_handoff_nkk_website/screenshots/{desktop,mobile}.png` — full-page captures
- `design_handoff_nkk_website/design-system/` — tokens (`tokens/*.css`) and component
  reference (`_ds_bundle.js` — see the `.nkk-btn` and `.nkk-input`/`.nkk-field` CSS)

Read the design files as annotated HTML: markup between `<x-dc>…</x-dc>` is the page,
`<x-import …Button/Input>` tags mount design-system Button/Input components whose CSS
lives in `_ds_bundle.js`. Recreate pixel-perfectly. **All copy is final — use verbatim.**

## Stack & Repo Context

Vite 7 + React 19 + TypeScript + Tailwind CSS v4 (via `@tailwindcss/vite`; tokens go in
`@theme` inside `src/index.css`). Entry: `index.html` → `src/main.tsx` → `src/App.tsx`.
Work happens on branch `feat/marketing-site` (already checked out). The existing
Coming-Soon page (`src/App.tsx`, `src/components/CountdownTimer.tsx`, `src/App.css`)
is replaced during these tasks.

## Global Constraints

- **Tailwind v4 utilities only** for styling. Design tokens declared in `@theme` in
  `src/index.css` and referenced via generated utilities (`bg-brand`, `text-muted`,
  `shadow-card`, `font-display`, …). No inline `style=` except for genuinely dynamic
  values. No CSS modules, no styled-components. Arbitrary values (`px-[26px]`) are fine
  where no token exists.
- **No new runtime dependencies.** (Test-only devDependencies are added in Task 1.)
- **Copy, colors, dimensions and SVG geometry come verbatim from the handoff files.**
  Hero jigsaw SVG paths and all feather-style icon SVGs (stroke `#0088CC`, width 1.6,
  round caps/joins) must be copied exactly from the `.dc.html` sources — do not
  substitute an icon library.
- **Design tokens** (single source of truth — declare in `@theme`):
  - Colors: `--color-brand: #0088CC` · `--color-brand-deep: #0077B3` (hover) ·
    `--color-ice: #E6F3FA` · `--color-navy: #0A192F` · `--color-sky-mist: #7CC1E8`
    (kickers/headings on navy) · `--color-ink: #22344D` (body text) ·
    `--color-muted: #5C7089` · `--color-line: #D8E7F2` (subtle border) ·
    `--color-line-strong: #AFCFE4` (input border) · `--color-dark-body: #B8C7DA`
    (body text on navy)
  - Non-token literals used as-is: dark-section card `bg-[rgba(230,243,250,.06)]`
    `border-[rgba(230,243,250,.14)]`; nav `bg-[rgba(255,255,255,.94)]`; focus ring
    `0 0 0 3px rgba(0,136,204,.35)`
  - Fonts: `--font-display: "Avenir Next", -apple-system, "Segoe UI", sans-serif` ·
    `--font-body: "Space Grotesk", "Avenir Next", sans-serif`
  - Shadow: `--shadow-card: 0 1px 2px rgba(10,25,47,.06), 0 4px 12px rgba(10,25,47,.08)`
- **Typography:** headings use `font-display`, color navy, leading 1.2 (hero 1.1);
  body uses Space Grotesk, leading 1.55. Kickers: 13px, bold **italic**, uppercase,
  tracking `.08em`, `font-display`. Hero h1: 34px mobile / `clamp(40px,5vw,56px)`
  desktop, weight 800. h2: 24px mobile / 28px desktop, weight 700. h3: 18px mobile /
  20px desktop (17px in Why-us cards desktop, 16px mobile), weight 700.
- **Cards:** 16px radius (`rounded-2xl`), `shadow-card`; services cards add 1px
  `line` border; icon chips 44×44 `rounded-xl` ice bg; step badges 36px circle brand
  bg, white bold `font-display` number.
- **Buttons** (from `.nkk-btn` in `_ds_bundle.js`): inline-flex centered, 12px radius,
  `font-body` weight 600, whitespace-nowrap, border 1.5px transparent;
  md = h-10 / px-5 / 15px; lg = h-12 / px-[26px] / 16px.
  Primary: brand bg, white text, hover `brand-deep`. Outline: transparent bg, brand
  text, brand 1.5px border, hover ice bg. Both: `active:scale-[.98]`,
  `focus-visible:` no outline + ring `0 0 0 3px rgba(0,136,204,.35)`, transition.
- **Inputs:** 6px radius (`rounded-md`), 1px `line-strong` border, white bg, 15px text
  `ink`, placeholder `muted`, padding `10px 12px`, full width; textarea min-h 96px,
  resize-y; label 13px weight 500 navy; hover/focus border brand, focus ring as above.
  (The DS bundle shows 12px-radius inputs but the handoff README states 6px — the
  README governs; use 6px for all fields including the textarea.)
- **Layout:** container `max-w-[1140px] mx-auto`, side padding 20px mobile / 24px
  desktop (`px-5 md:px-6`); section vertical padding 56px mobile / 88px desktop
  (`py-14 md:py-[88px]`). Card grids gap 20px desktop, 12–14px mobile.
- **Responsive:** mobile-first; desktop layouts switch at `md:` (768px); the services
  grid is 1-col (row-style cards) below `md`, 2-col at `md`, 4-col at `lg`.
- **Section ids / anchors:** `#top` (hero), `#services`, `#team` (Why us), `#process`,
  `#quote`. `html { scroll-behavior: smooth; scroll-padding-top: 72px }` so anchors
  clear the sticky nav. Mobile tap targets ≥ 44px.
- **Page order (App.tsx):** Nav · Hero · Services · WhyUs · Process · QuoteSection ·
  Footer.
- **Verification for every task:** `npm run build`, `npm run lint`, and `npm test`
  (vitest) all pass before committing. Commit on `feat/marketing-site`.
- Placeholder contact details (`+255 700 000 000`, `info@nkktech.co.tz`,
  "Dar es Salaam, Tanzania", `www.nkktech.co.tz`, © 2026) are intentional — keep them.

## Task 1: Foundation — assets, fonts, theme, shared primitives, test setup

**Files:** `src/index.css` (rewrite) · `index.html` (edit) · `src/components/ui/Button.tsx`
(new) · `src/components/ui/SectionHeader.tsx` (new) · `src/components/ui/icons.tsx` (new) ·
`src/components/ui/Button.test.tsx` (new) · `vite.config.ts` (edit) ·
`src/test/setup.ts` (new) · `package.json` (edit) · asset copies below.

1. **Copy assets** (with `cp`, no re-encoding):
   - `design_handoff_nkk_website/assets/logo_main.png` → `src/assets/logo_main.png`
   - `design_handoff_nkk_website/assets/logo_dark_bg.png` → `src/assets/logo_dark_bg.png`
   - `design_handoff_nkk_website/assets/icon_clear.png` → `src/assets/icon_clear.png`
   - `design_handoff_nkk_website/assets/icon_app.png` → `public/icon_app.png`
   - Fonts → `public/fonts/`: `AvenirNext-Regular.ttf`, `AvenirNext-Bold.ttf`,
     `AvenirNext-BoldItalic.ttf`, `AvenirNext-Heavy.ttf` (from
     `design_handoff_nkk_website/design-system/assets/fonts/`). Only these four weights
     are used (400 / 700 / 700-italic / 800).
2. **Rewrite `src/index.css`** (the old Coming-Soon theme is dead — replace wholesale):
   - Top of file, in this order (CSS requires `@import` before rules):
     `@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap');`
     then `@import "tailwindcss";`
   - Four `@font-face` blocks for "Avenir Next" (`/fonts/…` URLs, weights 400, 700
     normal + italic, 800, `font-display: swap`).
   - `@theme` with the tokens from Global Constraints (colors, fonts, shadow) plus
     `--animate-hero-float: heroPieceFloat 5s ease-in-out infinite` and
     `@keyframes heroPieceFloat { 0%,100% { transform: rotate(7deg) translate(0,0) }
     50% { transform: rotate(5deg) translate(-6px,8px) } }` (keyframes may live inside
     `@theme` per Tailwind v4 convention).
   - Base layer: `html { scroll-behavior: smooth; scroll-padding-top: 72px }`;
     `body` = white bg, `ink` text, `font-body`, 16px, leading 1.55, antialiased.
3. **`index.html`:** title `NKK Tech — Software, Security Systems & Hardware Supply`,
   `<meta name="description" content="NKK Tech Company Limited (Dar es Salaam) designs, builds and supports software, access control, CCTV and hardware supply — under one roof.">`,
   favicon → `/icon_app.png`.
4. **`src/components/ui/Button.tsx`:** the one shared button per Global Constraints.
   API: `variant?: 'primary' | 'outline'` (default primary), `size?: 'md' | 'lg'`
   (default md), `fullWidth?: boolean`, optional `href` — renders `<a>` when `href` is
   set, else `<button>`; spreads remaining anchor/button props; accepts `className`.
5. **`src/components/ui/SectionHeader.tsx`:** kicker + h2 + optional sub-paragraph.
   API: `kicker: string`, `title: string`, `sub?: string`, `dark?: boolean`,
   `id`-free (ids live on sections). Light: kicker brand, h2 navy, sub muted.
   Dark: kicker `sky-mist`, h2 white, sub `dark-body`. Sizes per Global Constraints.
   Layout: column, gap 8px mobile / 10px desktop, max-w 640px (680px is fine too —
   pass via className from callers who need it).
6. **`src/components/ui/icons.tsx`:** one tiny component per icon, SVG markup copied
   **verbatim** from the `.dc.html` files (viewBox 24, stroke `#0088CC` default,
   stroke-width 1.6, round caps/joins; accept `size?: number` default 22 and optional
   `stroke`): `CodeIcon`, `LockIcon`, `CctvIcon`, `PackageIcon`, `PhoneIcon`,
   `MailIcon`, `MapPinIcon`, `CheckIcon` (stroke #fff width 2 where used),
   `MenuIcon` + `CloseIcon` (24px, stroke `#0A192F`, width 1.6, round caps).
7. **Test setup:** `npm i -D vitest jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event`.
   Add `"test": "vitest run"` script. In `vite.config.ts` add a `test` block
   (`environment: 'jsdom'`, `setupFiles: './src/test/setup.ts'`, `globals: true`) —
   use `/// <reference types="vitest/config" />`. `src/test/setup.ts` imports
   `@testing-library/jest-dom/vitest`. Ensure `tsconfig.app.json` picks up vitest
   globals types (`"types": ["vitest/globals"]` in compilerOptions).
8. **TDD** the Button component (red → green): renders a `<button>` by default and an
   `<a href>` when `href` given; applies primary vs outline classes; `fullWidth` adds
   `w-full`; forwards `onClick`.
9. Old `src/App.tsx` keeps compiling against the new CSS (its Tailwind classes simply
   no longer resolve to the old theme — visual breakage of the placeholder page in
   this intermediate commit is expected and fine). Do not touch `App.tsx` in this task.

**Verify & commit:** build + lint + test green; commit
`feat: site foundation — brand theme, fonts, assets, UI primitives, test setup`.

## Task 2: Nav + Hero, new App shell, remove Coming-Soon page

**Files:** `src/components/Nav.tsx` (new) · `src/components/Nav.test.tsx` (new) ·
`src/components/Hero.tsx` (new) · `src/App.tsx` (rewrite) · delete
`src/components/CountdownTimer.tsx`, `src/App.css`, `src/assets/logo_main@4x.png`.

Source of truth: `Nav`/`Hero` sections of both `.dc.html` files (desktop lines ~27–62,
mobile lines ~27–70) and handoff README sections 1–2.

1. **`Nav.tsx`** — sticky top, z-50, `bg-[rgba(255,255,255,.94)]` + `backdrop-blur-[8px]`,
   1px bottom `line` border.
   - Inner bar: container, desktop `py-3.5` (14px) / mobile `py-2.5 px-4` per designs
     (mobile bar padding is `10px 16px`, desktop `14px 24px` — mobile overrides via
     base classes, desktop via `md:`).
   - Logo (`logo_main.png`, alt "NKK Tech") links `#top`; height 32px mobile / 38px
     desktop.
   - Desktop (`hidden md:flex`, gap 28px, 15px / weight 500): links Services `#services`,
     Why us `#team`, How we work `#process`, Contact `#quote` — `ink` text,
     hover brand, no underline; then `Button` md primary "Request a quote" → `#quote`.
   - Mobile (`md:hidden`): 44×44 hamburger button (aria-label "Menu",
     `aria-expanded`), `MenuIcon` ↔ `CloseIcon` swap on `menuOpen`. Slide-down panel
     below the bar (border-top `line`, white bg, `py-2`): the four links full-width,
     `px-5 py-3.5`, 16px / weight 500; then a `px-5 pt-2.5 pb-3` block with a
     full-width lg primary "Request a quote" Button → `#quote`. Every link/CTA tap
     closes the menu.
   - **TDD** (`Nav.test.tsx`): menu hidden initially; toggle opens it (links visible)
     and swaps to close icon; clicking a link closes it; `aria-expanded` tracks state.
2. **`Hero.tsx`** — `<header id="top">`, ice bg, overflow-hidden.
   - Container: mobile `pt-14 pb-12` (56/48) flex-col gap-5; desktop
     `md:grid md:grid-cols-[1.15fr_1fr] md:gap-14 md:items-center` with
     `md:pt-24 md:pb-[104px]` (96/104).
   - H1 per Global Constraints; "Missing Piece" wrapped in brand-colored span. Copy
     verbatim. Sub-paragraph 17px mobile / 19px desktop, `max-w-[560px]`,
     `[text-wrap:pretty]`.
   - CTAs: lg primary "Request a quote" → `#quote`; lg outline "Explore our services"
     → `#services`. Mobile stacked full-width (gap 12px); desktop side-by-side
     (gap 14px, auto width).
   - **Jigsaw motif** (aria-hidden, pointer-events-none): copy the four SVG paths
     verbatim from the design file. Desktop: wrapper `relative h-[400px]`, SVG
     340×340 absolute `left-5 bottom-6`; `icon_clear.png` absolute
     `left-[226px] bottom-[220px]` 170×170. Mobile: wrapper `h-[280px] mt-2`, SVG
     240×240 (same viewBox 340) centered via `left-1/2 -translate-x-[58%]` bottom-0;
     icon 120×120 `left-1/2 ml-3 bottom-[138px]`. Icon gets
     `drop-shadow` `0 18px 28px rgba(10,25,47,.22)` and the `animate-hero-float`
     animation (`motion-reduce:animate-none`).
3. **`App.tsx`** — rewrite: imports Nav + Hero, renders them inside a plain fragment
   or `<div>`; placeholder `<main>` comment noting Services/WhyUs/Process/Quote land
   in Tasks 3–4. Delete `CountdownTimer.tsx`, `App.css`, `logo_main@4x.png`; no
   remaining imports of them (main.tsx already only imports App + index.css).

**Verify & commit:** build + lint + test green; commit
`feat: sticky nav with mobile menu, hero with jigsaw motif; drop Coming-Soon page`.

## Task 3: Services, Why-us, and Process sections

**Files:** `src/components/Services.tsx` · `src/components/WhyUs.tsx` ·
`src/components/Process.tsx` (all new) · `src/components/sections.test.tsx` (new) ·
`src/App.tsx` (wire in).

Source of truth: sections 3–5 of the handoff README and the corresponding markup in
both `.dc.html` files. All headings/body copy verbatim from there.

1. **`Services.tsx`** — `<section id="services">`, white bg. SectionHeader: kicker
   "What we do" (uppercased by styling), title "Four services. One accountable
   partner.", sub — note the sub is **shorter on mobile** in the design; use the
   desktop sentence at all sizes (decision: single source of copy, the extra clause
   costs nothing on mobile). Grid: gap-3.5 `md:gap-5`; 1-col → `md:grid-cols-2` →
   `lg:grid-cols-4`. Card data as a typed array `{ icon, title, body }` with the four
   services (icons: CodeIcon, LockIcon, CctvIcon, PackageIcon). Card: white bg, 1px
   `line` border, rounded-2xl, shadow-card, p-5 `md:p-6`; layout row (chip left,
   items-start, gap-4) below `md`, column (gap-3.5) at `md:`+. Chip: 44×44 rounded-xl
   ice, centered icon. h3 18px `md:text-xl`; body 15px muted.
2. **`WhyUs.tsx`** — `<section id="team">`, navy bg. SectionHeader dark: kicker "Why
   NKK Tech", title "A new company. A seasoned team.", sub (desktop copy verbatim,
   `max-w-[680px]`). Cards: 1-col gap-3 → `md:grid-cols-3 md:gap-5`;
   `bg-[rgba(230,243,250,.06)] border border-[rgba(230,243,250,.14)]` rounded-2xl
   p-5 `md:p-6`; h3 white 16px `md:text-[17px]`; body `dark-body` 14px `md:text-[15px]`.
   Three cards verbatim from README §4.
3. **`Process.tsx`** — `<section id="process">`, ice bg. SectionHeader: "How we work" /
   "Three steps, no surprises." (no sub). Cards: 1-col gap-3 → `md:grid-cols-3 md:gap-5`;
   white, rounded-2xl, shadow-card, **no border**, p-5 `md:p-6`; mobile row layout
   (badge left, gap-4), desktop column (gap-3). Badge: 36px circle, brand bg, white,
   `font-display` bold, centered number. Steps 1/2/3 verbatim from README §5.
4. Wire all three into `App.tsx` between Hero and the future quote section.
5. **Tests** (`sections.test.tsx`): render each section; assert section ids, the four
   service titles, the three why-us card headings, and the three step names exist.
   (Smoke-level is deliberate — these are static sections.)

**Verify & commit:** build + lint + test green; commit
`feat: services, why-us and process sections`.

## Task 4: Quote form, footer, final wiring & cleanup

**Files:** `src/components/QuoteSection.tsx` (new) · `src/components/QuoteSection.test.tsx`
(new) · `src/components/Footer.tsx` (new) · `src/App.tsx` (wire in) · `package.json`
(remove `lucide-react`).

Source of truth: sections 6–7 of the handoff README and corresponding `.dc.html` markup.

1. **`QuoteSection.tsx`** — `<section id="quote">`, white bg. Container: flex-col
   gap-6 mobile; `md:grid md:grid-cols-[1fr_1.1fr] md:gap-14 md:items-start`.
   - **Intro column:** SectionHeader "Get in touch" / "Tell us about your project" /
     sub (desktop copy verbatim). Desktop-only (`hidden md:flex`) contact rows under
     it (gap-3, mt-2, 15px): PhoneIcon(18) + `+255 700 000 000`, MailIcon(18) +
     `info@nkktech.co.tz`, MapPinIcon(18) + `Dar es Salaam, Tanzania` — plain rows.
   - **Form card:** ice bg (`--color-ice` = surface-tint), rounded-2xl, p-5 `md:p-8`,
     flex-col gap-3.5 `md:gap-4`.
     - Local `Field` sub-component (label + input, per input constraints) is fine —
       it is only used here.
     - Fields: "Your name" (placeholder "Full name") · "Company / organisation"
       ("Company name") · "Email" (type email, "you@company.co.tz") · "Phone"
       ("+255 …") · textarea "What do you need?" (placeholder
       "e.g. CCTV for a 3-floor office, or a custom booking system…"). Desktop:
       name+company on one 2-col row, email+phone on a second (`md:grid-cols-2`
       gap-4); mobile all stacked.
     - Submit: full-width lg primary "Send request", `type="submit"` on a real
       `<form>` (noValidate; validation is ours).
     - **Validation on submit:** require name, message, and at least one of
       email/phone; if email is present it must match a basic email shape. On
       failure show a single error line inside the card (13px, `#D64545`), e.g.
       "Please add your name, what you need, and an email or phone number." —
       and do not flip to success.
     - **Success state** replaces the card contents: 44px brand circle with
       CheckIcon (white, stroke-width 2), h3 "Request received", muted 15px
       "Thank you — we'll reply within one business day." (Client-side only; the
       README's real-backend wiring is explicitly out of scope for this site today.)
   - **Mobile contact links** (`md:hidden`) below the card: `tel:+255700000000`,
     `mailto:info@nkktech.co.tz`, address span — rows gap-2.5, 15px, min-h-11,
     icon + text, `ink` text, no underline.
   - **TDD** (`QuoteSection.test.tsx`): submit empty → error shown, no success;
     name+message+phone → success state, form gone; name+message+bad email, no
     phone → error; success card shows the exact heading "Request received".
2. **`Footer.tsx`** — navy bg, ends with `<div class="h-2 bg-brand">` (8px strip).
   - Container `pt-10 md:pt-14 pb-7 md:pb-10`. Blocks:
     - Brand: `logo_dark_bg.png` h-[30px] `md:h-[34px]`, blurb (13px `dark-body`,
       `max-w-[280px]` desktop): "The Missing Piece in Your Digital Transformation —
       software, security systems and hardware supply under one roof."
     - Link columns — heading style: `font-display` bold italic uppercase 13px
       tracking-[.08em] `sky-mist`; links 14px `dark-body` hover:white no underline,
       `min-h-8 flex items-center` on mobile. **Services** (→ `#services`): Software
       projects · Access control · CCTV & surveillance · Hardware supply & tendering
       (mobile design shortens the last to "Hardware supply"; use the full desktop
       label everywhere — single copy source). **Company:** Why us `#team` · How we
      work `#process` · Request a quote `#quote`. **Contact** (desktop-only column,
       `hidden md:flex`): tel/mailto links + address span.
     - Desktop grid `md:grid-cols-[1.4fr_1fr_1fr_1fr] md:gap-10`; mobile: brand block,
       then 2-col grid (Services/Company) gap-7.
   - Bottom bar above the blue strip, hairline top border `rgba(230,243,250,.14)`:
     desktop flex row justify-between — "© 2026 NKK Tech Company Limited" (13px
     `dark-body`) left, `www.nkktech.co.tz` (15px white `font-display` bold italic)
     right. Mobile: stacked (domain first, then "© 2026 NKK Tech Company Limited ·
     Dar es Salaam, Tanzania" 11px) per mobile design.
3. Wire QuoteSection + Footer into `App.tsx` (final page order per Global
   Constraints). Remove the now-unused `lucide-react` dependency
   (`npm uninstall lucide-react`); grep to confirm no imports remain.

**Verify & commit:** build + lint + test green; commit
`feat: quote form with success state, footer; complete page`.
