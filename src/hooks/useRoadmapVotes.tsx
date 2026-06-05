import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

type Counts = Record<string, number>;
type MyVotes = Set<string>;

export const useRoadmapVotes = () => {
  const { user } = useAuth();
  const [counts, setCounts] = useState<Counts>({});
  const [myVotes, setMyVotes] = useState<MyVotes>(new Set());
  const [loading, setLoading] = useState(true);

  const refreshCounts = useCallback(async () => {
    const { data, error } = await supabase.rpc("get_roadmap_vote_counts");
    if (!error && data) {
      const next: Counts = {};
      for (const row of data as Array<{ feature_id: string; votes: number }>) {
        next[row.feature_id] = Number(row.votes);
      }
      setCounts(next);
    }
  }, []);

  const refreshMyVotes = useCallback(async () => {
    if (!user) {
      setMyVotes(new Set());
      return;
    }
    const { data, error } = await supabase
      .from("roadmap_feature_votes")
      .select("feature_id")
      .eq("user_id", user.id);
    if (!error && data) {
      setMyVotes(new Set(data.map((r) => r.feature_id)));
    }
  }, [user]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    Promise.all([refreshCounts(), refreshMyVotes()]).finally(() => {
      if (active) setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [refreshCounts, refreshMyVotes]);

  const toggleVote = useCallback(
    async (featureId: string) => {
      if (!user) return { needsAuth: true as const };
      const hasVoted = myVotes.has(featureId);
      // optimistic
      setMyVotes((prev) => {
        const next = new Set(prev);
        if (hasVoted) next.delete(featureId);
        else next.add(featureId);
        return next;
      });
      setCounts((prev) => ({
        ...prev,
        [featureId]: Math.max(0, (prev[featureId] ?? 0) + (hasVoted ? -1 : 1)),
      }));

      const op = hasVoted
        ? supabase
            .from("roadmap_feature_votes")
            .delete()
            .eq("user_id", user.id)
            .eq("feature_id", featureId)
        : supabase
            .from("roadmap_feature_votes")
            .insert({ user_id: user.id, feature_id: featureId });

      const { error } = await op;
      if (error) {
        // rollback
        await Promise.all([refreshCounts(), refreshMyVotes()]);
        return { error };
      }
      return { ok: true as const };
    },
    [user, myVotes, refreshCounts, refreshMyVotes],
  );

  return { counts, myVotes, loading, toggleVote };
};
