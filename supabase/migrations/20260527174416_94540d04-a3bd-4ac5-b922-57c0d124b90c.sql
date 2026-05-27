-- 1. Lock down site_settings: drop public read, keep admin-only
DROP POLICY IF EXISTS "Public can read site settings" ON public.site_settings;

-- 2. Create a public view exposing only non-sensitive fields
CREATE OR REPLACE VIEW public.public_site_settings
WITH (security_invoker = true) AS
SELECT
  id,
  contact_email,
  mailing_address,
  company_legal_name,
  social_twitter,
  social_github,
  social_linkedin,
  social_instagram,
  social_youtube,
  social_facebook,
  social_tiktok,
  updated_at
FROM public.site_settings;

-- Allow public read of the safe view
GRANT SELECT ON public.public_site_settings TO anon, authenticated;

-- The view runs as security_invoker, so it needs an RLS policy on the base table
-- to allow anon/authenticated to read the underlying rows. Add a column-blind
-- policy here — the view itself is what filters columns.
CREATE POLICY "Public can read site settings via view"
ON public.site_settings
FOR SELECT
TO anon, authenticated
USING (true);

-- Wait — that defeats the purpose. Use security_definer view instead.
DROP POLICY IF EXISTS "Public can read site settings via view" ON public.site_settings;

DROP VIEW IF EXISTS public.public_site_settings;
CREATE VIEW public.public_site_settings
WITH (security_invoker = false) AS
SELECT
  id,
  contact_email,
  mailing_address,
  company_legal_name,
  social_twitter,
  social_github,
  social_linkedin,
  social_instagram,
  social_youtube,
  social_facebook,
  social_tiktok,
  updated_at
FROM public.site_settings;

GRANT SELECT ON public.public_site_settings TO anon, authenticated;

-- 3. Realtime channel authorization: only allow subscribing to topics
-- that start with "{prefix}:{your-own-uid}:" — matches our client naming
-- ("notifications:<uid>:…", "subscriptions:<uid>:…").
DROP POLICY IF EXISTS "Users can subscribe to own realtime topics" ON realtime.messages;
CREATE POLICY "Users can subscribe to own realtime topics"
ON realtime.messages
FOR SELECT
TO authenticated
USING (
  realtime.topic() ~ ('^[a-z_]+:' || (SELECT auth.uid()::text) || ':')
);