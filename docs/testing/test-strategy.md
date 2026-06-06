# Test Strategy

> Source of truth for QA + launch readiness. Edit this freely — `/test` reads
> live scan data, but the goals, risks, owners, and exit criteria below come
> from here.

**Launch target:** Public launch
**Generated:** 2026-06-06

## Goals

1. Ship a SaaS template that public visitors can trust on first impression
   (no broken pages, fast LCP, accessible).
2. Guarantee multi-tenant isolation — no org can see another org's data.
3. Keep the payments + auth + invite flows green between releases.

## Critical workflows

The user confirmed "all major features" matter. The launch checklist treats
these as blocking until each has at least one happy-path test or manual
verification noted here:

- **Auth** — sign up, log in (email + Google), forgot/reset password.
- **Organizations** — create org, invite teammate, accept invite, switch org,
  change member role, leave org.
- **Billing** — start checkout (test mode), return from Stripe, webhook
  activates subscription, customer portal opens.
- **Newsletter** — subscribe, double opt-in confirm, unsubscribe.
- **Marketing pages** — `/`, `/pricing`, `/features`, `/blog`, `/changelog`,
  `/roadmap`, `/status`, `/docs/*` all render without console errors.
- **Admin** — admin login, list users, view audit log, edit blog/about/SEO,
  send broadcast.
- **Dashboard** — settings tabs (profile, notifications, security, API keys,
  webhooks, data export).
- **Support chat** — opens, sends message, edge function responds.

## Risks (ranked)

1. **Privilege escalation via roles** — roles live in `user_roles` via the
   `has_role` security-definer function. Any RLS regression here breaks
   tenant isolation. Covered by security memory invariants.
2. **Stripe webhook drift** — environment-aware (test vs live). A misrouted
   webhook silently fails to upgrade users.
3. **Email pipeline** — depends on `PUBLIC_SITE_NAME`, `PUBLIC_SITE_URL`,
   `SENDER_DOMAIN` env vars. Missing/wrong values send broken emails.
4. **Public-schema GRANTs** — every new table needs the
   `CREATE TABLE → GRANT → ENABLE RLS → CREATE POLICY` ordering, or the app
   silently breaks at runtime.
5. **Lighthouse regressions** — published-build only. Source can look fine
   while last published build still fails.

## Environments

| Env | URL | Stripe | Notes |
| --- | --- | --- | --- |
| Local preview | `id-preview--*.lovable.app` | test mode | Auth + emails work; sandbox DB |
| Published | `lovable-saas-starter.lovable.app` | test mode by default | Update via Publish to refresh |
| Production | custom domain (TBD) | switch to live mode | Requires Stripe keys + domain verify |

## Entry criteria (before running `/test`)

- Lovable Cloud is on.
- App builds without errors.
- The user has authenticated at least once in preview (so browser-based
  tests can hit gated routes).

## Exit criteria (launch-ready)

- All sub-pages on `/test` are green or have explicit "accepted risk" notes.
- Zero blocking items on the dashboard checklist.
- SEO scan: zero failing findings.
- Security scan: zero unaddressed findings; any ignored findings are
  documented in `mem://security-memory`.
- Each critical workflow has either an automated test or a checklist entry
  the on-call has signed off on within the last release.
- Published Lighthouse: Performance ≥ 90, Accessibility ≥ 95, Best
  Practices ≥ 95, SEO = 100.

## Owners

- **Frontend + design + a11y:** product team
- **Security + RLS:** founding engineer
- **Payments + webhooks:** founding engineer
- **Email + deliverability:** ops

## How to re-run

`/test` in chat. The dashboard refreshes scan data and adds any newly
selected sub-pages. Edits inside the `// USER EDITS BELOW` marker in each
route file are preserved.
