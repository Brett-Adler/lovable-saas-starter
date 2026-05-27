## Verification

**Host gating — already correct.** `src/components/marketing/TemplatePlaceholderRibbon.tsx` only sets `visible` when `window.location.hostname` is `localhost`, `127.0.0.1`, or ends with `.lovable.app` / `.lovableproject.com`. Any custom domain falls through and the component returns `null`. No change needed to the gating logic.

**Coverage — already consistent.** The ribbon is mounted on:
- `src/pages/Index.tsx` → logo cloud (`index-logo-cloud`) and testimonials (`index-testimonials`)
- `src/pages/About.tsx` → `about-copy`
- `src/pages/Legal.tsx` → one per kind (`legal-${kind}` for terms/privacy/etc.)
- `src/pages/Compare.tsx` → `compare-page`
- `src/pages/Status.tsx` → `status-page`

All four pages the user named (Index, About, Legal, testimonials) are covered.

## Small consistency improvement

Only `index-logo-cloud` and `status-page` include the explanatory `hint` line ("This ribbon is only shown on Lovable preview hosts…"). The other four ribbons (`index-testimonials`, `about-copy`, `legal-${kind}`, `compare-page`) just show the message. Adding the same hint makes the preview-only contract obvious everywhere.

**Changes:**
- `src/pages/Index.tsx` — add `hint="Visible only on Lovable preview hosts — never shown on your custom domain."` to the testimonials ribbon.
- `src/pages/About.tsx` — same hint on `about-copy`.
- `src/pages/Legal.tsx` — same hint on the per-kind ribbon.
- `src/pages/Compare.tsx` — same hint on `compare-page`.

Standardize the existing `index-logo-cloud` and `status-page` hints to the same wording so all six ribbons read identically.

## Out of scope

- No change to host-detection logic — already correct.
- No new pages get a ribbon.
- No refactor to extract `isPreviewHost()` — single consumer, not worth it yet.
- No changelog entry (cosmetic copy tweak only).
