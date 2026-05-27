
-- Organization SSO configuration (Team-tier scaffold)
CREATE TABLE public.org_sso_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL UNIQUE,
  metadata_url TEXT,
  idp_entity_id TEXT,
  acs_url TEXT,
  email_domains TEXT[] NOT NULL DEFAULT '{}',
  enabled BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'draft',
  notes TEXT,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.org_sso_config TO authenticated;
GRANT ALL ON public.org_sso_config TO service_role;
ALTER TABLE public.org_sso_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Org owners manage SSO config"
  ON public.org_sso_config FOR ALL TO authenticated
  USING (public.has_org_role(auth.uid(), organization_id, 'owner'::org_role))
  WITH CHECK (public.has_org_role(auth.uid(), organization_id, 'owner'::org_role));

CREATE POLICY "Org admins view SSO config"
  ON public.org_sso_config FOR SELECT TO authenticated
  USING (public.has_org_role(auth.uid(), organization_id, 'admin'::org_role));

CREATE POLICY "Platform admins view all SSO configs"
  ON public.org_sso_config FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_org_sso_config_updated_at
  BEFORE UPDATE ON public.org_sso_config
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Push subscriptions
CREATE TABLE public.push_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  endpoint TEXT NOT NULL UNIQUE,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_used_at TIMESTAMPTZ
);

CREATE INDEX push_subscriptions_user_id_idx ON public.push_subscriptions(user_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.push_subscriptions TO authenticated;
GRANT ALL ON public.push_subscriptions TO service_role;
ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own push subs"
  ON public.push_subscriptions FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins view all push subs"
  ON public.push_subscriptions FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));
