
# SaaS Starter Template

A batteries-included starter for SaaS apps on Lovable. Friendly & colorful design, light + dark mode, fully wired backend.

## 1. Branding & Asset Scaffolding

A clearly organized `public/` folder with placeholder files the user just swaps:

```text
public/
├── favicon.ico
├── favicon.svg
├── favicon-16x16.png
├── favicon-32x32.png
├── apple-touch-icon.png         (180x180)
├── android-chrome-192x192.png
├── android-chrome-512x512.png
├── safari-pinned-tab.svg
├── mstile-150x150.png
├── og-image.png                 (1200x630)
├── twitter-image.png            (1200x600)
├── logo.svg, logo-mark.svg, logo-dark.svg
├── site.webmanifest             (PWA + shortcuts)
└── browserconfig.xml
```

`index.html` pre-wired: full favicon set, apple-touch-icon, manifest, theme-color, Open Graph + Twitter card tags, canonical URL, description. `public/BRANDING.md` lists each file's purpose and exact dimensions for easy swapping.

## 2. Marketing Site (public)

- **Landing** (`/`) — sticky nav, hero + CTA, logo cloud, feature grid, "how it works", testimonials, pricing preview, FAQ, footer
- **Pricing** (`/pricing`) — Free / Pro / Team cards, monthly-yearly toggle, comparison table
- **About**, **Contact** (with email confirmation), **Blog** stub
- **Legal** — `/privacy`, `/terms`
- **Newsletter widgets** in hero + footer (and a dedicated `/newsletter` page) feeding the marketing list
- Shared marketing header + footer

## 3. Authentication

- Email + password (signup, login, forgot/reset password with `/reset-password` page)
- Google OAuth, Apple OAuth
- Phone (SMS OTP) sign-in via Twilio
- Pages: `/login`, `/signup`, `/forgot-password`, `/reset-password`, `/verify-email`
- Session persistence + auto-refresh, protected route wrapper

## 4. App Shell (authed)

- Top nav: logo, primary nav, search, notifications bell, org switcher, user avatar dropdown
- Collapsible sidebar; mobile drawer
- Light/dark mode toggle
- `/dashboard` with example widgets (signups, revenue, active users)

## 5. Account / Settings

`/settings` with tabs:
- **Profile** — name, avatar, bio, timezone
- **Account** — email change (verification), password, phone (SMS verify), connected OAuth providers
- **Notifications** — per-channel (in-app / email / SMS) toggles per category, plus marketing email opt-in/out
- **Billing** — current plan, upgrade/downgrade, invoices, payment method, Stripe customer portal
- **Team** — org name, members, invite by email, roles (Owner/Admin/Member), pending invites, leave org
- **Security** — active sessions, sign out everywhere, delete account
- **API keys** — generate/revoke personal API keys

## 6. Teams / Organizations

- Users belong to one+ orgs; org switcher in header
- Invite flow: invite email → accept link → join org
- Roles enforced via separate `user_roles` table + `has_role()` security definer

## 7. Payments — Stripe (Lovable built-in)

**End-user side:**
- Pricing page → Stripe checkout
- Subscription per organization
- Customer portal for payment method, invoices, cancellation
- Plan-gating helper (`requirePlan('pro')`)
- Sample products: Free, Pro $19/mo, Team $49/mo
- Webhook handler updating subscription status

**Super-admin side (`/admin/billing`):**
- View all customers + subscriptions, search/filter
- Change plan, comp/free account, cancel subscription, issue refund
- View invoice history per customer
- MRR, churn, active subscription counts at top

## 8. Auth + Transactional Email (Lovable built-in)

- Branded auth emails (verification, magic link, password reset, email change, invite)
- Transactional templates: welcome, contact confirmation, team invite, subscription receipt, plan-change, password-changed, lead-capture confirmation
- Styled to match brand colors

## 9. Marketing Email — Resend (separate subdomain)

- Resend connector on a different subdomain (e.g. `mail.example.com`) so it doesn't conflict with Lovable's `notify.` subdomain for auth/transactional
- **Subscribers DB**: `marketing_subscribers` (email, source, status, tags, subscribed_at, unsubscribed_at)
- **Newsletter signup widgets** (hero, footer, dedicated page) write to subscribers
- **Admin composer (`/admin/marketing`)**:
  - List subscribers with search, filters by tag/status, CSV export, manual add/import
  - Segments (by tag, plan, signup date)
  - Campaign composer: subject, from name, rich-text body, preview, send test, schedule or send now
  - Campaign history with open/click counts (from Resend webhooks)
  - One-click unsubscribe link in every email; unsubscribe page in app
- Hard separation: marketing sends never go through the transactional pipeline

## 10. Lead Capture Forms

- **Contact form** (`/contact`) — sends transactional confirmation, lands in admin inbox
- **Demo request form** (`/demo`)
- **Waitlist form** (`/waitlist`)
- All submissions stored in `lead_submissions` (type, payload JSON, status, assigned_to)
- Admin inbox (`/admin/leads`) — list, filter by type/status, view detail, mark contacted, export CSV
- Each form: client + server-side Zod validation, honeypot + rate limit

## 11. SMS / Phone (Twilio connector)

- Phone OTP login
- SMS notifications for opted-in users (critical alerts only)
- Phone verification in account settings
- `send-sms` edge function

## 12. In-app Notifications

- `notifications` table + bell dropdown, unread badge
- Per-channel preferences (in-app / email / SMS) per category
- Toast feedback (sonner)

## 13. Analytics — Built-in (self-hosted)

- **Event tracking**: `analytics_events` table (event_name, user_id, org_id, properties JSON, timestamp); lightweight `track()` helper auto-fires on signup, login, page_view, checkout_started, subscription_created, plan_changed, churned, lead_submitted, newsletter_subscribed
- **Admin dashboard (`/admin/analytics`)**:
  - **Acquisition**: new signups (day/week/month), signup source breakdown, newsletter growth
  - **Activation**: % verified, % completed onboarding, time-to-first-action
  - **Engagement**: DAU / WAU / MAU, page views, top pages
  - **Revenue**: MRR, ARR, MRR change, new vs expansion vs churn, ARPU, LTV estimate
  - **Retention**: cohort table, churn rate, cancellation reasons
  - **Marketing**: campaign opens/clicks, newsletter unsubscribe rate
- All charts via recharts; date-range picker; CSV export
- **Per-user dashboard** (`/dashboard`) shows the user's own activity slice

## 14. Admin Area (`/admin`)

Super-admin only (role check via `has_role(user, 'super_admin')`):
- `/admin` — overview (key metrics)
- `/admin/users` — list, search, impersonate, suspend, change role, delete
- `/admin/orgs` — list, view members, change plan
- `/admin/billing` — see section 7
- `/admin/leads` — see section 10
- `/admin/marketing` — see section 9
- `/admin/analytics` — see section 13
- `/admin/feature-flags` — simple table-driven flags

## 15. Design System

- Friendly & colorful: warm coral/orange primary, playful secondary accent, generous rounded corners, soft shadows
- Full HSL token system in `index.css` (primary, accent, success, warning, etc.)
- Light + dark mode
- Tailwind extended with brand tokens, gradients, shadows
- Inter font
- All shadcn components themed consistently

## Technical Setup

- Lovable Cloud enabled (auth, DB, storage, edge functions)
- Tables: `profiles`, `user_roles`, `organizations`, `org_members`, `invites`, `subscriptions`, `notifications`, `notification_preferences`, `contact_submissions`, `lead_submissions`, `marketing_subscribers`, `marketing_campaigns`, `marketing_sends`, `analytics_events`, `api_keys`, `feature_flags`
- All tables RLS-enabled; roles via `has_role()` security definer
- Stripe enabled via `enable_stripe_payments`; sample products via `batch_create_product`
- Email infra via `setup_email_infra` + auth + transactional template scaffolding
- Twilio + Resend connectors
- `README.md` walking through: replacing branding assets, configuring Stripe products, OAuth providers, Resend setup, customizing emails, granting super-admin role

## Out of Scope

- Actual product features (this is a shell)
- Third-party product analytics (PostHog etc.)
- A/B testing framework

After approval I'll enable Cloud, payments, email, Twilio, Resend in sequence, then build the schema and UI.
