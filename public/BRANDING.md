# Branding Assets — Replace These

This folder contains placeholder branding assets. Swap each one with your own
file at the same path and filename. No code changes needed.

## Icons & Favicons

| File | Size | Format | Purpose |
|------|------|--------|---------|
| `favicon.ico` | 48×48 (multi) | ICO | Default browser tab icon |
| `favicon.svg` | any (vector) | SVG | Modern browsers, scales perfectly |
| `favicon-16x16.png` | 16×16 | PNG | Browser tab |
| `favicon-32x32.png` | 32×32 | PNG | Browser tab (retina) |
| `apple-touch-icon.png` | 180×180 | PNG | iOS home screen |
| `android-chrome-192x192.png` | 192×192 | PNG | Android home screen |
| `android-chrome-512x512.png` | 512×512 | PNG | Android splash, PWA |
| `safari-pinned-tab.svg` | any (vector, monochrome) | SVG | Safari pinned tab |
| `mstile-150x150.png` | 150×150 | PNG | Windows tile |

## Logos (used in app UI)

| File | Recommended | Purpose |
|------|-------------|---------|
| `logo.svg` | wordmark | Main logo for light backgrounds |
| `logo-mark.svg` | icon only | Compact logo (sidebar, mobile) |
| `logo-dark.svg` | wordmark | Logo for dark backgrounds |

## Social Sharing

| File | Size | Purpose |
|------|------|---------|
| `og-image.png` | 1200×630 | Open Graph (Facebook, LinkedIn, Slack) |
| `twitter-image.png` | 1200×600 | Twitter / X cards |

## Other

- `site.webmanifest` — PWA manifest. Update `name`, `short_name`, `theme_color`.
- `browserconfig.xml` — Windows tile config. Update `TileColor`.
- `robots.txt` — Search engine crawler rules. Update sitemap URL.

## Where they're referenced

All HTML meta tags live in `/index.html`. Update the `<title>`, `<meta name="description">`,
Open Graph tags, and canonical URL there.

## Generating from a single source

The fastest way to produce all icon sizes is [realfavicongenerator.net](https://realfavicongenerator.net/) —
upload one square 512×512+ image and it produces every file in this list.
