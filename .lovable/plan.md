# Marketing site vs. actual app — what's missing, in what order

## What the site promises

From `Index.tsx` (features grid + FAQ + hero) and `Pricing.tsx`:

1. Auth: email/password, Google, **Apple**, **SMS (OTP)**
2. Stripe: subscriptions, customer portal, **plan-gating**, admin billing, **14-day trial**
3. Emails: branded auth + transactional templates, marketing campaigns via Resend
4. Teams & roles, invites
5. Built-in analytics (signups, MRR, churn, retention)
6. **SMS & critical notifications** via Twilio, per-user preferences
7. Secure by default (RLS, roles table, validated inputs)
8. Beautiful UI / dark mode
9. Pricing add-ons: **SSO / SAML**, **Audit logs** (Team tier)

## What we actually have

| Claim | State |
|---|---|
| Email/password + Google + Apple OAuth | ✅ buttons wired; providers must be enabled in Cloud (Apple not yet) |
| SMS / OTP login | ❌ only a `sms_enabled` toggle in preferences |
| Stripe subscriptions + portal + admin | ✅ checkout, webhook, portal, `/admin/subscriptions` |
| Plan-gating | ⚠️ `useSubscription` exists but no gate helper / UI enforcement |
| 14-day trial | ❌ not configured in `create-checkout` |
| Branded auth + transactional emails | ✅ full pipeline incl. queue + suppression |
| Marketing campaigns (Resend) | ✅ broadcasts + segments + recipients |
| Teams, invites, roles | ✅ orgs, invites, member mgmt |
| Built-in analytics | ✅ `/admin/analytics` w/ MRR, signups, churn |
| Notification prefs | ✅ UI; delivery side missing for in-app/push/SMS |
| In-app notification bell | ⚠️ `notifications` table exists, **no bell UI** |
| Push notifications | ❌ no service worker, no token store |
| SSO / SAML | ❌ pricing claim only |
| Audit logs | ❌ pricing claim only |
| Secure / RLS / roles table | ✅ |
| Design system, dark mode | ✅ |

## Recommended build order

Sequenced so each step lands a self-contained piece of value and earlier work doesn't get rewritten. Everything is structured so external services (Twilio, Resend keys, Apple/SAML providers, real Stripe products) only need credentials swapped in later — no rewiring.

### 1. In-app notification bell (1 PR, no external deps)
- Header `<NotificationBell />` on `DashboardShell` and `AdminShell` reading from existing `notifications` table.
- Realtime subscribe; mark-as-read; "see all" drawer.
- Helper edge function `notify-user` (service role insert) so backend code has one place to fire notifications. Already respects `notification_preferences.in_app_enabled`.
- **Why first:** unblocks every later feature that wants to ping the user; no API keys required.

### 2. Audit logs (Team-tier promise)
- New table `audit_log(id, actor_user_id, organization_id, action, target_type, target_id, metadata, created_at)` + admin-only RLS + grants.
- `log_audit(...)` SQL helper + `logAudit()` TS helper used from existing flows: invite sent/accepted, role change, org delete, subscription change, admin user edits.
- `/admin/audit` page (table + filters by actor/action/date).
- Org-scoped view under `/dashboard/organization/audit` (owners/admins only).

### 3. Plan-gating helper (turns Stripe data into UX)
- `usePlan()` returning `{ plan, limits, isAtLeast('pro'|'team') }` driven by `subscriptions.price_id` mapping.
- `<RequirePlan tier="pro">` component for guarding routes/sections; soft upsell card when blocked.
- Apply to: extra org seats > Free limit, "Marketing emails" admin actions, SSO/audit-log pages.
- 14-day trial: add `trial_period_days: 14` to `create-checkout` session params + surface "Trial ends …" banner in `/dashboard/billing`.

### 4. SMS / OTP login (Twilio-ready, no key needed)
- Add **Phone** tab to `/auth` and `/signup` (input + 6-digit code via shadcn `input-otp`).
- Use `supabase.auth.signInWithOtp({ phone })` + `verifyOtp`. Works the moment Twilio is configured in Cloud auth — zero code change.
- `phone` already on `profiles`; surface verification badge in Profile tab.
- Critical-event SMS: stub `send-sms` edge function with a clear `TODO: configure Twilio` block; gate sends behind `sms_enabled` + verified phone.

### 5. SSO / SAML scaffold (Team-tier promise)
- `/dashboard/organization/sso` page (owner-only, plan-gated to Team) with:
  - Metadata URL / IdP entity ID / ACS URL fields stored in new `org_sso_config` table.
  - "Test connection" button calls edge function that wraps Supabase's SAML admin API.
- Show a clear "Contact us to finish provisioning" state until the project enables SAML in Cloud — no behavior breaks before then.

### 6. Push notifications (browser)
- Service worker (`public/sw.js`) + Web Push subscription stored in `push_subscriptions` table.
- "Enable browser notifications" button in NotificationsTab, gated on `push_enabled`.
- `send-push` edge function stub using VAPID keys (env vars, easy swap).
- Fan-out from `notify-user` helper from step 1.

### 7. Polish + truth-in-marketing
- Wire trial CTA copy ("14-day trial") to actual `trial_period_days` from step 3.
- Update FAQ + features list to reflect Apple/SMS/SSO statuses (e.g. "SSO available on Team — contact us" until real provider is added).
- README section: "Before you launch — flip these switches" (Apple provider, Twilio creds, Resend domain verify, Stripe live keys, VAPID push keys, SAML metadata).

## Out of scope (intentionally)
- Actually populating Twilio / Resend / Apple / SAML credentials.
- Custom-domain self-serve, dedicated success manager, 99.9% SLA — sales copy, not features.
- Rewriting any current admin/dashboard chrome.

Approve and I'll start with **Step 1 (notification bell)**.
