CREATE POLICY "Org members can view each other's profiles" ON public.profiles
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.organization_members me
      JOIN public.organization_members them
        ON them.organization_id = me.organization_id
      WHERE me.user_id = auth.uid()
        AND them.user_id = profiles.id
    )
  );