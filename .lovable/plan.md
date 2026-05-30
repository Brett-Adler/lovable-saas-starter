## Goal

Replace the thin placeholder /about page with a full About page (mission, vision, founding story, values, milestones, team/leadership/board/investors/advisors/pets, press, contact) — and make every section editable from a new **Admin → About** screen so non-devs can update it.

## What the user sees

**Public `/about`** — single page, anchored sections:
1. **Hero** — eyebrow, headline, subhead, two CTAs.
2. **Mission & Vision** — two side-by-side cards.
3. **Founding story** — long-form rich text + optional image.
4. **Values** — repeatable cards (icon name + title + description).
5. **By the numbers** — repeatable stat tiles (label + value).
6. **Timeline / Milestones** — chronological list (year + title + body).
7. **Team** — grouped people grid. Each person: name, role, photo, bio, group (Leadership / Team / Board / Investors / Advisors / Pets / custom), socials (LinkedIn, X, GitHub, website), sort order. "Pets" group renders the same card with a paw icon.
8. **Press / "As seen in"** — logo strip with links.
9. **Careers / Contact CTA** — final band with two buttons.

A small "Edit this page" link appears for admins only (links to `/admin/about`).

**Admin `/admin/about`** — tabbed editor matching the sections above:
- **Page** tab: hero copy, mission, vision, founding story (textarea, markdown), CTA labels/links, section visibility toggles.
- **Values / Stats / Milestones / Press** tabs: simple repeatable list editors (add/remove/reorder, inline fields).
- **People** tab: list with filters by group; add/edit drawer with photo upload (reuses existing `brand-assets` bucket under `about/people/`), group dropdown (Leadership, Team, Board, Investors, Advisors, Pets, Other), socials, sort order, "published" toggle.
- Single "Save" button per tab; toast on save; optimistic refetch.

## Backend (new tables)

All in `public`, admin-write / public-read, with GRANTs.

1. `about_page` — singleton (`id smallint default 1`) holding all scalar/markdown copy and JSON for hero CTAs + section visibility flags. RLS: public SELECT, admin ALL.
2. `about_sections` — generic ordered list of structured items used for **values**, **stats**, **milestones**, **press**. Columns: `id`, `kind` (enum: `value` | `stat` | `milestone` | `press`), `title`, `subtitle`, `body`, `icon`, `image_url`, `link_url`, `meta jsonb`, `position int`, `published bool`. One table keeps the editor and queries simple. RLS: public SELECT (published only via policy), admin ALL.
3. `about_people` — `id`, `name`, `role`, `group_key` (text, free-form so admin can add "Pets" etc., with seeded defaults), `bio`, `photo_url`, `links jsonb` (linkedin/x/github/website), `position int`, `published bool`, timestamps. RLS: public SELECT where `published = true`, admin ALL.

No FKs to `auth.users` — these are CMS content, not user accounts. `updated_at` triggers via existing `public.update_updated_at_column()`.

## Frontend changes

- `src/pages/About.tsx` — rebuilt to fetch from the three tables via a single `useAboutContent()` hook (parallel queries, cached with React Query if available, else `useEffect`). Render sections conditionally on visibility flags. Keep `MarketingLayout` + `PageSeo`.
- New components under `src/components/about/`:
  - `AboutHero.tsx`, `AboutMissionVision.tsx`, `AboutStory.tsx`, `AboutValues.tsx`, `AboutStats.tsx`, `AboutTimeline.tsx`, `AboutTeam.tsx` (groups people by `group_key`), `AboutPress.tsx`, `AboutCta.tsx`.
- New `src/pages/admin/About.tsx` with tabs (`Page`, `Values`, `Stats`, `Milestones`, `Press`, `People`). Reuse shadcn `Tabs`, `Card`, `Input`, `Textarea`, `Switch`, `Dialog`, `Button`. Photo upload reuses the existing helper pattern from `src/pages/admin/Brand.tsx`.
- Wire `/admin/about` route in `src/App.tsx` (ProtectedRoute) and add a **Content → About page** nav item in `src/components/admin/AdminShell.tsx`.
- Remove the `TemplatePlaceholderRibbon` from About once the DB has real content (keep a fallback message if the singleton row is empty).
- Append an entry to `src/data/changelog.ts` per the project's changelog policy.

## Seed data

The migration inserts the singleton `about_page` row plus a small set of sensible defaults (3 values, 3 stats, 3 milestones, 4 people incl. one "Pets" example, 2 press logos) so the page never looks empty on first load. Admins overwrite from `/admin/about`.

## Out of scope

- Job listings / careers ATS (CTA only, links to `/contact`).
- Per-locale translations.
- Public-facing "follow author" features.
