# Brand Assets — SaaS Starter

This is the complete brand asset kit. Every file in this directory is either a hand-authored SVG source or a deterministically-generated raster from one of those sources. Re-run `scripts/generate-brand-icons.py` to regenerate all PNG/ICO files from the SVG mark.

## Identity

| Token | Hex | Usage |
|---|---|---|
| Primary | `#FF7AA5` | Brand pink — `theme_color`, accents, gradient middle |
| Gradient start | `#FF9A5A` | Warm orange — gradient start |
| Gradient end | `#C47DD6` | Soft purple — gradient end |
| Gradient (CSS) | `linear-gradient(135deg, #FF9A5A, #FF7AA5, #C47DD6)` | Logo container, marketing hero accents |
| Ink | `#0F172A` | Wordmark on light backgrounds |
| Surface dark | `#0F172A` | Splash dark, social card backgrounds |
| Surface light | `#FFFFFF` | Splash light, email backgrounds |

**Logo mark concept**: a rounded-square tile in the Lovable family gradient (orange → coral → purple) with a bold white "S" letterform and a small 4-point sparkle in the upper-right — a stylized stand-in for *SaaS / Starter*, kept in the Lovable Skills / Prompts family.

## Logos

| File | Type | When to use |
|---|---|---|
| `logo.svg` | Wordmark + mark | Light backgrounds (default) |
| `logo-dark.svg` | Wordmark + mark, white text | Dark backgrounds |
| `logo-mark.svg` | Mark only, square | Tight spaces (avatars, app icons, mobile nav) |
| `logo-horizontal.svg` | Mark + wordmark + tagline | Email headers, footers, wide banners |

**Clear space**: keep at least the height of the mark's container around the logo. **Minimum size**: 24px tall for the mark, 96px wide for the wordmark.

The in-app `<Logo />` component reads `/logo.svg`, `/logo-dark.svg`, and `/logo-mark.svg` automatically — no code changes needed when you replace these.

## Favicons & app icons

| File | Size | Used by |
|---|---|---|
| `favicon.svg` | vector | Modern browsers (referenced in `index.html`) |
| `favicon.ico` | 16/32/48 multi | Legacy browsers, default `/favicon.ico` request |
| `favicon-16x16.png` | 16×16 | Browser tab |
| `favicon-32x32.png` | 32×32 | Browser tab (retina) |
| `favicon-48x48.png` | 48×48 | Bookmarks bar |
| `apple-touch-icon.png` | 180×180 | iOS home screen (opaque white bg per Apple spec) |
| `android-chrome-192x192.png` | 192×192 | Android home screen |
| `android-chrome-512x512.png` | 512×512 | Android home screen XHDPI, PWA install |
| `maskable-icon-512x512.png` | 512×512 | Android adaptive icon (20% safe area, opaque magenta bg) |
| `mstile-150x150.png` | 150×150 | Windows Start menu tile |
| `safari-pinned-tab.svg` | vector mono | Safari pinned tab mask |

All sized icons are derived from `logo-mark.svg` by `scripts/generate-brand-icons.py`. Edit the SVG → re-run the script.

## Social share cards

| File | Size | Used by |
|---|---|---|
| `og-image.png` | 1200×630 | Open Graph default — Facebook, LinkedIn, Slack, iMessage |
| `twitter-image.png` | 1200×600 | X / Twitter `summary_large_image` |
| `og-square.png` | 1200×1200 | Square previews — WhatsApp, Discord, signal |

These are AI-generated marketing cards (not derived from the SVG). To regenerate with different copy or palette, re-run an image-generation pass with the prompt patterns from the project changelog.

## Email & splash

| File | Size | Used by |
|---|---|---|
| `email-header.png` | 600×200 | Transactional email header (Resend / SES) |
| `splash-light-1024.png` | 1024×1024 | PWA splash, light system theme |
| `splash-dark-1024.png` | 1024×1024 | PWA splash, dark system theme |

## How to regenerate

After editing `logo-mark.svg` or `logo-horizontal.svg`:

```bash
python3 scripts/generate-brand-icons.py
```

This rewrites every PNG and the `.ico` from the SVG sources. Commit the regenerated files.

## Where they're referenced

- HTML meta + favicons: `index.html`
- PWA manifest: `public/site.webmanifest`
- Windows tile: `public/browserconfig.xml`
- React logo component: `src/components/Logo.tsx` (reads `/logo*.svg` from this directory)

## Replacing the brand entirely

This kit ships with a generic "SaaS Starter" identity. To rebrand:
1. Replace `logo-mark.svg` with your own square mark (keep the 48×48 viewBox for proportions).
2. Replace `logo.svg`, `logo-dark.svg`, `logo-horizontal.svg` with your wordmark variants.
3. Update color tokens in this file and in `public/site.webmanifest`, `public/browserconfig.xml`, `index.html`.
4. Regenerate raster icons: `python3 scripts/generate-brand-icons.py`.
5. Regenerate the social cards (`og-image.png`, `twitter-image.png`, `og-square.png`) with your own design or imagegen prompt.
