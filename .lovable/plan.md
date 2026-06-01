## SaaS Starter — Brand Asset Kit

Generate a complete, cohesive set of brand and app imagery for **SaaS Starter** using **Lovable's pink/magenta gradient** identity and an **iconic symbol** logo mark (a stylized rocket/spark — representing "starter / launch"). Vector logos and favicons are hand-authored SVG/PNG (crisp at every size); Open Graph, Twitter, and email hero cards are AI-generated for richer composition.

### 1. Logo mark concept

A geometric **rocket-spark** mark inside a rounded-square container:
- Container: 12px-radius rounded square filled with Lovable's pink→magenta gradient (`#FF4FA3` → `#C026D3`).
- Mark: a clean upward chevron + dot ("ignition spark") in white, optically centered.
- Used across favicons, app icons, splash, and the existing `<Logo>` component (which already auto-loads from `/public`).

### 2. Files to create / replace in `public/`

Logos (SVG, hand-authored):
- `logo.svg` — wordmark "SaaS Starter" + mark, dark text (light backgrounds)
- `logo-dark.svg` — wordmark + mark, white text (dark backgrounds)
- `logo-mark.svg` — square mark only
- `logo-horizontal.svg` — extra-wide variant for email headers / footers

Favicons & app icons (SVG + PNG, generated via a one-off Node script using `sharp`):
- `favicon.svg`, `favicon.ico` (multi-size 16/32/48)
- `favicon-16x16.png`, `favicon-32x32.png`
- `apple-touch-icon.png` (180×180, opaque background per iOS)
- `android-chrome-192x192.png`, `android-chrome-512x512.png`
- `maskable-icon-512x512.png` (with safe-area padding)
- `mstile-150x150.png`
- `safari-pinned-tab.svg` (monochrome mask)

Social / share cards (AI-generated PNG, then optimized):
- `og-image.png` (1200×630) — primary Open Graph, used by Facebook/LinkedIn/Slack/iMessage
- `twitter-image.png` (1200×600) — X/Twitter summary_large_image
- `og-square.png` (1200×1200) — WhatsApp/Discord square preview

Email & splash:
- `email-header.png` (600×200) — for transactional email templates
- `splash-light-1024.png`, `splash-dark-1024.png` (1024×1024) — PWA splash

Manifest / config refresh:
- Update `site.webmanifest` — set `name: "SaaS Starter"`, `short_name: "SaaS Starter"`, `description`, `theme_color: "#C026D3"`, add maskable icon entry
- Update `browserconfig.xml` TileColor → `#C026D3`
- Update `index.html` `theme-color` meta → `#C026D3`

### 3. Asset guide

Create **`public/BRAND-ASSETS.md`** (replaces / extends the existing `BRANDING.md` reference):
- Color tokens (hex + HSL) for primary, gradient stops, neutrals
- Logo variants table — which to use on which background, min sizes, clear-space rule
- Favicon/app-icon table — file, dimensions, where it's referenced
- Social card table — platform, dimensions, when to regenerate
- Email & splash — usage
- "How to regenerate" — single command to re-run the icon script

### 4. Technical approach

1. **Author SVGs by hand** for `logo.svg`, `logo-dark.svg`, `logo-mark.svg`, `logo-horizontal.svg`, `favicon.svg`, `safari-pinned-tab.svg`. These are the source of truth.
2. **Write one Node script** `scripts/generate-brand-icons.mjs` using `sharp` (already a common dep; add if missing) that takes `public/logo-mark.svg` and renders every PNG/ICO size into `public/`. Run it once to populate; it stays in repo for future re-runs.
3. **Generate AI social cards** via the agent's `imagegen` tool — one prompt per card with consistent palette/typography. Save as PNGs in `public/`, hand-checked, then optimized.
4. **Update meta**: `index.html` `theme-color`, `site.webmanifest`, `browserconfig.xml`. No changes to `<Logo>` component or any TS — it already reads `/logo.svg` etc.
5. **Changelog entry** appended to `src/data/changelog.ts` per project policy.

### 5. Out of scope

- No changes to design tokens in `index.css` / `tailwind.config.ts` (orange `#FF5C2A` is the *product* accent; the *brand mark* uses Lovable pink as requested — these can coexist). If you'd rather also retheme the app UI to pink, say so and I'll add that.
- No changes to the in-app Brand Kit generator at `src/lib/brand/generate.ts`.

### 6. Deliverables checklist

- [ ] 4 logo SVGs
- [ ] 11 favicon/app-icon files (SVG + PNG + ICO)
- [ ] 3 social cards (OG, Twitter, square)
- [ ] 2 splash images + 1 email header
- [ ] Updated `site.webmanifest`, `browserconfig.xml`, `index.html` theme color
- [ ] `public/BRAND-ASSETS.md` usage guide
- [ ] `scripts/generate-brand-icons.mjs` for reproducibility
- [ ] Changelog entry