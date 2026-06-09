
## Phase 1b — Finalize wordmarks

Keep the approved S+sparkle mark exactly as-is. Replace the four lockup SVGs with two new wordmark variants (each in light + dark):

1. **Primary lockup — "Lovable SaaS"**
   - Files: `lockup-primary-light.svg`, `lockup-primary-dark.svg`
   - Mark on the left, "Lovable SaaS" set in Space Grotesk Bold to the right
   - No tagline underneath — clean single-line lockup

2. **Secondary lockup — "SaaS Starter"**
   - Files: `lockup-secondary-light.svg`, `lockup-secondary-dark.svg`
   - Same construction, "SaaS Starter" wordmark

Delete the old `lockup-full-*` and `lockup-short-*` drafts (they used "Lovable SaaS Starter" + tagline, which you're replacing).

Render a fresh preview PNG showing: mark / primary lockup / secondary lockup, in both light and dark, so you can sign off in one glance.

**Stop and wait for approval** before Phase 2.

## Phase 2 — Full asset set (after approval)

Once wordmarks are approved, generate the confirmed manifest from the earlier plan:
- Favicons + PWA icons (`favicon.ico`, `favicon-16/32.png`, `apple-touch-icon.png`, `icon-192/512.png`, maskable variants)
- Social cards (`og-image.png` 1200×630, `twitter-card.png`) using the primary lockup
- In-app logo components swapped to the new SVGs
- `site.webmanifest`, `browserconfig.xml`, `<head>` meta wiring in `index.html`
- Archive old `public/logo.*` + `favicon.ico` into `public/brand/archive/<timestamp>/`
- Write `public/brand/README.md` documenting which lockup to use where (primary = social/header, secondary = footer/about/marketing variants)

### Technical notes
- Hand-authored SVG (no AI gen) for both lockups, same gradient + geometry as the approved mark
- Wordmark color: `#0F172A` on light, `#F8FAFC` on dark
- Spacing: mark height = cap height × 1.6, gap = cap height × 0.6
- Phase 2 raster conversion via Python + Pillow + cairosvg, ICO via ImageMagick (same toolchain as the preview)
