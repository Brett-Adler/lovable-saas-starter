import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ExternalLink, Loader2, Search } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useUserRoles } from "@/hooks/useUserRole";
import { supabase } from "@/integrations/supabase/client";
import { AdminShell } from "@/components/admin/AdminShell";

type Sub = {
  id: string;
  user_id: string | null;
  organization_id: string | null;
  status: string;
  product_name: string | null;
  product_id: string | null;
  price_id: string | null;
  stripe_customer_id: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  environment: string;
  created_at: string;
};

const STATUSES = ["all", "active", "trialing", "past_due", "canceled", "incomplete", "incomplete_expired", "unpaid", "paused"] as const;

const Subscriptions = () => {
  const { isAdmin } = useUserRoles();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<string>("all");
  const [env, setEnv] = useState<"all" | "sandbox" | "live">("all");

  const { data, isLoading } = useQuery({
    queryKey: ["admin-subscriptions"],
    enabled: isAdmin,
    queryFn: async () => {
      const [subsRes, profilesRes, orgsRes] = await Promise.all([
        supabase.from("subscriptions").select("id,user_id,organization_id,status,product_name,product_id,price_id,stripe_customer_id,current_period_end,cancel_at_period_end,environment,created_at").order("created_at", { ascending: false }).limit(1000),
        supabase.from("profiles").select("id,email,display_name"),
        supabase.from("organizations").select("id,name,slug"),
      ]);
      if (subsRes.error) throw subsRes.error;
      if (profilesRes.error) throw profilesRes.error;
      if (orgsRes.error) throw orgsRes.error;
      const profileById = new Map((profilesRes.data ?? []).map((p) => [p.id, p]));
      const orgById = new Map((orgsRes.data ?? []).map((o) => [o.id, o]));
      return { subs: subsRes.data as Sub[], profileById, orgById };
    },
  });

  const subs = data?.subs ?? [];
  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return subs.filter((s) => {
      if (env !== "all" && s.environment !== env) return false;
      if (status !== "all" && s.status !== status) return false;
      if (!needle) return true;
      const p = s.user_id ? data?.profileById.get(s.user_id) : null;
      const o = s.organization_id ? data?.orgById.get(s.organization_id) : null;
      return (
        (p?.email ?? "").toLowerCase().includes(needle) ||
        (o?.name ?? "").toLowerCase().includes(needle) ||
        (s.product_name ?? "").toLowerCase().includes(needle) ||
        (s.stripe_customer_id ?? "").toLowerCase().includes(needle)
      );
    });
  }, [subs, q, status, env, data]);

  return (
    <AdminShell title="Subscriptions" description="All Stripe customers across sandbox and live.">
      <div className="flex flex-wrap gap-3 mb-4">
          <div className="relative flex-1 min-w-[220px] max-w-sm">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-9" placeholder="Customer, plan, or Stripe ID…" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
            <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s}>{s === "all" ? "All statuses" : s}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={env} onValueChange={(v) => setEnv(v as typeof env)}>
            <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All envs</SelectItem>
              <SelectItem value="live">Live</SelectItem>
              <SelectItem value="sandbox">Test</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Env</TableHead>
                <TableHead>Renews / ends</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={6} className="text-center py-12"><Loader2 className="h-5 w-5 animate-spin mx-auto" /></TableCell></TableRow>
              ) : !filtered.length ? (
                <TableRow><TableCell colSpan={6} className="text-center py-12 text-muted-foreground">No subscriptions found.</TableCell></TableRow>
              ) : filtered.map((s) => {
                const p = s.user_id ? data?.profileById.get(s.user_id) : null;
                const o = s.organization_id ? data?.orgById.get(s.organization_id) : null;
                const customer = o?.name ?? p?.email ?? "—";
                const stripeUrl = s.stripe_customer_id
                  ? `https://dashboard.stripe.com/${s.environment === "live" ? "" : "test/"}customers/${s.stripe_customer_id}`
                  : null;
                return (
                  <TableRow key={s.id}>
                    <TableCell>
                      <div className="font-medium truncate max-w-[200px]">{customer}</div>
                      {o && p ? <div className="text-xs text-muted-foreground truncate">{p.email}</div> : null}
                    </TableCell>
                    <TableCell className="text-sm">
                      {s.product_name ?? <span className="text-muted-foreground">—</span>}
                      {s.price_id ? <div className="text-xs text-muted-foreground font-mono">{s.price_id}</div> : null}
                    </TableCell>
                    <TableCell>
                      <Badge variant={["active", "trialing"].includes(s.status) ? "default" : s.status === "past_due" ? "destructive" : "secondary"}>
                        {s.status}
                      </Badge>
                      {s.cancel_at_period_end && <div className="text-xs text-muted-foreground mt-1">cancels at period end</div>}
                    </TableCell>
                    <TableCell><Badge variant="outline">{s.environment === "live" ? "live" : "test"}</Badge></TableCell>
                    <TableCell className="text-xs whitespace-nowrap text-muted-foreground">
                      {s.current_period_end ? format(new Date(s.current_period_end), "MMM d, yyyy") : "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      {stripeUrl && (
                        <Button asChild variant="ghost" size="sm">
                          <a href={stripeUrl} target="_blank" rel="noreferrer noopener" aria-label="Open in Stripe">
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>
      </main>
    </div>
  );
};

export default Subscriptions;
