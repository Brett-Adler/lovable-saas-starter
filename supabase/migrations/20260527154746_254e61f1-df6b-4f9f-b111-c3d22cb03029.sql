
-- ============ BLOG ============
CREATE TABLE public.blog_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  description text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.blog_categories TO anon, authenticated;
GRANT ALL ON public.blog_categories TO service_role;
ALTER TABLE public.blog_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read blog categories" ON public.blog_categories FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admin manage blog categories" ON public.blog_categories FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_blog_categories_updated BEFORE UPDATE ON public.blog_categories FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.blog_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.blog_tags TO anon, authenticated;
GRANT ALL ON public.blog_tags TO service_role;
ALTER TABLE public.blog_tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read blog tags" ON public.blog_tags FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admin manage blog tags" ON public.blog_tags FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  excerpt text,
  content_md text NOT NULL DEFAULT '',
  cover_image_url text,
  category_id uuid REFERENCES public.blog_categories(id) ON DELETE SET NULL,
  author_name text,
  author_id uuid,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published')),
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX blog_posts_status_pub_idx ON public.blog_posts(status, published_at DESC);
CREATE INDEX blog_posts_category_idx ON public.blog_posts(category_id);
GRANT SELECT ON public.blog_posts TO anon, authenticated;
GRANT ALL ON public.blog_posts TO service_role;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read published posts" ON public.blog_posts FOR SELECT TO anon, authenticated USING (status = 'published' AND published_at IS NOT NULL AND published_at <= now());
CREATE POLICY "admin read all posts" ON public.blog_posts FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin manage posts" ON public.blog_posts FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_blog_posts_updated BEFORE UPDATE ON public.blog_posts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.blog_post_tags (
  post_id uuid NOT NULL REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  tag_id uuid NOT NULL REFERENCES public.blog_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);
GRANT SELECT ON public.blog_post_tags TO anon, authenticated;
GRANT ALL ON public.blog_post_tags TO service_role;
ALTER TABLE public.blog_post_tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read post tags" ON public.blog_post_tags FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admin manage post tags" ON public.blog_post_tags FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============ STATUS PAGE ============
CREATE TABLE public.status_components (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  current_status text NOT NULL DEFAULT 'operational' CHECK (current_status IN ('operational','degraded','partial_outage','major_outage','maintenance')),
  position int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.status_components TO anon, authenticated;
GRANT ALL ON public.status_components TO service_role;
ALTER TABLE public.status_components ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read status components" ON public.status_components FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admin manage status components" ON public.status_components FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_status_components_updated BEFORE UPDATE ON public.status_components FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.status_incidents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  body_md text,
  severity text NOT NULL DEFAULT 'minor' CHECK (severity IN ('minor','major','critical','maintenance')),
  status text NOT NULL DEFAULT 'investigating' CHECK (status IN ('investigating','identified','monitoring','resolved')),
  started_at timestamptz NOT NULL DEFAULT now(),
  resolved_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX status_incidents_started_idx ON public.status_incidents(started_at DESC);
GRANT SELECT ON public.status_incidents TO anon, authenticated;
GRANT ALL ON public.status_incidents TO service_role;
ALTER TABLE public.status_incidents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read incidents" ON public.status_incidents FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admin manage incidents" ON public.status_incidents FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_status_incidents_updated BEFORE UPDATE ON public.status_incidents FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed default components
INSERT INTO public.status_components (name, description, position) VALUES
  ('Authentication', 'Sign-in, signup, password reset, OAuth.', 1),
  ('Database & API', 'Application data layer and read/write APIs.', 2),
  ('Transactional email', 'Auth and account-related emails.', 3),
  ('Payments (Stripe)', 'Checkout, subscriptions, webhooks.', 4),
  ('File storage', 'Brand assets and user uploads.', 5),
  ('AI support chat', 'In-app AI assistant for visitors.', 6);

-- ============ SUPPORT CHAT RATE LIMIT ============
CREATE TABLE public.support_chat_usage (
  ip_hash text NOT NULL,
  day date NOT NULL DEFAULT (now() AT TIME ZONE 'utc')::date,
  message_count int NOT NULL DEFAULT 0,
  last_message_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (ip_hash, day)
);
GRANT ALL ON public.support_chat_usage TO service_role;
ALTER TABLE public.support_chat_usage ENABLE ROW LEVEL SECURITY;
-- No client policies: only the service role (edge function) touches this table.
