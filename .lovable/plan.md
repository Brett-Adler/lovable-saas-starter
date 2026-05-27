## What's already correct

The **Features grid** (`src/pages/Index.tsx` lines 26–35, rendered at 170–183) already passes `status` and `tooltip` to `StatusBadge` for every card. Each `setup` card has a tooltip; `shipped` cards don't need one. No change needed there.

## What's missing

The **FAQ section** (lines 50–57, rendered 256–263) doesn't show any status indicator, even though three of the six questions are directly about a feature whose state matters:

| Question | Related feature(s) | Correct badge |
|---|---|---|
| "Are SMS, push, and SSO live out of the box?" | `auth-sms`, `push`, `saml` | **Needs setup** |
| "Does it support dark mode?" | UI / theming | **Live** |
| "What about marketing emails?" | `marketing-email` | **Needs setup** |

The other three FAQs ("What's included?", "Can I use this commercially?", "How do I add my logo?") are general — no badge.

## Changes

**`src/pages/Index.tsx`**

1. Extend the FAQ type so an item can optionally carry status:
   ```ts
   type Faq = { q: string; a: string; status?: FeatureStatus; tooltip?: string };
   const faqs: Faq[] = [ ... ];
   ```
2. Add `status` + `tooltip` to the three feature-related FAQs:
   - SMS/push/SSO → `status: "setup"`, tooltip mirrors the setup notes from `featureStatus.ts` (Twilio, VAPID, SAML form).
   - Dark mode → `status: "shipped"` (no tooltip).
   - Marketing emails → `status: "setup"`, tooltip: "Add `RESEND_API_KEY` and verify a sending domain in Resend."
3. In the FAQ render, place a `<StatusBadge>` next to the question label inside `AccordionTrigger`, only when `f.status` is defined. Keep the trigger left-aligned; badge sits to the right of the text and before the chevron.

**Features grid** — keep as-is. Verified each entry already has the correct status/tooltip.

## Out of scope

- No edits to `featureStatus.ts` (single source of truth is already correct).
- No new FAQ items.
- No changes to schema.org `FAQPage` JSON-LD (status badges are visual hints, not part of the structured Q/A).
- No changelog entry (cosmetic accuracy tweak).
