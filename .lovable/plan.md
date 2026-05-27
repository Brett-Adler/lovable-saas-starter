## Goal

Add a `/docs` page that uses the existing Readme as its body, so there's an obvious destination for "where are the docs?".

## Approach

1. **Refactor `src/pages/Readme.tsx`** — extract the current page body into a reusable component `src/components/docs/ReadmeContent.tsx`. `Readme.tsx` re-renders it inside `MarketingLayout` so `/readme` keeps working unchanged.
2. **New `src/pages/Docs.tsx`** — `MarketingLayout` + `PageSeo` (path `/docs`, title "Documentation"). Page structure:
   - Compact hero ("Documentation").
   - Small quick-links row: Roadmap, Changelog, Status, Setup guide (anchor to readme below).
   - Renders `<ReadmeContent />` underneath as the main docs body.
3. **Wire route + nav**
   - `src/App.tsx`: add `<Route path="/docs" element={<Docs />} />`.
   - `src/lib/public-routes.ts`: add `Docs` to the Resources group (kept above Setup guide).
   - `src/components/marketing/MarketingHeader.tsx`: add `Docs` link (replace/append — keep header compact).
4. **Changelog**: one `added` entry.

## Out of scope

No new content authoring, no MDX engine, no per-page docs routing. This is a single hub that points to the existing Readme.

## Files

- New: `src/pages/Docs.tsx`, `src/components/docs/ReadmeContent.tsx`.
- Edited: `src/pages/Readme.tsx`, `src/App.tsx`, `src/lib/public-routes.ts`, `src/components/marketing/MarketingHeader.tsx`, `src/data/changelog.ts`.
