# Plan: Cleaner, more user-friendly `/admin`

Today every admin page repeats its own header, back button, and one-off layout. The index is a flat 8-tile grid with no grouping or signal of what needs attention. Goal: a single consistent admin shell with grouped navigation, an overview that surfaces live numbers, and small UX wins on every subpage.

## 1. New shared `AdminShell` — `src/components/admin/AdminShell.tsx`

Mirror the pattern of `DashboardShell` so subpages stop reinventing chrome.

- Sticky top bar: Logo, page title (breadcrumb), right-side: theme toggle, "View site" link, user menu (avatar → Dashboard / Sign out).
- Left sidebar (collapsible on mobile via shadcn `Sheet`), grouped:
  - **Overview** — Dashboard
  - **People** — Users, Organizations
  - **Revenue** — Subscriptions, Analytics
  - **Growth** — Leads, Subscribers, Broadcasts
  - **Configure** — Site settings
- Active route highlighted; lucide icon per item.
- Page content slot with consistent `max-w-6xl` container, `py-8`, page heading + optional action button area.
- Centralised admin-guard: shell renders the "Admins only" card if `!isAdmin`, so every subpage drops its own guard block.

## 2. `/admin` — redesigned overview

Replace the flat tile grid with a real dashboard landing:

- **Top KPI strip (4 cards)** — Total users, Active subscriptions, MRR (live), New signups (7d). Reuses the `admin-analytics-overview` edge function + `subscriptions` query already built for `/admin/analytics`. Each card links to its detail page.
- **"Needs attention" panel** — count of new leads (`leads.status='new'`), pending newsletter confirmations (`marketing_subscribers.status='pending'`), past-due subscriptions. Each row links to a pre-filtered subpage.
- **Quick actions** — buttons for "New broadcast", "Invite admin user", "Edit site settings".
- **Recent activity** — last 5 signups + last 5 leads in a compact two-column list.
- Remove the "Back to dashboard" footer button (user menu handles it).

## 3. Subpage cleanups

Each admin subpage drops its custom header and wraps in `<AdminShell title="…">`:

- `Users`, `Organizations`, `Subscriptions`, `Analytics`, `Leads`, `Subscribers`, `Broadcasts`, `SiteSettings`.
- Each gets a one-line description under the title and a primary action button in the header slot when applicable (e.g. Broadcasts → "New broadcast").
- Remove the duplicated `Logo` + `Sign out` headers and "Back to admin" links — sidebar handles navigation.
- Standardise empty/loading states using a shared `<AdminEmpty />` and shared spinner.

## 4. Small UX polish

- Page titles set via `document.title` per page (`Users · Admin`, etc.).
- Tables: sticky header, zebra rows, right-aligned numeric columns, consistent date format (`MMM d, yyyy`).
- Mobile: sidebar collapses behind a hamburger; KPI grid stacks 2-up.

## Files

**Created**
- `src/components/admin/AdminShell.tsx`
- `src/components/admin/AdminSidebar.tsx`
- `src/components/admin/AdminOverview.tsx` (the new `/admin` body)

**Edited**
- `src/pages/admin/AdminIndex.tsx` — render `AdminShell` + `AdminOverview`
- `src/pages/admin/{Users,Organizations,Subscriptions,Analytics,Leads,Subscribers,Broadcasts,SiteSettings}.tsx` — wrap in `AdminShell`, drop their headers/guards

## Out of scope
- Renaming routes, changing permissions, or adding new admin features.
- Visual redesign beyond shell/grid/spacing (no new color tokens or typography).

Confirm and I'll build it.
