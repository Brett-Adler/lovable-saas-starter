## Goal

Add a public `/changelog` page and a memory rule so I update it automatically on significant changes.

## 1. Changelog data

Create `src/data/changelog.ts` — a typed array of entries I can append to in one place:

```ts
export type ChangeType = "added" | "changed" | "fixed" | "removed" | "security" | "deprecated";
export interface ChangelogEntry {
  date: string;        // ISO yyyy-mm-dd
  version?: string;    // optional semver tag
  title: string;       // short headline
  changes: { type: ChangeType; text: string }[];
}
export const changelog: ChangelogEntry[] = [ /* seeded with recent milestones */ ];
```

Seed with a few entries from recent work (auth, orgs, billing, notifications, SMS/Push/SSO scaffolding, audit log, scroll-to-top, etc.) grouped by date.

## 2. Changelog page

Create `src/pages/Changelog.tsx` using `MarketingLayout`:

- H1 "Changelog", short subtitle.
- Vertical timeline; each entry shows date (+ optional version pill), title, and grouped chips per change type with the standard Keep-a-Changelog colors (Added/green, Changed/blue, Fixed/amber, Removed/red, Security/purple, Deprecated/gray).
- Sorted newest-first.
- SEO meta + JSON-LD.

Register route `/changelog` in `src/App.tsx`.

## 3. Surfacing

- Add a "Changelog" link to the **Resources** group in `src/lib/public-routes.ts` (auto-appears in footer + sitemap).
- Add `/changelog` to `public/sitemap.xml` via the generator and to `src/pages/Sitemap.tsx`.
- Add a small "Recent updates" bullet pointing to `/changelog` in `src/pages/Readme.tsx`.

## 4. Memory rule (automatic updates)

Create `mem://changelog-policy`:

> Whenever a user-visible change ships (new feature, removed feature, breaking change, security fix, notable bug fix, pricing/plan change, integration added/removed), prepend a new entry — or extend today's entry — in `src/data/changelog.ts`. Use these types only: added, changed, fixed, removed, security, deprecated. Skip refactors, copy tweaks, internal-only changes, and dev-tooling edits.

Update `mem://index.md`:

- Add a one-liner to **Core**: "Log significant user-visible changes to `src/data/changelog.ts` — see changelog-policy memory."
- Add a reference under **Memories**: `[Changelog policy](mem://changelog-policy) — when and how to append entries.`

## Out of scope

- No admin UI for editing changelog (file-based is enough).
- No RSS/Atom feed (can add later if asked).
- No DB table — keeping it in code so it ships with deploys and is reviewable in version history.
