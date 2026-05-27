import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { ScrollText, ArrowRight, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

const ACTION_LABELS: Record<string, string> = {
  "invite.created": "Invite sent",
  "invite.revoked": "Invite revoked",
  "member.added": "Member added",
  "member.removed": "Member removed",
  "member.role_changed": "Role changed",
  "role.granted": "Role granted",
  "role.revoked": "Role revoked",
};

export const RecentAuditCard = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-recent-audit"],
    queryFn: async () => {
      const { data } = await supabase
        .from("audit_log")
        .select("id,action,actor_email,target_type,created_at")
        .order("created_at", { ascending: false })
        .limit(6);
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
            <CardTitle className="text-base">Recent audit events</CardTitle>
            <CardDescription>Latest security-relevant actions</CardDescription>
          </div>
          <Button asChild variant="ghost" size="sm">
            <Link to="/admin/audit">
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {isLoading ? (
          <div className="py-6 grid place-items-center text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
        ) : !data || data.length === 0 ? (
          <p className="py-4 text-sm text-muted-foreground text-center">No audit events yet.</p>
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
