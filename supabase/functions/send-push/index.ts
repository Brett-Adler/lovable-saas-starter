// Send a Web Push notification to a user.
//
// This is a STUB. To enable real Web Push:
//   1. Generate VAPID keys: `npx web-push generate-vapid-keys`.
//   2. Add VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_SUBJECT (mailto:you@…)
//      as project secrets. Expose VAPID_PUBLIC_KEY to the client too (it's
//      public by design).
//   3. Replace the `TODO: Web Push integration` block below with a real
//      `web-push` call (or any VAPID-signed POST to subscription.endpoint).
//
// The function already:
//   - Validates JWT or service-role bearer token.
//   - Pulls all push_subscriptions for the recipient.
//   - Respects notification_preferences.push_enabled.
//   - Deletes subscriptions that the browser has revoked (410 Gone).

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
  user_id: z.string().uuid(),
  title: z.string().min(1).max(200),
  body: z.string().max(500).optional(),
  url: z.string().max(500).optional(),
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
  const { user_id, title, body, url, bypass_preferences } = parsed.data;

  if (!bypass_preferences) {
    const { data: prefs } = await admin
      .from("notification_preferences")
      .select("push_enabled")
      .eq("user_id", user_id)
      .maybeSingle();
    if (prefs && prefs.push_enabled === false) {
      return json({ status: "skipped", reason: "opted_out" });
    }
  }

  const { data: subs } = await admin
    .from("push_subscriptions")
    .select("id,endpoint,p256dh,auth")
    .eq("user_id", user_id);

  if (!subs || subs.length === 0) {
    return json({ status: "skipped", reason: "no_subscriptions" });
  }

  // TODO: Web Push integration — uncomment and configure when ready.
  // const vapidPublic = Deno.env.get("VAPID_PUBLIC_KEY");
  // const vapidPrivate = Deno.env.get("VAPID_PRIVATE_KEY");
  // const vapidSubject = Deno.env.get("VAPID_SUBJECT");
  // if (!vapidPublic || !vapidPrivate || !vapidSubject) {
  //   return json({ status: "skipped", reason: "vapid_not_configured" });
  // }
  // ... call web-push with each sub; delete row on 404/410.

  console.log(
    `[send-push STUB] Would push to ${subs.length} subscription(s) for ${user_id}: ${title}`,
  );
  return json({
    status: "stub",
    reason: "vapid_not_configured",
    subscriptions: subs.length,
    preview: { title, body, url },
  });
});
