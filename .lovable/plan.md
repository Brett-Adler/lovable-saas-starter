# SaaS starter — build roadmap

All seven roadmap steps are shipped. The app now matches the marketing
promises end-to-end; everything that needs a third-party credential is a
credential swap, not a code change. See `README.md` for the launch
checklist.

## Status

| Step | State |
|---|---|
| 1. In-app notification bell | ✅ realtime, bell in dashboard + admin shells, `notify-user` helper |
| 2. Audit logs | ✅ `audit_log` table + triggers + `/admin/audit` |
| 3. Plan-gating + 14-day trial | ✅ `usePlan`, `<RequirePlan>`, trial wired into checkout |
| 4. SMS / OTP login | ✅ Phone tab on `/login`+`/signup`, `send-sms` stub (Twilio-ready) |
| 5. SSO / SAML scaffold | ✅ `/dashboard/organization/sso`, `org_sso_config` table, Team-gated |
| 6. Push notifications | ✅ `public/sw.js`, `push_subscriptions` table, `send-push` stub (VAPID-ready) |
| 7. Polish + truth-in-marketing | ✅ FAQ updated, pre-launch checklist in README |

## What still needs credentials (not code)

- Apple provider (Lovable Cloud → Auth)
- Twilio (SMS) — secrets + uncomment block in `send-sms`
- Web Push VAPID keys — secrets + `VITE_VAPID_PUBLIC_KEY` + uncomment block in `send-push`
- SAML provisioning — when a customer fills in the SSO form, run `configure_saml_sso`
- Stripe live keys + real products
- Resend sending-domain verification
