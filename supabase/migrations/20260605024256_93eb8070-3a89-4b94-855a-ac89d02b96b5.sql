
CREATE TABLE public.roadmap_feature_votes (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  feature_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, feature_id)
);

CREATE INDEX idx_roadmap_feature_votes_feature ON public.roadmap_feature_votes(feature_id);

GRANT SELECT, INSERT, DELETE ON public.roadmap_feature_votes TO authenticated;
GRANT ALL ON public.roadmap_feature_votes TO service_role;

ALTER TABLE public.roadmap_feature_votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own votes"
  ON public.roadmap_feature_votes FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can cast their own votes"
  ON public.roadmap_feature_votes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their own votes"
  ON public.roadmap_feature_votes FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.get_roadmap_vote_counts()
RETURNS TABLE(feature_id TEXT, votes BIGINT)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT feature_id, COUNT(*)::BIGINT AS votes
  FROM public.roadmap_feature_votes
  GROUP BY feature_id
$$;

GRANT EXECUTE ON FUNCTION public.get_roadmap_vote_counts() TO anon, authenticated;
