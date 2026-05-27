import { useMemo } from "react";
import { useSubscription } from "@/hooks/useSubscription";

export type PlanTier = "free" | "pro" | "team";

const TIER_RANK: Record<PlanTier, number> = { free: 0, pro: 1, team: 2 };

// Map of the lookup_keys we ship by default in create-checkout → tier.
// Update this when you add or rename plans.
const PRICE_TO_TIER: Record<string, PlanTier> = {
  pro_monthly: "pro",
  pro_yearly: "pro",
  team_monthly: "team",
  team_yearly: "team",
};

const LIMITS: Record<PlanTier, { projects: number | null; seats: number | null }> = {
  free: { projects: 3, seats: 1 },
  pro: { projects: null, seats: 10 },
  team: { projects: null, seats: null },
};

export interface PlanInfo {
  tier: PlanTier;
  isAtLeast: (min: PlanTier) => boolean;
  isTrialing: boolean;
  trialEndsAt: Date | null;
  limits: (typeof LIMITS)[PlanTier];
  loading: boolean;
}

export function usePlan(): PlanInfo {
  const { subscription, isActive, loading } = useSubscription();

  return useMemo(() => {
    const tier: PlanTier =
      isActive && subscription?.price_id
        ? PRICE_TO_TIER[subscription.price_id] ?? "free"
        : "free";

    const isTrialing = (subscription?.status ?? "") === "trialing";
    const trialEndsAt =
      isTrialing && subscription?.current_period_end
        ? new Date(subscription.current_period_end)
        : null;

    return {
      tier,
      isAtLeast: (min: PlanTier) => TIER_RANK[tier] >= TIER_RANK[min],
      isTrialing,
      trialEndsAt,
      limits: LIMITS[tier],
      loading,
    };
  }, [subscription, isActive, loading]);
}
