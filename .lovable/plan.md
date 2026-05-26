# Plan: Real Settings page + Admin management views

## 1. `/dashboard/settings` — real page

Replace the placeholder with three tabbed sections inside `DashboardShell`:

**Profile** — edit `display_name`, `avatar_url`, `phone`, `timezone`, `locale` on `public.profiles`.

**Security** — change password (re-auth with current password via `signInWithPassword`, then `auth.updateUser({ password })`); change email (`auth.updateUser({ email })` → existing auth-email-hook); "Sign out everywhere" (`signOut({ scope: 'global' })`).

**Notifications** — switches bound to `notification_preferences`: `email_marketing`, `email_product`, `email_security` (locked on), `sms_enabled`, `push_enabled`, `in_app_enabled`. Link to `/unsubscribe` for the marketing newsletter.

All forms: react-hook-form + zod, accessible labels, toasts, loading states.

## 2. Admin views — replace the three "Coming next phase" cards

### `/admin/users` — `src/pages/admin/Users.tsx`
- Table: avatar, display_name, email, roles (badges), provider, last sign-in, created_at, org count.
- Search by email/name; pagination 50/page.
- Row actions: **Grant/Revoke admin** (insert/delete in `user_roles`), **View details** drawer with org memberships + active subscription.
- Data: `profiles` + `user_roles` + `organization_members` joins (admin RLS already allows), plus auth metadata via new edge function below.

### `/admin/organizations` — `src/pages/admin/Organizations.tsx`
- Table: name, slug, plan, member count, owner email, created_at.
- Search; drawer with members + roles + org subscription. Read-only.

### `/admin/subscriptions` — `src/pages/admin/Subscriptions.tsx`
- Table: customer (user email or org name), product_name, status badge, price_id, current_period_end, cancel_at_period_end.
- Filters: status, environment (sandbox/live).
- Link to Stripe dashboard customer URL.
- Read-only.

### AdminIndex
Promote Users/Organizations/Subscriptions tiles from dashed to live; Analytics stays as "coming next phase".

### Routes
Add `/admin/users`, `/admin/organizations`, `/admin/subscriptions` to `src/App.tsx`, admin-gated like existing admin routes.

## 3. New edge function: `admin-list-users`

Service-role function that returns auth metadata not exposed via the Data API.

- Verifies caller JWT, then checks `has_role(uid, 'admin')`; 403 if not.
- Calls `supabase.auth.admin.listUsers({ page, perPage })`.
- Returns `[{ id, email, last_sign_in_at, created_at, providers: identities[].provider, email_confirmed_at }]`.
- Used by `/admin/users` to enrich profile rows; merged on `id`.

Config: `verify_jwt = false` in `supabase/config.toml` (we validate in code). CORS via `npm:@supabase/supabase-js@2/cors`.

## 4. Technical notes

- No DB migration needed.
- No new npm dependencies.
- All UI uses existing shadcn primitives (Table, Tabs, Switch, Sheet, Badge, Dialog).

## Files

**Created**
- `src/pages/admin/Users.tsx`
- `src/pages/admin/Organizations.tsx`
- `src/pages/admin/Subscriptions.tsx`
- `src/pages/dashboard/settings/ProfileTab.tsx`
- `src/pages/dashboard/settings/SecurityTab.tsx`
- `src/pages/dashboard/settings/NotificationsTab.tsx`
- `supabase/functions/admin-list-users/index.ts`
- `supabase/functions/admin-list-users/deno.json`

**Edited**
- `src/pages/dashboard/Settings.tsx`
- `src/pages/admin/AdminIndex.tsx`
- `src/App.tsx`
- `supabase/config.toml` (function entry)