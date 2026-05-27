import { Link } from "react-router-dom";
import { Sparkles, Building2, Users, ArrowRight, Shield, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { OnboardingChecklist } from "@/components/dashboard/OnboardingChecklist";
import { SubscriptionStatusCard } from "@/components/dashboard/SubscriptionStatusCard";
import { PendingInvitesCard } from "@/components/dashboard/PendingInvitesCard";
import { RecentNotificationsCard } from "@/components/dashboard/RecentNotificationsCard";
import { OrgActivityCard } from "@/components/dashboard/OrgActivityCard";
import { useAuth } from "@/hooks/useAuth";
import { useOrganization } from "@/hooks/useOrganization";
import { useUserRoles } from "@/hooks/useUserRole";

const Eyebrow = ({ children }: { children: React.ReactNode }) => (
  <div className="px-1 mb-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
    {children}
  </div>
);

const Dashboard = () => {
  const { user } = useAuth();
  const { currentOrg, memberships } = useOrganization();
  const { isAdmin } = useUserRoles();

  const displayName =
    user?.user_metadata?.display_name ||
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0];

  return (
    <DashboardShell>
      {/* Hero band */}
      <div className="relative overflow-hidden border-b border-border bg-gradient-to-br from-primary/10 via-background to-background">
        <div
          aria-hidden
          className="absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, hsl(var(--primary) / 0.15) 1px, transparent 0)",
            backgroundSize: "24px 24px",
          }}
        />
        <div className="relative max-w-6xl mx-auto p-6 lg:p-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-3">
            <Sparkles className="h-3.5 w-3.5" />
            You're signed in
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold mb-2 tracking-tight">
            Welcome back{displayName ? `, ${displayName}` : ""}
          </h1>
          <p className="text-muted-foreground max-w-2xl">
            {currentOrg
              ? `Working in ${currentOrg.name}. Here's what's happening today.`
              : "Create or join an organization to get started collaborating."}
          </p>

          {currentOrg && (
            <div className="mt-5 flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="gap-1.5">
                <Building2 className="h-3.5 w-3.5" />
                {currentOrg.name}
              </Badge>
              <Badge variant="outline" className="capitalize">
                {currentOrg.role}
              </Badge>
              <Badge variant="outline" className="capitalize">
                {currentOrg.plan} plan
              </Badge>
            </div>
          )}

          {!currentOrg && memberships.length === 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              <Button asChild>
                <Link to="/dashboard/organization/new">
                  Create your first organization
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/dashboard/invitations">
                  View invitations
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6 lg:p-10 space-y-10 animate-fade-in">
        {/* Getting started + Subscription */}
        <section>
          <Eyebrow>Get set up</Eyebrow>
          <div className="grid lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <OnboardingChecklist />
            </div>
            <SubscriptionStatusCard />
          </div>
        </section>

        {/* Inbox */}
        <section>
          <Eyebrow>Your inbox</Eyebrow>
          <div className="grid lg:grid-cols-2 gap-4">
            <PendingInvitesCard />
            <RecentNotificationsCard />
          </div>
        </section>

        {/* Workspace */}
        {currentOrg && (
          <section>
            <Eyebrow>Workspace</Eyebrow>
            <div className="grid lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2">
                <OrgActivityCard />
              </div>

              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-primary/10 grid place-items-center">
                      <Users className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-base">Manage workspace</CardTitle>
                      <CardDescription>Quick links</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button asChild variant="outline" size="sm" className="w-full justify-start">
                    <Link to="/dashboard/members">
                      <Users className="h-4 w-4" />
                      Members
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="sm" className="w-full justify-start">
                    <Link to="/dashboard/organization">
                      <Building2 className="h-4 w-4" />
                      Organization settings
                    </Link>
                  </Button>
                  {(currentOrg.role === "owner" || currentOrg.role === "admin") && (
                    <Button asChild variant="outline" size="sm" className="w-full justify-start">
                      <Link to="/dashboard/billing">
                        <ExternalLink className="h-4 w-4" />
                        Billing
                      </Link>
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          </section>
        )}

        {isAdmin && (
          <section>
            <Eyebrow>Admin</Eyebrow>
            <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" />
                  Admin tools
                </CardTitle>
                <CardDescription>You have global admin access to manage users, content, and revenue.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild size="sm">
                  <Link to="/admin">
                    Open admin panel
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </section>
        )}
      </div>
    </DashboardShell>
  );
};

export default Dashboard;
