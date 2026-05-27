# Use-this-template guides

Two new marketing pages walking new users through adopting the template, with light cross-linking from existing pages. No content changes elsewhere beyond adding links.

## New pages

### `/use-template/lovable` — for Lovable users
Step-by-step remix flow, no terminal required.
1. Open the live demo / template project in Lovable
2. Click **Remix** — Lovable forks the code and provisions a fresh Cloud backend
3. First signup becomes admin automatically
4. Rebrand in one prompt (link the ready-made prompts from README §2)
5. Upload your logo at `/admin/brand`
6. Edit site name / meta at `/admin/site-settings`
7. Replace legal pages at `/privacy` and `/terms`
8. Go-live checklist link → `/launch`

Includes copy-pasteable rebrand / pricing / pivot prompts (already in README §2), a "what you don't have to set up" callout (DB, auth, emails, sandbox Stripe all preconfigured), and a final CTA linking to `/launch`.

### `/use-template/github` — for GitHub users
Developer flow, local-first.
1. Remix on Lovable once (required — provisions Cloud backend)
2. Settings → GitHub → connect; Lovable creates the repo and two-way syncs
3. Local clone + `npm install` + `npm run dev` (port 8080)
4. How the synced `.env` works (Cloud URL + anon key auto-managed)
5. Where things live: `src/pages`, `supabase/functions`, `supabase/migrations`
6. Two-way sync rules (push to branch ↔ Lovable prompts commit back)
7. Go-live checklist link → `/launch`

Includes a "why you still need Lovable once" callout (Cloud provisioning), bash blocks for clone/install/dev, and pointers to architecture notes from the README.

## Shared page chrome
- `MarketingLayout` + `PageSeo`
- Top of each page: a small tab/segmented switcher linking to the other guide ("Prefer GitHub? →" / "Prefer Lovable? →") so users can flip without going back
- Numbered step cards (reuse existing `Card` + numbered badge pattern from `Launch.tsx`)
- Sidebar or footer callout linking to `/launch`, `/readme`, `/docs`

## Minimal edits to existing pages (links only, no content rewrites)

- `src/components/marketing/MarketingFooter.tsx` — add two links under an existing column (likely "Resources"): "Use on Lovable" → `/use-template/lovable`, "Use on GitHub" → `/use-template/github`
- `src/pages/Readme.tsx` — add a single banner/callout near the top: "New here? Start with the [Lovable guide] or [GitHub guide]." No other content changed
- `src/pages/Launch.tsx` — add one line at the top: "Just remixed? See the [Lovable setup guide] first." No other content changed

These are the only edits to existing pages. If you'd like links added in additional places (landing hero CTA, docs page, /about), say so and I'll add them — otherwise I'll keep the footprint minimal as you asked.

## Routing
Add to `src/App.tsx` in the marketing block:
```tsx
<Route path="/use-template/lovable" element={<UseTemplateLovable />} />
<Route path="/use-template/github" element={<UseTemplateGithub />} />
```

## SEO
- Lovable page title: "Use this template on Lovable — remix in one click"
- GitHub page title: "Use this template on GitHub — clone and sync"
- Both added to `public/sitemap.xml` via the existing generator script

## Content source
All copy derives from `README.md` §"Use this starter" — no new claims, just reformatted as a guided flow with screenshots-less step cards. Pricing, features, and architecture statements are unchanged.

## Out of scope (will confirm before doing)
- Rewriting the landing hero or About page
- Changing the README content itself
- Adding screenshots/illustrations (can add later if you want)
- Removing the existing `/readme` or `/docs` pages
