# Tests

Two test layers protect this app from regressions.

## Frontend (Vitest + React Testing Library)

```bash
bun run test         # one-shot
bun run test:watch   # watch mode
```

Setup:
- Global setup in `src/test/setup.ts` (jest-dom, matchMedia stub).
- Reusable Supabase client mock in `src/test/mocks/supabase.ts` — import it once at
  the top of a test file (`import "../mocks/supabase"`) and the whole component
  tree will see a chainable, no-network Supabase client.
- `renderWithProviders` in `src/test/utils.tsx` wraps a UI with QueryClient,
  HelmetProvider, TooltipProvider, and a MemoryRouter. It also mocks
  `useAuth`, `useOrganization`, and `useUserRole` so pages render without a
  real session.

What's covered:
- Data regression: `src/data/*.test.ts` guards `featureStatus`, `roadmap`,
  and `changelog` shape + invariants (status enums, sorting, shipped keys).
- Page smoke: `src/test/smoke/pages.test.tsx` mounts every critical public
  page and asserts a recognizable label renders.
- Component regression: `src/components/marketing/StatusBadge.test.tsx`
  covers the badge variants used everywhere.

## Edge functions (Deno)

Tests live next to each function as `index_test.ts` and are run via the
Lovable test tool (`supabase--test_edge_functions`). They cover the
user-facing happy path plus an auth/validation failure for each function.

Both layers run independently — keep them green before publishing.
