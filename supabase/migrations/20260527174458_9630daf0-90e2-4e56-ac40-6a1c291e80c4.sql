-- Remove the security-definer view; use column-level grants instead
DROP VIEW IF EXISTS public.public_site_settings;

-- Re-allow public SELECT at the row level
CREATE POLICY "Public can read site settings"
ON public.site_settings
FOR SELECT
TO anon, authenticated
USING (true);

-- Revoke broad SELECT and grant only the safe columns
REVOKE SELECT ON public.site_settings FROM anon, authenticated;

GRANT SELECT (
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
) ON public.site_settings TO anon, authenticated;

-- Admins keep full access via the existing admin policy + service_role grant
GRANT ALL ON public.site_settings TO service_role;