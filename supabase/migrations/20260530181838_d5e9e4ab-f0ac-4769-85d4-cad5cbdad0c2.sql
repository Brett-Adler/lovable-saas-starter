
-- Singleton row of page-level copy
CREATE TABLE public.about_page (
  id smallint PRIMARY KEY DEFAULT 1,
  eyebrow text,
  headline text,
  subhead text,
  primary_cta_label text,
  primary_cta_href text,
  secondary_cta_label text,
  secondary_cta_href text,
  mission_title text,
  mission_body text,
  vision_title text,
  vision_body text,
  story_title text,
  story_body text,
  story_image_url text,
  values_title text,
  stats_title text,
  milestones_title text,
  team_title text,
  team_subtitle text,
  press_title text,
  cta_title text,
  cta_body text,
  cta_primary_label text,
  cta_primary_href text,
  cta_secondary_label text,
  cta_secondary_href text,
  show_mission boolean NOT NULL DEFAULT true,
  show_story boolean NOT NULL DEFAULT true,
  show_values boolean NOT NULL DEFAULT true,
  show_stats boolean NOT NULL DEFAULT true,
  show_milestones boolean NOT NULL DEFAULT true,
  show_team boolean NOT NULL DEFAULT true,
  show_press boolean NOT NULL DEFAULT true,
  show_cta boolean NOT NULL DEFAULT true,
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT about_page_singleton CHECK (id = 1)
);

GRANT SELECT ON public.about_page TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.about_page TO authenticated;
GRANT ALL ON public.about_page TO service_role;

ALTER TABLE public.about_page ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read about_page"
  ON public.about_page FOR SELECT
  USING (true);

CREATE POLICY "Admins manage about_page"
  ON public.about_page FOR ALL
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER about_page_updated_at
  BEFORE UPDATE ON public.about_page
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Typed repeatable sections (values, stats, milestones, press)
CREATE TYPE public.about_section_kind AS ENUM ('value', 'stat', 'milestone', 'press');

CREATE TABLE public.about_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind public.about_section_kind NOT NULL,
  title text,
  subtitle text,
  body text,
  icon text,
  image_url text,
  link_url text,
  meta jsonb NOT NULL DEFAULT '{}'::jsonb,
  position int NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX about_sections_kind_position_idx ON public.about_sections (kind, position);

GRANT SELECT ON public.about_sections TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.about_sections TO authenticated;
GRANT ALL ON public.about_sections TO service_role;

ALTER TABLE public.about_sections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read published about_sections"
  ON public.about_sections FOR SELECT
  USING (published = true);

CREATE POLICY "Admins read all about_sections"
  ON public.about_sections FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins manage about_sections"
  ON public.about_sections FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER about_sections_updated_at
  BEFORE UPDATE ON public.about_sections
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- People (team, leadership, board, investors, advisors, pets, custom)
CREATE TABLE public.about_people (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text,
  group_key text NOT NULL DEFAULT 'team',
  bio text,
  photo_url text,
  links jsonb NOT NULL DEFAULT '{}'::jsonb,
  position int NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX about_people_group_position_idx ON public.about_people (group_key, position);

GRANT SELECT ON public.about_people TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.about_people TO authenticated;
GRANT ALL ON public.about_people TO service_role;

ALTER TABLE public.about_people ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read published about_people"
  ON public.about_people FOR SELECT
  USING (published = true);

CREATE POLICY "Admins read all about_people"
  ON public.about_people FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins manage about_people"
  ON public.about_people FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER about_people_updated_at
  BEFORE UPDATE ON public.about_people
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed singleton page
INSERT INTO public.about_page (
  id, eyebrow, headline, subhead,
  primary_cta_label, primary_cta_href,
  secondary_cta_label, secondary_cta_href,
  mission_title, mission_body,
  vision_title, vision_body,
  story_title, story_body,
  values_title, stats_title, milestones_title,
  team_title, team_subtitle, press_title,
  cta_title, cta_body,
  cta_primary_label, cta_primary_href,
  cta_secondary_label, cta_secondary_href
) VALUES (
  1,
  'About us',
  'We build the boring stuff so you don''t have to.',
  'Every SaaS founder spends their first three months building the same things — auth, billing, teams, email. We built that foundation, made it beautiful, and made it yours.',
  'See pricing', '/pricing',
  'Talk to us', '/contact',
  'Our mission', 'Give every builder a polished, production-ready foundation so they can ship the thing only they can build.',
  'Our vision', 'A world where shipping a serious SaaS takes days, not months — without sacrificing craft.',
  'How we got here', 'We kept rebuilding the same auth flows, billing portals, and admin panels on every new project. After the fifth time, we extracted the shared pieces, polished them, and turned them into a starter we''d actually want to use ourselves.',
  'What we value', 'By the numbers', 'Milestones',
  'The team', 'Builders, operators, and one very good dog.', 'As seen in',
  'Ready to ship something great?',
  'Drop in your branding, configure your products, and launch this week.',
  'Get started', '/auth',
  'Read the docs', '/docs'
)
ON CONFLICT (id) DO NOTHING;

-- Seed values
INSERT INTO public.about_sections (kind, title, body, icon, position) VALUES
  ('value', 'Craft over speed', 'Polish is a feature. We sweat the empty states.', 'Sparkles', 0),
  ('value', 'Defaults that scale', 'Sensible out of the box, configurable when you grow.', 'Settings', 1),
  ('value', 'Honest by default', 'Clear changelogs, real status pages, no hand-waving.', 'ShieldCheck', 2);

-- Seed stats
INSERT INTO public.about_sections (kind, title, subtitle, position) VALUES
  ('stat', '12k+', 'Builders shipped on the starter', 0),
  ('stat', '99.98%', 'Rolling 90-day uptime', 1),
  ('stat', '< 3 min', 'From clone to first deploy', 2);

-- Seed milestones
INSERT INTO public.about_sections (kind, title, subtitle, body, position) VALUES
  ('milestone', 'The itch', '2023', 'Rebuilt the same auth + billing stack for the fifth time. Decided enough was enough.', 0),
  ('milestone', 'First release', '2024', 'Shipped v1 with auth, teams, billing, and a polished admin panel.', 1),
  ('milestone', 'Today', '2026', 'Used by indie hackers and small teams to launch production SaaS in days.', 2);

-- Seed press logos (link_url + title for alt text)
INSERT INTO public.about_sections (kind, title, link_url, position) VALUES
  ('press', 'Product Hunt', 'https://www.producthunt.com', 0),
  ('press', 'Indie Hackers', 'https://www.indiehackers.com', 1),
  ('press', 'Hacker News', 'https://news.ycombinator.com', 2);

-- Seed people
INSERT INTO public.about_people (name, role, group_key, bio, links, position) VALUES
  ('Alex Rivera', 'Co-founder & CEO', 'leadership', 'Previously shipped two SaaS products. Cares about empty states more than is healthy.', '{"linkedin":"https://linkedin.com","x":"https://x.com"}'::jsonb, 0),
  ('Sam Chen', 'Co-founder & CTO', 'leadership', 'Backend, infra, and the person who actually reads Postgres release notes.', '{"linkedin":"https://linkedin.com","github":"https://github.com"}'::jsonb, 1),
  ('Jordan Patel', 'Design engineer', 'team', 'Turns Figma into Tailwind without complaining (much).', '{"x":"https://x.com"}'::jsonb, 0),
  ('Robin Mori', 'Customer success', 'team', 'Replies faster than you''d expect from a startup this small.', '{}'::jsonb, 1),
  ('Lena Park', 'Board member', 'board', 'Operator-turned-investor. Sits on three SaaS boards.', '{"linkedin":"https://linkedin.com"}'::jsonb, 0),
  ('Northstar Ventures', 'Lead investor', 'investors', 'Backed our seed round in 2024.', '{"website":"https://example.com"}'::jsonb, 0),
  ('Priya Shah', 'Advisor — go-to-market', 'advisors', 'Helped scale two B2B SaaS from $0 to $10M ARR.', '{"linkedin":"https://linkedin.com"}'::jsonb, 0),
  ('Elwood', 'Chief Morale Officer', 'pets', 'Golden retriever. Reviews every PR with a tail wag.', '{}'::jsonb, 0);
