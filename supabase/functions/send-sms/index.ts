// Send a transactional SMS to a user.
//
// This is a STUB. To enable real SMS:
//   1. Provision a Twilio account + phone number.
//   2. Add the Twilio Account SID, Auth Token, and From number as project
//      secrets (TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER).
//   3. Replace the `TODO: Twilio integration` block below with the real
//      Twilio Messages API call. No other code changes needed.
//
// The function already:
//   - Validates JWT or service-role bearer token (other edge functions).
//   - Looks up the recipient's profile.phone and notification_preferences.sms_enabled.
//   - Skips sends to users who haven't opted in (unless bypass_preferences).
//   - Returns a clear payload so callers can show "Not configured" gracefully.

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
  message: z.string().min(1).max(640),
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
  const { user_id, message, bypass_preferences } = parsed.data;

  const { data: profile } = await admin
    .from("profiles")
    .select("phone")
    .eq("id", user_id)
    .maybeSingle();
  if (!profile?.phone) {
    return json({ status: "skipped", reason: "no_phone" });
  }

  if (!bypass_preferences) {
    const { data: prefs } = await admin
      .from("notification_preferences")
      .select("sms_enabled")
      .eq("user_id", user_id)
      .maybeSingle();
    if (prefs && prefs.sms_enabled === false) {
      return json({ status: "skipped", reason: "opted_out" });
    }
  }

  // TODO: Twilio integration — uncomment and configure when ready.
  // const accountSid = Deno.env.get("TWILIO_ACCOUNT_SID");
  // const authToken = Deno.env.get("TWILIO_AUTH_TOKEN");
  // const fromNumber = Deno.env.get("TWILIO_FROM_NUMBER");
  // if (!accountSid || !authToken || !fromNumber) {
  //   return json({ status: "skipped", reason: "twilio_not_configured" });
  // }
  // const resp = await fetch(
  //   `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
  //   {
  //     method: "POST",
  //     headers: {
  //       Authorization: `Basic ${btoa(`${accountSid}:${authToken}`)}`,
  //       "Content-Type": "application/x-www-form-urlencoded",
  //     },
  //     body: new URLSearchParams({ To: profile.phone, From: fromNumber, Body: message }),
  //   },
  // );
  // const data = await resp.json();
  // if (!resp.ok) return json({ error: data }, 502);
  // return json({ status: "sent", sid: data.sid });

  console.log(
    `[send-sms STUB] Would send to ${profile.phone}: ${message.slice(0, 80)}…`,
  );
  return json({
    status: "stub",
    reason: "twilio_not_configured",
    message: "SMS pipeline is wired but Twilio credentials are not configured.",
  });
});
