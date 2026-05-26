// Admin-only: returns signups time series + recent signups from auth.users.
// Other analytics (MRR, subs, leads, events) are queried client-side via admin RLS.
import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

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
  const { data: claimsData } = await userClient.auth.getUser()
  const callerUserId = claimsData?.user?.id
  if (!callerUserId) return json({ error: 'Unauthorized' }, 401)

  const admin = createClient(supabaseUrl, serviceKey)
  const { data: isAdmin } = await admin.rpc('has_role', { _user_id: callerUserId, _role: 'admin' })
  if (!isAdmin) return json({ error: 'Forbidden: admin required' }, 403)

  const url = new URL(req.url)
  const days = Math.min(365, Math.max(1, Number(url.searchParams.get('days') ?? '30')))
  const now = new Date()
  const start = new Date(now.getTime() - days * 24 * 60 * 60 * 1000)
  const prevStart = new Date(start.getTime() - days * 24 * 60 * 60 * 1000)

  // Paginate auth.users — listUsers max perPage is 1000.
  const all: Array<{ id: string; email: string | null; created_at: string; identities?: Array<{ provider: string }> }> = []
  for (let page = 1; page <= 50; page++) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 1000 })
    if (error) return json({ error: error.message }, 500)
    const users = data?.users ?? []
    for (const u of users) {
      all.push({
        id: u.id,
        email: u.email ?? null,
        created_at: u.created_at!,
        identities: (u.identities ?? []).map((i) => ({ provider: i.provider })),
      })
    }
    if (users.length < 1000) break
  }

  // Daily buckets (UTC date keys).
  const series: Record<string, number> = {}
  for (let i = 0; i < days; i++) {
    const d = new Date(start.getTime() + i * 24 * 60 * 60 * 1000)
    series[d.toISOString().slice(0, 10)] = 0
  }
  let countInRange = 0
  let countInPrev = 0
  for (const u of all) {
    const t = new Date(u.created_at).getTime()
    if (t >= start.getTime() && t <= now.getTime()) {
      countInRange++
      const key = new Date(u.created_at).toISOString().slice(0, 10)
      if (key in series) series[key]++
    } else if (t >= prevStart.getTime() && t < start.getTime()) {
      countInPrev++
    }
  }

  const signupsSeries = Object.entries(series).map(([day, count]) => ({ day, count }))

  const recent = [...all]
    .sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at))
    .slice(0, 10)
    .map((u) => ({
      id: u.id,
      email: u.email,
      created_at: u.created_at,
      provider: u.identities?.[0]?.provider ?? 'email',
    }))

  return json({
    totalUsers: all.length,
    signups: { current: countInRange, previous: countInPrev, series: signupsSeries },
    recentSignups: recent,
  })
})
