# Add Smoke + Regression Test Suite

Vitest is already wired up (`vitest.config.ts`, `src/test/setup.ts`) but only an example test exists. This plan adds a meaningful baseline so future edits break a test before they break the app.

## Scope

Two test layers:

1. **Frontend (Vitest + React Testing Library)** — fast smoke tests for routing, data sanity, and key page renders.
2. **Edge function (Deno test)** — contract tests for the most user-facing functions so refactors don't silently break them.

No production code changes; only new test files and a couple of small test helpers/mocks.

## 1. Frontend smoke tests

All under `src/**/*.test.{ts,tsx}`. Each uses a minimal wrapper (QueryClient + MemoryRouter + Helmet) and mocks `@/integrations/supabase/client` so tests run offline.

New helper:
- `src/test/utils.tsx` — `renderWithProviders(ui, { route })` wrapping with `QueryClientProvider`, `MemoryRouter`, `HelmetProvider`, `TooltipProvider`, mocked `AuthProvider`/`OrganizationProvider`.
- `src/test/mocks/supabase.ts` — `vi.mock('@/integrations/supabase/client')` returning a chainable stub (`from().select().eq()...` resolves with `{ data: [], error: null }`, `auth.getSession` returns no session, `functions.invoke` returns `{ data: null, error: null }`, `channel().on().subscribe()` no-ops).

### Page render smoke tests
One test per critical public route — asserts the page mounts without throwing and renders a recognizable heading/landmark:
- `Index`, `Pricing`, `About`, `Contact`, `Newsletter`, `Demo`, `Waitlist`, `Roadmap`, `Status`, `Integrations`, `Security`, `Compare`, `Customers`, `Blog`, `Changelog`, `Readme`, `Docs`, `Launch`, `Sitemap`, `Accessibility`, `Legal` (privacy/terms/cookies), `NotFound`.
- Auth pages: `Auth` (login + signup mode), `ForgotPassword`, `ResetPassword`.
- One combined file `src/test/smoke/public-pages.test.tsx` table-driven over route → component to keep this compact.

### Routing test
`src/test/smoke/routing.test.tsx` — mounts `<App />` at a handful of routes via `MemoryRouter` (need to refactor `App.tsx` minimally to export a routerless `<AppRoutes>` OR test by mounting `<BrowserRouter>` with `window.history.pushState`). Decision: introduce `src/AppRoutes.tsx` that contains the `<Routes>` block; `App.tsx` re-exports/uses it. Test imports `AppRoutes` and wraps with `MemoryRouter`. Asserts: `/` → marketing heading, `/pricing` → pricing heading, `/blog` → blog list, `/unknown` → NotFound 404 text, `/dashboard` (unauthenticated) → redirect to `/login`.

### Data-layer regression tests
Catch accidental edits to single-source-of-truth arrays:
- `src/data/featureStatus.test.ts` — every entry has `status ∈ {shipped, setup, soon}` and required fields; specific keys (`chat`, `blog`, `status-page`) are `shipped`; `live-chat` legacy key (if present) does not regress.
- `src/data/roadmap.test.ts` — same status enum check; counts per bucket > 0.
- `src/data/changelog.test.ts` — entries sorted desc by date, valid ISO dates, latest entry mentions chat/blog/status release.
- `src/data/seo.test.ts` (if it exists) — each route has unique `title < 60` and `description < 160`.

### Component regression tests
- `src/components/marketing/SupportChatWidget.test.tsx` — opens on button click, sends a message (mocked `functions.invoke` for `support-chat`), renders assistant response, persists to `localStorage`, disables input when rate-limit error returned.
- `src/components/marketing/StatusBadge.test.tsx` (or wherever it lives) — renders correct label/variant for `shipped` vs `setup` vs `soon`, shows tooltip text when provided.
- `src/components/admin/AdminShell.test.tsx` — renders Content nav links (Blog, Status) for admin role; hides them otherwise.
- `src/pages/Contact.test.tsx` — admin-mode notice appears when `contact_email` site setting is missing; form submits to `leads` with `kind=contact`.

### Lead-capture regression
`src/test/regression/lead-forms.test.tsx` — for Newsletter, Demo, Waitlist, Contact: fill + submit, assert `supabase.from('leads').insert` called with the right `kind` and `source`.

## 2. Edge function tests (Deno)

Add `*_test.ts` next to each function, run via `supabase--test_edge_functions`. Use `Deno.env` + `dotenv/load` per the testing guide. These are contract/smoke tests — happy path + one auth/validation failure each.

- `supabase/functions/support-chat/index_test.ts` — POST a message, expect 200 + streamed/text reply; POST without body → 400; verify rate-limit row inserted (mock or hit a test IP).
- `supabase/functions/subscribe-newsletter/index_test.ts` — valid email → 200; invalid → 400.
- `supabase/functions/confirm-newsletter-subscription/index_test.ts` — invalid token → 400.
- `supabase/functions/notify-user/index_test.ts` — missing auth → 401.
- `supabase/functions/send-transactional-email/index_test.ts` — schema validation: missing `to` → 400.
- `supabase/functions/preview-transactional-email/index_test.ts` — returns rendered HTML for known template key.
- `supabase/functions/admin-analytics-overview/index_test.ts` — non-admin → 403.
- `supabase/functions/admin-list-users/index_test.ts` — non-admin → 403.
- `supabase/functions/create-checkout/index_test.ts` — missing price → 400.
- `supabase/functions/payments-webhook/index_test.ts` — invalid Stripe signature → 400.

Tests that need an admin call a `service_role`-keyed setup helper to seed; cleanup is best-effort.

## 3. CI ergonomics

- Keep `bun run test` green as the single command for frontend.
- Document a one-liner in `README` / `src/test/README.md`: "Run `bun run test` for the frontend suite. Edge function tests run via the Lovable test tool / `deno test` locally."
- No GitHub Actions changes (project doesn't manage CI here).

## Out of scope

- E2E browser tests (Playwright) — would add dependency weight; can be a follow-up.
- Visual regression / screenshot diffs.
- Coverage thresholds (can be enabled later via `vitest --coverage`).

## Technical notes

- `App.tsx` will be split: extract `<Routes>` into `src/AppRoutes.tsx`. `App.tsx` still owns providers and `BrowserRouter`. Tests import `AppRoutes` wrapped in `MemoryRouter`.
- All Supabase calls in components go through `@/integrations/supabase/client`, so a single `vi.mock` covers the whole tree.
- `useAuth`/`useOrganization` get mocked via `vi.mock('@/hooks/useAuth', ...)` returning configurable session + role. Helper exposes `renderWithProviders(ui, { user, role })`.
- Edge tests use `VITE_SUPABASE_URL` + `VITE_SUPABASE_PUBLISHABLE_KEY` from `.env` per the testing guide; admin paths use `SUPABASE_SERVICE_ROLE_KEY` if available, otherwise the admin assertion is skipped with a `console.warn`.

## Deliverables

- ~25 new test files (frontend) + ~10 (edge functions)
- 2 small helpers (`src/test/utils.tsx`, `src/test/mocks/supabase.ts`)
- `src/AppRoutes.tsx` extraction
- Short `src/test/README.md`
