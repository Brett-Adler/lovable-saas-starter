## Goal

No such page exists today. Add an admin "Brand kit" page where the user uploads one square logo (PNG/SVG, ideally ≥ 512×512) and the app generates and publishes every common web/PWA/social variant. Generated assets are stored in a new public Supabase storage bucket and wired up through the existing `site_seo` / `Logo` / `PageSeo` pipeline.

Today `public/*.png` are static placeholders documented in `public/BRANDING.md` and pointed at by `index.html`. We keep those as the first-paint fallback and override them at runtime once a brand kit is published.

## What gets generated from one logo

Everything happens client-side in a single `<canvas>` pass. The source logo is rendered into each target size, padded for safe area, and exported as PNG (or kept as SVG when the upload is SVG).

**Icons & favicons** (square, transparent PNG):
- `favicon-16.png`, `favicon-32.png`, `favicon-48.png`
- `apple-touch-icon-180.png` (white background, iOS strips alpha anyway)
- `android-chrome-192.png`, `android-chrome-512.png`
- `maskable-512.png` (192px safe area inside 512 canvas, themed background)
- `mstile-150.png` (Windows tile, themed background)
- `favicon.ico` (multi-size 16/32/48) — built with `to-ico` (pure JS)

**Logos for UI**:
- `logo.png` (max width 320, transparent) — replaces `/logo.svg` in the navbar/footer via the `Logo` component
- `logo-mark.png` (64×64 transparent)
- If the upload is SVG, also store the SVG verbatim and prefer it for the navbar.

**Social cards** (themed background + centered logo):
- `og-image.png` (1200×630) — used for Facebook, LinkedIn, Slack, iMessage previews
- `twitter-image.png` (1200×600)
- `og-square.png` (1200×1200) — used by some messaging apps that prefer square

**PWA & misc**:
- `splash-light-1024.png`, `splash-dark-1024.png` — centered mark on theme background / inverted
- `site.webmanifest` regenerated with the right icon URLs, `theme_color`, `background_color`, app name (pulled from `site_seo.site_name`)
- `browserconfig.xml` regenerated with the new mstile URL and tile color

All generated files are uploaded to a new public bucket `brand-assets/` under a versioned folder (`v{epoch}/`) so cached URLs invalidate cleanly.

## Wiring (so the new assets actually take effect)

1. **DB**: extend `site_seo` with one jsonb column `brand_assets` (URL map) plus `theme_color` (already exists) and `background_color` (new text). Migration also creates the public `brand-assets` storage bucket with public-read RLS and admin-only write.

2. **Logo component** (`src/components/Logo.tsx`): if `site_seo.brand_assets.logo` exists, use it; otherwise fall back to the static `/logo.svg`. Keep the same dimensions API.

3. **PageSeo** (`src/components/seo/PageSeo.tsx`): when `brand_assets` is present, inject `<link rel="icon">`, `<link rel="apple-touch-icon">`, `<link rel="manifest">` (pointing at the regenerated manifest URL), and `<meta name="theme-color">` via Helmet so every route picks up the runtime brand. OG and Twitter image already flow through `default_og_image_url`; the brand kit writes its generated `og-image.png` into that field automatically.

4. **`AdminShell`** sidebar: add a new "Brand kit" item under the Configure group.

## Admin "Brand kit" page (`src/pages/admin/Brand.tsx`)

Single page, three sections:

1. **Upload**: drag-and-drop a PNG/SVG/JPG up to 4 MB. Show a preview, dimensions, warn if smaller than 512×512 on the longer side or non-square.

2. **Style**: two color pickers for `theme_color` and `background_color` (defaults read from existing `site_seo` and from the dominant color of the upload when first chosen), text input for "App name" (mirrors `site_seo.site_name`), and a "padding" slider for icon safe area (10–25%).

3. **Generate & publish**: a single button that:
   - renders every variant in a worker-friendly canvas loop with a progress bar (`Generating apple-touch-icon-180… 12/22`),
   - uploads each to `brand-assets/v{epoch}/<filename>` via `supabase.storage`,
   - writes the URL map into `site_seo.brand_assets` and updates `default_og_image_url`, `theme_color`, manifest URL,
   - shows a results grid with thumbnail + filename + size + "Download" + "Copy URL" for every generated file, plus a "Download all (.zip)" button (built client-side with `jszip` — already in tree? if not, add).

A second tab "Preview" mocks browser tab favicon, iOS home-screen icon, Android home-screen icon, OG card (Slack/Facebook style), Twitter card, and the in-app navbar so the admin can visually confirm before publishing.

## Libraries to add

- `to-ico` (pure JS, ~5 kB) for multi-size `.ico`
- `jszip` (for "Download all") — already a common dep; install if missing

No backend code beyond the storage bucket creation. No edge functions.

## Out of scope

- Rewriting `index.html` at build time (we override via Helmet at runtime).
- Per-tenant brand kits — this is site-wide brand for the marketing site/app shell, not per-organization theming.
- Email-template logo URL (already separately editable; can be wired in a follow-up).
- Generating animated splash screens or full iOS launch images (sizes per device).

## Files

- New: `src/pages/admin/Brand.tsx`
- New: `src/lib/brand/generate.ts` (pure functions: `renderIcon`, `renderOg`, `renderManifest`, `renderBrowserconfig`, `buildIco`)
- New: `src/lib/brand/upload.ts` (upload + URL-map writer)
- New: `src/components/admin/BrandPreview.tsx` (mock cards)
- Edit: `src/components/Logo.tsx` (runtime override via `useSiteSeo`)
- Edit: `src/components/seo/PageSeo.tsx` (inject favicon/manifest/theme-color links from `brand_assets`)
- Edit: `src/hooks/useSiteSeo.ts` (include `brand_assets`, `background_color`)
- Edit: `src/components/admin/AdminShell.tsx` (add Brand kit nav item)
- Edit: `src/App.tsx` (route `/admin/brand`)
- New migration: add `brand_assets jsonb`, `background_color text` to `site_seo`; create `brand-assets` public storage bucket with admin-write / public-read policies
- Append to `src/data/changelog.ts`
