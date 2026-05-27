import { useState } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { CreditCard, ExternalLink, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { PaymentTestModeBanner } from "@/components/PaymentTestModeBanner";
import { useSubscription } from "@/hooks/useSubscription";
import { getStripeEnvironment } from "@/lib/stripe";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const planLabel = (priceId: string | null) => {
  if (!priceId) return "—";
  const map: Record<string, string> = {
    pro_monthly: "Pro (Monthly)",
    pro_yearly: "Pro (Yearly)",
    team_monthly: "Team (Monthly)",
    team_yearly: "Team (Yearly)",
  };
  return map[priceId] ?? priceId;
};

const Billing = () => {
  const { subscription, isActive, loading } = useSubscription();
  const [opening, setOpening] = useState(false);

  const openPortal = async () => {
    setOpening(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-portal-session", {
        body: {
          returnUrl: `${window.location.origin}/dashboard/billing`,
          environment: getStripeEnvironment(),
        },
      });
      if (error || !data?.url) throw new Error(error?.message || "Failed to open billing portal");
      window.open(data.url, "_blank");
    } catch (e) {
      toast({
        title: "Couldn't open billing portal",
        description: (e as Error).message,
        variant: "destructive",
      });
    } finally {
      setOpening(false);
    }
  };

  return (
    <DashboardShell>
      <PaymentTestModeBanner />
      <div className="p-6 lg:p-10 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">Billing</h1>
        <p className="text-muted-foreground mb-6">Manage your plan, payment method, and invoices.</p>

        {loading ? (
          <Card>
            <CardContent className="p-8 flex items-center justify-center text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin mr-2" /> Loading…
            </CardContent>
          </Card>
        ) : subscription ? (
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-primary" />
                    {planLabel(subscription.price_id)}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {subscription.status === "trialing"
                      ? "Free trial — you won't be charged until it ends"
                      : subscription.cancel_at_period_end
                      ? "Cancels at the end of the current period"
                      : "Renews automatically"}
                  </CardDescription>
                </div>
                <Badge variant={isActive ? "default" : "secondary"} className="capitalize">
                  {subscription.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {subscription.current_period_end && (
                <p className="text-sm text-muted-foreground">
                  {subscription.status === "trialing"
                    ? "Trial ends "
                    : subscription.cancel_at_period_end
                    ? "Access ends "
                    : "Next billing date: "}
                  <span className="text-foreground font-medium">
                    {format(new Date(subscription.current_period_end), "MMMM d, yyyy")}
                  </span>
                </p>
              )}
              <div className="flex gap-3">
                <Button onClick={openPortal} disabled={opening}>
                  {opening ? <Loader2 className="h-4 w-4 animate-spin" /> : <ExternalLink className="h-4 w-4" />}
                  Manage billing
                </Button>
                <Button asChild variant="outline">
                  <Link to="/pricing">Change plan</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-dashed">
            <CardHeader>
              <CardTitle>No active subscription</CardTitle>
              <CardDescription>You're on the Free plan. Upgrade anytime.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link to="/pricing">View plans</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardShell>
  );
};

export default Billing;
