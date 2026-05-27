## Audit summary

I walked the marketing pages, Readme/Docs, roadmap data, edge functions, and the configured secrets. Most of what the site claims is already true; the gaps are small and mostly about **honesty in copy** and a **single launch checklist** so a remixer knows exactly what to flip on.

### What's accurate today

- Auth (email + password, Google, Apple, magic links via reset), orgs/invites/roles, in-app notifications, audit log, brand-kit generator, admin analytics, sitemap/SEO, brand pages — all live and match the docs.
- Transactional + auth emails — actually shipped (uses Lovable's managed email on notify.voicept.com, no extra key needed).
- Stripe — wired end-to-end against the sandbox key that's already configured. Test checkout works.
- SMS / Web Push / SAML SSO / marketing broadcasts — honestly labelled "Needs setup" with the exact secret names.

### Inaccuracies the audit found

1. **Landing claims marketing broadcasts are `shipped`** (`src/pages/Index.tsx:29` feature card). They actually require `RESEND_API_KEY` + verified domain — should be `setup` to match `featureStatus.ts`.
2. **Roadmap lists `data-export` as `soon`**, but `/dashboard/settings/data` already ships a working JSON export. Status should be `shipped` (delete-account stays "soon" since it's still a request queue).
3. **Readme route list doesn't include `/docs`** even though we just added it. Same for `/roadmap`, `/status`, `/integrations`, `/security`, `/compare`, `/customers`, `/blog`.
4. **Readme "Phase 6 — Marketing email (Resend) ✅"** is misleading — the pipeline is built but inert without `RESEND_API_KEY`. Re-label as "wired, needs key".
5. **No single launch checklist.** Setup steps for Stripe live keys, Resend domain, Twilio, VAPID, Apple production credentials, and SAML are spread across the Readme. A remixer has to hunt.

### What still needs to be built (small)

Only one new surface: a **Launch checklist page** that turns the scattered "needs setup" guidance into a single ordered list a non-technical operator can work through. Everything else is copy edits.

## Changes

1. **`src/data/featureStatus.ts`** — flip `marketing-email` summary wording to match copy update; flip `data-export` references.
2. **`src/data/roadmap.ts`** — change `data-export` to `status: "shipped"`, `href: "/dashboard/settings/data"`, update summary to "Download all your data as JSON. Self-serve account deletion still on the way."
3. **`src/pages/Index.tsx`** — change the Branded emails card to two truthful lines: "Transactional + auth emails: live" and "Marketing broadcasts: add Resend key" with `status="setup"` badge; update the FAQ entry to reflect marketing email as setup-required.
4. **`src/components/docs/ReadmeContent.tsx`** — update the public routes card (add `/docs`, `/roadmap`, `/status`, `/integrations`, `/security`, `/compare`, `/customers`, `/blog`); change Phase 6 line to "Marketing email pipeline (wired, add RESEND_API_KEY to enable)"; add a one-line link to the new `/launch` checklist near the top.
5. **New `src/pages/Launch.tsx`** + route `/launch`:
   - Hero: "Launch checklist".
   - Ordered cards, each with status pill (`Done` / `Needs you`), what to do, and where to do it. Items:
     - ✅ Brand & SEO (link to `/admin/brand`, `/admin/seo`, `/admin/site-settings`)
     - ✅ First admin (auto-promoted)
     - ✅ Legal pages (link to `/privacy`, `/terms`, mark "replace placeholder text")
     - 🟡 Stripe — swap sandbox key for live `STRIPE_API_KEY`, create products with the four documented `lookup_keys`, set live webhook → `payments-webhook`
     - 🟡 Marketing email — add `RESEND_API_KEY`, verify sending domain
     - 🟡 SMS OTP — add `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM_NUMBER`
     - 🟡 Web Push — generate VAPID keys, add `VAPID_PUBLIC_KEY` / `VAPID_PRIVATE_KEY` / `VAPID_SUBJECT`
     - 🟡 Apple Sign-In — swap managed credentials for your own Apple Developer credentials (optional)
     - 🟡 SAML SSO — submit IdP metadata from `/dashboard/organization/sso` (per-workspace)
     - ✅ Publish — link to publish flow
   - Static page — no live secret detection (we can't read secrets from the client). Status pills show "Done" for things the starter ships with and "Needs you" for credential-gated items.
6. **Wire `/launch`**: `src/App.tsx`, `src/lib/public-routes.ts` (Resources group, above Setup guide), `src/components/marketing/MarketingHeader.tsx` (replace Roadmap? — no, keep both; header is fine with 6 links), `src/pages/Docs.tsx` (add to the quick-links grid).
7. **`src/data/changelog.ts`** — one entry: "Launch checklist page + honesty pass on what's live vs needs setup."

## Out of scope

- No new edge functions, no DB migrations, no secret additions. The point of this pass is to make the site honest and give the operator a single checklist — not to add features.
- No live-secret detection in the UI (would need an admin-only edge function to introspect available env vars; not worth the surface for v1).

## Files

- New: `src/pages/Launch.tsx`.
- Edited: `src/App.tsx`, `src/lib/public-routes.ts`, `src/components/marketing/MarketingHeader.tsx`, `src/pages/Docs.tsx`, `src/components/docs/ReadmeContent.tsx`, `src/pages/Index.tsx`, `src/data/featureStatus.ts`, `src/data/roadmap.ts`, `src/data/changelog.ts`.
