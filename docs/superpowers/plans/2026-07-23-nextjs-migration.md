# Next.js Migration + SEO Layer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate the NKK Tech one-page marketing site from Vite + React SPA to Next.js App Router with full build-time prerendering, complete SEO layer (metadata, OG image, JSON-LD, robots, sitemap), self-hosted fonts via `next/font`, real contact details, and a working quote form via Mailtrap.

**Architecture:** In-place migration on branch `feat/nextjs-migration`. App Router lives at `src/app/`; existing `src/components/` stay put. The page is fully static (SSG); the only server code is one server action for the quote form. Vitest + Testing Library remain the test runner (via a new `vitest.config.ts`, since `vite.config.ts` goes away).

**Tech Stack:** Next.js 16 (App Router), TypeScript, React 19, Tailwind CSS v4 via `@tailwindcss/postcss`, Vitest + jsdom, Mailtrap Send API, Vercel.

**Spec:** `docs/superpowers/specs/2026-07-23-nextjs-migration-design.md`

## Global Constraints

- TypeScript everywhere; no `.js`/`.jsx` source files.
- Site constants come from `src/lib/site.ts` (created in Task 1) — never hardcode the URL, phone, or email in components.
- Exact copy values: phone display `+255 746 800 951`, phone href `tel:+255746800951`, E.164 `+255746800951`, email `info@nkktech.co.tz`, location `Mikocheni, Dar es Salaam, Tanzania`, canonical URL `https://nkktech.co.tz`.
- Title (unchanged): `NKK Tech — Software, Security Systems & Hardware Supply`. Description (unchanged): `NKK Tech Company Limited (Dar es Salaam) designs, builds and supports software, access control, CCTV and hardware supply — under one roof.`
- All existing tests must keep passing after every task. `npm test` and `npm run build` are the gates.
- Prerender visibility rule: server-rendered HTML must never contain a hidden-state class on revealed content; hidden state is gated behind the `html.js` class added by an inline script.
- Commit at the end of every task with a conventional-commit message.
- Trailer on every commit: `Co-Authored-By: Claude <model per implementer>`.

## Parallel Execution Batches

Tasks within a batch touch disjoint files and may run in parallel. Batches are sequential.

- **Batch A:** Task 1 (scaffold — everything depends on it)
- **Batch B:** Task 2 (fonts), Task 3 (robots/sitemap/OG image), Task 4 (contact details)
- **Batch C:** Task 5 (Reveal prerender visibility), Task 6 (quote form server action)
- **Batch D:** Task 7 (metadata + JSON-LD)
- **Batch E:** Task 8 (build verification + Vercel deploy — main loop, not a subagent)

File-conflict rationale: `src/app/layout.tsx` is touched by Tasks 2, 5, 7 (separate batches). `src/app/globals.css` by Tasks 2, 5. `QuoteSection.tsx` by Tasks 4, 6.

---

### Task 1: Scaffold swap — Vite out, Next.js in

**Files:**
- Create: `next.config.ts`, `postcss.config.mjs`, `vitest.config.ts`, `src/app/layout.tsx`, `src/app/page.tsx`, `src/lib/site.ts`, `src/test/imageMock.ts`
- Move: `src/index.css` → `src/app/globals.css` (content unchanged in this task)
- Modify: `package.json`, `tsconfig.json`, `eslint.config.js`, `.gitignore`, `src/components/Nav.tsx`, `src/components/Footer.tsx`, `src/components/Hero.tsx`, `src/components/QuoteSection.tsx`, `src/components/ui/Reveal.tsx`
- Delete: `index.html`, `vite.config.ts`, `src/main.tsx`, `src/App.tsx`, `tsconfig.app.json`, `tsconfig.node.json`

**Interfaces:**
- Produces: `src/lib/site.ts` exporting `SITE_URL`, `SITE_NAME`, `SITE_TITLE`, `SITE_DESCRIPTION`, `CONTACT` (shape below) — later tasks import these with the `@/` alias (`@/lib/site`).
- Produces: `src/app/layout.tsx` and `src/app/page.tsx` that Tasks 2, 5, 7 modify.
- Produces: working `npm test` (vitest) and `npm run build` (next build).

- [ ] **Step 1: Baseline — confirm existing tests pass**

Run: `npm test`
Expected: all suites pass. If not, STOP and report; do not migrate on a red baseline.

- [ ] **Step 2: Swap dependencies**

```bash
npm uninstall @tailwindcss/vite
npm install next@^16.0.0
npm install -D @tailwindcss/postcss
```

Then edit `package.json` scripts to:

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint .",
  "preview": "next start",
  "test": "vitest run"
}
```

(`vite` and `@vitejs/plugin-react` stay in devDependencies — vitest uses them.)

- [ ] **Step 3: Create Next config files**

`next.config.ts`:

```ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {}

export default nextConfig
```

`postcss.config.mjs`:

```js
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}
```

- [ ] **Step 4: Replace the three tsconfig files with one Next-style tsconfig**

Delete `tsconfig.app.json` and `tsconfig.node.json`. Replace `tsconfig.json` entirely with:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["DOM", "DOM.Iterable", "ESNext"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "types": ["vitest/globals"],
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 5: Create vitest.config.ts (replaces vite.config.ts test block)**

```ts
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: '@', replacement: fileURLToPath(new URL('./src', import.meta.url)) },
      {
        find: /\.(png|jpe?g|gif|webp|avif)$/,
        replacement: fileURLToPath(new URL('./src/test/imageMock.ts', import.meta.url)),
      },
    ],
  },
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    globals: true,
  },
})
```

`src/test/imageMock.ts` (mimics Next's `StaticImageData` for image imports in tests):

```ts
const imageMock = { src: '/mock-image.png', width: 100, height: 100, blurDataURL: undefined }
export default imageMock
```

- [ ] **Step 6: Create src/lib/site.ts**

```ts
export const SITE_URL = 'https://nkktech.co.tz'
export const SITE_NAME = 'NKK Tech Company Limited'
export const SITE_TITLE = 'NKK Tech — Software, Security Systems & Hardware Supply'
export const SITE_DESCRIPTION =
  'NKK Tech Company Limited (Dar es Salaam) designs, builds and supports software, access control, CCTV and hardware supply — under one roof.'

export const CONTACT = {
  email: 'info@nkktech.co.tz',
  phone: '+255746800951',
  phoneDisplay: '+255 746 800 951',
  phoneHref: 'tel:+255746800951',
  location: 'Mikocheni, Dar es Salaam, Tanzania',
} as const
```

- [ ] **Step 7: Create the App Router shell**

`git mv src/index.css src/app/globals.css` (create `src/app/` first; CSS content unchanged in this task).

`src/app/layout.tsx`:

```tsx
import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { SITE_TITLE, SITE_DESCRIPTION } from '@/lib/site'
import './globals.css'

export const metadata: Metadata = {
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  icons: { icon: '/icon_app.png' },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

`src/app/page.tsx` (replaces `src/App.tsx`):

```tsx
import { Nav } from '@/components/Nav'
import { Hero } from '@/components/Hero'
import { Services } from '@/components/Services'
import { WhyUs } from '@/components/WhyUs'
import { Process } from '@/components/Process'
import { QuoteSection } from '@/components/QuoteSection'
import { Footer } from '@/components/Footer'

export default function Page() {
  return (
    <>
      <Nav />
      <Hero />
      <Services />
      <WhyUs />
      <Process />
      <QuoteSection />
      <Footer />
    </>
  )
}
```

Delete `index.html`, `vite.config.ts`, `src/main.tsx`, `src/App.tsx`. If `src/vite-env.d.ts` exists, delete it too.

- [ ] **Step 8: Mark client components and fix image imports**

Add `'use client'` as the first line of exactly these three files:
- `src/components/Nav.tsx` (useState/useEffect)
- `src/components/QuoteSection.tsx` (useState/useId)
- `src/components/ui/Reveal.tsx` (hooks)

Next's static image imports return `StaticImageData` objects, not URL strings. Update the three `<img>` usages to use `.src`:

- `src/components/Nav.tsx` line ~35: `<img src={logoMain.src} alt="NKK Tech" ...>`
- `src/components/Footer.tsx` line ~34: `<img src={logoDarkBg.src} alt="NKK Tech" ...>`
- `src/components/Hero.tsx` line ~50: `<img src={iconClear.src} alt="" ...>`

(Plain `<img>` is deliberate — the logos are ≤28KB PNGs; `next/image` buys nothing here and complicates jsdom tests.)

- [ ] **Step 9: Update ESLint config and .gitignore**

`eslint.config.js` — remove the `eslint-plugin-react-refresh` import and its `reactRefresh.configs.vite` entry (Vite-only plugin), and ignore Next artifacts:

```js
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', '.next', 'next-env.d.ts']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
])
```

Run `npm uninstall eslint-plugin-react-refresh`.

`.gitignore` — add:

```
.next/
.vercel
.env*.local
```

- [ ] **Step 10: Run tests**

Run: `npm test`
Expected: all existing suites pass unchanged (components don't know they moved runtimes).

- [ ] **Step 11: Build and verify prerendered HTML**

Run: `npm run build`
Expected: build succeeds, route `/` listed as static (`○`).

Run: `grep -c "Missing Piece" .next/server/app/index.html && grep -c "Request a quote" .next/server/app/index.html`
Expected: both counts ≥ 1 — the full page content is in the prerendered HTML.

- [ ] **Step 12: Lint, then commit**

Run: `npm run lint`
Expected: clean.

```bash
git add -A
git commit -m "feat: migrate Vite SPA to Next.js App Router with static prerendering"
```

---

### Task 2: Fonts via next/font (kills the render-blocking @import chain)

**Files:**
- Create: `src/fonts/AvenirNext-Regular.woff2`, `src/fonts/AvenirNext-Bold.woff2`, `src/fonts/AvenirNext-BoldItalic.woff2`, `src/fonts/AvenirNext-Heavy.woff2` (converted from `public/fonts/*.ttf`)
- Modify: `src/app/layout.tsx`, `src/app/globals.css`, `package.json` (temporary dev dep)
- Delete: `public/fonts/` (all four TTFs)

**Interfaces:**
- Consumes: `src/app/layout.tsx` from Task 1.
- Produces: CSS variables `--font-avenir-next` and `--font-space-grotesk` on `<html>`; `--font-display`/`--font-body` theme tokens now reference them. No other task depends on the specifics.

- [ ] **Step 1: Convert TTFs to WOFF2**

```bash
npm install -D ttf2woff2
mkdir -p src/fonts
for f in Regular Bold BoldItalic Heavy; do
  node -e "const t=require('ttf2woff2'),fs=require('fs');fs.writeFileSync('src/fonts/AvenirNext-$f.woff2', t(fs.readFileSync('public/fonts/AvenirNext-$f.ttf')))"
done
ls -la src/fonts
npm uninstall ttf2woff2
```

Expected: four `.woff2` files, each meaningfully smaller than its `.ttf` source (roughly 30–50% of original size). If any file is 0 bytes, STOP — do not delete the TTFs.

- [ ] **Step 2: Wire next/font in layout.tsx**

Add to `src/app/layout.tsx` (imports at top, font definitions above `metadata`, className on `<html>`):

```tsx
import localFont from 'next/font/local'
import { Space_Grotesk } from 'next/font/google'

const avenirNext = localFont({
  src: [
    { path: '../fonts/AvenirNext-Regular.woff2', weight: '400', style: 'normal' },
    { path: '../fonts/AvenirNext-Bold.woff2', weight: '700', style: 'normal' },
    { path: '../fonts/AvenirNext-BoldItalic.woff2', weight: '700', style: 'italic' },
    { path: '../fonts/AvenirNext-Heavy.woff2', weight: '800', style: 'normal' },
  ],
  variable: '--font-avenir-next',
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
})
```

Change the `<html>` tag to:

```tsx
<html lang="en" className={`${avenirNext.variable} ${spaceGrotesk.variable}`}>
```

- [ ] **Step 3: Update globals.css**

Delete from `src/app/globals.css`:
- The line `@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap');`
- All four `@font-face { font-family: "Avenir Next"; ... }` blocks.

In the `@theme` block, replace the two font tokens with:

```css
--font-display: var(--font-avenir-next), -apple-system, "Segoe UI", sans-serif;
--font-body: var(--font-space-grotesk), var(--font-avenir-next), sans-serif;
```

Then delete the now-unused TTFs: `git rm -r public/fonts`

- [ ] **Step 4: Verify build and no external font requests**

Run: `npm run build`
Expected: success.

Run: `grep -o "fonts.googleapis.com" .next/server/app/index.html | head -1`
Expected: no output (Google Fonts CSS is gone; next/font self-hosts). Also check `grep -c "preload" .next/server/app/index.html` ≥ 1 (font preload links present).

Run: `npm test`
Expected: all pass.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: self-host fonts via next/font, drop render-blocking Google Fonts import"
```

---

### Task 3: robots.ts, sitemap.ts, opengraph-image.tsx

**Files:**
- Create: `src/app/robots.ts`, `src/app/sitemap.ts`, `src/app/opengraph-image.tsx`

**Interfaces:**
- Consumes: `SITE_URL`, `SITE_TITLE` from `@/lib/site` (Task 1).
- Produces: `/robots.txt`, `/sitemap.xml`, `/opengraph-image` routes. Task 7's metadata relies on the OG image file convention auto-attaching `og:image` — nothing to import.

- [ ] **Step 1: robots.ts**

```ts
import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
```

- [ ] **Step 2: sitemap.ts**

```ts
import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
  ]
}
```

- [ ] **Step 3: opengraph-image.tsx**

Brand palette: navy `#0A192F`, brand blue `#0088CC`, sky mist `#7CC1E8`, dark body `#B8C7DA`.

```tsx
import { ImageResponse } from 'next/og'

export const alt = 'NKK Tech — Software, Security Systems & Hardware Supply'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#0A192F',
          padding: 80,
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 68, fontWeight: 800, color: '#ffffff' }}>NKK Tech</div>
          <div style={{ fontSize: 42, color: '#7CC1E8', marginTop: 28, maxWidth: 950, lineHeight: 1.2 }}>
            The Missing Piece in Your Digital Transformation
          </div>
          <div style={{ fontSize: 28, color: '#B8C7DA', marginTop: 28 }}>
            Software · Access control · CCTV · Hardware supply
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 26, color: '#ffffff' }}>nkktech.co.tz</div>
          <div style={{ width: 220, height: 12, backgroundColor: '#0088CC', borderRadius: 6 }} />
        </div>
      </div>
    ),
    size,
  )
}
```

- [ ] **Step 4: Verify the three routes build**

Run: `npm run build`
Expected: build output lists `/robots.txt`, `/sitemap.xml`, `/opengraph-image` as static routes (`○`).

- [ ] **Step 5: Commit**

```bash
git add src/app/robots.ts src/app/sitemap.ts src/app/opengraph-image.tsx
git commit -m "feat: add robots.txt, sitemap.xml and generated Open Graph image"
```

---

### Task 4: Real contact details in Footer and QuoteSection

**Files:**
- Modify: `src/components/Footer.tsx`, `src/components/QuoteSection.tsx`

**Interfaces:**
- Consumes: `CONTACT` from `@/lib/site` (Task 1). Use `CONTACT.phoneHref`, `CONTACT.phoneDisplay`, `CONTACT.email`, `CONTACT.location` — no literals.

- [ ] **Step 1: Footer.tsx**

Add `import { CONTACT } from '@/lib/site'`. In the Contact column replace:

- `href="tel:+255700000000"` → `href={CONTACT.phoneHref}`
- text `+255 700 000 000` → `{CONTACT.phoneDisplay}`
- `href="mailto:info@nkktech.co.tz"` → `` href={`mailto:${CONTACT.email}`} `` and text → `{CONTACT.email}`
- location line `Dar es Salaam, Tanzania` → `{CONTACT.location}`

The mobile copyright line becomes `© 2026 NKK Tech Company Limited · Mikocheni, Dar es Salaam` (desktop copyright unchanged).

- [ ] **Step 2: QuoteSection.tsx**

Add `import { CONTACT } from '@/lib/site'`. Two contact blocks (desktop `hidden md:flex` block and mobile `md:hidden` block):

- `+255 700 000 000` → `{CONTACT.phoneDisplay}` (both blocks)
- `href="tel:+255700000000"` → `href={CONTACT.phoneHref}`
- `info@nkktech.co.tz` display text → `{CONTACT.email}`; `href="mailto:info@nkktech.co.tz"` → `` href={`mailto:${CONTACT.email}`} ``
- `Dar es Salaam, Tanzania` → `{CONTACT.location}` (both blocks)

- [ ] **Step 3: Verify**

Run: `npm test`
Expected: all pass (no test asserts the old placeholder number).

Run: `grep -rn "255 700 000 000\|tel:+255700000000" src/`
Expected: no matches.

- [ ] **Step 4: Commit**

```bash
git add src/components/Footer.tsx src/components/QuoteSection.tsx
git commit -m "fix: real phone number and Mikocheni location replace placeholders"
```

---

### Task 5: Reveal prerender visibility (no hidden content in static HTML)

**Files:**
- Modify: `src/components/ui/Reveal.tsx`, `src/components/ui/Reveal.test.tsx`, `src/app/globals.css`, `src/app/layout.tsx`

**Interfaces:**
- Consumes: layout.tsx as left by Task 2 (fonts present).
- Produces: `html.js` class convention — hidden reveal state only applies under `html.js`. Server markup renders `class="reveal"` (never `is-visible`, never hidden).

**Problem being fixed:** `useReveal` currently initializes `visible` to `true` when `IntersectionObserver` is undefined — which is the case during SSR, so the server would render `is-visible` while the client's first render (IO exists) renders without it → hydration mismatch. Also `.reveal { opacity: 0 }` would hide content in the static HTML for no-JS consumers.

- [ ] **Step 1: Write the failing SSR test**

Append to `src/components/ui/Reveal.test.tsx`:

```tsx
import { renderToString } from 'react-dom/server'

describe('Reveal SSR', () => {
  it('server markup is plain reveal — visible content, no is-visible, no hidden state', () => {
    const html = renderToString(<Reveal>ssr content</Reveal>)
    expect(html).toContain('ssr content')
    expect(html).toContain('class="reveal"')
    expect(html).not.toContain('is-visible')
  })
})
```

(Place the import at the top of the file with the other imports.)

- [ ] **Step 2: Run it — expect FAIL**

Run: `npx vitest run src/components/ui/Reveal.test.tsx`
Expected: the new test FAILS — `renderToString` runs in jsdom where the IO mock exists… so it may PASS locally while failing in real SSR (node, no IO). To model real SSR, the test must delete the IO global first. Use this version instead:

```tsx
import { renderToString } from 'react-dom/server'

describe('Reveal SSR', () => {
  it('server markup is plain reveal — visible content, no is-visible, no hidden state', () => {
    const original = globalThis.IntersectionObserver
    // @ts-expect-error simulating a server environment without IntersectionObserver
    delete globalThis.IntersectionObserver
    try {
      const html = renderToString(<Reveal>ssr content</Reveal>)
      expect(html).toContain('ssr content')
      expect(html).toContain('class="reveal"')
      expect(html).not.toContain('is-visible')
    } finally {
      globalThis.IntersectionObserver = original
    }
  })
})
```

Expected: FAILS on `not.toContain('is-visible')` — current code renders `reveal is-visible` when IO is absent.

- [ ] **Step 3: Fix useReveal**

In `src/components/ui/Reveal.tsx`, change the state initialization and move the no-IO fallback into the effect:

```tsx
function useReveal() {
  const ref = useRef<HTMLElement | null>(null)
  // Always start hidden-state-off so server and client first render agree.
  // The no-IntersectionObserver fallback lives in the effect (client-only),
  // so SSR markup never carries is-visible.
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true)
      return
    }
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true)
            observer.unobserve(entry.target)
            observer.disconnect()
            break
          }
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' },
    )
    observer.observe(el)

    return () => observer.disconnect()
  }, [])

  return { ref, visible }
}
```

The existing test `'is visible immediately when IntersectionObserver is unavailable'` still passes (RTL flushes effects).

- [ ] **Step 4: Gate hidden state behind html.js in globals.css**

In `src/app/globals.css`, replace the `.reveal` component rules:

```css
.reveal {
  transition:
    opacity 650ms var(--ease-out-soft),
    transform 650ms var(--ease-out-soft);
}

/* Hidden state exists only when JS is running (html.js is set by an inline
   script before paint). Static HTML, crawlers and no-JS users always see
   content. */
html.js .reveal:not(.is-visible) {
  opacity: 0;
  transform: translateY(20px);
}

html.js .reveal:not(.is-visible) .badge-pop {
  opacity: 0;
}

.reveal.is-visible .badge-pop {
  animation: popIn 400ms var(--ease-spring) 200ms both;
}
```

(Delete the old `.reveal { opacity: 0; ... }`, `.reveal.is-visible { ... }`, and `.reveal:not(.is-visible) .badge-pop { ... }` rules — the `.reveal.is-visible .badge-pop` rule is kept as shown.)

Update the reduced-motion guard (specificity must beat `html.js .reveal:not(.is-visible)`):

```css
@media (prefers-reduced-motion: reduce) {
  .reveal,
  html.js .reveal:not(.is-visible) {
    opacity: 1;
    transform: none;
    transition: none;
  }

  .motion-safe-anim {
    animation: none !important;
  }

  .badge-pop {
    opacity: 1 !important;
    animation: none !important;
  }
}
```

- [ ] **Step 5: Add the js-flag inline script to layout.tsx**

In `src/app/layout.tsx`, add `suppressHydrationWarning` to `<html>` (an external script mutates its class before hydration — the next-themes pattern) and the script as the first child of `<body>`:

```tsx
<html
  lang="en"
  suppressHydrationWarning
  className={`${avenirNext.variable} ${spaceGrotesk.variable}`}
>
  <body>
    <script
      dangerouslySetInnerHTML={{
        __html: "document.documentElement.classList.add('js')",
      }}
    />
    {children}
  </body>
</html>
```

- [ ] **Step 6: Run the full suite**

Run: `npm test`
Expected: all pass, including the new SSR test and all pre-existing Reveal tests.

- [ ] **Step 7: Verify prerendered output has no hidden content**

Run: `npm run build && grep -c "is-visible" .next/server/app/index.html`
Expected: `0` matches (grep exits 1). Also `grep -c "classList.add('js')" .next/server/app/index.html` → ≥ 1.

- [ ] **Step 8: Commit**

```bash
git add src/components/ui/Reveal.tsx src/components/ui/Reveal.test.tsx src/app/globals.css src/app/layout.tsx
git commit -m "fix: reveal animations never hide content in prerendered HTML"
```

---

### Task 6: Quote form server action → Mailtrap

**Files:**
- Create: `src/app/actions/quote.ts`, `src/app/actions/quote.test.ts`
- Modify: `src/components/QuoteSection.tsx`, `src/components/QuoteSection.test.tsx`

**Interfaces:**
- Consumes: `CONTACT` from `@/lib/site`; QuoteSection as left by Task 4.
- Produces: `sendQuoteRequest(input: QuoteRequestInput): Promise<{ ok: boolean }>` from `@/app/actions/quote`, with `type QuoteRequestInput = { name: string; company: string; email: string; phone: string; message: string; website: string }` (`website` is the honeypot).

**Env contract:** `MAILTRAP_TOKEN` (secret, required in prod). `MAILTRAP_SANDBOX_INBOX_ID` — when set, the action posts to the sandbox API instead of production send. Missing token → action returns `{ ok: false }` (never throws to the client).

- [ ] **Step 1: Write failing tests for the action**

`src/app/actions/quote.test.ts`:

```ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { sendQuoteRequest } from './quote'

const validInput = {
  name: 'Ada Lovelace',
  company: 'Analytical Engines Ltd',
  email: 'ada@example.co.tz',
  phone: '+255 700 111 222',
  message: 'A booking system',
  website: '',
}

function mockFetch(ok = true) {
  const fn = vi.fn().mockResolvedValue({ ok, status: ok ? 200 : 500 })
  vi.stubGlobal('fetch', fn)
  return fn
}

beforeEach(() => {
  vi.stubEnv('MAILTRAP_TOKEN', 'test-token')
  vi.stubEnv('MAILTRAP_SANDBOX_INBOX_ID', '')
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.unstubAllEnvs()
})

describe('sendQuoteRequest', () => {
  it('rejects when name is missing and does not call Mailtrap', async () => {
    const fetch = mockFetch()
    const result = await sendQuoteRequest({ ...validInput, name: '' })
    expect(result).toEqual({ ok: false })
    expect(fetch).not.toHaveBeenCalled()
  })

  it('rejects when message is missing', async () => {
    const fetch = mockFetch()
    const result = await sendQuoteRequest({ ...validInput, message: '  ' })
    expect(result).toEqual({ ok: false })
    expect(fetch).not.toHaveBeenCalled()
  })

  it('rejects when neither email nor phone is given', async () => {
    const fetch = mockFetch()
    const result = await sendQuoteRequest({ ...validInput, email: '', phone: '' })
    expect(result).toEqual({ ok: false })
    expect(fetch).not.toHaveBeenCalled()
  })

  it('rejects a malformed email when no phone is given', async () => {
    const fetch = mockFetch()
    const result = await sendQuoteRequest({
      ...validInput,
      email: 'not-an-email',
      phone: '',
    })
    expect(result).toEqual({ ok: false })
    expect(fetch).not.toHaveBeenCalled()
  })

  it('silently accepts honeypot submissions without sending', async () => {
    const fetch = mockFetch()
    const result = await sendQuoteRequest({ ...validInput, website: 'http://spam.example' })
    expect(result).toEqual({ ok: true })
    expect(fetch).not.toHaveBeenCalled()
  })

  it('sends a correctly shaped Mailtrap payload to production API', async () => {
    const fetch = mockFetch()
    const result = await sendQuoteRequest(validInput)
    expect(result).toEqual({ ok: true })
    expect(fetch).toHaveBeenCalledTimes(1)

    const [url, init] = fetch.mock.calls[0]
    expect(url).toBe('https://send.api.mailtrap.io/api/send')
    expect(init.method).toBe('POST')
    expect(init.headers).toMatchObject({
      Authorization: 'Bearer test-token',
      'Content-Type': 'application/json',
    })
    const body = JSON.parse(init.body)
    expect(body.to).toEqual([{ email: 'info@nkktech.co.tz' }])
    expect(body.from.email).toBe('website@nkktech.co.tz')
    expect(body.reply_to).toEqual({ email: 'ada@example.co.tz' })
    expect(body.subject).toContain('Ada Lovelace')
    expect(body.text).toContain('A booking system')
    expect(body.text).toContain('+255 700 111 222')
    expect(body.text).toContain('Analytical Engines Ltd')
  })

  it('uses the sandbox API when MAILTRAP_SANDBOX_INBOX_ID is set', async () => {
    vi.stubEnv('MAILTRAP_SANDBOX_INBOX_ID', '3752148')
    const fetch = mockFetch()
    await sendQuoteRequest(validInput)
    expect(fetch.mock.calls[0][0]).toBe(
      'https://sandbox.api.mailtrap.io/api/send/3752148',
    )
  })

  it('returns ok: false when Mailtrap responds non-2xx', async () => {
    mockFetch(false)
    const result = await sendQuoteRequest(validInput)
    expect(result).toEqual({ ok: false })
  })

  it('returns ok: false when fetch throws', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network down')))
    const result = await sendQuoteRequest(validInput)
    expect(result).toEqual({ ok: false })
  })

  it('returns ok: false without calling fetch when MAILTRAP_TOKEN is unset', async () => {
    vi.stubEnv('MAILTRAP_TOKEN', '')
    const fetch = mockFetch()
    const result = await sendQuoteRequest(validInput)
    expect(result).toEqual({ ok: false })
    expect(fetch).not.toHaveBeenCalled()
  })
})
```

- [ ] **Step 2: Run — expect FAIL (module doesn't exist)**

Run: `npx vitest run src/app/actions/quote.test.ts`
Expected: FAIL — cannot resolve `./quote`.

- [ ] **Step 3: Implement the action**

`src/app/actions/quote.ts`:

```ts
'use server'

import { CONTACT } from '@/lib/site'

export type QuoteRequestInput = {
  name: string
  company: string
  email: string
  phone: string
  message: string
  /** Honeypot — humans never fill this. */
  website: string
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export async function sendQuoteRequest(
  input: QuoteRequestInput,
): Promise<{ ok: boolean }> {
  const name = input.name.trim()
  const company = input.company.trim()
  const email = input.email.trim()
  const phone = input.phone.trim()
  const message = input.message.trim()

  // Honeypot: pretend success, send nothing.
  if (input.website.trim() !== '') return { ok: true }

  const hasContact = email !== '' || phone !== ''
  const emailOk = email === '' || isValidEmail(email)
  if (!name || !message || !hasContact || !emailOk) return { ok: false }

  const token = process.env.MAILTRAP_TOKEN
  if (!token) {
    console.error('sendQuoteRequest: MAILTRAP_TOKEN is not set')
    return { ok: false }
  }

  const sandboxInboxId = process.env.MAILTRAP_SANDBOX_INBOX_ID
  const endpoint = sandboxInboxId
    ? `https://sandbox.api.mailtrap.io/api/send/${sandboxInboxId}`
    : 'https://send.api.mailtrap.io/api/send'

  const lines = [
    `Name: ${name}`,
    company && `Company: ${company}`,
    email && `Email: ${email}`,
    phone && `Phone: ${phone}`,
    '',
    message,
  ].filter((line): line is string => line !== false)

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: { email: 'website@nkktech.co.tz', name: 'NKK Tech Website' },
        to: [{ email: CONTACT.email }],
        ...(email ? { reply_to: { email } } : {}),
        subject: `Quote request — ${name}`,
        text: lines.join('\n'),
        category: 'quote-request',
      }),
    })
    if (!res.ok) {
      console.error(`sendQuoteRequest: Mailtrap responded ${res.status}`)
      return { ok: false }
    }
    return { ok: true }
  } catch (error) {
    console.error('sendQuoteRequest: request failed', error)
    return { ok: false }
  }
}
```

- [ ] **Step 4: Run action tests — expect PASS**

Run: `npx vitest run src/app/actions/quote.test.ts`
Expected: all PASS.

- [ ] **Step 5: Wire QuoteSection to the action**

In `src/components/QuoteSection.tsx`:

Add import: `import { sendQuoteRequest } from '@/app/actions/quote'`

Add a server-error message constant next to `ERROR_MESSAGE`:

```ts
const SEND_ERROR_MESSAGE =
  'Something went wrong sending your request. Please try again, or email us directly.'
```

Replace the state and `handleSubmit` with:

```tsx
const [sent, setSent] = useState(false)
const [sending, setSending] = useState(false)
const [error, setError] = useState<'validation' | 'send' | null>(null)
const [errorCount, setErrorCount] = useState(0)

async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault()
  const data = new FormData(event.currentTarget)
  const name = String(data.get('name') ?? '').trim()
  const company = String(data.get('company') ?? '').trim()
  const email = String(data.get('email') ?? '').trim()
  const phone = String(data.get('phone') ?? '').trim()
  const message = String(data.get('message') ?? '').trim()
  const website = String(data.get('website') ?? '').trim()

  const hasContact = email !== '' || phone !== ''
  const emailOk = email === '' || isValidEmail(email)

  if (!name || !message || !hasContact || !emailOk) {
    setError('validation')
    setErrorCount((count) => count + 1)
    return
  }

  setError(null)
  setSending(true)
  try {
    const result = await sendQuoteRequest({ name, company, email, phone, message, website })
    if (result.ok) {
      setSent(true)
    } else {
      setError('send')
      setErrorCount((count) => count + 1)
    }
  } catch {
    setError('send')
    setErrorCount((count) => count + 1)
  } finally {
    setSending(false)
  }
}
```

Add the honeypot immediately after `<form ...>`'s opening tag (visually hidden, excluded from a11y tree and tab order):

```tsx
<div aria-hidden="true" className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden">
  <label htmlFor="quote-website">Website</label>
  <input id="quote-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
</div>
```

(The form element needs `className="relative flex flex-col gap-3.5 md:gap-4"` — add `relative`.)

Update the error paragraph to show the right message:

```tsx
{error && (
  <p
    key={errorCount}
    role="alert"
    className="anim-shake motion-safe-anim text-[13px] text-[#D64545]"
  >
    {error === 'validation' ? ERROR_MESSAGE : SEND_ERROR_MESSAGE}
  </p>
)}
```

Update the submit button to reflect the sending state:

```tsx
<Button type="submit" variant="primary" size="lg" fullWidth disabled={sending}>
  {sending ? 'Sending…' : 'Send request'}
</Button>
```

If `Button` doesn't already pass `disabled` through, check `src/components/ui/Button.tsx` — it spreads rest props onto the underlying element, so `disabled` flows through; verify visually in the test run.

- [ ] **Step 6: Update QuoteSection tests**

In `src/components/QuoteSection.test.tsx`, mock the action module at the top (after imports):

```tsx
import { vi, beforeEach } from 'vitest'
import { sendQuoteRequest } from '@/app/actions/quote'

vi.mock('@/app/actions/quote', () => ({
  sendQuoteRequest: vi.fn().mockResolvedValue({ ok: true }),
}))

beforeEach(() => {
  vi.mocked(sendQuoteRequest).mockClear()
  vi.mocked(sendQuoteRequest).mockResolvedValue({ ok: true })
})
```

The four existing tests keep working: RTL's `await userEvent.click` flushes the async submit. Verify the success-path tests still pass, then add:

```tsx
it('passes the form values to sendQuoteRequest', async () => {
  render(<QuoteSection />)
  await userEvent.type(screen.getByLabelText('Your name'), 'Ada Lovelace')
  await userEvent.type(screen.getByLabelText('What do you need?'), 'A booking system')
  await userEvent.type(screen.getByLabelText('Phone'), '+255 746 800 951')
  await userEvent.click(screen.getByRole('button', { name: 'Send request' }))

  expect(sendQuoteRequest).toHaveBeenCalledWith({
    name: 'Ada Lovelace',
    company: '',
    email: '',
    phone: '+255 746 800 951',
    message: 'A booking system',
    website: '',
  })
})

it('shows a send error and keeps the form when the action fails', async () => {
  vi.mocked(sendQuoteRequest).mockResolvedValue({ ok: false })
  render(<QuoteSection />)
  await userEvent.type(screen.getByLabelText('Your name'), 'Ada Lovelace')
  await userEvent.type(screen.getByLabelText('What do you need?'), 'A booking system')
  await userEvent.type(screen.getByLabelText('Phone'), '+255 746 800 951')
  await userEvent.click(screen.getByRole('button', { name: 'Send request' }))

  expect(screen.getByRole('alert')).toHaveTextContent(
    'Something went wrong sending your request. Please try again, or email us directly.',
  )
  expect(screen.getByRole('button', { name: 'Send request' })).toBeInTheDocument()
  expect(screen.queryByRole('heading', { name: 'Request received' })).toBeNull()
})

it('does not call the action when validation fails', async () => {
  render(<QuoteSection />)
  await userEvent.click(screen.getByRole('button', { name: 'Send request' }))
  expect(sendQuoteRequest).not.toHaveBeenCalled()
})
```

- [ ] **Step 7: Full suite + build**

Run: `npm test`
Expected: all pass.

Run: `npm run build`
Expected: success — the server action compiles; route `/` remains static.

- [ ] **Step 8: Commit**

```bash
git add src/app/actions/quote.ts src/app/actions/quote.test.ts src/components/QuoteSection.tsx src/components/QuoteSection.test.tsx
git commit -m "feat: quote form delivers email via Mailtrap server action with honeypot"
```

---

### Task 7: Full metadata + JSON-LD

**Files:**
- Modify: `src/app/layout.tsx`, `src/app/page.tsx`
- Create: `src/app/page.test.tsx`

**Interfaces:**
- Consumes: `SITE_URL`, `SITE_NAME`, `SITE_TITLE`, `SITE_DESCRIPTION`, `CONTACT` from `@/lib/site`; layout.tsx as left by Task 5 (fonts + js script present). The OG image from Task 3 auto-attaches via the file convention — do NOT add an `images` entry to `openGraph`/`twitter` (it would override the generated one).

- [ ] **Step 1: Write the failing JSON-LD test**

`src/app/page.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import Page from './page'

describe('Page JSON-LD', () => {
  it('embeds a ProfessionalService block with real contact data', () => {
    const { container } = render(<Page />)
    const script = container.querySelector('script[type="application/ld+json"]')
    expect(script).not.toBeNull()

    const data = JSON.parse(script!.textContent ?? '{}')
    expect(data['@type']).toBe('ProfessionalService')
    expect(data.name).toBe('NKK Tech Company Limited')
    expect(data.url).toBe('https://nkktech.co.tz')
    expect(data.telephone).toBe('+255746800951')
    expect(data.email).toBe('info@nkktech.co.tz')
    expect(data.address).toMatchObject({
      '@type': 'PostalAddress',
      streetAddress: 'Mikocheni',
      addressLocality: 'Dar es Salaam',
      addressCountry: 'TZ',
    })
    expect(data.areaServed).toBe('Tanzania')
  })
})
```

- [ ] **Step 2: Run — expect FAIL**

Run: `npx vitest run src/app/page.test.tsx`
Expected: FAIL — no ld+json script in the rendered page.

- [ ] **Step 3: Add JSON-LD to page.tsx**

In `src/app/page.tsx`:

```tsx
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION, CONTACT } from '@/lib/site'

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: SITE_NAME,
  url: SITE_URL,
  email: CONTACT.email,
  telephone: CONTACT.phone,
  description: SITE_DESCRIPTION,
  image: `${SITE_URL}/icon_app.png`,
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Mikocheni',
    addressLocality: 'Dar es Salaam',
    addressCountry: 'TZ',
  },
  areaServed: 'Tanzania',
} as const

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Nav />
      <Hero />
      <Services />
      <WhyUs />
      <Process />
      <QuoteSection />
      <Footer />
    </>
  )
}
```

- [ ] **Step 4: Run — expect PASS**

Run: `npx vitest run src/app/page.test.tsx`
Expected: PASS.

- [ ] **Step 5: Expand metadata in layout.tsx**

Replace the `metadata` export with:

```tsx
import { SITE_URL, SITE_TITLE, SITE_DESCRIPTION } from '@/lib/site'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: '/',
    siteName: 'NKK Tech',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  icons: { icon: '/icon_app.png', apple: '/icon_app.png' },
}
```

- [ ] **Step 6: Verify the head in built HTML**

Run: `npm run build`

Then:

```bash
grep -c 'rel="canonical" href="https://nkktech.co.tz' .next/server/app/index.html
grep -c 'property="og:image"' .next/server/app/index.html
grep -c 'name="twitter:card" content="summary_large_image"' .next/server/app/index.html
grep -c 'application/ld+json' .next/server/app/index.html
```

Expected: every count ≥ 1. The `og:image` must point at `/opengraph-image` (file convention attached it).

Run: `npm test`
Expected: all pass.

- [ ] **Step 7: Commit**

```bash
git add src/app/layout.tsx src/app/page.tsx src/app/page.test.tsx
git commit -m "feat: canonical + Open Graph + Twitter metadata and ProfessionalService JSON-LD"
```

---

### Task 8: End-to-end verification + Vercel deploy (main loop — NOT a subagent)

**Files:** none created; `.vercel/` appears locally (gitignored).

**Interfaces:**
- Consumes: the finished branch. Requires user-supplied `MAILTRAP_TOKEN` (and optionally `MAILTRAP_SANDBOX_INBOX_ID`) — if unavailable, deploy anyway; the form degrades to the error message by design.

- [ ] **Step 1: Full local gate**

```bash
npm test && npm run lint && npm run build
```

Expected: all green.

- [ ] **Step 2: Serve production build locally and probe every SEO surface**

```bash
npm run start &   # then curl once ready
curl -s http://localhost:3000/ | grep -c "Missing Piece"          # ≥ 1
curl -s http://localhost:3000/ | grep -c "application/ld+json"    # ≥ 1
curl -s http://localhost:3000/robots.txt                          # shows sitemap line
curl -s http://localhost:3000/sitemap.xml | grep -c nkktech.co.tz # ≥ 1
curl -s -o /dev/null -w "%{http_code} %{content_type}" http://localhost:3000/opengraph-image  # 200 image/png
```

Kill the server afterwards.

- [ ] **Step 3: Link Vercel project + env vars**

`vercel link` (interactive — user's account/team), then set `MAILTRAP_TOKEN` for Production + Preview once the user provides it. `MAILTRAP_SANDBOX_INBOX_ID` on Preview only, so previews hit the sandbox.

- [ ] **Step 4: Preview deploy + probe**

`vercel deploy` → run the same curl probes against the preview URL (note: skip if Deployment Protection blocks anonymous access — verify in browser instead). Submit the quote form once against the preview and confirm the message arrives in the Mailtrap sandbox inbox.

- [ ] **Step 5: Report**

Summarize verification results to the user; production promotion and domain attachment are user decisions.
