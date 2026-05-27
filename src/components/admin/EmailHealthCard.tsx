import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Mail, ArrowRight, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

type LogRow = {
  message_id: string | null;
  status: string;
  created_at: string;
};

const STATUS_VARIANT: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  sent: "default",
  failed: "destructive",
  dlq: "destructive",
  bounced: "destructive",
  complained: "destructive",
  suppressed: "secondary",
  pending: "outline",
};

export const EmailHealthCard = () => {
  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const logs = useQuery({
    queryKey: ["admin-email-health", since],
    queryFn: async () => {
      const { data } = await supabase
        .from("email_send_log")
        .select("message_id,status,created_at")
        .gte("created_at", since)
        .order("created_at", { ascending: false })
        .limit(2000);
      return (data ?? []) as LogRow[];
    },
  });

  // Dedupe by message_id, keeping latest status
  const counts = (() => {
    const seen = new Set<string>();
    const totals: Record<string, number> = {};
    let total = 0;
    for (const row of logs.data ?? []) {
      const key = row.message_id ?? `__row_${Math.random()}`;
      if (seen.has(key)) continue;
      seen.add(key);
      totals[row.status] = (totals[row.status] ?? 0) + 1;
      total++;
    }
    return { totals, total };
  })();

  const sent = counts.totals.sent ?? 0;
  const failed = (counts.totals.dlq ?? 0) + (counts.totals.failed ?? 0) + (counts.totals.bounced ?? 0);
  const suppressed = counts.totals.suppressed ?? 0;
  const failRate = counts.total > 0 ? Math.round((failed / counts.total) * 100) : 0;

  const buckets = [
    { label: "Sent", value: sent, status: "sent" },
    { label: "Failed", value: failed, status: "failed" },
    { label: "Suppressed", value: suppressed, status: "suppressed" },
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary/10 grid place-items-center">
            <Mail className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-base">Email health</CardTitle>
            <CardDescription>Last 7 days · {counts.total} unique emails</CardDescription>
          </div>
          <Button asChild variant="ghost" size="sm">
            <Link to="/admin/broadcasts">
              View <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {logs.isLoading ? (
          <div className="py-6 grid place-items-center text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
        ) : counts.total === 0 ? (
          <p className="py-4 text-sm text-muted-foreground text-center">
            No emails sent in the last 7 days.
          </p>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              {buckets.map((b) => (
                <div
                  key={b.label}
                  className="rounded-lg border border-border bg-card/50 p-3"
                >
                  <div className="text-xs text-muted-foreground">{b.label}</div>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-xl font-bold tabular-nums">{b.value}</span>
                    <Badge
                      variant={STATUS_VARIANT[b.status] ?? "secondary"}
                      className="h-4 px-1.5 text-[10px]"
                    >
                      {b.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Failure rate</span>
              <span
                className={
                  failRate >= 5
                    ? "font-semibold text-destructive tabular-nums"
                    : "font-semibold tabular-nums"
                }
              >
                {failRate}%
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
