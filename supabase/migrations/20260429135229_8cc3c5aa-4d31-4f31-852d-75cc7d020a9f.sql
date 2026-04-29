-- Auto-add creator as owner on organization insert
CREATE OR REPLACE FUNCTION public.handle_new_organization()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.created_by IS NOT NULL THEN
    INSERT INTO public.organization_members (organization_id, user_id, role)
    VALUES (NEW.id, NEW.created_by, 'owner')
    ON CONFLICT (organization_id, user_id) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_orgs_after_insert ON public.organizations;
CREATE TRIGGER trg_orgs_after_insert
  AFTER INSERT ON public.organizations
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_organization();

-- Accept invite by token (used by invitee — bypasses RLS via SECURITY DEFINER)
CREATE OR REPLACE FUNCTION public.accept_organization_invite(_token TEXT)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_invite public.organization_invites%ROWTYPE;
  v_user_email TEXT;
  v_uid UUID := auth.uid();
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  SELECT email INTO v_user_email FROM auth.users WHERE id = v_uid;

  SELECT * INTO v_invite FROM public.organization_invites WHERE token = _token;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Invite not found';
  END IF;

  IF v_invite.accepted_at IS NOT NULL THEN
    RAISE EXCEPTION 'Invite already accepted';
  END IF;

  IF v_invite.expires_at < now() THEN
    RAISE EXCEPTION 'Invite expired';
  END IF;

  IF lower(v_invite.email) <> lower(v_user_email) THEN
    RAISE EXCEPTION 'Invite is for a different email address';
  END IF;

  INSERT INTO public.organization_members (organization_id, user_id, role)
  VALUES (v_invite.organization_id, v_uid, v_invite.role)
  ON CONFLICT (organization_id, user_id) DO NOTHING;

  UPDATE public.organization_invites
    SET accepted_at = now()
    WHERE id = v_invite.id;

  RETURN v_invite.organization_id;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.accept_organization_invite(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.accept_organization_invite(TEXT) TO authenticated;

-- Allow invitees to look up their own pending invites by email (for an "Invitations" inbox)
CREATE POLICY "Invitees can view their invites" ON public.organization_invites
  FOR SELECT TO authenticated
  USING (lower(email) = lower((SELECT email FROM auth.users WHERE id = auth.uid())));