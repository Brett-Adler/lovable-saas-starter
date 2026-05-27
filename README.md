# SaaS Starter

A complete, production-shaped SaaS starter: auth, payments, teams, emails,
analytics, notifications, audit logs, and admin tooling — already wired up.
Replace the branding, swap in your credentials, and ship.

**Live demo:** https://lovable-saas-starter.lovable.app

## What's included

Ordered to match the feature grid on the landing page.

- **Auth, batteries included** — email/password, Google OAuth, Apple OAuth,
  and SMS OTP (Twilio-ready). Branded auth emails out of the box.
- **Stripe payments** — Checkout, customer portal, 14-day trial, plan-gating
  via `usePlan()` + `<RequirePlan>`, and a full admin billing dashboard.
- **Branded emails** — auth and transactional React Email templates, plus
  marketing campaigns with segments, recipients, and a suppression list.
- **Teams & roles** — organizations, invites, and role-based access
  (owner / admin / member) with a dedicated `user_roles` table.
- **Built-in analytics** — self-hosted dashboard: MRR, signups, churn,
  retention, plan mix.
- **SMS & notifications** — in-app notification bell with realtime updates,
  browser Web Push (VAPID-ready), SMS via Twilio, and per-user preferences.
- **Audit logs** — every privileged action (membership changes, invites,
  role grants/revokes) is recorded automatically via DB triggers. Admin
  viewer at `/admin/audit`.
- **SSO scaffold** — per-org SAML config UI at
  `/dashboard/organization/sso`, gated to the Team plan.
- **Secure by default** — RLS on every public table, explicit `GRANT`s,
  separate `user_roles` table with a security-definer `has_role` function.
- **Beautiful UI** — themable design system, light + dark mode, semantic
  tokens, no hardcoded colors.
- **Admin** — users, organizations, subscriptions, leads, broadcasts, audit
  log, site settings, analytics.

## Pricing tiers

Mirrors `/pricing` — keep the two in sync when you change either.

| Tier  | Price (yearly) | Highlights                                              |
| ----- | -------------- | ------------------------------------------------------- |
| Free  | $0             | 3 projects, 1 seat, basic analytics                     |
| Pro   | $15/mo         | Unlimited projects, 10 seats, custom domain, marketing emails |
| Team  | $39/mo         | Unlimited seats, SSO/SAML, audit logs, 99.9% SLA        |

The 14-day trial is set in `supabase/functions/create-checkout/index.ts`.

## Quick start

```bash
npm install
npm run dev
```

Lovable Cloud auto-provisions the backend — no separate Supabase account
needed. Database migrations live in `supabase/migrations/` and run
automatically. Edge functions in `supabase/functions/*` deploy on save.

## Before you launch — pre-launch checklist

The app runs out of the box, but a handful of external services need
credentials before they actually deliver. Each item is a credential swap,
not a code change.

### Required

- **Stripe (live mode)** — replace test products with real ones, point
  `STRIPE_API_KEY` and webhook secret at your live account. See
  `supabase/functions/create-checkout/index.ts`.
- **Email sending domain** — verify your sending domain in Resend (or your
  provider) and update `site_settings.from_email` from the admin panel.

### Optional, but recommended

- **Apple Sign-In** — enable the Apple provider in Lovable Cloud → Users
  → Auth Settings → Providers. Frontend button is already wired.
- **Twilio (SMS)** — provision a phone number and add `TWILIO_ACCOUNT_SID`,
  `TWILIO_AUTH_TOKEN`, `TWILIO_FROM_NUMBER` secrets. Uncomment the Twilio
  block in `supabase/functions/send-sms/index.ts`. Then enable the Phone
  provider in auth settings so OTP login starts working too.
- **Web Push** — generate VAPID keys with `npx web-push generate-vapid-keys`.
  Add `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `VAPID_SUBJECT` as secrets.
  Set `VITE_VAPID_PUBLIC_KEY` in the env file. Uncomment the web-push block
  in `supabase/functions/send-push/index.ts`.
- **SAML SSO** — when a customer fills in the SSO form at
  `/dashboard/organization/sso`, use the `configure_saml_sso` tool (or
  Lovable Cloud → Auth → SSO) to provision their identity provider. The
  ACS URL and Entity ID are pre-filled on that page.
- **Custom domain** — point your domain at Lovable and update `site_settings`
  with your contact email and social links.

## Branding

See `public/BRANDING.md` for the list of swappable files (logos, favicon,
social images). Drop your files in `/public` with matching names — no code
changes required.

## Architecture notes

- Roles live in a dedicated `user_roles` table with a security-definer
  `has_role` function. Never store roles on the profile.
- All public-schema tables have explicit `GRANT`s alongside their RLS
  policies — Lovable Cloud doesn't grant Data API access by default.
- Edge functions live in `supabase/functions/*`. Most use `verify_jwt = false`
  because the signing-keys system requires in-code JWT validation.
- The Stripe webhook (`payments-webhook`) is the source of truth for
  subscription state; `useSubscription` and `usePlan` read from the
  `subscriptions` table populated by the webhook.
- **Notifications** use Supabase Realtime on `public.notifications`.
  Server-side fan-out goes through the `notify-user` edge function, which
  respects each user's `notification_preferences` row.
- **Audit log** is append-only via the `log_audit()` security-definer
  function. Triggers on `organization_members`, `organization_invites`, and
  `user_roles` handle the common cases automatically.
- **Plan tier resolution** is centralized in `src/hooks/usePlan.tsx`. Gate
  UI with `<RequirePlan tier="pro" />` or `<RequirePlan tier="team" />`.

## FAQ

The landing page FAQ (`/#faq`) is the canonical user-facing answer. This
README is the developer view — keep both in sync when shipping new features.
