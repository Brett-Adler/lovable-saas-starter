import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Lock, Sparkles } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { usePlan, type PlanTier } from "@/hooks/usePlan";

interface RequirePlanProps {
  tier: PlanTier;
  /** Pretty name shown in the upgrade card, e.g. "Audit logs". */
  feature?: string;
  /** Custom fallback. If omitted, an upgrade card is rendered. */
  fallback?: ReactNode;
  children: ReactNode;
}

const TIER_LABEL: Record<PlanTier, string> = {
  free: "Free",
  pro: "Pro",
  team: "Team",
};

export const RequirePlan = ({ tier, feature, fallback, children }: RequirePlanProps) => {
  const plan = usePlan();

  if (plan.loading) {
    return (
      <div className="py-16 grid place-items-center">
        <div className="h-6 w-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (plan.isAtLeast(tier)) return <>{children}</>;
  if (fallback) return <>{fallback}</>;

  return (
    <Card className="max-w-xl mx-auto border-dashed">
      <CardHeader>
        <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
          <Lock className="h-5 w-5 text-primary" />
        </div>
        <CardTitle>
          {feature ?? "This feature"} is on the {TIER_LABEL[tier]} plan
        </CardTitle>
        <CardDescription>
          Upgrade to unlock it for your workspace. Cancel anytime.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button asChild>
          <Link to="/pricing">
            <Sparkles className="h-4 w-4" />
            See plans
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};
