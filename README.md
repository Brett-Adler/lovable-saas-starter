# SaaS Starter

A complete, production-shaped SaaS starter: auth, payments, teams, emails,
analytics, notifications, and admin tooling — already wired up. Replace the
branding, swap in your credentials, and ship.

## What's included

- **Auth** — email/password, Google OAuth, Apple OAuth, SMS OTP (Twilio-ready).
- **Payments** — Stripe Checkout, customer portal, plan-gating, 14-day trial,
  admin billing dashboard.
- **Email** — branded auth and transactional templates, marketing campaigns
  with segments and recipients, email suppression list.
- **Teams** — organizations, invites, role-based access (owner / admin / member).
- **Notifications** — in-app bell with realtime, browser push (VAPID-ready),
  SMS (Twilio-ready), per-user preferences.
- **Analytics** — built-in dashboard with MRR, signups, churn, retention.
- **Audit logs** — every privileged action (invite, role change, member
  changes) is recorded with actor and metadata. Admin-only viewer.
- **SSO scaffold** — per-org SAML config UI, gated to the Team plan.
- **Admin** — users, organizations, subscriptions, leads, broadcasts, audit
  log, site settings, analytics.

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
  block in `supabase/functions/send-sms/index.ts`. Then enable Phone provider
  in auth settings so OTP login starts working too.
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
