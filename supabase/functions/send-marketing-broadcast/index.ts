// Admin-triggered marketing broadcast via Resend (connector gateway).
// Reads a marketing_campaigns row, fetches confirmed subscribers, sends each
// email through Resend with a per-recipient unsubscribe URL + List-Unsubscribe
// headers, and records per-recipient status in marketing_campaign_recipients.
import { createClient } from 'npm:@supabase/supabase-js@2'
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'
import { z } from 'npm:zod@3.23.8'

const BodySchema = z.object({
  campaign_id: z.string().uuid(),
  test_email: z.string().email().optional(), // when present, only send to this one address
})

const RESEND_GATEWAY = 'https://connector-gateway.lovable.dev/resend'
const BATCH_SIZE = 50
const BATCH_DELAY_MS = 250
const SITE_URL = (Deno.env.get('PUBLIC_SITE_URL') ?? '').replace(/\/$/, '')
const FALLBACK_FROM_EMAIL = Deno.env.get('NEWSLETTER_FROM_EMAIL')
  ?? `newsletter@${Deno.env.get('SENDER_DOMAIN') ?? 'mail.example.com'}`

function json(data: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

function htmlEscape(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  } as Record<string, string>)[c])
}

// Tiny markdown → HTML for broadcast body. We accept only a small safe subset:
// headings (# ##), paragraphs, bold/italic, links, lists, line breaks.
function mdToHtml(md: string): string {
  const lines = md.split(/\r?\n/)
  const out: string[] = []
  let inList = false
  for (let raw of lines) {
    const line = raw.trimEnd()
    if (!line.trim()) {
      if (inList) { out.push('</ul>'); inList = false }
      out.push('')
      continue
    }
    if (/^\s*[-*]\s+/.test(line)) {
      if (!inList) { out.push('<ul>'); inList = true }
      out.push(`<li>${inline(line.replace(/^\s*[-*]\s+/, ''))}</li>`)
      continue
    }
    if (inList) { out.push('</ul>'); inList = false }
    if (/^#{2}\s+/.test(line)) { out.push(`<h2>${inline(line.replace(/^#{2}\s+/, ''))}</h2>`); continue }
    if (/^#\s+/.test(line))    { out.push(`<h1>${inline(line.replace(/^#\s+/, ''))}</h1>`); continue }
    out.push(`<p>${inline(line)}</p>`)
  }
  if (inList) out.push('</ul>')
  return out.join('\n')

  function inline(s: string): string {
    let t = htmlEscape(s)
    t = t.replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" style="color:#f5532d">$1</a>')
    t = t.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    t = t.replace(/(^|[\s(])\*([^*\n]+)\*/g, '$1<em>$2</em>')
    return t
  }
}

function buildEmailHtml(args: {
  bodyHtml: string
  preheader?: string
  unsubscribeUrl: string
  mailingAddress: string
  companyName: string
}): string {
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title></title></head>
<body style="margin:0;padding:0;background:#ffffff;font-family:'Inter',Arial,sans-serif;color:#1f1f2e">
<div style="display:none;max-height:0;overflow:hidden;color:transparent">${htmlEscape(args.preheader ?? '')}</div>
<div style="max-width:560px;margin:0 auto;padding:40px 32px;line-height:1.6;font-size:15px;color:#3a3a4a">
${args.bodyHtml}
<hr style="border:none;border-top:1px solid #f0eef0;margin:32px 0">
<p style="font-size:12px;color:#9a9aa8">
You're getting this because you confirmed your subscription to our newsletter.
<a href="${args.unsubscribeUrl}" style="color:#f5532d">Unsubscribe in one click</a>.
</p>
<p style="font-size:12px;color:#9a9aa8;margin-top:8px">
${htmlEscape(args.companyName)} · ${htmlEscape(args.mailingAddress)}
</p>
</div>
</body></html>`
}

function buildEmailText(args: {
  bodyText: string
  unsubscribeUrl: string
  mailingAddress: string
  companyName: string
}): string {
  return `${args.bodyText}

---
You're getting this because you confirmed your subscription to our newsletter.
Unsubscribe in one click: ${args.unsubscribeUrl}

${args.companyName} · ${args.mailingAddress}`
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders })
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405)

  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY')
  const lovableKey = Deno.env.get('LOVABLE_API_KEY')
  const resendKey = Deno.env.get('RESEND_API_KEY')

  if (!supabaseUrl || !serviceKey || !anonKey) return json({ error: 'Server configuration error' }, 500)
  if (!lovableKey || !resendKey) {
    return json({
      error: 'Email provider not connected. Ask an admin to connect Resend in Lovable Cloud → Connectors.',
    }, 503)
  }

  // ---- admin check via caller JWT ----
  const authHeader = req.headers.get('Authorization') || ''
  const callerToken = authHeader.replace(/^Bearer\s+/i, '')
  if (!callerToken) return json({ error: 'Unauthorized' }, 401)

  const userClient = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: `Bearer ${callerToken}` } },
  })
  const { data: claimsData } = await userClient.auth.getClaims(callerToken)
  const claims = claimsData?.claims as { sub?: string } | undefined
  const callerUserId = claims?.sub
  if (!callerUserId) return json({ error: 'Unauthorized' }, 401)

  const supabase = createClient(supabaseUrl, serviceKey)
  const { data: isAdmin, error: roleErr } = await supabase.rpc('has_role', {
    _user_id: callerUserId,
    _role: 'admin',
  })
  if (roleErr || !isAdmin) return json({ error: 'Forbidden: admin required' }, 403)

  // ---- parse + load campaign ----
  let body: unknown
  try { body = await req.json() } catch { return json({ error: 'Invalid JSON' }, 400) }
  const parsed = BodySchema.safeParse(body)
  if (!parsed.success) return json({ error: 'Invalid input', details: parsed.error.flatten().fieldErrors }, 400)
  const { campaign_id, test_email } = parsed.data

  const { data: campaign, error: campErr } = await supabase
    .from('marketing_campaigns')
    .select('*')
    .eq('id', campaign_id)
    .maybeSingle()
  if (campErr || !campaign) return json({ error: 'Campaign not found' }, 404)

  if (!test_email && (campaign.status === 'sending' || campaign.status === 'sent')) {
    return json({ error: `Campaign already ${campaign.status}` }, 409)
  }

  // ---- site_settings for footer / from ----
  const { data: settings } = await supabase
    .from('site_settings')
    .select('mailing_address, company_legal_name, from_name, from_email, reply_to')
    .eq('id', 1)
    .maybeSingle()

  const fromName = campaign.from_name ?? settings?.from_name ?? 'Newsletter'
  const fromEmail = campaign.from_email ?? settings?.from_email ?? FALLBACK_FROM_EMAIL
  const replyTo = campaign.reply_to ?? settings?.reply_to ?? null
  const mailingAddress = settings?.mailing_address ?? ''
  const companyName = settings?.company_legal_name ?? 'The Newsletter Team'

  // Render body (HTML + text). campaign.body_html wins if set; else markdown from body_text.
  const rawBody = (campaign.body_html?.trim() || mdToHtml(campaign.body_text ?? '')) as string
  const rawText = (campaign.body_text?.trim() || (campaign.body_html ?? '').replace(/<[^>]+>/g, ' ')) as string

  // ---- recipient list ----
  type Recipient = { email: string; name: string | null; subscriber_id: string | null }
  let recipients: Recipient[] = []

  if (test_email) {
    recipients = [{ email: test_email.toLowerCase(), name: null, subscriber_id: null }]
  } else {
    const { data: rows, error: listErr } = await supabase.rpc('list_confirmed_subscriber_emails')
    if (listErr) return json({ error: 'Failed to load subscribers', details: listErr.message }, 500)
    recipients = (rows ?? []).map((r: { id: string; email: string; name: string | null }) => ({
      email: r.email.toLowerCase(),
      name: r.name,
      subscriber_id: r.id,
    }))
  }

  if (recipients.length === 0) {
    return json({ success: true, sent: 0, message: 'No confirmed subscribers.' })
  }

  // ---- suppression filter ----
  const emails = recipients.map((r) => r.email)
  const { data: suppressed } = await supabase
    .from('suppressed_emails')
    .select('email')
    .in('email', emails)
  const suppressedSet = new Set((suppressed ?? []).map((r: { email: string }) => r.email))

  if (!test_email) {
    await supabase
      .from('marketing_campaigns')
      .update({ status: 'sending' })
      .eq('id', campaign_id)
  }

  let sent = 0
  let failed = 0
  let skipped = 0

  for (let i = 0; i < recipients.length; i += BATCH_SIZE) {
    const batch = recipients.slice(i, i + BATCH_SIZE)
    await Promise.all(batch.map(async (rcpt) => {
      // Skip suppressed
      if (suppressedSet.has(rcpt.email)) {
        skipped++
        if (!test_email) {
          await supabase.from('marketing_campaign_recipients').upsert({
            campaign_id, email: rcpt.email, subscriber_id: rcpt.subscriber_id,
            status: 'skipped', error: 'suppressed',
          }, { onConflict: 'campaign_id,email' })
        }
        return
      }

      // Ensure unsubscribe token exists (one per email).
      let unsubToken: string | null = null
      const { data: existing } = await supabase
        .from('email_unsubscribe_tokens')
        .select('token, used_at')
        .eq('email', rcpt.email)
        .maybeSingle()

      if (existing && !existing.used_at) {
        unsubToken = existing.token
      } else if (!existing) {
        const newToken = crypto.randomUUID().replace(/-/g, '') + crypto.randomUUID().replace(/-/g, '')
        await supabase
          .from('email_unsubscribe_tokens')
          .upsert({ token: newToken, email: rcpt.email }, { onConflict: 'email', ignoreDuplicates: true })
        const { data: stored } = await supabase
          .from('email_unsubscribe_tokens')
          .select('token')
          .eq('email', rcpt.email)
          .maybeSingle()
        unsubToken = stored?.token ?? newToken
      } else {
        // Token used but somehow not suppressed -> skip and mark
        skipped++
        if (!test_email) {
          await supabase.from('marketing_campaign_recipients').upsert({
            campaign_id, email: rcpt.email, subscriber_id: rcpt.subscriber_id,
            status: 'skipped', error: 'unsubscribed',
          }, { onConflict: 'campaign_id,email' })
        }
        return
      }

      const unsubscribeUrl = `${SITE_URL}/unsubscribe?token=${encodeURIComponent(unsubToken!)}`
      const oneClickUrl = `${supabaseUrl}/functions/v1/handle-email-unsubscribe?token=${encodeURIComponent(unsubToken!)}`

      const html = buildEmailHtml({ bodyHtml: rawBody, preheader: campaign.preheader ?? '', unsubscribeUrl, mailingAddress, companyName })
      const text = buildEmailText({ bodyText: rawText, unsubscribeUrl, mailingAddress, companyName })

      try {
        const res = await fetch(`${RESEND_GATEWAY}/emails`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${lovableKey}`,
            'X-Connection-Api-Key': resendKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: `${fromName} <${fromEmail}>`,
            to: [rcpt.email],
            subject: campaign.subject,
            html,
            text,
            ...(replyTo ? { reply_to: replyTo } : {}),
            headers: {
              'List-Unsubscribe': `<${oneClickUrl}>, <mailto:${replyTo ?? fromEmail}?subject=unsubscribe>`,
              'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
            },
          }),
        })
        const data = await res.json().catch(() => ({}))
        if (!res.ok) {
          throw new Error(`Resend ${res.status}: ${JSON.stringify(data)}`)
        }
        sent++
        if (!test_email) {
          await supabase.from('marketing_campaign_recipients').upsert({
            campaign_id, email: rcpt.email, subscriber_id: rcpt.subscriber_id,
            status: 'sent', provider_message_id: data?.id ?? null, sent_at: new Date().toISOString(),
          }, { onConflict: 'campaign_id,email' })
        }
      } catch (err) {
        failed++
        const msg = err instanceof Error ? err.message : String(err)
        console.error('Broadcast send failed', { email: rcpt.email, err: msg })
        if (!test_email) {
          await supabase.from('marketing_campaign_recipients').upsert({
            campaign_id, email: rcpt.email, subscriber_id: rcpt.subscriber_id,
            status: 'failed', error: msg.slice(0, 500),
          }, { onConflict: 'campaign_id,email' })
        }
      }
    }))
    if (i + BATCH_SIZE < recipients.length) {
      await new Promise((r) => setTimeout(r, BATCH_DELAY_MS))
    }
  }

  if (!test_email) {
    await supabase
      .from('marketing_campaigns')
      .update({
        status: failed > 0 && sent === 0 ? 'failed' : 'sent',
        sent_at: new Date().toISOString(),
        stats: { sent, failed, skipped, total: recipients.length },
      })
      .eq('id', campaign_id)
  }

  return json({ success: true, sent, failed, skipped, total: recipients.length })
})
