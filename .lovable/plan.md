## Plan

Add a clear, friendly disclaimer banner on the `/pricing` page clarifying that this is a free Lovable starter template and the listed prices are illustrative — no one is being charged to use the template.

### Change
- File: `src/pages/Pricing.tsx`
- Insert a dismissible-style `Alert` (using existing `@/components/ui/alert`) directly under the `PaymentTestModeBanner`, above the hero section.
- Copy (concise):
  - Title: "This is a free template"
  - Body: "SaaS Starter Suite is an open Lovable template. The pricing below is example content to demonstrate a subscription flow — you are not being charged to use the template. Remix it and replace these tiers with your own."

### Styling
- Use semantic tokens only (no raw colors). Variant: default `Alert` inside a centered `container` with top padding so it sits cleanly above the "Pricing" badge.
- Include an `Info` icon from `lucide-react` for clarity.

No other files or logic change.