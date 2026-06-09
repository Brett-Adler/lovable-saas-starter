# Lovable SaaS Starter — logo + full image set

Following the `saas-image-set` skill. Two phases so you can approve the mark before I commit to ~50 derivative files.

## Phase 1 — Master logo (review & revise)

**Concept.** A bold white **S** sitting inside a rounded-square tile, tile filled with the Lovable family gradient (orange → coral/pink → purple, mirroring `lovable-skills-mark-*.svg` and `lovable-prompts.png`). A small 4-point Lovable-style sparkle tucks into the upper-right of the S to tie it to the Skills/Prompts marks. Geometry inherits the same 256×256 viewBox and 56px corner radius the family uses, so it sits next to the Skills and Prompts icons as siblings.

**What I'll deliver for review** (all hand-authored SVG, no AI generation needed — keeps the family feel tight):
- `mark-light.svg`, `mark-dark.svg` — tile-on-white and tile-on-dark backplates
- `lockup-full-light.svg` — mark + "Lovable SaaS Starter" wordmark (Space Grotesk 700, matches Skills lockup)
- `lockup-short-light.svg` — mark + "Lovable SaaS"
- Plus dark variants of both lockups
- A side-by-side preview image showing the new mark next to Lovable, Skills, and Prompts marks so you can sanity-check the family resemblance

I'll drop these in `src/assets/brand-drafts/` and post the previews inline. **You review, request tweaks (color stops, sparkle position, S weight, wordmark font, etc.), and I iterate until you say "approved".**

## Phase 2 — Full image set (after master is approved)

Per your answers: full favicon/PWA set, social cards, in-app logos, and updated `index.html` + manifest.

**Will create by default (~50 files)** — full breakdown shown in a confirmation message before I generate, but the headline groups are:
- **Web/app icons (10):** favicon.ico, favicon-16/32/96, apple-touch-icon (+precomposed), android-chrome-192/512, maskable-icon-512, safari-pinned-tab.svg, site.webmanifest
- **Windows tiles (2):** mstile-150, browserconfig.xml
- **Logo variations (16):** full lockup / mark / wordmark / monochrome, each light + dark, SVG + PNG @1×/2×/3× + WebP + transparent PNG. Both "Lovable SaaS Starter" and "Lovable SaaS" lockups included.
- **Social share (8):** og-image 1200×630, og-square 1200×1200, twitter 1200×600, twitter-square, linkedin-banner 1584×396, facebook-cover 820×312, social-profile-square 400×400, social-profile-circle 400×400
- **Email (3):** signature 600px, header 1200×300, footer-icon 200×200
- **Print & merch (5):** logo-print.pdf/.eps/.ai, hi-res 4000×4000 PNG, CMYK TIFF (or sRGB fallback)
- **UI button icons (4):** 24/32/48 light + dark

**Will NOT create unless you ask** — opt-ins from the skill (Apple PWA splash screens, App/Play Store icons, extra Windows tiles, browser-extension icons, Slack/Discord-specific unfurls, og:video, Wallet pass artwork, dark-mode-only email variants, CMYK proof PDFs, social auth button marks). The Phase 2 confirmation message lists each with a one-line "you'd want this if…".

**Wire-up:**
- Update `index.html` `<link rel="icon">`/`apple-touch-icon`/`manifest`/`theme-color` and `og:image`/`twitter:image`
- Write `public/site.webmanifest` (name "Lovable SaaS Starter", short_name "Lovable SaaS", theme/background colors from the approved gradient)
- Write `public/browserconfig.xml`
- Replace `public/logo.svg`, `public/logo-dark.svg`, `public/logo-mark.svg` — `src/components/Logo.tsx` keeps working unchanged
- Delete the old placeholder `public/favicon.ico` so the new one wins
- Generate `public/brand/README.md` documenting every file and the "what we didn't generate" list

## Technical notes

- Master logo is hand-authored SVG, not AI-generated, so the family gradient/geometry stays exact (`#FF9A5A → #FF7AA5 → #C47DD6`, 56px radius on 256 viewBox).
- Phase 2 generation uses Python + Pillow + cairosvg for raster conversions, ImageMagick for ICO/TIFF where available. Caveats (`.ai` = renamed SVG, `.eps` needs Inkscape, CMYK TIFF needs ImageMagick) will be surfaced in the confirmation and the brand README per the skill's honesty rules.
- All branding lives under `public/` and `public/brand/`; nothing leaves the project repo.

Reply with "go" to start Phase 1, or call out tweaks to the concept first (different sparkle treatment, geometric S instead of letterform, alternate wordmark font, etc.).
