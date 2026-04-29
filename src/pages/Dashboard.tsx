import { Link } from "react-router-dom";
import { Sparkles, Building2, Users, CreditCard, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { useAuth } from "@/hooks/useAuth";
import { useOrganization } from "@/hooks/useOrganization";
import { useUserRoles } from "@/hooks/useUserRole";

const Dashboard = () => {
  const { user } = useAuth();
  const { currentOrg, memberships } = useOrganization();
  const { isAdmin } = useUserRoles();

  return (
    <DashboardShell>
      <div className="p-6 lg:p-10 max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-3">
            <Sparkles className="h-3.5 w-3.5" />
            You're signed in
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold mb-2">
            Welcome back{user?.user_metadata?.display_name ? `, ${user.user_metadata.display_name}` : ""}
          </h1>
          <p className="text-muted-foreground">
            {currentOrg ? `Working in ${currentOrg.name}` : "Create or join an organization to get started."}
          </p>
        </div>

        {!currentOrg && memberships.length === 0 && (
          <Card className="mb-8 border-dashed">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                No organization yet
              </CardTitle>
              <CardDescription>
                Organizations let you collaborate with teammates, share billing, and manage roles.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link to="/dashboard/organization/new">
                  Create your first organization
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentOrg && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-primary" />
                    Organization
                  </CardTitle>
                  <CardDescription>Manage your workspace</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium truncate">{currentOrg.name}</span>
                    <Badge variant="secondary" className="capitalize">{currentOrg.role}</Badge>
                  </div>
                  <Button asChild variant="outline" size="sm" className="w-full">
                    <Link to="/dashboard/organization">Open settings</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    Members
                  </CardTitle>
                  <CardDescription>Invite teammates</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild variant="outline" size="sm" className="w-full">
                    <Link to="/dashboard/members">Manage members</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-primary" />
                    Plan
                  </CardTitle>
                  <CardDescription className="capitalize">{currentOrg.plan}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild variant="outline" size="sm" className="w-full">
                    <Link to="/pricing">View plans</Link>
                  </Button>
                </CardContent>
              </Card>
            </>
          )}

          {isAdmin && (
            <Card className="border-primary/30">
              <CardHeader>
                <CardTitle className="text-base">Admin tools</CardTitle>
                <CardDescription>You have global admin access.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild size="sm" className="w-full">
                  <Link to="/admin">Open admin panel</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardShell>
  );
};

export default Dashboard;
