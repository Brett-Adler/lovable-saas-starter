GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.is_org_member(uuid, uuid) TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.has_org_role(uuid, uuid, public.org_role) TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.has_active_subscription(uuid, text) TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.accept_organization_invite(text) TO authenticated;