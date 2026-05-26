# Plan: `/admin/analytics` — core SaaS metrics

Replace the dashed "Analytics" tile on `AdminIndex` with a real page. Phase 1 focuses on the standard metrics every SaaS dashboard starts with, all derivable from existing tables (`auth.users`, `profiles`, `subscriptions`, `organizations`, `leads`, `marketing_subscribers`, `analytics_events`). No new tables.

## Page layout — `src/pages/admin/Analytics.tsx`

Inside `AdminShell`-style header. Date-range selector (Last 7 / 30 / 90 days, default 30) — drives every query.

### 1. KPI strip (6 cards)
- **MRR** — sum of active subscription prices × interval normalization (monthly). Pulled from `subscriptions` where `status IN ('active','trialing')` and `environment = 'live'`. Show absolute + delta vs previous period.
- **Active subscriptions** — count of same filter. Delta vs previous period.
- **New signups** — `auth.users.created_at` in range (via edge function, same service-role pattern as `admin-list-users`).
- **New paying customers** — distinct `user_id` in `subscriptions` with first active sub in range.
- **Churn count** — subs that moved to `canceled` or `current_period_end` passed in range without renewal.
- **Newsletter subscribers** — `marketing_subscribers` where `status='subscribed'`, delta vs prev period.

### 2. Charts (Recharts, already in deps)
- **Signups over time** — daily line, range-bucketed.
- **MRR over time** — daily line, computed from subscription state at each day's end.
- **Active subscriptions by plan** — stacked bar by `product_name`.
- **Leads by source** — horizontal bar grouped by `source`/`kind` from `leads`.

### 3. Tables
- **Top events** (last 30d) — group `analytics_events.event_name`, count, unique users. Sorted desc, top 20.
- **Recent signups** — last 10 from edge function (email, created_at, provider).

## Data layer

Two new edge functions (service-role, admin-gated like `admin-list-users`):

### `admin-analytics-overview`
Returns the KPI strip + chart series for a given range. One round-trip. Computes:
- signups daily series via `auth.admin.listUsers` filtered by `created_at` (pagination), or a `count_signups_by_day` RPC. **Choose RPC**: simpler, faster — add `public.count_signups_by_day(start, end)` security-definer that reads `auth.users`.
- MRR snapshot + daily series via SQL over `subscriptions`.
- churn count via SQL.
- newsletter counts via SQL.

### `admin-analytics-events`
Returns top-events table from `analytics_events` for a range (admin already has SELECT via RLS — could be done client-side; keep client-side and skip this function).

### New RPCs (one migration)
- `public.admin_signups_daily(_start timestamptz, _end timestamptz)` → `(day date, count int)` — reads `auth.users`, security definer, gated by `has_role(auth.uid(),'admin')`.
- `public.admin_signups_count(_start, _end)` → int.
- `public.admin_mrr_snapshot(_env text)` → numeric — sums monthly-normalized prices over active subs (price comes from `subscriptions.metadata->>'unit_amount'` and `metadata->>'interval'`, set by the webhook today; if missing, fall back to counting subs).
- `public.admin_subs_by_plan(_env)` → `(product_name text, count int)`.

All RPCs `SECURITY DEFINER`, raise if caller isn't admin.

## AdminIndex + routes
- Move "Analytics" out of "Coming next phase" into the live grid.
- Add `/admin/analytics` route in `src/App.tsx`, admin-gated.

## Files

**Created**
- `src/pages/admin/Analytics.tsx`
- `src/components/admin/analytics/KpiCard.tsx`
- `src/components/admin/analytics/RangePicker.tsx`
- `supabase/functions/admin-analytics-overview/index.ts` + `deno.json`
- `supabase/migrations/<ts>_admin_analytics_rpcs.sql`

**Edited**
- `src/pages/admin/AdminIndex.tsx` — promote tile
- `src/App.tsx` — add route
- `supabase/config.toml` — register function

## Out of scope (phase 2)
Cohort retention, LTV, ARPU, funnel/conversion, geographic breakdown, custom date ranges, CSV export, scheduled email digests. Confirm if any of these should move into phase 1.
