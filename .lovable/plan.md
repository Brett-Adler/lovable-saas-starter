## What's there today

`NewsletterForm` already inserts into `public.marketing_subscribers` (table exists with `email`, `status`, `source`, `unsubscribe_token`, RLS allowing anonymous insert, admin read/update). The insert technically works, but the form swallows errors and there is **no confirmation email, no unsubscribe flow, no admin view, and no way to actually send a broadcast**. Also: `marketing_campaigns` and `marketing_segments` tables already exist — we'll reuse `marketing_campaigns` for broadcasts.

## Stack decisions (confirmed)

- **Broadcast ESP**: Resend (via the connector gateway). Lovable's built-in email pipeline stays for auth + transactional only.
- **Double opt-in**: required. New subscribers land as `pending` until they click the confirmation link.
- **Compliance**: CAN-SPAM physical address (Wrigley Field — 1060 W Addison St, Chicago, IL 60613), GDPR consent text, one-click unsubscribe, `List-Unsubscribe` + `List-Unsubscribe-Post` headers, suppression honored.
- **Voice**: sample/preview names from *The Blues Brothers* (Jake, Elwood, Mrs. Murphy, Curtis, Cab Calloway, etc.).

## Plan

### 1. Database migration
- Add to `marketing_subscribers`: `confirmed_at TIMESTAMPTZ`, `confirmation_token TEXT UNIQUE` (default random hex), `consent_ip INET`, `consent_user_agent TEXT`, `consent_text TEXT`. Default `status` changes to `pending` for new rows.
- Add to `site_settings`: `mailing_address TEXT`, `company_legal_name TEXT`, `from_name TEXT`, `from_email TEXT`, `reply_to TEXT`.
- Seed `site_settings` with Wrigley Field address + "Blues Brothers Newsletter" defaults.
- New `marketing_campaign_recipients` table to track per-recipient send status for each broadcast (campaign_id, email, status: `queued|sent|failed|skipped`, error, sent_at). Admin-only RLS.
- Security-definer RPC `list_confirmed_subscribers()` so the broadcast edge function can fetch the list via service role only.
- GRANTs + RLS on all new tables/columns.

### 2. Transactional templates (Lovable Emails — `_shared/transactional-email-templates/`)
- `newsletter-confirm.tsx` — "Confirm you want updates from {site}" with branded button → `/newsletter/confirm?token=...`. Preview data uses *"Jake Blues"*.
- `newsletter-welcome.tsx` — sent once on successful confirmation.
- Register both in `registry.ts` and add to `USER_TRIGGERABLE` with rule `'self'` so anyone can request a confirm email for their own address.
- Both templates use existing `_styles.ts` tokens, white body bg, brand orange button, semantic markup, mailing address in footer.

### 3. New Lovable edge functions
- `confirm-newsletter-subscription` (`verify_jwt = false`): validates token, marks `status='subscribed'`, sets `confirmed_at`, triggers `send-transactional-email` welcome.
- `send-marketing-broadcast` (`verify_jwt = true`, in-function admin check via `has_role`): loads `marketing_campaigns` row, fetches confirmed subscribers, sends through Resend gateway in batches of 50 with 250 ms spacing, per-recipient unsubscribe URL, `List-Unsubscribe` headers, honors `suppressed_emails`. Writes per-recipient rows to `marketing_campaign_recipients`, updates campaign `stats` + `status`.
- Update `handle-email-unsubscribe`: after marking the token used, also `UPDATE marketing_subscribers SET status='unsubscribed', unsubscribed_at=now()` for that email so they're removed from future broadcasts.

### 4. Resend connector + secret
- Call `standard_connectors--connect` for Resend so `RESEND_API_KEY` + `LOVABLE_API_KEY` are available to the broadcast function.
- Verify Resend domain (notify.voicept.com or chosen subdomain) handled by the user inside Resend — surfaced as a checklist on the admin Broadcasts page if `verify_credentials` reports failure.

### 5. Public pages
- **Rewrite `NewsletterForm.tsx`**: zod validation, captures `consent_text` + UA, calls `supabase.from('marketing_subscribers').upsert(...)`, then `supabase.functions.invoke('send-transactional-email', { template: 'newsletter-confirm', ... })`. Real error handling, success state "Check your inbox to confirm — even Elwood had to click the link." Inline GDPR consent text + link to Privacy.
- **New `/newsletter/confirm` page**: reads `?token=`, calls confirm edge function, accessible status messaging with `role="status"` / `aria-live="polite"`.
- **Update `/unsubscribe`**: copy now mentions both transactional + newsletter unsubscribe.
- **`/legal` privacy section**: add subscriber-data paragraph (what we store, retention, how to delete, controller info pointing to Wrigley Field address).
- **`Newsletter.tsx` page**: add accessibility note + sample-issue link.

### 6. Admin (`/admin`)
- **`Subscribers.tsx`**: paginated table (email, status badge, source, subscribed_at, confirmed_at), filter by status, search, CSV export, manual unsubscribe / delete, copy email button. Counts header ("Curtis is tracking 124 confirmed, 12 pending").
- **`Broadcasts.tsx`**: list of `marketing_campaigns` + composer (subject, preheader, markdown body, from_name/reply_to defaults from site_settings). Live HTML preview with mailing address + unsubscribe footer auto-appended. Buttons: *Send test to me*, *Send to all confirmed* (confirmation dialog with recipient count + "type SEND to confirm").
- Update `SiteSettings.tsx` with new fields (mailing address, legal name, from/reply-to).
- Wire cards on `AdminIndex.tsx`.

### 7. Compliance & accessibility polish
- All forms: labeled inputs, focus rings via semantic tokens, error text linked via `aria-describedby`, status announcements via `aria-live`.
- All marketing emails: physical address + one-click unsubscribe + `List-Unsubscribe` + `List-Unsubscribe-Post: List-Unsubscribe=One-Click` (Gmail/Apple Mail requirement) + plain-text alternative.
- Suppression list checked before every Resend send; bounced/complained addresses auto-suppressed by existing `handle-email-suppression`.
- Resubscribe flow: re-submitting flips status back to `pending` and re-sends confirmation (no duplicates).

## Technical notes
- Idempotency keys: `newsletter-confirm-{subscriber.id}`, `newsletter-welcome-{subscriber.id}`, `broadcast-{campaign.id}-{recipient.id}`.
- Per-recipient unsubscribe URL: `${SITE_URL}/unsubscribe?token=...` reusing existing `email_unsubscribe_tokens` infra.
- Broadcast send loop is best-effort with retries on 429 (respect Resend `Retry-After`); per-recipient errors don't abort the batch.
- Resend connector key naming: `RESEND_API_KEY` (gateway URL `https://connector-gateway.lovable.dev/resend`).
- Sample/test recipient defaults to admin email; `from_name` default "Jake & Elwood @ {site}".
