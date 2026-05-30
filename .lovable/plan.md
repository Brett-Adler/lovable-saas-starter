## Goal

Make template/preview-only notices (test-mode banner, "free template" alert, placeholder ribbons) visually stand out, and make every one of them dismissible — with the dismissal **remembered across reloads** by default, plus a one-time "just for now" option.

## Approach

Introduce one shared building block and route the existing notices through it. Single source of truth = consistent look, consistent dismissal behavior, no duplicated localStorage code.

### 1. New component: `src/components/marketing/DismissibleNotice.tsx`

Props:
- `id: string` — required, used as the `localStorage` key (`notice-dismissed:{id}`).
- `tone?: "info" | "warning" | "preview"` — controls color + icon. Default `preview`.
- `title?: string`, `children: ReactNode` — body content; title bold, body smaller.
- `previewOnly?: boolean` — when true, only renders on `localhost`, `*.lovable.app`, or `*.lovableproject.com` (matches today's `TemplatePlaceholderRibbon` behavior).
- `persistDismissal?: boolean` (default `true`) — when true, remembers dismissal forever; when false, only hides for the current tab session (`sessionStorage`).
- `actions?: ReactNode` — optional inline links/buttons (e.g., "Read more").
- `className?: string`.

Visual standout (vs. today's quiet warning ribbon):
- Pill-shaped left accent bar in the tone color, soft tone-tinted background, 1px tone border, `shadow-sm`, slight `ring-1 ring-tone/20`.
- Tone icon in a rounded square chip (`bg-tone/15`), aligned to top.
- Title in `font-semibold`, body in `text-sm text-foreground/80`.
- Right side: a compact action cluster:
  - `actions` slot (renders inline links).
  - A `…` overflow menu (shadcn `DropdownMenu`) with two items:
    1. **Dismiss** — hides until the page is reloaded (or forever if `persistDismissal=true`, which is the default).
    2. **Don't show again** — always writes the persistent flag. Shown only when `persistDismissal` is true (the default).
  - A close (X) button — uses the default dismissal behavior of the notice.
- Smooth fade/slide-out (`animate-fade-out`) on dismiss.
- Full-bleed `variant="banner"` mode for top-of-page banners (test mode): no border-radius, sits flush, still dismissible.

Behavior:
- On mount: check `previewOnly` host gate → check `localStorage["notice-dismissed:{id}"]` (and `sessionStorage` if not persisted) → set visible.
- On dismiss: write the appropriate storage key, animate out, unmount.
- Accessible: `role="status"` for info, `role="alert"` for warning, `aria-live="polite"`, close button has `aria-label`.

### 2. Replace existing notices

| Today | After |
|---|---|
| `PaymentTestModeBanner` (`bg-orange-100` hard-coded, not dismissible) | Rewritten to render `DismissibleNotice` with `variant="banner"`, `tone="warning"`, `id="payments-test-mode"`, `previewOnly=false` (it depends on the publishable key, not the host). |
| Pricing page `Alert` "This is a free template" | Replaced with `DismissibleNotice` `tone="info"`, `id="pricing-free-template"`, includes the "Read more" link as an action. |
| `TemplatePlaceholderRibbon` (used on Index, Legal, Compare) | Kept as a thin wrapper that delegates to `DismissibleNotice` with `previewOnly=true`, `tone="preview"`. No call sites need to change. |

### 3. Tokens

Add `--preview` HSL token + `bg-preview`, `text-preview`, `border-preview` utilities in `index.css` / `tailwind.config.ts` (warm amber, distinct from `warning` so a real warning still feels heavier). `tone="warning"` keeps using existing `--warning` token; `tone="info"` uses `--primary`.

### 4. Out of scope

- No global "reset all dismissed notices" UI (could add later via `/dashboard/settings`).
- No server-side persistence — local-only is enough for these notices.

## Files

```text
src/components/marketing/
  DismissibleNotice.tsx         new
  TemplatePlaceholderRibbon.tsx edited — delegates to DismissibleNotice (API unchanged)
src/components/
  PaymentTestModeBanner.tsx     edited — uses DismissibleNotice banner variant
src/pages/Pricing.tsx           edited — swap Alert for DismissibleNotice
src/index.css                   edited — add --preview HSL token
tailwind.config.ts              edited — register `preview` color
src/data/changelog.ts           appended
```

## Open question

Default dismissal behavior — happy to flip either way:
- **A. Persistent by default** (X = remembered forever, dropdown offers "Just dismiss for now"). My recommendation.
- **B. Session by default** (X = back next reload, dropdown offers "Don't show again").

Defaulting to **A** unless you say otherwise.