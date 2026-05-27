# Page sync & accuracy pass

Goal: every page tells the truth about what's working, what's a stub, and what the user still needs to do. Coming-soon is fine — being vague about it isn't.

## Convention to introduce

A small shared `<StatusBadge />` component with three variants:

- `shipped` — green, "Live"
- `setup` — amber, "Needs setup" (with tooltip naming the secret/config)
- `soon` — muted, "Coming soon"

Used inline next to feature names on Index, Pricing, About, Contact, and the dashboard's onboarding checklist so the same vocabulary appears everywhere.

## Per-page changes

### `src/pages/Index.tsx` (landing)
- Auth feature card: split into "Email/password, Google, Apple — Live" and "SMS OTP — Needs Twilio" badges. No more lumping stubs with shipped.
- FAQ entries on Twilio, VAPID, SAML: keep, but link each to the Readme section that lists the exact secrets/steps.
- Logo cloud (Acme/Globex/…): wrap in a dismissible "Template placeholders — replace in `src/pages/Index.tsx`" dev-only ribbon (only visible on the preview/lovable.app host, hidden on custom domains).
- Testimonials: same dev-only ribbon. No content rewrite — user owns that.

### `src/pages/Pricing.tsx`
- Keep the existing "free template" banner.
- Under Team plan's "SSO / SAML" line, add the small `setup` badge + helper text: "Form is live; final activation requires manual provisioning."
- Add a one-line note near the CTA: "Checkout requires Stripe `lookup_keys` (pro_monthly, pro_yearly, team_monthly, team_yearly). See Readme → Stripe."

### `src/pages/About.tsx`
- Add the dev-only "Template copy — personalize before launch" ribbon at the top.
- Fix the "production-ready" sentence to "Auth, billing, teams, and transactional email are wired. SMS and Web Push ship as stubs you can enable."

### `src/pages/Demo.tsx`
- Reconcile duration: pick "30 minutes" everywhere (hero + SEO description).
- Success state: remove "Check your inbox for a calendar link" (no email is sent). Replace with "Thanks — we'll be in touch. You can also reach us at {contact_email}."
- Toast: drop the "within 24h" SLA promise; say "Got it — we'll be in touch."
- Switch the insert target from `lead_submissions` to `leads` (the table that actually exists and is used by Contact). Drop the `as never` cast and silent error swallow.

### `src/pages/Waitlist.tsx`
- Same fix: insert into `leads` with a `source: "waitlist"` field instead of the missing `lead_submissions` table. Surface real errors with a toast.
- Soften copy from "We'll email you the moment access opens" to "We'll be in touch when access opens" until an email trigger exists.

### `src/pages/Contact.tsx`
- "Live chat — Mon–Fri, 9am–5pm UTC" block: replace with an honest "Email is the fastest way to reach us — we reply within 1 business day" line. (No chat widget shipped; don't promise one.)
- When `contact_email` is unset, render a visible amber inline notice on the page (admin-only via `useUserRole`) linking to `/admin/site-settings`. Public visitors still see whatever fallback is configured.

### `src/pages/Accessibility.tsx` and `src/pages/Legal.tsx`
- Replace hardcoded "Last updated: January 1, 2026" with a `lastUpdated` constant per page so the user has one obvious place to bump it.
- Legal pages: keep the placeholder warning (already good). Also add the same dev-only ribbon so it's impossible to miss before launch.

### `src/pages/dashboard/OrgSso.tsx`
- Replace hardcoded `support@example.com` with `{contact_email}` from `useSiteSettings`, falling back to a generic "your admin" string.

### `src/pages/dashboard/Dashboard.tsx` (onboarding checklist)
- Add new checklist items so the user sees the remaining template-owner tasks in one place:
  - "Set your contact email" → `/admin/site-settings` (done when `contact_email` differs from the default placeholder)
  - "Replace placeholder logos & testimonials on the landing page" (manual check-off, persisted in localStorage)
  - "Replace Legal / Privacy / Terms placeholders" (manual check-off)
  - "Configure Stripe `lookup_keys`" (manual check-off, with Readme link)
  - "Optional: enable SMS (Twilio), Web Push (VAPID)" (manual check-off, collapsed under "Optional integrations")

### `src/pages/Readme.tsx`
- Add a new top section: **"What works out of the box vs what needs your input"** — a compact two-column table built from the same source of truth used by the new badges, so Readme and landing stay in sync.

### `src/data/changelog.ts`
- One new entry summarizing this accuracy pass.

## Out of scope
- Writing real Legal/Privacy/Terms text (user's lawyer).
- Wiring Twilio, VAPID, or a real chat widget.
- Redesigning any page — copy and small inline badges only.
- Rewriting About / testimonials with real content.

## Technical notes
- New file: `src/components/marketing/StatusBadge.tsx` — small wrapper around `Badge` with the three variants + optional tooltip.
- New file: `src/components/marketing/TemplatePlaceholderRibbon.tsx` — renders only when `window.location.hostname` ends with `lovable.app` or is `localhost`, so it disappears on custom domains automatically.
- New file: `src/data/featureStatus.ts` — single source of truth (`{ id, label, status, note }[]`) consumed by Index feature cards, Pricing footnotes, Readme table, and the onboarding checklist.
- No DB migrations. No new edge functions.
