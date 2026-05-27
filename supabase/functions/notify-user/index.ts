// Backend-facing helper for creating in-app notifications.
//
// Two callers are supported:
//   1. Admin user (JWT) — can target any user. Used by admin tools and broadcasts.
//   2. Service-role caller (other edge functions) — pass the
//      SUPABASE_SERVICE_ROLE_KEY as the Authorization bearer to skip the admin
//      check.
//
// Respects notification_preferences.in_app_enabled per recipient.
//
// Body:
//   {
//     user_ids: string[],          // recipients (required, max 500)
//     title: string,               // required
//     body?: string,
//     link?: string,               // in-app deep link
//     icon?: string,               // lucide icon name, optional
//     bypass_preferences?: boolean // service callers only — for security alerts
//   }

import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { z } from "npm:zod@3";

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

const BodySchema = z.object({
  user_ids: z.array(z.string().uuid()).min(1).max(500),
  title: z.string().min(1).max(200),
  body: z.string().max(2000).optional(),
  link: z.string().max(500).optional(),
  icon: z.string().max(60).optional(),
  bypass_preferences: z.boolean().optional(),
});

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
  if (!supabaseUrl || !serviceKey || !anonKey) {
    return json({ error: "Server configuration error" }, 500);
  }

  const token = (req.headers.get("Authorization") || "").replace(/^Bearer\s+/i, "");
  if (!token) return json({ error: "Unauthorized" }, 401);

  const admin = createClient(supabaseUrl, serviceKey);
  const isService = token === serviceKey;

  if (!isService) {
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: `Bearer ${token}` } },
    });
    const { data: claimsData } = await userClient.auth.getClaims(token);
    const callerUserId = (claimsData?.claims as { sub?: string } | undefined)?.sub;
    if (!callerUserId) return json({ error: "Unauthorized" }, 401);
    const { data: isAdmin } = await admin.rpc("has_role", {
      _user_id: callerUserId,
      _role: "admin",
    });
    if (!isAdmin) return json({ error: "Forbidden: admin required" }, 403);
  }

  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return json({ error: "Invalid JSON body" }, 400);
  }
  const parsed = BodySchema.safeParse(payload);
  if (!parsed.success) return json({ error: parsed.error.flatten().fieldErrors }, 400);
  const { user_ids, title, body, link, icon, bypass_preferences } = parsed.data;

  // Resolve preferences. Service callers can bypass for security/critical events.
  let recipients = user_ids;
  if (!bypass_preferences) {
    const { data: prefs } = await admin
      .from("notification_preferences")
      .select("user_id,in_app_enabled")
      .in("user_id", user_ids);
    const optOut = new Set(
      (prefs ?? [])
        .filter((p) => p.in_app_enabled === false)
        .map((p) => p.user_id as string),
    );
    recipients = user_ids.filter((id) => !optOut.has(id));
  }

  if (recipients.length === 0) {
    return json({ created: 0, skipped: user_ids.length });
  }

  const rows = recipients.map((user_id) => ({
    user_id,
    title,
    body: body ?? null,
    link: link ?? null,
    icon: icon ?? null,
  }));

  const { error } = await admin.from("notifications").insert(rows);
  if (error) return json({ error: error.message }, 500);

  return json({ created: rows.length, skipped: user_ids.length - rows.length });
});
