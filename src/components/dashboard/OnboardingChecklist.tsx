import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Check, Circle, ArrowRight, Sparkles } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useOrganization } from "@/hooks/useOrganization";
import { useSubscription } from "@/hooks/useSubscription";
import { cn } from "@/lib/utils";

type Step = {
  id: string;
  label: string;
  done: boolean;
  to: string;
  cta: string;
};

export const OnboardingChecklist = () => {
  const { user } = useAuth();
  const { currentOrg, memberships } = useOrganization();
  const { isActive: subActive } = useSubscription();

  const profile = useQuery({
    queryKey: ["onboarding-profile", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase
        .from("profiles")
        .select("display_name,onboarded_at")
        .eq("id", user!.id)
        .maybeSingle();
      return data;
    },
  });

  const invites = useQuery({
    queryKey: ["onboarding-invites", currentOrg?.id],
    enabled: !!currentOrg,
    queryFn: async () => {
      const { count } = await supabase
        .from("organization_invites")
        .select("id", { count: "exact", head: true })
        .eq("organization_id", currentOrg!.id);
      return count ?? 0;
    },
  });

  const push = useQuery({
    queryKey: ["onboarding-push", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { count } = await supabase
        .from("push_subscriptions")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user!.id);
      return (count ?? 0) > 0;
    },
  });

  const steps: Step[] = [
    {
      id: "profile",
      label: "Add your display name",
      done: !!(profile.data?.display_name && profile.data.display_name.trim().length > 0),
      to: "/dashboard/settings",
      cta: "Edit profile",
    },
    {
      id: "org",
      label: "Create your organization",
      done: memberships.length > 0,
      to: "/dashboard/organization/new",
      cta: "Create org",
    },
    {
      id: "invite",
      label: "Invite a teammate",
      done: (invites.data ?? 0) > 0,
      to: "/dashboard/members",
      cta: "Invite",
    },
    {
      id: "billing",
      label: "Activate a subscription",
      done: subActive,
      to: "/pricing",
      cta: "View plans",
    },
    {
      id: "push",
      label: "Enable push notifications",
      done: !!push.data,
      to: "/dashboard/settings",
      cta: "Enable",
    },
  ];

  const doneCount = steps.filter((s) => s.done).length;
  const pct = Math.round((doneCount / steps.length) * 100);

  if (doneCount === steps.length) return null;

  const next = steps.find((s) => !s.done);

  return (
    <Card className="overflow-hidden border-primary/20">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary/10 grid place-items-center">
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-base">Getting started</CardTitle>
            <CardDescription>
              {doneCount} of {steps.length} complete
            </CardDescription>
          </div>
        </div>
        <Progress value={pct} className="mt-3 h-1.5" />
      </CardHeader>
      <CardContent>
        <ul className="space-y-1">
          {steps.map((step) => (
            <li
              key={step.id}
              className={cn(
                "flex items-center justify-between gap-3 rounded-md px-2 py-2 -mx-2",
                !step.done && step === next && "bg-muted/60",
              )}
            >
              <div className="flex items-center gap-3 min-w-0">
                {step.done ? (
                  <div className="h-5 w-5 rounded-full bg-primary grid place-items-center shrink-0">
                    <Check className="h-3 w-3 text-primary-foreground" />
                  </div>
                ) : (
                  <Circle className="h-5 w-5 text-muted-foreground shrink-0" />
                )}
                <span
                  className={cn(
                    "text-sm truncate",
                    step.done && "line-through text-muted-foreground",
                  )}
                >
                  {step.label}
                </span>
              </div>
              {!step.done && (
                <Button asChild variant="ghost" size="sm" className="h-7 text-xs shrink-0">
                  <Link to={step.to}>
                    {step.cta}
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </Button>
              )}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};
