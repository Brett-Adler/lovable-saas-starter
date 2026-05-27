import "https://deno.land/std@0.224.0/dotenv/load.ts";
import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";

const SUPABASE_URL = Deno.env.get("VITE_SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("VITE_SUPABASE_PUBLISHABLE_KEY")!;
const ENDPOINT = `${SUPABASE_URL}/functions/v1/subscribe-newsletter`;

const headers = {
  "Content-Type": "application/json",
  apikey: SUPABASE_ANON_KEY,
  Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
};

Deno.test("subscribe-newsletter rejects invalid JSON", async () => {
  const res = await fetch(ENDPOINT, { method: "POST", headers, body: "not-json" });
  await res.text();
  assertEquals(res.status, 400);
});

Deno.test("subscribe-newsletter rejects invalid email", async () => {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers,
    body: JSON.stringify({ email: "nope" }),
  });
  await res.text();
  assertEquals(res.status, 400);
});

Deno.test("subscribe-newsletter rejects GET", async () => {
  const res = await fetch(ENDPOINT, { method: "GET", headers });
  await res.text();
  assertEquals(res.status, 405);
});
