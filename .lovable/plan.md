# Pre-Phase-5 housekeeping

## 1. First user becomes admin (DB migration)

Update `handle_new_user()` so when there are zero admins in `user_roles`, the new signup is granted both `user` and `admin`. Backfill: grant admin to the existing first user (`brett@voicept.com`) so it applies retroactively.

```text
INSERT user role 'user'  (always)
IF no admin exists yet:
   INSERT user role 'admin'
```

Idempotent — once an admin exists, all later signups stay as plain `user`. After it runs, you'll see the "Admin" link in the sidebar on next page load.

## 2. Open TODOs added to `.lovable/plan.md`

Already written into the plan this turn:

- Replace placeholder Privacy Policy with real SaaS wording (data collected, processors, GDPR/CCPA, retention, contact)
- Replace placeholder Terms of Service with real wording (account terms, billing, IP, liability, governing law)
- Update "Last updated" dates once finalized
- Free generators noted: iubenda, TermsFeed, PrivacyPolicies.com

## 3. New in-app `/readme` page

A public route, styled to match the marketing site (uses `MarketingLayout` like `/privacy` and `/terms`).

**Sections:**

- **Quickstart** — sign up at `/signup`, first account is auto-promoted to admin, create an org, invite teammates from `/dashboard/members`
- **What's included** — table of every public route, every authed route, every admin route, and every backend table
- **Customizing the app**
  - Branding & assets — `public/` files, reference `public/BRANDING.md` for dimensions
  - Colors & design system — HSL tokens in `src/index.css`, `tailwind.config.ts`; never hard-code colors
  - Marketing copy — file locations for landing, pricing, about, contact
  - Promoting more admins — ask Lovable to "make user@x.com an admin" or insert into `user_roles`
  - OAuth providers — Google + Apple work out of the box; configurable in Lovable backend settings
- **⚠️ Privacy & Terms placeholder warning** — exact wording matching the screenshot, prominent callout card, with links to **iubenda**, **TermsFeed**, **PrivacyPolicies.com** + reminder to disclose all data processors (Lovable Cloud, Stripe, Resend, Twilio, built-in analytics)
- **Roadmap** — phases 1–4 done, phases 5–9 upcoming
- **Tech stack** — React 18, Vite 5, TS 5, Tailwind v3, shadcn/ui, Lovable Cloud

**Wiring:**

- New file `src/pages/Readme.tsx`
- Route `/readme` added to `src/App.tsx` (public, above the `*` catch-all)
- Footer link added in `src/components/marketing/MarketingFooter.tsx` so users can find it

## Out of scope here

No other UI changes. No `README.md` file. After approval I'll run the migration, build the `/readme` page + footer link, then we move on to **Phase 5: Stripe billing**.
