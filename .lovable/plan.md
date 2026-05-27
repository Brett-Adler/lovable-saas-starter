## Goal
Make this starter easy for any Lovable user to take and run with. Add clear, action-oriented instructions covering the three ways someone might pick it up: (1) Remix the live Lovable project, (2) Customize it with one or a few prompts, (3) Clone it from GitHub and run locally. Reflect the same in both `README.md` (developer view) and the in-app `/readme` page (user view).

## Scope
Documentation only. No feature/code changes.

## Changes

### 1. `src/pages/Readme.tsx`
Add a new section "Use this starter" near the top, just below the existing **Quickstart** section, with three side-by-side cards:

- **Remix on Lovable** — one-click way to fork the live project. Steps: open the demo, click "Remix" in the top bar, sign in, get your own copy with Lovable Cloud preconfigured. Add a primary CTA button linking to `https://lovable.dev/projects/65731117-aac8-4723-ab30-aec22d01517c?remix=1` (using the actual Lovable project ID we have in context).
- **Customize with one prompt** — show 3–4 ready-to-paste prompt examples that do the most common rebrands in a single shot. Examples:
  1. *Rebrand* — "Rebrand this app as **Acme** — a project management tool for design teams. Use a calm sage + cream palette, Inter for body and Space Grotesk for headings. Update the home page hero, pricing copy, and About page to match. Replace the logo placeholder text with 'Acme'."
  2. *Pricing* — "Change pricing to three tiers: Starter $0, Pro $19/mo, Business $49/mo with annual discounts. Update `/pricing`, the landing page teaser, and the changelog."
  3. *Niche pivot* — "Turn this into a SaaS for fitness studios: replace the marketing copy on `/`, `/about`, `/pricing`, and the FAQ. Keep auth, billing, and admin as-is."
  4. *Cloud-only swap* — "Swap the email provider copy from Resend to Postmark across the README and admin help text. Don't change any edge functions."
  Each prompt is in a copy-friendly code block.
- **Clone from GitHub** — bash snippet. Cover: connect Lovable → GitHub (Settings → GitHub), clone the repo, install with `npm i` (or `bun i`), run `npm run dev`. Note that Lovable Cloud env vars come from `.env` (auto-generated when the project is linked to Lovable) and that local dev still talks to the same Cloud backend.

Use the existing `Section` / `Card` / `Code` primitives already in the file. Add icons from `lucide-react` (`Sparkles`, `MessageSquare`, `Github`) to keep visual style consistent.

Also add one short paragraph at the very top of the page (before Quickstart) explaining the three paths and which one to pick.

### 2. `README.md`
Mirror the same content in markdown. Add three new sections right after the existing intro / "What's included":

- **Use this starter (pick one)** — one-line description + bullet for each of the three paths.
- **Remix on Lovable** — link + 4-step list.
- **Customize with a prompt** — same 3–4 prompt examples as the in-app page, in fenced blocks.
- **Clone from GitHub** — bash snippet, plus the note about Lovable → GitHub connection (`https://docs.lovable.dev/integrations/git` reference) and the env-file behavior.

Keep the existing "Quick start", "Pre-launch checklist", "Branding", and "Architecture notes" sections unchanged — the new sections sit above them.

### 3. `src/data/changelog.ts`
Append one entry to today's release: `added` — "README and /readme page now cover Remix, prompt-based customization, and GitHub clone workflows."

## Out of scope
- No UI redesign of `/readme` beyond the new section.
- No new routes, components, or hooks.
- No SEO changes.
- No code or backend changes.

## Deliverables
- Updated `src/pages/Readme.tsx`
- Updated `README.md`
- One-line changelog entry
