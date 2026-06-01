## Goal

Replace the "illustrative placeholder" mockups with real screenshots of this app's pages, framed in a polished macOS-style window with a gradient backdrop. Surface them on the home page and a brand-new `/features` page.

## Screenshots to capture

Using the browser tool against the preview (logged in as the current preview user), capture these routes at 1440x900:

1. `/dashboard` — main dashboard
2. `/admin/analytics` — analytics
3. `/dashboard/billing` — billing
4. `/dashboard/members` — team / members
5. `/admin/users` — users admin
6. `/admin/audit` — audit log

If a route requires auth and the preview session isn't logged in, I'll pause and ask you to sign in once, then continue.

Each PNG runs through the `product-shot` skill (different gradient presets per shot for variety: `sunset`, `aurora`, `ocean`, `lavender`, `arctic`, `midnight`) and is uploaded via `lovable-assets` so it lives on the CDN, not in the repo. Pointer files land in `src/assets/screenshots/`.

## Home page (`src/pages/Index.tsx`)

- Keep the existing hero explainer video.
- In the Features section, **replace** the two `AppMockup` placeholders (analytics + billing) with the real framed screenshots of `/admin/analytics` and `/dashboard/billing`. Drop the "Illustrative placeholders — not real product screens." caption.

## New `/features` page (`src/pages/Features.tsx`)

A long-form page with one screenshot per major feature. Structure:

- `PageSeo` (title "Features — SaaS Starter", proper description)
- `MarketingHeader` + `MarketingFooter` (match other marketing pages)
- Hero: badge "Features", H1 "Everything a SaaS needs, already built", short subhead, primary CTA → `/signup`, secondary → `/pricing`
- 6 alternating zigzag feature blocks (image left/right swap each row), each with:
  - Small eyebrow label, H2, 1-paragraph description, 3-item check bullet list, "Learn more" link
  - Framed real screenshot on the other side
  - Sections: Dashboard, Analytics, Billing & subscriptions, Teams & roles, User admin, Audit log
- Closing CTA band reusing the home-page CTA style

Register the route in `src/App.tsx` (public) and add a "Features" link to `MarketingHeader` nav between Home and Pricing. Add `/features` to `src/data/sitemap.ts` if it exists.

## Technical details

- Screenshots saved temporarily to `/tmp/shots/`, framed PNGs written to `/tmp/framed/`, then uploaded via `lovable-assets create --file ... --filename <name>.png > src/assets/screenshots/<name>.png.asset.json`. Originals deleted from `/tmp`.
- Import pattern in components:
  ```tsx
  import analyticsShot from "@/assets/screenshots/analytics.png.asset.json";
  <img src={analyticsShot.url} alt="Analytics dashboard" loading="lazy" width={1600} height={1000} />
  ```
- No new dependencies, no backend/data changes, no business logic touched.
- Append a changelog entry in `src/data/changelog.ts` per the changelog policy.

## Out of scope

- Changing `AppMockup` itself (left in place — still used elsewhere).
- Editing dashboard/admin pages to look prettier for the screenshot.
- Redesigning the home Features grid or copy.
