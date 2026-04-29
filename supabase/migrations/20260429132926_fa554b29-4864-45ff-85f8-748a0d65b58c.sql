
-- Lock down SECURITY DEFINER helpers — only used internally by RLS policies and triggers.
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.is_org_member(uuid, uuid) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.has_org_role(uuid, uuid, org_role) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;

-- Tighten public-insert policies: anon can only insert with no user_id; authenticated users may set their own.
DROP POLICY IF EXISTS "Anyone can submit a lead" ON public.leads;
CREATE POLICY "Anyone can submit a lead" ON public.leads
  FOR INSERT WITH CHECK (true);
-- (leads has no user_id column — keep open submission)

DROP POLICY IF EXISTS "Anyone can subscribe" ON public.marketing_subscribers;
CREATE POLICY "Anyone can subscribe" ON public.marketing_subscribers
  FOR INSERT WITH CHECK (
    user_id IS NULL OR auth.uid() = user_id
  );

DROP POLICY IF EXISTS "Anyone can insert events" ON public.analytics_events;
CREATE POLICY "Anyone can insert events" ON public.analytics_events
  FOR INSERT WITH CHECK (
    user_id IS NULL OR auth.uid() = user_id
  );
