// Public endpoint: validates a newsletter confirmation token,
// flips subscriber to status=subscribed, and triggers the welcome email.
import { createClient } from 'npm:@supabase/supabase-js@2'
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'
import { z } from 'npm:zod@3.23.8'

const BodySchema = z.object({
  token: z.string().trim().min(20).max(200),
})

function json(data: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders })

  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  if (!supabaseUrl || !serviceKey) return json({ error: 'Server configuration error' }, 500)

  // Token can come from GET (?token=) or POST body
  let token: string | null = null
  if (req.method === 'GET') {
    token = new URL(req.url).searchParams.get('token')
  } else if (req.method === 'POST') {
    try {
      const body = await req.json()
      const parsed = BodySchema.safeParse(body)
      if (!parsed.success) return json({ error: 'Invalid token' }, 400)
      token = parsed.data.token
    } catch {
      return json({ error: 'Invalid JSON body' }, 400)
    }
  } else {
    return json({ error: 'Method not allowed' }, 405)
  }

  if (!token) return json({ error: 'Token is required' }, 400)

  const supabase = createClient(supabaseUrl, serviceKey)

  const { data: subscriber, error: lookupErr } = await supabase
    .from('marketing_subscribers')
    .select('id, email, name, status, confirmed_at')
    .eq('confirmation_token', token)
    .maybeSingle()

  if (lookupErr) {
    console.error('Lookup failed', { error: lookupErr })
    return json({ error: 'Lookup failed' }, 500)
  }
  if (!subscriber) return json({ valid: false, reason: 'invalid_token' }, 404)

  // GET = validate only
  if (req.method === 'GET') {
    if (subscriber.status === 'subscribed' && subscriber.confirmed_at) {
      return json({ valid: false, reason: 'already_confirmed' })
    }
    return json({ valid: true })
  }

  // POST = confirm
  if (subscriber.status === 'subscribed' && subscriber.confirmed_at) {
    return json({ success: true, alreadyConfirmed: true })
  }

  const { error: updateErr } = await supabase
    .from('marketing_subscribers')
    .update({
      status: 'subscribed',
      confirmed_at: new Date().toISOString(),
      subscribed_at: new Date().toISOString(),
      unsubscribed_at: null,
    })
    .eq('id', subscriber.id)

  if (updateErr) {
    console.error('Failed to confirm subscriber', { error: updateErr, id: subscriber.id })
    return json({ error: 'Failed to confirm' }, 500)
  }

  // Send welcome email (best-effort; failure does not block confirmation)
  const { data: settings } = await supabase
    .from('site_settings')
    .select('mailing_address')
    .eq('id', 1)
    .maybeSingle()

  // Use service role to invoke welcome (it's not in USER_TRIGGERABLE, so we
  // call directly via fetch with the service key in the Authorization header)
  try {
    await fetch(`${supabaseUrl}/functions/v1/send-transactional-email`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${serviceKey}`,
        apikey: serviceKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        templateName: 'newsletter-welcome',
        recipientEmail: subscriber.email,
        idempotencyKey: `newsletter-welcome-${subscriber.id}`,
        templateData: {
          name: subscriber.name ?? undefined,
          mailingAddress: settings?.mailing_address ?? undefined,
        },
      }),
    })
  } catch (err) {
    console.error('Welcome email failed (non-fatal)', { error: err })
  }

  return json({ success: true })
})
