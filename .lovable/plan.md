## Goal

Refresh `/dashboard` and `/admin` so both surface more of the data we already collect, and give both shells a more modern, consistent look. No new backend, no schema changes — purely frontend on existing tables, hooks, and the `admin-analytics-overview` edge function.

## /dashboard (user overview)

Replace the current 3-card layout in `src/pages/Dashboard.tsx` with a richer overview:

1. **Hero strip** — keep welcome, but add a compact org/plan badge row and a primary CTA tied to the next best action (create org, accept invite, finish billing, or "Invite teammates").

2. **Getting started checklist** (new component `OnboardingChecklist.tsx`)
   - Profile complete (display name set)
   - Organization created
   - Members invited (≥1 invite sent OR ≥2 members)
   - Subscription active (via `useSubscription`)
   - Push notifications enabled (`push_subscriptions` for current user)
   - Auto-hides once all done.

3. **Subscription status card** — uses existing `useSubscription`/`usePlan`. Shows plan name, status badge (active/trialing/past_due/canceled), period end, "Manage billing" → `/dashboard/billing`, upgrade nudge on free.

4. **Invites + notifications row** (two cards side by side)
   - Pending invites: query `organization_invites` for the user's email where `accepted_at IS NULL`, with inline Accept button linking to `/invite/:token`.
   - Recent notifications: latest 5 rows from `notifications` for `auth.uid()`, mark-as-read on click, link to full list (`NotificationBell` already exists — this is a list preview).

5. **Org activity feed** — last 8 entries from `audit_log` filtered by current `organization_id` (RLS already permits owner/admin). Shows action, actor email, target, relative time. Empty state for members without permission.

6. **Visual polish**
   - Gradient hero header band with subtle pattern.
   - Cards: `rounded-xl`, hover lift, consistent icon-in-pill header style matching `AdminOverview` Kpi cards.
   - Section dividers with small uppercase eyebrow labels (mirroring admin sidebar groups).
   - Skeletons for each query while loading.

## /admin overview refresh

Update `src/components/admin/AdminOverview.tsx`:

1. **Sparkline on KPI cards**
   - Add a tiny inline sparkline to the "Total users" Kpi using `signups.series` already returned by `admin-analytics-overview`.
   - Use `recharts` (already a dep) `<ResponsiveContainer>` with a 32-px high `<AreaChart>`, no axes, primary-tinted fill.
   - Extend `Kpi` component to accept optional `trend?: { day: string; count: number }[]`.

2. **Email health card** (new section)
   - Last 7 days: counts of `email_send_log` grouped by status (sent / failed / dlq / suppressed), deduplicated by `message_id` using the pattern from the email-monitoring guide.
   - Show: total sent, failure rate %, suppressed count, link to a future Broadcasts page, with status-colored badges.
   - Suppressed count from `suppressed_emails` (last 30 days).

3. **Recent audit events card**
   - Latest 6 entries from `audit_log` (admin RLS already allows all). Show action, actor email, target type, relative time. Link "View all" → `/admin/audit`.

4. **Layout reshuffle**
   - Row 1: KPI strip (now with sparkline on users).
   - Row 2: Needs attention (2/3) + Quick actions (1/3).
   - Row 3: Email health (1/2) + Recent audit events (1/2).
   - Row 4: Recent signups + Recent leads (existing).

5. **Visual polish across both shells**
   - Sidebar: active item gets a subtle left primary bar; group eyebrows already exist in admin, mirror them on the dashboard sidebar (Workspace / Account / Admin).
   - Consistent KPI card style (used in both `/dashboard` subscription card and `/admin` Kpis).
   - Unified card padding, header weight, and muted/foreground hierarchy.
   - Soft animated entry (`animate-fade-in` on grid children) for the overview grids.

## Files

- Edit `src/pages/Dashboard.tsx` — restructure overview.
- Edit `src/components/dashboard/DashboardShell.tsx` — group sidebar nav, active indicator, polish.
- Add `src/components/dashboard/OnboardingChecklist.tsx`.
- Add `src/components/dashboard/SubscriptionStatusCard.tsx`.
- Add `src/components/dashboard/PendingInvitesCard.tsx`.
- Add `src/components/dashboard/RecentNotificationsCard.tsx`.
- Add `src/components/dashboard/OrgActivityCard.tsx`.
- Edit `src/components/admin/AdminOverview.tsx` — sparkline, new cards, layout.
- Add `src/components/admin/EmailHealthCard.tsx`.
- Add `src/components/admin/RecentAuditCard.tsx`.
- Edit `src/components/admin/AdminShell.tsx` — active indicator polish.
- Append entry to `src/data/changelog.ts`.

## Out of scope

- No schema changes, no new edge functions, no new RLS.
- No changes to sub-pages (Members, Billing, Users, Leads, etc.).
- No new routes.
