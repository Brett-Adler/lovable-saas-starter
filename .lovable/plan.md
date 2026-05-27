## Goal

Close the loop on every "missing" item: ship the small ones, give the rest a real Coming-Soon page with email capture (writes to `leads` with `source=<feature>`), and link everything from one `/roadmap`.

## Triage

### Cheap wins — build for real

| Item | Route | What ships |
|---|---|---|
| Roadmap index | `/roadmap` | One page listing every entry below + already-known stubs, sourced from a new `src/data/roadmap.ts`. Per-item "Notify me" → leads. |
| Status page | `/status` | Static page with uptime promise, link to incident history (placeholder list), components: Auth / DB / Email / Payments shown green by default. Cheap, no monitoring wired. |
| Integrations directory | `/integrations` | Card grid (Stripe Live, Google Live, Apple Live, Resend Setup, Twilio Setup, Web Push Setup, Crisp Coming-soon, Zapier Coming-soon, Slack Coming-soon, Webhooks Coming-soon) driven by `featureStatus.ts` + new entries. |
| Security / Trust page | `/security` | Honest summary: RLS, audit log, JWT rotation, brand-kit, SOC2 = Coming soon. Pulls from existing security memory tone. |
| Compare page | `/compare` | Single page stub: "vs build-it-yourself" table. Marked dev-only ribbon. |
| Customers / Case studies | `/customers` | Coming-soon hero + email capture (source=`customers`). Adds to footer. |
| Blog | `/blog` | Coming-soon hero + email capture (source=`blog`). |
| Dashboard → Security (2FA) | `/dashboard/settings/security` | Real settings page with a disabled "Enable 2FA (TOTP)" toggle + Coming-soon badge + "Notify me" → leads(source=`2fa`). Lists active sessions area as Coming-soon. |
| Dashboard → API keys | `/dashboard/settings/api-keys` | Page with explainer, disabled "Create key" button, Coming-soon badge, notify-me. |
| Dashboard → Webhooks | `/dashboard/settings/webhooks` | Same shape as API keys. |
| Dashboard → Data export | `/dashboard/settings/data` | "Export my data (JSON)" — wired, queries `profiles`, `organization_members`, `audit_log` (own rows) and downloads JSON. "Delete my account" — opens confirm + writes a `leads` row with `source=account_deletion` for manual handling (no destructive auth call). |

### Surface only — no new pages

- Add `Coming soon` / `Needs setup` badges to existing nav items where applicable (Admin sidebar: Broadcasts already setup-flagged; Dashboard sidebar: new Security/API/Webhooks items get badges).
- Footer: add Roadmap, Status, Security, Integrations, Customers, Blog links under a new "Resources" column.
- Marketing header: add "Roadmap" link in the secondary menu.

### Already-known stubs — re-link, don't rebuild

SMS OTP, Web Push, Resend marketing, SAML → already in `featureStatus.ts`. Roadmap page renders them with their existing notes and links to the relevant admin/dashboard pages.

## New data model

`src/data/roadmap.ts` — superset of `featureStatus.ts`, adds:
```
{ id, label, summary, status: 'shipped'|'setup'|'soon'|'planned',
  category: 'auth'|'billing'|'team'|'developer'|'comms'|'compliance'|'marketing',
  notifySource?: string,  // leads.source for the notify form
  href?: string }         // where Live items link to
```
`featureStatus.ts` keeps its slimmer shape; both arrays share IDs so the Readme/onboarding stay in sync.

## New shared components

- `src/components/marketing/ComingSoonHero.tsx` — title, blurb, status pill, inline email field that POSTs to `leads` with the given `source`. Reused by `/customers`, `/blog`, `/compare`, and dashboard stubs.
- `src/components/marketing/RoadmapList.tsx` — groups roadmap entries by category, renders status badges + notify buttons.
- `src/components/dashboard/SettingsSidebar.tsx` (or extend existing nav) — adds Security / API keys / Webhooks / Data tabs with badges.

## Files

**New pages:** `src/pages/Roadmap.tsx`, `Status.tsx`, `Integrations.tsx`, `Security.tsx`, `Compare.tsx`, `Customers.tsx`, `Blog.tsx`, `dashboard/settings/Security.tsx`, `dashboard/settings/ApiKeys.tsx`, `dashboard/settings/Webhooks.tsx`, `dashboard/settings/Data.tsx`.

**New components/data:** `ComingSoonHero.tsx`, `RoadmapList.tsx`, `src/data/roadmap.ts`.

**Edited:** `src/App.tsx` (12 new routes), `MarketingHeader.tsx`, `MarketingFooter.tsx`, `Dashboard.tsx` settings nav, `featureStatus.ts` (add Roadmap/Status/2FA/API-keys/Webhooks/Data-export entries so the onboarding checklist mentions them), `src/data/changelog.ts` (one entry).

## Out of scope

- Real 2FA, API key issuing, webhook delivery, status monitoring, blog CMS, case-study CMS, live chat — all explicitly Coming-soon.
- No DB migrations; everything reuses the existing `leads` table.
- No new edge functions.

## Verification

- Click every new route from footer/nav and confirm renders.
- Submit a "Notify me" on one Coming-soon page and confirm a row appears in `leads` with correct `source`.
- Confirm Readme table + Dashboard onboarding still match `featureStatus.ts`.
