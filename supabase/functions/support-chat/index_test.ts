import "https://deno.land/std@0.224.0/dotenv/load.ts";
import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";

const SUPABASE_URL = Deno.env.get("VITE_SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("VITE_SUPABASE_PUBLISHABLE_KEY")!;
const ENDPOINT = `${SUPABASE_URL}/functions/v1/support-chat`;

const headers = {
  "Content-Type": "application/json",
  apikey: SUPABASE_ANON_KEY,
  Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
};

Deno.test("support-chat rejects GET", async () => {
  const res = await fetch(ENDPOINT, { method: "GET", headers });
  await res.text();
  assertEquals(res.status, 405);
});

Deno.test("support-chat responds to OPTIONS preflight", async () => {
  const res = await fetch(ENDPOINT, { method: "OPTIONS", headers });
  await res.text();
  // Either 200 or 204 is acceptable for preflight
  assertEquals(res.status >= 200 && res.status < 300, true);
});
