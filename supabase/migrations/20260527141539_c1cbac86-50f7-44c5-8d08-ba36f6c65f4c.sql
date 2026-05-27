
ALTER TABLE public.site_seo
  ADD COLUMN IF NOT EXISTS brand_assets jsonb NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS background_color text;

INSERT INTO storage.buckets (id, name, public)
VALUES ('brand-assets', 'brand-assets', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Public can read brand assets" ON storage.objects;
CREATE POLICY "Public can read brand assets"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'brand-assets');

DROP POLICY IF EXISTS "Admins can upload brand assets" ON storage.objects;
CREATE POLICY "Admins can upload brand assets"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'brand-assets' AND public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins can update brand assets" ON storage.objects;
CREATE POLICY "Admins can update brand assets"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'brand-assets' AND public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins can delete brand assets" ON storage.objects;
CREATE POLICY "Admins can delete brand assets"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'brand-assets' AND public.has_role(auth.uid(), 'admin'::app_role));
