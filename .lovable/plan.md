# Building, testing & delivering the homepage feature set

The landing page promises 8 capabilities. Phases 1–4 are done (auth, teams/roles/invites, dashboard shell, public marketing site, admin shell, /readme). Here's the proposed plan for the rest, in dependency order. Each phase is a self-contained shippable milestone with its own test pass.

## What's already done ✅
- Auth (email/password, Google, Apple, reset, protected routes)
- Teams: organizations, members, invites, accept-invite flow, role-gated nav
- Admin shell + first-user-auto-admin
- Marketing site (landing, pricing, about, contact, legal, /readme)
- Design system (HSL tokens, dark mode, shadcn variants)

## Phase 5 — Stripe billing
- Enable Stripe via Lovable's built-in integration
- Products & prices defined in dashboard, synced into `subscriptions` table
- `/dashboard/billing` shows current plan + opens Stripe Customer Portal
- Webhook edge function keeps `subscriptions` row in sync (status, period, cancel_at_period_end)
- Plan-gating helper `useSubscription()` for feature flags
- **Test**: subscribe in Stripe test mode → row appears → portal cancel updates row → admin sees all subs

## Phase 6 — Branded emails (auth + transactional)
- Set up email domain (user provides domain → NS records → Lovable verifies)
- Scaffold auth email templates (signup, magic link, recovery, invite, email-change)
- Scaffold transactional pipeline + templates:
  - `invite-teammate` (replaces default Supabase invite copy with branded org-invite)
  - `welcome` (after signup)
  - `subscription-receipt` (after Stripe checkout)
  - `password-changed` (security notice)
- All templates use brand colors from `index.css`
- **Test**: trigger each flow → check inbox → verify unsubscribe footer on transactional

## Phase 7 — SMS & notifications
- Twilio connector for SMS OTP login + critical alerts
- Add phone-OTP option to `/login`
- Build `/dashboard/notifications` (in-app feed reads `notifications` table)
- Wire `notification_preferences` UI in `/dashboard/settings` (email_marketing, email_security, email_product, sms_enabled, push_enabled, in_app_enabled)
- Realtime subscription on `notifications` table so bell icon updates live
- Helper `notifyUser(userId, {title, body, link, channels})` chooses email/SMS/in-app based on prefs
- **Test**: SMS OTP login works, security-critical event fans out to enabled channels only

## Phase 8 — Built-in analytics dashboard
- Client SDK wrapper around `analytics_events` table (page views, signups, conversions)
- Auto-track: page views, signup, login, subscription started/canceled, invite sent/accepted
- `/admin/analytics` page with cards: signups (7/30/90d), MRR, active subs, churn %, retention cohort, top pages
- Charts via Recharts; date-range picker
- **Test**: simulate events → numbers match `select count` queries

## Phase 9 — Security hardening + polish
- Run security scanner, fix findings
- Enable HIBP leaked-password check
- Audit RLS on every table (already mostly good — verify with scanner)
- Rate-limit sensitive edge functions
- Add `robots.txt` + canonical tags + JSON-LD on marketing pages (SEO pass)
- Lighthouse pass on landing page (perf, a11y, SEO ≥ 95)
- Final QA: every link on /readme works, dark mode on every page, mobile responsive

## Delivery
After each phase: publish update, mark phase done in plan, brief changelog. Final delivery = publish + custom domain hookup.

---

**Suggested order**: 5 → 6 → 7 → 8 → 9. Stripe first because billing emails (Phase 6) and revenue analytics (Phase 8) depend on it.

**Where do you want to start?** Default is Phase 5 (Stripe). If you'd rather start with branded emails or skip Stripe for now, say so and I'll re-sequence.