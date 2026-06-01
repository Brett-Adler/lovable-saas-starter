## Goal

Turn `/docs` from a single setup-guide page into a proper multi-audience documentation site, structured like a typical SaaS help center + builder docs, with a sidebar nav and per-article routing.

## Audiences and information architecture

Three audiences, surfaced as top-level tabs on `/docs` and as URL sections:

1. **For users** (`/docs/users/...`) — end-user help center
2. **For admins & owners** (`/docs/admins/...`) — workspace owners
3. **For builders** (`/docs/builders/...`) — devs cloning the template

Each article is a real route with its own `<PageSeo>` (so they're indexable and shareable).

### For users
- Getting started
  - Create your account
  - Sign in, sign out, password reset
  - Set up your profile
  - Switch dark / light theme
- Your workspace
  - What is an organization
  - Joining an organization (accepting an invite)
  - Switching between workspaces
- Notifications & email preferences
- Account & security
  - Change password
  - Connected providers (Google, email)
  - Delete your account / export your data
- Troubleshooting
  - Didn't receive my invite or magic email
  - "Test mode" banner — what it means
  - Reporting a bug

### For admins & owners
- Workspace basics
  - Roles: owner, admin, member
  - Renaming and branding your workspace
- Team management
  - Inviting teammates
  - Changing or revoking roles
  - Removing members
  - Pending invitations
- Billing & subscriptions
  - Choosing a plan
  - The /checkout flow (what your teammates will see)
  - Updating payment method via the customer portal
  - Canceling, refunds, and proration
  - Reading the analytics dashboard
- SSO & SAML (placeholder — links to `/dashboard/.../sso`)
- Audit log — what's captured and how to filter
- Compliance & data handling — links to `/security` and `/privacy`

### For builders
- Re-home the existing setup guide here. Split the current `ReadmeContent` into discrete articles instead of one long page:
  - Use this starter
  - First-run quickstart
  - What's included
  - Tech stack & architecture
  - Customizing branding & theme
  - Auth providers (Google, email, SSO)
  - Billing & Stripe wiring
  - Email pipeline (Resend, sender domain, transactional templates)
  - Edge functions & secrets
  - Database, RLS, and migrations
  - Roles & permissions (owner/admin/member, `has_role`)
  - Analytics & audit log internals
  - Deploying & custom domains
  - Privacy & Terms placeholders
  - Roadmap & changelog conventions
- Cross-link to existing pages: `/launch`, `/roadmap`, `/changelog`, `/status`, `/security`, `/integrations`.

## Page structure

- `/docs` — landing hub: hero, three audience cards (User / Admin / Builder) with a short tagline + the article list for each. Keep the existing "Powered by" logo cloud and external docs grid below.
- `/docs/:audience/:slug` — single article view with:
  - Left sidebar: collapsible per-audience nav (sticky on `lg:`)
  - Right column: article body + a "Was this helpful?" footer with prev/next links
  - Right-rail TOC on `xl:` for long articles (reuse existing `DocsToc`)
  - Breadcrumbs: Docs / {Audience} / {Article}
- 404 inside docs → friendly "Article not found, browse the index" instead of generic NotFound.

## Data model

A single `src/data/docs.ts` exporting:

```ts
type Audience = "users" | "admins" | "builders";

interface DocArticle {
  slug: string;
  title: string;
  description: string;       // for SEO + card subtitle
  audience: Audience;
  category: string;          // grouping label inside the sidebar
  body: () => JSX.Element;   // MDX-style React content
  updatedAt: string;         // ISO
}
```

Article bodies live as small TSX components under `src/content/docs/{audience}/{slug}.tsx` so each is independently editable and tree-shaken. A shared `<DocLayout>` wraps every article with the sidebar, breadcrumbs, SEO, and prev/next.

The existing `ReadmeContent.tsx` is decomposed: each `<section id="...">` becomes one builder article, copy preserved verbatim. The current `/docs` body becomes the landing hub.

## Search

Lightweight client-side search (no extra deps): a `<DocsSearch />` input at the top of `/docs` and on every article page that fuzzy-matches `title + description + category` from the docs index, jumping straight to the article. Anything beyond this (full-text, Algolia, etc.) is out of scope.

## Other plumbing

- Register the new routes in `src/App.tsx`: `/docs/:audience` (audience index) and `/docs/:audience/:slug` (article).
- Add the new top-level URLs to `src/lib/public-routes.ts` under Resources so they show in the footer/sitemap (just the three audience indexes — not every article, to keep the footer lean).
- Update `src/pages/Sitemap.tsx` if it iterates a static list — confirm it auto-pulls from `publicNavGroups`; if not, add the audience indexes there.
- Append a changelog entry per the changelog policy.
- Add a `/docs/users` and `/docs/builders` smoke render to `src/test/smoke/pages.test.tsx`.

## Out of scope

- Versioned docs, i18n, MDX tooling, Algolia, or a CMS.
- Backend/database changes.
- Rewriting marketing copy on pages other than `/docs`.
- Changing the `/launch`, `/roadmap`, `/changelog`, `/security`, or `/readme` pages (just cross-linking to them).
- Authentication-gated docs.

## File touch summary

- New: `src/data/docs.ts`, `src/content/docs/users/*.tsx`, `src/content/docs/admins/*.tsx`, `src/content/docs/builders/*.tsx`, `src/pages/DocsArticle.tsx`, `src/pages/DocsAudience.tsx`, `src/components/docs/DocsSidebar.tsx`, `src/components/docs/DocsSearch.tsx`, `src/components/docs/DocLayout.tsx`.
- Edit: `src/pages/Docs.tsx` (landing hub redesign), `src/App.tsx` (routes), `src/lib/public-routes.ts`, `src/test/smoke/pages.test.tsx`, `src/data/changelog.ts`.
- Keep: `src/components/docs/ReadmeContent.tsx` and `/readme` route — the long setup guide stays available; builder articles cite it for the deepest detail.
