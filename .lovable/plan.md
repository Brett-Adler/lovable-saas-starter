## Finding: nothing to do

I reviewed `src/pages/Contact.tsx` end-to-end and searched the codebase for related artifacts.

**Admin notice when `contact_email` is missing — already complete** (lines 81–90):

- Pulls `contact_email` via `useSiteSettings()`.
- Treats it as a placeholder when null/missing or when it ends with `@example.com` (`emailIsPlaceholder`).
- Gated on `isAdmin` (admins only) via `useUserRoles()`.
- Renders a warning banner with a deep link to `/admin/site-settings` so the operator can fix it in one click.
- The public-facing email (`mailto:` + display) gracefully falls back to `hello@example.com` when unset, so anonymous visitors see a sensible default while admins see the actionable warning.

**Leftover placeholder chat UI — none found.** No chat widget, no `Crisp`/`Intercom`/`Tawk` references, no commented-out chat block in `Contact.tsx` or anywhere under `src/components`. The single match for "chat" in the codebase is unrelated copy in `src/components/docs/ReadmeContent.tsx` ("Paste any of these into the chat…").

## Recommendation

No code change is needed. If you were expecting a specific change (different copy, a different trigger condition, or a chat widget that was supposed to be removed from somewhere specific), point me at it and I'll handle it. Otherwise this task is already done and I'll close it out without edits.
