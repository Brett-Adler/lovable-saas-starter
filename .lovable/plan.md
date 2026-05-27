## Optional cleanup

Verification confirmed both Demo and Waitlist write valid rows to `public.leads`. One small improvement worth making:

**`src/pages/Demo.tsx`** — populate the dedicated `company` column instead of packing it into `source`:

```ts
await supabase.from("leads").insert({
  kind: "demo",
  name: parsed.data.name,
  email: parsed.data.email,
  company: parsed.data.company,          // ← use the real column
  source: `demo:size=${parsed.data.size}`, // keep team size in source (no dedicated column)
  message: parsed.data.notes || null,
});
```

Why: makes admin filtering on `/admin/leads` by company straightforward, and leaves `source` for routing/attribution only.

Optional polish on the same pass: align Waitlist's success toast ("You're on the list!") with its success-state heading ("You're in 🎉") — either is fine, just pick one for consistency.

## Out of scope

- No schema changes (the `team_size` data has no dedicated column on purpose — `leads` stays generic).
- No changes to Waitlist's insert payload (already correct).

## Files

- Edited: `src/pages/Demo.tsx` (and optionally `src/pages/Waitlist.tsx` for the toast/heading wording).
