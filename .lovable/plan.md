## Audit summary — `/docs`

Reviewed `src/pages/Docs.tsx` and `src/components/docs/ReadmeContent.tsx`. The page is content-rich but currently fails on readability, heading semantics, and skim-ability. Findings:

### Critical (semantics / SR)
1. **Broken heading hierarchy.** Page has an `<h1>Docs</h1>`, then `ReadmeContent` adds a second giant heading "Setup & Customization Guide" as an `<h2>`, fine — but the "First-run checklist" card *also* uses `<h2>` (visually it's a small card title — should be `<h3>`). Inside `<Section>` children, sub-items use `<h3>`. Net: a screen-reader user gets an inconsistent outline that doesn't match the visual hierarchy.
2. **Decorative emoji inside heading text.** `<h2>⚠️ Privacy Policy …</h2>` and ✅/⏳ at the start of every roadmap bullet are read aloud literally ("warning sign", "check mark button"). Should be `aria-hidden` and paired with a real text status badge.
3. **No heading anchors.** None of the `h2`/`h3`s have `id`s, so deep-links and "on this page" navigation aren't possible.
4. **Plain `<a>` links to external generators / docs** rely on color only and have no focus-visible ring or "opens in new tab" cue for AT.

### Warning (readability / contrast)
5. **Body copy is wrapped in `text-muted-foreground`** at the `<Section>` level (line 14). Every paragraph in the doc renders in muted gray — fine for captions, fatiguing for long-form reading. Body should be `text-foreground/85` (or just `text-foreground`), with muted reserved for secondary/eyebrow lines.
6. **`list-decimal list-inside` quickstart/clone steps** indent wrapped lines under the marker, hurting scannability. Switch to `list-outside` with proper left padding.
7. **`<pre>` code blocks use `whitespace-pre-wrap`** so shell commands wrap mid-token. Replace with `overflow-x-auto`, monospace, tabIndex=0, `aria-label`, and a copy button for the longer snippets (`git clone …`, the prompt templates).
8. **Hard-coded `amber-500` palette** on the "Coming-soon screens" card breaks the design-token rule and ships a different yellow in dark mode than the rest of the warning system. Switch to the existing `warning` token (or the new `preview` token added earlier).
9. **Heavy walls of text** in "Customize with one prompt" and the Privacy/Terms section — long paragraphs without breaks. Break to short paragraphs + bullets, and tighten verbose copy.
10. **Cards in "What's included"** lump 8+ routes into one list — split into route groups (Marketing / Product / Legal / Meta) so users can scan.

### Info
11. **No "On this page" ToC.** Page is ~400 lines tall; users have to scroll-hunt.
12. **`<Code>` chips** lack `font-medium` weight and break-words rule; long ones (`/dashboard/settings/api-keys`) overflow on mobile.
13. **`Section` icon chip** is purely decorative — add `aria-hidden="true"`.
14. **`<a>` `rel="noreferrer"`** is missing `noopener` on the legal-generator links.

---

## Plan

### 1. Rework `src/components/docs/ReadmeContent.tsx`

- `Section` component:
  - Render heading as `<h2 id={slug}>` with a scroll-margin offset; accept an `id` prop derived from title.
  - Mark the icon chip `aria-hidden="true"`.
  - Drop the wrapper `text-muted-foreground`; default body to `text-foreground/85 leading-relaxed`. Apply `text-muted-foreground` only on intentionally-secondary lines.
- Heading levels:
  - "First-run checklist" / "Coming-soon screens" cards → `<h3>` (not `<h2>` / `<h3>` mismatch).
  - All sub-headings inside Sections stay `<h3>`.
  - Strip emoji from "Privacy Policy & Terms of Service — placeholders" title; rename to plain text and use the `ShieldAlert` icon chip already in place. Roadmap bullets: emoji wrapped in `<span aria-hidden="true">` and paired with a `Badge` ("Shipped" / "In progress").
- Lists:
  - `list-decimal pl-5 marker:text-muted-foreground` (outside markers) for ordered lists; same for the "Privacy generators" UL with `list-disc pl-5`.
  - Cards' route lists: split "Public routes" into Marketing / Product / Legal / Meta sub-groups using small `<h4>`s.
- Code blocks:
  - Replace `<pre className="whitespace-pre-wrap …">` with a small `CodeBlock` helper: `<pre tabIndex={0} aria-label={label} className="overflow-x-auto rounded-md bg-muted/60 p-4 text-sm font-mono">`. Long prompts get a copy button (uses existing `navigator.clipboard` pattern) so users don't have to select text.
  - `<Code>` chip gains `font-medium break-all`.
- Cards: swap `amber-500` for `bg-warning/5 border-warning/30`; same for the Privacy/Terms card so colors come from tokens.
- External links: helper `<ExternalDocLink>` that adds `target="_blank"`, `rel="noopener noreferrer external"`, a trailing `ExternalLink` icon, focus ring `focus-visible:ring-2 focus-visible:ring-primary`, and screen-reader text `"(opens in new tab)"`.

### 2. Add an "On this page" sidebar in `src/pages/Docs.tsx`

- New `DocsToc` component (`src/components/docs/DocsToc.tsx`): static list of section ids/titles, renders as a sticky `<nav aria-label="On this page">` visible on `lg:block` only, scrolls smoothly with `scroll-margin-top` set on each `h2`.
- Layout swap: wrap `ReadmeContent` and `DocsToc` in a `lg:grid lg:grid-cols-[1fr_220px] lg:gap-12` so the ToC sits to the right without changing the existing intro/quick-links block.
- The intro `<h1>` becomes the sole page H1; the small "Powered by" label downgrades from `<h2 className="text-sm">` to a plain `<p className="text-xs uppercase">` (it's a label, not a heading).
- Add `scroll-pt-24` to the page so anchor jumps clear the sticky nav.

### 3. Copy tightening (no scope change)

- Trim 3-line paragraphs in "Customize with one prompt", "Promoting more admins", and the Privacy/Terms intro to 1–2 lines each.
- Convert the long Privacy/Terms second paragraph into a small bullet list of duties ("Disclose all processors", "Match your actual practices", "Re-review on changes").

### Files

```text
src/pages/Docs.tsx                     edited (layout + ToC slot, eyebrow downgrade)
src/components/docs/ReadmeContent.tsx  edited (Section, headings, lists, code blocks, tokens, links)
src/components/docs/DocsToc.tsx        new (sticky on-this-page nav)
src/components/docs/CodeBlock.tsx      new (scrollable, copy button, aria)
src/data/changelog.ts                  appended
```

### Out of scope

- No new content, no backend changes, no full design refresh — purely a11y + readability tightening on `/docs`.
- README/marketing copy elsewhere untouched.

Used the **Accessibility Review** skill.