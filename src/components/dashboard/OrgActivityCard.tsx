import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { ScrollText, Lock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useOrganization } from "@/hooks/useOrganization";

const ACTION_LABELS: Record<string, string> = {
  "invite.created": "Invite sent",
  "invite.revoked": "Invite revoked",
  "member.added": "Member added",
  "member.removed": "Member removed",
  "member.role_changed": "Role changed",
  "role.granted": "Role granted",
  "role.revoked": "Role revoked",
};

export const OrgActivityCard = () => {
  const { currentOrg } = useOrganization();
  const canView = currentOrg?.role === "owner" || currentOrg?.role === "admin";

  const { data, isLoading } = useQuery({
    queryKey: ["org-activity", currentOrg?.id],
    enabled: !!currentOrg && canView,
    queryFn: async () => {
      const { data } = await supabase
        .from("audit_log")
        .select("id,action,actor_email,target_type,metadata,created_at")
        .eq("organization_id", currentOrg!.id)
        .order("created_at", { ascending: false })
        .limit(8);
      return data ?? [];
    },
  });

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary/10 grid place-items-center">
            <ScrollText className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-base">Organization activity</CardTitle>
            <CardDescription>
              {currentOrg ? `Recent events in ${currentOrg.name}` : "Pick an organization to see activity"}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {!currentOrg ? (
          <p className="py-4 text-sm text-muted-foreground text-center">No organization selected.</p>
        ) : !canView ? (
          <div className="py-6 text-center text-sm text-muted-foreground space-y-2">
            <Lock className="h-5 w-5 mx-auto opacity-60" />
            <div>Only owners and admins can see org activity.</div>
          </div>
        ) : isLoading ? (
          <Skeleton className="h-24 w-full" />
        ) : !data || data.length === 0 ? (
          <p className="py-4 text-sm text-muted-foreground text-center">No activity yet.</p>
        ) : (
          <ul className="divide-y divide-border">
            {data.map((e) => (
              <li key={e.id} className="py-2.5 flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium truncate">
                    {ACTION_LABELS[e.action] ?? e.action}
                  </div>
                  <div className="text-xs text-muted-foreground truncate">
                    {e.actor_email ?? "System"} ·{" "}
                    {formatDistanceToNow(new Date(e.created_at), { addSuffix: true })}
                  </div>
                </div>
                {e.target_type && (
                  <Badge variant="outline" className="text-[10px] shrink-0">
                    {e.target_type.replace("organization_", "")}
                  </Badge>
                )}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};
