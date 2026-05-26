// Public endpoint: accepts a newsletter signup, upserts a pending subscriber,
// and triggers a confirmation email via send-transactional-email (service role).
import { createClient } from 'npm:@supabase/supabase-js@2'
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'
import { z } from 'npm:zod@3.23.8'

const BodySchema = z.object({
  email: z.string().trim().toLowerCase().email().max(320),
  name: z.string().trim().max(200).optional().nullable(),
  source: z.string().trim().max(100).optional().nullable(),
  consent_text: z.string().trim().max(1000).optional().nullable(),
})

const SITE_URL = (Deno.env.get('PUBLIC_SITE_URL') ?? 'https://saas-starter-suite.lovable.app').replace(/\/$/, '')

function json(data: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders })
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405)

  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  if (!supabaseUrl || !serviceKey) return json({ error: 'Server configuration error' }, 500)

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return json({ error: 'Invalid JSON body' }, 400)
  }

  const parsed = BodySchema.safeParse(body)
  if (!parsed.success) {
    return json({ error: 'Invalid input', details: parsed.error.flatten().fieldErrors }, 400)
  }
  const { email, name, source, consent_text } = parsed.data

  // Capture consent audit info from request headers (best-effort).
  const ipHeader =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('cf-connecting-ip') ||
    null
  const userAgent = req.headers.get('user-agent')

  const supabase = createClient(supabaseUrl, serviceKey)

  // Check suppression: if user previously unsubscribed via Lovable Emails
  // pipeline, refuse to resubscribe silently here — they must reach out.
  const { data: suppressed } = await supabase
    .from('suppressed_emails')
    .select('id')
    .eq('email', email)
    .maybeSingle()

  if (suppressed) {
    return json({
      success: false,
      reason: 'suppressed',
      message: "This address previously opted out. Reply to a past email and we'll help.",
    }, 200)
  }

  // Upsert subscriber. If they exist & confirmed: idempotent success.
  // If they exist & pending/unsubscribed: reset to pending + fresh token.
  const { data: existing } = await supabase
    .from('marketing_subscribers')
    .select('id, status, confirmed_at, confirmation_token')
    .eq('email', email)
    .maybeSingle()

  let subscriberId: string
  let confirmationToken: string
  let alreadyConfirmed = false

  if (existing) {
    if (existing.status === 'subscribed' && existing.confirmed_at) {
      // Already on the list. Don't resend confirmation. Be friendly.
      return json({ success: true, alreadyConfirmed: true })
    }
    // Re-issue a fresh token so old links can't be hijacked.
    const newToken = crypto.randomUUID().replace(/-/g, '') + crypto.randomUUID().replace(/-/g, '')
    const { error: updateErr } = await supabase
      .from('marketing_subscribers')
      .update({
        status: 'pending',
        name: name ?? null,
        source: source ?? null,
        confirmation_token: newToken,
        confirmed_at: null,
        unsubscribed_at: null,
        consent_ip: ipHeader,
        consent_user_agent: userAgent,
        consent_text: consent_text ?? null,
      })
      .eq('id', existing.id)

    if (updateErr) {
      console.error('Failed to update subscriber', { error: updateErr, email })
      return json({ error: 'Could not process signup' }, 500)
    }
    subscriberId = existing.id
    confirmationToken = newToken
  } else {
    const newToken = crypto.randomUUID().replace(/-/g, '') + crypto.randomUUID().replace(/-/g, '')
    const { data: inserted, error: insertErr } = await supabase
      .from('marketing_subscribers')
      .insert({
        email,
        name: name ?? null,
        source: source ?? null,
        status: 'pending',
        confirmation_token: newToken,
        consent_ip: ipHeader,
        consent_user_agent: userAgent,
        consent_text: consent_text ?? null,
      })
      .select('id, confirmation_token')
      .single()

    if (insertErr || !inserted) {
      console.error('Failed to insert subscriber', { error: insertErr, email })
      return json({ error: 'Could not process signup' }, 500)
    }
    subscriberId = inserted.id
    confirmationToken = inserted.confirmation_token
  }

  if (alreadyConfirmed) return json({ success: true, alreadyConfirmed: true })

  // Pull mailing address for the confirmation footer.
  const { data: settings } = await supabase
    .from('site_settings')
    .select('mailing_address')
    .eq('id', 1)
    .maybeSingle()

  const confirmUrl = `${SITE_URL}/newsletter/confirm?token=${encodeURIComponent(confirmationToken)}`

  // Trigger the confirmation email via send-transactional-email using service role
  const { error: sendErr } = await supabase.functions.invoke('send-transactional-email', {
    body: {
      templateName: 'newsletter-confirm',
      recipientEmail: email,
      idempotencyKey: `newsletter-confirm-${subscriberId}-${confirmationToken.slice(0, 10)}`,
      templateData: {
        name: name ?? undefined,
        confirmUrl,
        mailingAddress: settings?.mailing_address ?? undefined,
      },
    },
  })

  if (sendErr) {
    console.error('Failed to enqueue confirmation email', { error: sendErr, email })
    // Subscriber is saved; the admin can manually resend. Still surface the error.
    return json({
      success: true,
      warning: 'Saved, but confirmation email could not be queued. Contact support.',
    })
  }

  return json({ success: true })
})
