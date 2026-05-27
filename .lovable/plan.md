## Goal

Update `README.md` so it's a faithful, current snapshot of what's built, mirroring the features and FAQ on the public landing page (`/`) and pricing page.

## Findings

Today's README is mostly accurate but slightly out of date vs. what we now ship and what the marketing page advertises:

- The landing FAQ now mentions audit logs, in-app notifications, 14-day trial, and SAML SSO scaffold — README mentions most but the framing isn't matched.
- README has no quick-start / dev section (run, env, migrations) — useful for anyone forking.
- No mention of the new `usePlan` / `RequirePlan` plan-gating helper, even though it ships.
- No mention of the audit-log triggers (membership / invites / role grants) — only the table.
- "Architecture notes" doesn't reference notifications realtime or the `notify-user` edge function.
- Pricing tiers (Free / Pro / Team) shown on `/pricing` aren't referenced.
- No top-level link back to the live demo / published URL.

## Plan

Rewrite `README.md` with these sections, kept tight:

1. **Header** — one-line pitch + link to live demo.
2. **What's included** — keep current bullets, reorder to match the order on the landing `features` array (Auth → Payments → Emails → Teams → Analytics → SMS & Notifications → Secure by default → Beautiful UI), and add:
   - In-app notification bell (realtime) + `notify-user` edge function.
   - Audit log with automatic triggers for memberships, invites, role grants.
   - Plan-gating via `usePlan()` + `<RequirePlan>`.
3. **Pricing tiers** — short table mirroring `/pricing` (Free / Pro / Team) so README and site agree on what each tier unlocks.
4. **Quick start** — `npm i`, `npm run dev`, note that Lovable Cloud auto-provisions backend; migrations live in `supabase/migrations`.
5. **Pre-launch checklist** — keep existing structure (Required / Optional), no functional changes, just verify each item still matches code paths.
6. **Branding** — unchanged.
7. **Architecture notes** — keep current bullets, add:
   - Notifications use Supabase Realtime on `public.notifications`; server-side fan-out via `notify-user`.
   - Audit log is append-only via `log_audit()` security-definer function; triggers handle the common cases.
   - Plan tier resolution is centralized in `src/hooks/usePlan.tsx`.
8. **FAQ parity note** — short line saying the landing FAQ is the canonical user-facing answer; README is the developer view.

No code or schema changes. README only.
