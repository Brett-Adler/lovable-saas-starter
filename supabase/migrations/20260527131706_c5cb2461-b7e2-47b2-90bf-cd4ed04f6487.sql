
CREATE TABLE public.site_seo (
  id smallint PRIMARY KEY DEFAULT 1,
  site_name text,
  default_title text,
  title_template text,
  default_description text,
  default_og_image_url text,
  twitter_handle text,
  theme_color text,
  base_url text,
  organization_json_ld jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT site_seo_singleton CHECK (id = 1)
);

GRANT SELECT ON public.site_seo TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_seo TO authenticated;
GRANT ALL ON public.site_seo TO service_role;

ALTER TABLE public.site_seo ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read site_seo" ON public.site_seo FOR SELECT USING (true);
CREATE POLICY "Admins manage site_seo" ON public.site_seo FOR ALL USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER site_seo_updated_at BEFORE UPDATE ON public.site_seo FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.seo_pages (
  path text PRIMARY KEY,
  title text,
  description text,
  og_image_url text,
  keywords text,
  noindex boolean NOT NULL DEFAULT false,
  canonical_override text,
  json_ld jsonb,
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.seo_pages TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.seo_pages TO authenticated;
GRANT ALL ON public.seo_pages TO service_role;

ALTER TABLE public.seo_pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read seo_pages" ON public.seo_pages FOR SELECT USING (true);
CREATE POLICY "Admins manage seo_pages" ON public.seo_pages FOR ALL USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER seo_pages_updated_at BEFORE UPDATE ON public.seo_pages FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.site_seo (id, site_name, default_title, title_template, default_description, default_og_image_url, twitter_handle, theme_color, base_url, organization_json_ld)
VALUES (
  1,
  'SaaS Starter',
  'SaaS Starter — Build your SaaS in days, not months',
  '%s — SaaS Starter',
  'A complete SaaS starter template with auth, payments, emails, teams, and analytics. Replace the branding and ship.',
  'https://saas-starter-suite.lovable.app/og-image.png',
  '@yourbrand',
  '#FF5C2A',
  'https://saas-starter-suite.lovable.app',
  jsonb_build_object(
    '@context', 'https://schema.org',
    '@type', 'Organization',
    'name', 'SaaS Starter',
    'url', 'https://saas-starter-suite.lovable.app'
  )
)
ON CONFLICT (id) DO NOTHING;
