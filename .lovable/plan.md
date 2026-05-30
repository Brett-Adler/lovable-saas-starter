## Goal

Make the marketing site feel more visual by adding (a) generic app mockup screenshots in hero and feature areas, and (b) real partner/tech logos with links on integrations, roadmap, and docs — without using any real third-party product UI.

## What gets added

### 1. Reusable building blocks (`src/components/marketing/`)

- **`BrowserMockup.tsx`** — fake browser/macOS window chrome (traffic lights + URL bar) wrapping any children. Used to frame dashboard mockups.
- **`AppMockup.tsx`** — pure-Tailwind/SVG fake dashboard built from divs (sidebar, fake metric cards, chart bars, table rows, avatar circles). Several variants via prop: `dashboard`, `analytics`, `inbox`, `billing`, `team`. No real screenshots, no real product UI — visibly stylized so it reads as a placeholder mockup, not a real screen.
- **`BrandIcon.tsx`** — renders a known brand glyph by `slug` using [simple-icons](https://simpleicons.org/) SVG paths (already MIT-licensed brand marks). Falls back to a monogram tile if the slug is unknown. Slugs we will support out of the gate: `stripe`, `supabase`, `lovable`, `resend`, `twilio`, `slack`, `zapier`, `google`, `apple`, `github`, `okta`, `azure`, `vercel`, `postgres`, `react`, `typescript`, `tailwindcss`, `nodejs`.
- **`LogoCloud.tsx`** — horizontal row of `BrandIcon`s with optional labels and external links (`rel="noopener noreferrer external" target="_blank"`).

We will NOT bring in the `simple-icons` npm package; instead we'll inline only the ~18 SVG paths we use into `src/lib/brand/icons.ts` to keep bundle size small. Attribution comment added in that file.

### 2. Page-level changes

- **`src/pages/Index.tsx`**
  - Hero: add an `AppMockup variant="dashboard"` inside a `BrowserMockup`, placed below the CTA buttons with a soft glow/parallax. On mobile it stacks; on desktop it sits beneath the hero copy at full width.
  - New "Built on" `LogoCloud` strip just under the hero (Lovable, Supabase, Stripe, Resend, React, Tailwind, TypeScript) — each logo links to its official site.
  - Features section: add a small inline `AppMockup` variant next to 2–3 of the feature cards (analytics, teams, billing) so the section isn't text-only.

- **`src/pages/Integrations.tsx`**
  - Each integration card gets a `BrandIcon` (Stripe, Google, Apple, Resend, Twilio, Slack, Zapier, etc.). Cards with an official site get an external "Learn more" link in addition to the existing internal "Open" link (e.g., Stripe → stripe.com, Resend → resend.com, Twilio → twilio.com, Slack → slack.com, Zapier → zapier.com, Okta → okta.com).
  - Add a top `LogoCloud` summarizing the ecosystem.

- **`src/pages/Roadmap.tsx`** / **`src/components/marketing/RoadmapList.tsx`**
  - Where a roadmap item maps to a known vendor (Slack, Zapier, Twilio, SAML providers, etc.), render its `BrandIcon` next to the title.
  - Add a `BrowserMockup` containing an `AppMockup variant="roadmap"` at the top — a generic placeholder of what a shipped feature looks like in-app.

- **`src/pages/Docs.tsx`**
  - Add a "Powered by" `LogoCloud` (Lovable, Supabase, Stripe, Resend, React, Tailwind) with external links to their docs: Lovable docs (docs.lovable.dev), Supabase docs, Stripe docs, Resend docs, React docs, Tailwind docs.
  - Where doc cards reference an external service, add the `BrandIcon` and an external link.

- **`src/pages/Demo.tsx`** (small touch)
  - Add a `BrowserMockup` + `AppMockup variant="analytics"` at the top so the page isn't empty above the CTA.

### 3. Accessibility & SEO

- All mockups are decorative: wrapped with `aria-hidden="true"` and no `alt` text needed.
- Brand icons get `aria-label="<Brand> logo"` and `<title>` inside the SVG.
- External links use `rel="noopener noreferrer external"` and `target="_blank"` with a visually-hidden " (opens in new tab)".

### 4. Out of scope

- No real product screenshots, no scraped UI, no real customer logos.
- No backend/admin changes — content lives in code constants for now.
- No new dependencies.

## Technical notes

```text
src/
  components/marketing/
    BrowserMockup.tsx        new
    AppMockup.tsx            new (variants: dashboard|analytics|inbox|billing|team|roadmap)
    BrandIcon.tsx            new (reads from src/lib/brand/icons.ts)
    LogoCloud.tsx            new
    RoadmapList.tsx          edited (BrandIcon per item where applicable)
  lib/brand/
    icons.ts                 new — inlined simple-icons SVG paths + attribution
  pages/
    Index.tsx                edited (hero mockup + logo cloud + inline feature mockups)
    Integrations.tsx         edited (BrandIcon per card + external links + top LogoCloud)
    Roadmap.tsx              edited (top mockup)
    Docs.tsx                 edited (LogoCloud + external doc links)
    Demo.tsx                 edited (top mockup)
```

Changelog entry appended to `src/data/changelog.ts` per project policy.

## Open question

Two acceptable looks for the mockups — happy to pick one or do both:
1. **Light/neutral** mockups matching the current theme (clean, subtle).
2. **Gradient-backed** mockups using the existing `gradient-mesh` token for extra visual punch in the hero.

Defaulting to **#2 in the hero**, **#1 elsewhere** unless you say otherwise.