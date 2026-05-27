import { Link } from "react-router-dom";
import { CreditCard, ArrowRight, Sparkles } from "lucide-react";
import { format } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useSubscription } from "@/hooks/useSubscription";
import { usePlan } from "@/hooks/usePlan";

const STATUS_TONE: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  active: "default",
  trialing: "default",
  past_due: "destructive",
  canceled: "secondary",
  incomplete: "outline",
};

export const SubscriptionStatusCard = () => {
  const { subscription, loading } = useSubscription();
  const { tier, isTrialing, trialEndsAt } = usePlan();

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary/10 grid place-items-center">
            <CreditCard className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-base">Subscription</CardTitle>
            <CardDescription>Your current plan</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <Skeleton className="h-16 w-full" />
        ) : (
          <>
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <div className="text-2xl font-bold capitalize tabular-nums">{tier}</div>
                {subscription?.current_period_end && (
                  <div className="text-xs text-muted-foreground">
                    {subscription.cancel_at_period_end ? "Ends" : "Renews"}{" "}
                    {format(new Date(subscription.current_period_end), "MMM d, yyyy")}
                  </div>
                )}
                {isTrialing && trialEndsAt && (
                  <div className="text-xs text-primary font-medium mt-0.5">
                    Trial ends {format(trialEndsAt, "MMM d")}
                  </div>
                )}
              </div>
              {subscription?.status && (
                <Badge
                  variant={STATUS_TONE[subscription.status] ?? "secondary"}
                  className="capitalize shrink-0"
                >
                  {subscription.status.replace("_", " ")}
                </Badge>
              )}
            </div>

            {tier === "free" ? (
              <Button asChild size="sm" className="w-full">
                <Link to="/pricing">
                  <Sparkles className="h-4 w-4" />
                  Upgrade plan
                </Link>
              </Button>
            ) : (
              <Button asChild variant="outline" size="sm" className="w-full">
                <Link to="/dashboard/billing">
                  Manage billing
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};
