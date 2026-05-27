CREATE TABLE public.audit_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  actor_user_id UUID,
  actor_email TEXT,
  organization_id UUID,
  action TEXT NOT NULL,
  target_type TEXT,
  target_id TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_audit_log_created_at ON public.audit_log (created_at DESC);
CREATE INDEX idx_audit_log_organization ON public.audit_log (organization_id, created_at DESC);
CREATE INDEX idx_audit_log_actor ON public.audit_log (actor_user_id, created_at DESC);
CREATE INDEX idx_audit_log_action ON public.audit_log (action);

GRANT SELECT ON public.audit_log TO authenticated;
GRANT ALL ON public.audit_log TO service_role;

ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all audit entries"
  ON public.audit_log FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Org owners/admins can view org audit entries"
  ON public.audit_log FOR SELECT
  TO authenticated
  USING (
    organization_id IS NOT NULL
    AND (
      public.has_org_role(auth.uid(), organization_id, 'owner'::org_role)
      OR public.has_org_role(auth.uid(), organization_id, 'admin'::org_role)
    )
  );

CREATE OR REPLACE FUNCTION public.log_audit(
  _action TEXT,
  _actor_user_id UUID DEFAULT NULL,
  _organization_id UUID DEFAULT NULL,
  _target_type TEXT DEFAULT NULL,
  _target_id TEXT DEFAULT NULL,
  _metadata JSONB DEFAULT '{}'::jsonb
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id UUID;
  v_email TEXT;
BEGIN
  IF _actor_user_id IS NOT NULL THEN
    SELECT email INTO v_email FROM auth.users WHERE id = _actor_user_id;
  END IF;

  INSERT INTO public.audit_log (
    actor_user_id, actor_email, organization_id, action,
    target_type, target_id, metadata
  )
  VALUES (
    _actor_user_id, v_email, _organization_id, _action,
    _target_type, _target_id, COALESCE(_metadata, '{}'::jsonb)
  )
  RETURNING id INTO v_id;

  RETURN v_id;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.log_audit(TEXT, UUID, UUID, TEXT, TEXT, JSONB) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.log_audit(TEXT, UUID, UUID, TEXT, TEXT, JSONB) TO service_role;

-- Capture organization membership changes automatically.
CREATE OR REPLACE FUNCTION public.audit_organization_members()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    PERFORM public.log_audit(
      'member.added',
      auth.uid(),
      NEW.organization_id,
      'organization_member',
      NEW.id::text,
      jsonb_build_object('user_id', NEW.user_id, 'role', NEW.role)
    );
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' AND NEW.role IS DISTINCT FROM OLD.role THEN
    PERFORM public.log_audit(
      'member.role_changed',
      auth.uid(),
      NEW.organization_id,
      'organization_member',
      NEW.id::text,
      jsonb_build_object('user_id', NEW.user_id, 'from', OLD.role, 'to', NEW.role)
    );
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    PERFORM public.log_audit(
      'member.removed',
      auth.uid(),
      OLD.organization_id,
      'organization_member',
      OLD.id::text,
      jsonb_build_object('user_id', OLD.user_id, 'role', OLD.role)
    );
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

CREATE TRIGGER trg_audit_organization_members
AFTER INSERT OR UPDATE OR DELETE ON public.organization_members
FOR EACH ROW EXECUTE FUNCTION public.audit_organization_members();

-- Capture invite lifecycle.
CREATE OR REPLACE FUNCTION public.audit_organization_invites()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    PERFORM public.log_audit(
      'invite.created',
      auth.uid(),
      NEW.organization_id,
      'organization_invite',
      NEW.id::text,
      jsonb_build_object('email', NEW.email, 'role', NEW.role)
    );
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    PERFORM public.log_audit(
      'invite.revoked',
      auth.uid(),
      OLD.organization_id,
      'organization_invite',
      OLD.id::text,
      jsonb_build_object('email', OLD.email)
    );
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

CREATE TRIGGER trg_audit_organization_invites
AFTER INSERT OR DELETE ON public.organization_invites
FOR EACH ROW EXECUTE FUNCTION public.audit_organization_invites();

-- Capture role grants/revokes.
CREATE OR REPLACE FUNCTION public.audit_user_roles()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    PERFORM public.log_audit(
      'role.granted',
      auth.uid(),
      NULL,
      'user_role',
      NEW.id::text,
      jsonb_build_object('user_id', NEW.user_id, 'role', NEW.role)
    );
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    PERFORM public.log_audit(
      'role.revoked',
      auth.uid(),
      NULL,
      'user_role',
      OLD.id::text,
      jsonb_build_object('user_id', OLD.user_id, 'role', OLD.role)
    );
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

CREATE TRIGGER trg_audit_user_roles
AFTER INSERT OR DELETE ON public.user_roles
FOR EACH ROW EXECUTE FUNCTION public.audit_user_roles();