import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Mail, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export const PendingInvitesCard = () => {
  const { user } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ["pending-invites", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const { data } = await supabase
        .from("organization_invites")
        .select("id,token,email,role,organization_id,expires_at")
        .is("accepted_at", null)
        .gt("expires_at", new Date().toISOString())
        .order("expires_at", { ascending: true })
        .limit(5);
      return data ?? [];
    },
  });

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary/10 grid place-items-center">
            <Mail className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-base">Pending invites</CardTitle>
            <CardDescription>Invitations waiting for you</CardDescription>
          </div>
          {data && data.length > 0 && (
            <Badge variant="default" className="tabular-nums">
              {data.length}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {isLoading ? (
          <Skeleton className="h-20 w-full" />
        ) : !data || data.length === 0 ? (
          <p className="py-4 text-sm text-muted-foreground text-center">
            No pending invitations.
          </p>
        ) : (
          <ul className="space-y-2">
            {data.map((inv) => (
              <li
                key={inv.id}
                className="flex items-center justify-between gap-2 rounded-md border border-border px-3 py-2"
              >
                <div className="min-w-0">
                  <div className="text-sm font-medium truncate">{inv.email}</div>
                  <div className="text-[11px] text-muted-foreground capitalize">
                    Role: {inv.role}
                  </div>
                </div>
                <Button asChild size="sm" className="h-7 shrink-0">
                  <Link to={`/invite/${inv.token}`}>
                    Accept
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </Button>
              </li>
            ))}
            <Button asChild variant="ghost" size="sm" className="w-full justify-center mt-1">
              <Link to="/dashboard/invitations">
                View all
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </ul>
        )}
      </CardContent>
    </Card>
  );
};
