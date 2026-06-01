## Goal

Make the "subscribe" experience clearer: when a user picks a plan they see a confirmation step that summarizes exactly what they're buying (plan, cadence, price, what's included, billing terms, trust signals) before they pay, and the actual payment surface feels more like a focused Stripe window than a cramped modal.

## Constraint: embedded vs. hosted Stripe

Lovable's managed Stripe integration only supports **embedded** Checkout — we cannot redirect to `checkout.stripe.com` or pop a new browser window. The closest equivalent to "open a Stripe window" is a **dedicated full-page route** (`/checkout`) where the embedded Stripe form is the only thing on screen, with the marketing chrome stripped away. That's what this plan builds.

## What changes

### 1. Replace the current modal with a richer two-step flow

When a user clicks "Subscribe to Pro/Team" on `/pricing`:

**Step A — Confirmation dialog** (new, replaces today's bare modal):
A wider dialog with two columns:
- **Left: Order summary**
  - Plan name + "Most popular" badge if applicable
  - Billing cadence pill (Monthly / Yearly)
  - Big price line: `$15 /month` with `Billed $180 annually` underneath when yearly
  - "You save $48/year" line when yearly is selected
  - Itemized "What's included" list (reuses the tier's `features`)
  - Account line: `Signing in as user@example.com`
- **Right: Terms & trust panel**
  - "What happens next" 3-step list: secure payment → instant access → manage anytime
  - Bullets: cancel anytime, prorated upgrades/downgrades, secure payment by Stripe, 30-day refund policy (copy only — no functional change)
  - Primary button: **Continue to payment →**
  - Secondary: **Cancel**
  - Small print: links to /legal terms and privacy

This step is purely presentational — no Stripe call yet, so it loads instantly and lets users back out before a session is created.

**Step B — Full-page checkout** (new route):
Clicking "Continue to payment" navigates to `/checkout?plan=pro&cadence=yearly`. This page:
- Uses a stripped layout (logo top-left, "Secure checkout" + lock icon top-right, no marketing header/footer nav)
- Two columns on desktop, stacked on mobile:
  - Left (sticky): condensed order summary (plan, price, cadence, features, "Change plan" link back to /pricing)
  - Right: the existing `<StripeEmbeddedCheckout />` mounted full-height
- Reads plan/cadence from query params, validates against the tier list, and calls `openCheckout({...})` on mount
- `return_url` stays `/checkout/return?session_id={CHECKOUT_SESSION_ID}` (unchanged)
- Auth guard: if not signed in, redirects to `/signup?next=/checkout?...`

This gives the "feels like a dedicated Stripe window" experience without violating the embedded-only constraint.

### 2. Files

**New:**
- `src/components/pricing/PlanConfirmDialog.tsx` — the rich confirmation dialog (props: tier, yearly, userEmail, onConfirm, onCancel)
- `src/pages/Checkout.tsx` — full-page checkout route with order summary + embedded Stripe

**Edited:**
- `src/pages/Pricing.tsx` — replace existing `Dialog`+`useStripeCheckout` usage with the new `PlanConfirmDialog`; on confirm, `navigate(\`/checkout?plan=${tier}&cadence=${yearly ? 'yearly' : 'monthly'}\`)`. Remove the `useStripeCheckout` import here.
- `src/App.tsx` — register `/checkout` route (public; auth handled inside the page so we can redirect with `next=`)
- `src/lib/public-routes.ts` — add `/checkout` if needed for SEO/no-index behavior (likely `noindex`)
- `src/data/changelog.ts` — append entry per changelog policy

**Unchanged:**
- `useStripeCheckout`, `StripeEmbeddedCheckout`, `CheckoutReturn.tsx`, edge function `create-checkout` — the underlying Stripe flow is identical.

### 3. Design notes

- Confirmation dialog: `max-w-3xl`, two-column on `md:`, single column on mobile. Uses existing semantic tokens (`bg-card`, `border-border`, `text-muted-foreground`, `gradient-primary` for the price highlight on the popular tier).
- Full-page checkout: minimal top bar with `<Logo />` + small "Secure payment by Stripe" indicator. Background `bg-muted/30` to separate from the white card. Sticky summary on `lg:` viewports.
- All copy stays factual to existing tier data — no invented features.

### 4. Out of scope

- No backend changes, no edge function changes, no Stripe configuration changes.
- Not switching to hosted Stripe Checkout (not supported by the managed integration).
- Not changing the tier data, prices, or feature lists.
