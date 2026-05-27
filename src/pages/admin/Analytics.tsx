import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowUp, ArrowDown, Loader2 } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip as RTooltip,
  BarChart,
  Bar,
  CartesianGrid,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useUserRoles } from "@/hooks/useUserRole";
import { supabase } from "@/integrations/supabase/client";
import { AdminShell } from "@/components/admin/AdminShell";

type Range = 7 | 30 | 90;

type Overview = {
  totalUsers: number;
  signups: { current: number; previous: number; series: { day: string; count: number }[] };
  recentSignups: { id: string; email: string | null; created_at: string; provider: string }[];
};

function intervalMultiplier(interval?: string | null) {
  switch (interval) {
    case "year": return 1 / 12;
    case "week": return 52 / 12;
    case "day": return 365 / 12;
    default: return 1; // month or unknown
  }
}

function fmtCurrency(cents: number, currency = "usd") {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: currency.toUpperCase(), maximumFractionDigits: 0 })
    .format(cents / 100);
}

function Delta({ current, previous }: { current: number; previous: number }) {
  if (previous === 0 && current === 0) return <span className="text-xs text-muted-foreground">—</span>;
  const diff = current - previous;
  const pct = previous === 0 ? 100 : Math.round((diff / previous) * 100);
  const up = diff >= 0;
  return (
    <span className={`inline-flex items-center gap-0.5 text-xs ${up ? "text-emerald-600 dark:text-emerald-500" : "text-destructive"}`}>
      {up ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
      {Math.abs(pct)}%
    </span>
  );
}

function Kpi({ label, value, sub, delta }: { label: string; value: React.ReactNode; sub?: React.ReactNode; delta?: React.ReactNode }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription>{label}</CardDescription>
        <CardTitle className="text-2xl font-bold tabular-nums">{value}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0 flex items-center justify-between">
        <div className="text-xs text-muted-foreground">{sub}</div>
        {delta}
      </CardContent>
    </Card>
  );
}

const Analytics = () => {
  const { isAdmin } = useUserRoles();
  const [range, setRange] = useState<Range>(30);

  const sinceISO = useMemo(() => new Date(Date.now() - range * 86400000).toISOString(), [range]);
  const prevSinceISO = useMemo(() => new Date(Date.now() - 2 * range * 86400000).toISOString(), [range]);

  const overview = useQuery({
    queryKey: ["admin-analytics-overview", range],
    enabled: isAdmin,
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke<Overview>("admin-analytics-overview", {
        body: { days: range },
      });
      if (error) throw error;
      return data!;
    },
  });

  const subs = useQuery({
    queryKey: ["admin-analytics-subs"],
    enabled: isAdmin,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("subscriptions")
        .select("id,status,product_name,price_id,current_period_end,cancel_at_period_end,environment,created_at,updated_at,metadata")
        .limit(2000);
      if (error) throw error;
      return data ?? [];
    },
  });

  const leads = useQuery({
    queryKey: ["admin-analytics-leads", range],
    enabled: isAdmin,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("leads")
        .select("id,kind,source,created_at")
        .gte("created_at", sinceISO)
        .limit(2000);
      if (error) throw error;
      return data ?? [];
    },
  });

  const events = useQuery({
    queryKey: ["admin-analytics-events", range],
    enabled: isAdmin,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("analytics_events")
        .select("event_name,user_id")
        .gte("created_at", sinceISO)
        .limit(5000);
      if (error) throw error;
      return data ?? [];
    },
  });

  const newsletter = useQuery({
    queryKey: ["admin-analytics-newsletter", range],
    enabled: isAdmin,
    queryFn: async () => {
      const [confirmed, currentNew, prevNew] = await Promise.all([
        supabase.from("marketing_subscribers").select("id", { count: "exact", head: true }).eq("status", "subscribed"),
        supabase.from("marketing_subscribers").select("id", { count: "exact", head: true }).eq("status", "subscribed").gte("subscribed_at", sinceISO),
        supabase.from("marketing_subscribers").select("id", { count: "exact", head: true }).eq("status", "subscribed").gte("subscribed_at", prevSinceISO).lt("subscribed_at", sinceISO),
      ]);
      return {
        total: confirmed.count ?? 0,
        current: currentNew.count ?? 0,
        previous: prevNew.count ?? 0,
      };
    },
  });

  // Derived sub metrics (live env only)
  const subMetrics = useMemo(() => {
    const all = (subs.data ?? []).filter((s) => s.environment === "live");
    const isActive = (s: typeof all[number]) => ["active", "trialing"].includes(s.status as string);
    const active = all.filter(isActive);

    let mrrCents = 0;
    let currency = "usd";
    for (const s of active) {
      const meta = (s.metadata ?? {}) as Record<string, unknown>;
      const amount = Number(meta.unit_amount ?? meta.amount ?? 0);
      const interval = (meta.interval as string | undefined) ?? (meta.recurring_interval as string | undefined);
      if (Number.isFinite(amount) && amount > 0) {
        mrrCents += amount * intervalMultiplier(interval);
      }
      if (typeof meta.currency === "string") currency = meta.currency;
    }

    const sinceMs = Date.now() - range * 86400000;
    const prevSinceMs = sinceMs - range * 86400000;
    const newPayingCurrent = all.filter((s) => isActive(s) && +new Date(s.created_at) >= sinceMs).length;
    const newPayingPrev = all.filter((s) => isActive(s) && +new Date(s.created_at) >= prevSinceMs && +new Date(s.created_at) < sinceMs).length;

    const churnCurrent = all.filter((s) => s.status === "canceled" && +new Date(s.updated_at) >= sinceMs).length;
    const churnPrev = all.filter((s) => s.status === "canceled" && +new Date(s.updated_at) >= prevSinceMs && +new Date(s.updated_at) < sinceMs).length;

    const byPlan = new Map<string, number>();
    for (const s of active) {
      const name = s.product_name ?? "—";
      byPlan.set(name, (byPlan.get(name) ?? 0) + 1);
    }
    const planData = Array.from(byPlan, ([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count);

    return { activeCount: active.length, mrrCents: Math.round(mrrCents), currency, newPayingCurrent, newPayingPrev, churnCurrent, churnPrev, planData };
  }, [subs.data, range]);

  const leadsData = useMemo(() => {
    const map = new Map<string, number>();
    for (const l of leads.data ?? []) {
      const key = l.source ?? l.kind ?? "unknown";
      map.set(key, (map.get(key) ?? 0) + 1);
    }
    return Array.from(map, ([source, count]) => ({ source, count })).sort((a, b) => b.count - a.count).slice(0, 8);
  }, [leads.data]);

  const eventsData = useMemo(() => {
    const map = new Map<string, { count: number; users: Set<string> }>();
    for (const e of events.data ?? []) {
      const row = map.get(e.event_name) ?? { count: 0, users: new Set() };
      row.count++;
      if (e.user_id) row.users.add(e.user_id);
      map.set(e.event_name, row);
    }
    return Array.from(map, ([name, row]) => ({ name, count: row.count, users: row.users.size }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20);
  }, [events.data]);

  return (
    <AdminShell
      title="Analytics"
      description="Signups, revenue, and engagement across the platform."
      actions={
        <Select value={String(range)} onValueChange={(v) => setRange(Number(v) as Range)}>
          <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="90">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      }
    >

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <Kpi
            label="MRR (live)"
            value={subs.isLoading ? "…" : fmtCurrency(subMetrics.mrrCents, subMetrics.currency)}
            sub={`${subMetrics.activeCount} active subs`}
          />
          <Kpi
            label="Active subscriptions"
            value={subs.isLoading ? "…" : subMetrics.activeCount}
            sub="active + trialing, live env"
          />
          <Kpi
            label="New signups"
            value={overview.isLoading ? "…" : overview.data?.signups.current ?? 0}
            sub={`vs ${overview.data?.signups.previous ?? 0} previous period`}
            delta={overview.data ? <Delta current={overview.data.signups.current} previous={overview.data.signups.previous} /> : null}
          />
          <Kpi
            label="New paying customers"
            value={subs.isLoading ? "…" : subMetrics.newPayingCurrent}
            sub={`vs ${subMetrics.newPayingPrev} previous`}
            delta={<Delta current={subMetrics.newPayingCurrent} previous={subMetrics.newPayingPrev} />}
          />
          <Kpi
            label="Churned"
            value={subs.isLoading ? "…" : subMetrics.churnCurrent}
            sub={`vs ${subMetrics.churnPrev} previous`}
            delta={<Delta current={subMetrics.churnPrev} previous={subMetrics.churnCurrent} />}
          />
          <Kpi
            label="Newsletter subscribers"
            value={newsletter.isLoading ? "…" : newsletter.data?.total ?? 0}
            sub={`+${newsletter.data?.current ?? 0} this period`}
            delta={newsletter.data ? <Delta current={newsletter.data.current} previous={newsletter.data.previous} /> : null}
          />
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-4 mb-8">
          <Card>
            <CardHeader><CardTitle className="text-base">Signups over time</CardTitle></CardHeader>
            <CardContent className="h-64">
              {overview.isLoading ? (
                <div className="grid place-items-center h-full"><Loader2 className="h-5 w-5 animate-spin" /></div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={overview.data?.signups.series ?? []}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="day" tick={{ fontSize: 11 }} tickFormatter={(d) => format(new Date(d), "MMM d")} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                    <RTooltip contentStyle={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                    <Line type="monotone" dataKey="count" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Active subscriptions by plan</CardTitle></CardHeader>
            <CardContent className="h-64">
              {subs.isLoading ? (
                <div className="grid place-items-center h-full"><Loader2 className="h-5 w-5 animate-spin" /></div>
              ) : !subMetrics.planData.length ? (
                <div className="grid place-items-center h-full text-sm text-muted-foreground">No active subscriptions.</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={subMetrics.planData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                    <RTooltip contentStyle={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                    <Bar dataKey="count" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader><CardTitle className="text-base">Leads by source</CardTitle></CardHeader>
            <CardContent className="h-56">
              {leads.isLoading ? (
                <div className="grid place-items-center h-full"><Loader2 className="h-5 w-5 animate-spin" /></div>
              ) : !leadsData.length ? (
                <div className="grid place-items-center h-full text-sm text-muted-foreground">No leads in this period.</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={leadsData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
                    <YAxis type="category" dataKey="source" width={120} tick={{ fontSize: 11 }} />
                    <RTooltip contentStyle={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                    <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Tables */}
        <div className="grid lg:grid-cols-2 gap-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Top events</CardTitle><CardDescription>Last {range} days</CardDescription></CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event</TableHead>
                    <TableHead className="text-right">Count</TableHead>
                    <TableHead className="text-right">Users</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {events.isLoading ? (
                    <TableRow><TableCell colSpan={3} className="text-center py-8"><Loader2 className="h-5 w-5 animate-spin mx-auto" /></TableCell></TableRow>
                  ) : !eventsData.length ? (
                    <TableRow><TableCell colSpan={3} className="text-center py-8 text-muted-foreground">No events tracked yet.</TableCell></TableRow>
                  ) : eventsData.map((e) => (
                    <TableRow key={e.name}>
                      <TableCell className="font-mono text-xs">{e.name}</TableCell>
                      <TableCell className="text-right tabular-nums">{e.count}</TableCell>
                      <TableCell className="text-right tabular-nums text-muted-foreground">{e.users}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Recent signups</CardTitle><CardDescription>{overview.data?.totalUsers ?? 0} total users</CardDescription></CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Provider</TableHead>
                    <TableHead className="text-right">Joined</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {overview.isLoading ? (
                    <TableRow><TableCell colSpan={3} className="text-center py-8"><Loader2 className="h-5 w-5 animate-spin mx-auto" /></TableCell></TableRow>
                  ) : !overview.data?.recentSignups.length ? (
                    <TableRow><TableCell colSpan={3} className="text-center py-8 text-muted-foreground">No signups.</TableCell></TableRow>
                  ) : overview.data.recentSignups.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell className="truncate max-w-[220px] text-sm">{u.email ?? "—"}</TableCell>
                      <TableCell><Badge variant="outline" className="text-xs">{u.provider}</Badge></TableCell>
                      <TableCell className="text-right text-xs text-muted-foreground whitespace-nowrap">
                        {formatDistanceToNow(new Date(u.created_at), { addSuffix: true })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
    </AdminShell>
  );
};

export default Analytics;
