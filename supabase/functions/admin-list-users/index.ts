// Admin-only: returns auth.users metadata (last_sign_in_at, providers, etc.)
// not exposed via the Data API. Caller JWT is validated and checked for admin.
import { createClient } from 'npm:@supabase/supabase-js@2'
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders })
  if (req.method !== 'POST' && req.method !== 'GET') return json({ error: 'Method not allowed' }, 405)

  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY')
  if (!supabaseUrl || !serviceKey || !anonKey) return json({ error: 'Server configuration error' }, 500)

  const authHeader = req.headers.get('Authorization') || ''
  const callerToken = authHeader.replace(/^Bearer\s+/i, '')
  if (!callerToken) return json({ error: 'Unauthorized' }, 401)

  const userClient = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: `Bearer ${callerToken}` } },
  })
  const { data: claimsData } = await userClient.auth.getClaims(callerToken)
  const callerUserId = (claimsData?.claims as { sub?: string } | undefined)?.sub
  if (!callerUserId) return json({ error: 'Unauthorized' }, 401)

  const admin = createClient(supabaseUrl, serviceKey)
  const { data: isAdmin } = await admin.rpc('has_role', { _user_id: callerUserId, _role: 'admin' })
  if (!isAdmin) return json({ error: 'Forbidden: admin required' }, 403)

  const url = new URL(req.url)
  const page = Math.max(1, Number(url.searchParams.get('page') ?? '1'))
  const perPage = Math.min(200, Math.max(1, Number(url.searchParams.get('perPage') ?? '200')))

  const { data, error } = await admin.auth.admin.listUsers({ page, perPage })
  if (error) return json({ error: error.message }, 500)

  const users = (data?.users ?? []).map((u) => ({
    id: u.id,
    email: u.email ?? null,
    last_sign_in_at: u.last_sign_in_at ?? null,
    created_at: u.created_at ?? null,
    email_confirmed_at: u.email_confirmed_at ?? null,
    providers: Array.from(new Set((u.identities ?? []).map((i) => i.provider))).filter(Boolean),
    banned_until: (u as unknown as { banned_until?: string | null }).banned_until ?? null,
  }))

  return json({ users })
})
