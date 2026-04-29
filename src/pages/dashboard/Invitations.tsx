import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Loader2, Mail, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { supabase } from "@/integrations/supabase/client";
import { useOrganization } from "@/hooks/useOrganization";
import { toast } from "@/hooks/use-toast";

interface PendingInvite {
  id: string;
  token: string;
  role: string;
  expires_at: string;
  organization_id: string;
  organizations: { name: string; slug: string } | null;
}

const Invitations = () => {
  const { refresh, setCurrentOrgId } = useOrganization();
  const [invites, setInvites] = useState<PendingInvite[]>([]);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("organization_invites")
      .select("id, token, role, expires_at, organization_id, organizations:organization_id (name, slug)")
      .is("accepted_at", null);
    setInvites((data ?? []) as PendingInvite[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleAccept = async (invite: PendingInvite) => {
    setAccepting(invite.id);
    const { data, error } = await supabase.rpc("accept_organization_invite", {
      _token: invite.token,
    });
    setAccepting(null);
    if (error) {
      toast({ title: "Could not accept", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Joined organization!", description: invite.organizations?.name });
    await refresh();
    if (typeof data === "string") setCurrentOrgId(data);
    load();
  };

  return (
    <DashboardShell>
      <div className="p-6 lg:p-10 max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Invitations</h1>
          <p className="text-muted-foreground">Pending invites to join organizations.</p>
        </div>

        {loading ? (
          <div className="py-12 flex justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : invites.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-12 flex flex-col items-center text-center">
              <Inbox className="h-10 w-10 text-muted-foreground mb-3" />
              <p className="font-medium">No pending invitations</p>
              <p className="text-sm text-muted-foreground mt-1">
                When someone invites you to an organization, it'll show up here.
              </p>
              <Button asChild variant="outline" size="sm" className="mt-4">
                <Link to="/dashboard/organization/new">Create your own</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          invites.map((invite) => (
            <Card key={invite.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Mail className="h-5 w-5 text-primary" />
                  {invite.organizations?.name ?? "Organization"}
                </CardTitle>
                <CardDescription>
                  Invited as <Badge variant="secondary" className="capitalize ml-1">{invite.role}</Badge>
                  <span className="ml-2 text-xs">
                    Expires {new Date(invite.expires_at).toLocaleDateString()}
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => handleAccept(invite)} disabled={accepting === invite.id}>
                  {accepting === invite.id && <Loader2 className="h-4 w-4 animate-spin" />}
                  Accept invite
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </DashboardShell>
  );
};

export default Invitations;
