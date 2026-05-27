# SEO improvements

Address every actionable finding from the SEO scan, plus give admins a UI to control the SEO fields that ship in the **initial HTML payload** (not just client-side after hydration — important for social crawlers like LinkedIn/Slack that don't run JS).

## 1. Database: admin-editable SEO

New migration adds two tables:

- **`site_seo`** (singleton, `id = 1`) — global defaults
  - `site_name`, `default_title`, `title_template` (e.g. `"%s — Acme"`), `default_description`, `default_og_image_url` (absolute), `twitter_handle`, `theme_color`, `organization_json_ld` (jsonb), `base_url`
- **`seo_pages`** — per-route overrides
  - `path` (PK, e.g. `/pricing`), `title`, `description`, `og_image_url`, `keywords`, `noindex` (bool), `canonical_override`, `json_ld` (jsonb, optional extra schema)

RLS: public `SELECT` (needed by build script & client), `INSERT/UPDATE/DELETE` restricted to `has_role(auth.uid(), 'admin')`. Seed `site_seo` with current `index.html` values.

## 2. Per-route head with `react-helmet-async`

- Install `react-helmet-async`, wrap `<App>` with `<HelmetProvider>` in `src/main.tsx`.
- New `src/components/seo/PageSeo.tsx` — reads `useSiteSeo()` + optional per-page props, renders `<Helmet>` with title (via template), description, canonical (self-referential, absolute), og:* (absolute URLs), twitter:*, optional JSON-LD.
- New `src/hooks/useSiteSeo.ts` — TanStack Query against `site_seo` + `seo_pages`.
- Drop `<PageSeo path="/pricing" />` (etc.) into every public route: `Index`, `Pricing`, `About`, `Contact`, `Newsletter`, `Demo`, `Waitlist`, `Legal` (×3), `Accessibility`, `Sitemap`, `Readme`, `Changelog`.
- Auth/dashboard/admin/checkout routes get a `<PageSeo noindex />` so robots stay out even if crawled.
- Remove the duplicate canonical from `index.html` (Helmet owns canonical per-route); keep static og:* in `index.html` as a fallback for non-JS crawlers.

## 3. Bake SEO into the initial HTML payload

The user's "load with initial page load" requirement — critical for non-JS crawlers. Vite SPA, so we do this at build time, not SSR:

- New `scripts/sync-seo-to-html.ts` (added to `predev` + `prebuild`, after the sitemap step):
  1. Fetches `site_seo` + `seo_pages` from Supabase using the public anon key.
  2. Rewrites `index.html`: replaces title, meta description, canonical, og:title/description/url/image (absolute), twitter:*, theme-color, and injects/updates the `Organization` + `WebSite` JSON-LD blocks. Uses delimited markers (`<!-- seo:start -->…<!-- seo:end -->`) so the rewrite is idempotent.
  3. Writes `public/llms.txt` from a route allow-list + the global `site_name` / `default_description`.
  4. Regenerates `public/sitemap.xml` (merge existing route list with `seo_pages.noindex` filter; adds `<lastmod>` from `seo_pages.updated_at`).
- Failure of the Supabase fetch is non-fatal — falls back to the file's current values so offline dev still works.
- Admin-page UX: after saving, show a toast explaining changes ship to the initial HTML on the next deploy/publish (since the rewrite happens at build time).

This means the homepage's title/description/og/JSON-LD always render correctly to LinkedIn/Slack/Google's first fetch. Per-route deep-links additionally get Helmet for JS-aware crawlers (Googlebot).

## 4. Structured data (fixes `agent_metadata:structured_data`)

- Homepage: `Organization` + `WebSite` (baked into `index.html` via sync script) and `FAQPage` (via Helmet from existing FAQ section data).
- `/pricing`: `Product` + `Offer` for each tier (via Helmet, sourced from existing pricing tier data).
- `/changelog`: keep existing `ItemList`.
- `BreadcrumbList` helper in `PageSeo` for deeper routes.

## 5. Admin UI

New `src/pages/admin/SEO.tsx` (linked from `AdminIndex`):

- **Global tab** — edits `site_seo` fields. Live preview card showing how the homepage `<title>` / description / OG card will look.
- **Pages tab** — table of routes (auto-discovered from a constant `PUBLIC_ROUTES` list), each row editable inline: title, description, og image, noindex toggle, canonical override.
- Save calls Supabase upsert; explanatory banner: "Changes appear in the live HTML after the next publish."
- Optional "Copy current index.html values into defaults" one-click seeding.

## 6. Fix existing findings

- `agent_metadata:metadata_quality` — fixed by §2 (per-route titles, descriptions, self-referential canonicals).
- `agent_metadata:social_preview` — fixed by §3 (absolute og:image URL in index.html) and §2 (per-route og:* via Helmet).
- `agent_metadata:structured_data` — fixed by §4.
- `http:sitemap` — sitemap already exists; the scan is stale. Mark fixed after verification.
- `http:llms_txt` — fixed by §3 (`/llms.txt` generated at build).
- `lighthouse:lighthouse_accessibility` — out of scope (separate contrast issue). Will leave as-is unless the user asks.
- `gsc:gsc` — Google Search Console connection requires the user; will mention in the closing message rather than auto-trigger.

## 7. Files

**New**
- `supabase/migrations/<ts>_seo_tables.sql`
- `src/hooks/useSiteSeo.ts`
- `src/components/seo/PageSeo.tsx`
- `src/pages/admin/SEO.tsx`
- `scripts/sync-seo-to-html.ts`
- `public/llms.txt` (generated, but commit a placeholder)

**Edited**
- `package.json` — add `react-helmet-async`, update `predev`/`prebuild`
- `src/main.tsx` — wrap with `HelmetProvider`
- `index.html` — add `<!-- seo:start --><!-- seo:end -->` markers, drop hardcoded canonical
- `src/App.tsx` — add `/admin/seo` route
- `src/pages/admin/AdminIndex.tsx` — add SEO card
- All public-route page components — add `<PageSeo />`
- Auth/dashboard/admin/checkout pages — add `<PageSeo noindex />`
- `scripts/generate-sitemap.ts` — extend with DB merge (or replace with sync script's sitemap step)
- `src/data/changelog.ts` — log the SEO release
- `mem://index.md` — note the SEO sync flow

## 8. Out of scope

- True SSR / prerendering of every route (would require migrating to TanStack Start or `vite-plugin-prerender`). Calling out as a future option if the user wants per-route initial HTML for non-JS crawlers.
- Connecting Google Search Console (user action).
- Fixing the Lighthouse contrast finding (separate visual change).
