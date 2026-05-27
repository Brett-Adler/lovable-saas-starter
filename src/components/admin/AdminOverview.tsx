import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Users as UsersIcon,
  Building2,
  CreditCard,
  DollarSign,
  Inbox,
  Mail,
  Send,
  Settings as SettingsIcon,
  AlertCircle,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

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
    default: return 1;
  }
}

function fmtCurrency(cents: number, currency = "usd") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

interface KpiProps {
  label: string;
  value: React.ReactNode;
  sub?: React.ReactNode;
  icon: React.ComponentType<{ className?: string }>;
  to: string;
  loading?: boolean;
}

function Kpi({ label, value, sub, icon: Icon, to, loading }: KpiProps) {
  return (
    <Link
      to={to}
      className="group rounded-xl border border-border bg-card p-5 hover:border-primary/40 hover:shadow-sm transition-all"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="text-sm text-muted-foreground">{label}</div>
        <Icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
      </div>
      <div className="mt-2 text-2xl font-bold tabular-nums">
        {loading ? <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /> : value}
      </div>
      {sub && <div className="mt-1 text-xs text-muted-foreground">{sub}</div>}
    </Link>
  );
}

export const AdminOverview = () => {
  const overview = useQuery({
    queryKey: ["admin-overview-signups"],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke<Overview>("admin-analytics-overview", {
        body: { days: 7 },
      });
      if (error) throw error;
      return data!;
    },
  });

  const subs = useQuery({
    queryKey: ["admin-overview-subs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("subscriptions")
        .select("id,status,environment,metadata,product_name,updated_at")
        .limit(2000);
      if (error) throw error;
      return data ?? [];
    },
  });

  const attention = useQuery({
    queryKey: ["admin-overview-attention"],
    queryFn: async () => {
      const [newLeads, pendingSubs] = await Promise.all([
        supabase.from("leads").select("id", { count: "exact", head: true }).eq("status", "new"),
        supabase
          .from("marketing_subscribers")
          .select("id", { count: "exact", head: true })
          .eq("status", "pending"),
      ]);
      return {
        newLeads: newLeads.count ?? 0,
        pendingSubs: pendingSubs.count ?? 0,
      };
    },
  });

  const orgsCount = useQuery({
    queryKey: ["admin-overview-orgs-count"],
    queryFn: async () => {
      const { count } = await supabase
        .from("organizations")
        .select("id", { count: "exact", head: true });
      return count ?? 0;
    },
  });

  const recentLeads = useQuery({
    queryKey: ["admin-overview-recent-leads"],
    queryFn: async () => {
      const { data } = await supabase
        .from("leads")
        .select("id,email,name,kind,status,created_at")
        .order("created_at", { ascending: false })
        .limit(5);
      return data ?? [];
    },
  });

  // Live MRR + active count + past_due
  const subMetrics = (() => {
    const live = (subs.data ?? []).filter((s) => s.environment === "live");
    const active = live.filter((s) => ["active", "trialing"].includes(s.status as string));
    const pastDue = live.filter((s) => s.status === "past_due").length;
    let mrrCents = 0;
    let currency = "usd";
    for (const s of active) {
      const meta = (s.metadata ?? {}) as Record<string, unknown>;
      const amount = Number(meta.unit_amount ?? meta.amount ?? 0);
      const interval =
        (meta.interval as string | undefined) ?? (meta.recurring_interval as string | undefined);
      if (Number.isFinite(amount) && amount > 0) {
        mrrCents += amount * intervalMultiplier(interval);
      }
      if (typeof meta.currency === "string") currency = meta.currency;
    }
    return { activeCount: active.length, mrrCents: Math.round(mrrCents), currency, pastDue };
  })();

  const attentionItems = [
    {
      label: "New leads awaiting triage",
      count: attention.data?.newLeads ?? 0,
      to: "/admin/leads",
    },
    {
      label: "Pending newsletter confirmations",
      count: attention.data?.pendingSubs ?? 0,
      to: "/admin/subscribers",
    },
    {
      label: "Past-due subscriptions",
      count: subMetrics.pastDue,
      to: "/admin/subscriptions",
    },
  ].filter((i) => i.count > 0);

  return (
    <div className="space-y-8">
      {/* KPI strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Kpi
          label="Total users"
          value={overview.data?.totalUsers ?? 0}
          sub={`+${overview.data?.signups.current ?? 0} in last 7 days`}
          icon={UsersIcon}
          to="/admin/users"
          loading={overview.isLoading}
        />
        <Kpi
          label="Organizations"
          value={orgsCount.data ?? 0}
          sub="across all plans"
          icon={Building2}
          to="/admin/organizations"
          loading={orgsCount.isLoading}
        />
        <Kpi
          label="Active subscriptions"
          value={subMetrics.activeCount}
          sub="live, active + trialing"
          icon={CreditCard}
          to="/admin/subscriptions"
          loading={subs.isLoading}
        />
        <Kpi
          label="MRR"
          value={fmtCurrency(subMetrics.mrrCents, subMetrics.currency)}
          sub="monthly recurring, live"
          icon={DollarSign}
          to="/admin/analytics"
          loading={subs.isLoading}
        />
      </div>

      {/* Needs attention + quick actions */}
      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-base">Needs attention</CardTitle>
            </div>
            <CardDescription>Items that may need your review.</CardDescription>
          </CardHeader>
          <CardContent>
            {attention.isLoading || subs.isLoading ? (
              <div className="py-6 grid place-items-center text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin" />
              </div>
            ) : attentionItems.length === 0 ? (
              <p className="py-6 text-sm text-muted-foreground text-center">
                Inbox zero. Nothing needs your attention right now.
              </p>
            ) : (
              <ul className="divide-y divide-border">
                {attentionItems.map((item) => (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      className="flex items-center justify-between py-3 group hover:text-primary transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Badge variant="default" className="tabular-nums">
                          {item.count}
                        </Badge>
                        <span className="text-sm">{item.label}</span>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Quick actions</CardTitle>
            <CardDescription>Common admin tasks.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button asChild variant="outline" size="sm" className="w-full justify-start">
              <Link to="/admin/broadcasts">
                <Send className="h-4 w-4" />
                New broadcast
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="w-full justify-start">
              <Link to="/admin/users">
                <UsersIcon className="h-4 w-4" />
                Manage users
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="w-full justify-start">
              <Link to="/admin/site-settings">
                <SettingsIcon className="h-4 w-4" />
                Edit site settings
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent activity */}
      <div className="grid lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Recent signups</CardTitle>
                <CardDescription>Latest new accounts.</CardDescription>
              </div>
              <Button asChild variant="ghost" size="sm">
                <Link to="/admin/users">
                  View all <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {overview.isLoading ? (
              <div className="py-6 grid place-items-center text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin" />
              </div>
            ) : !overview.data?.recentSignups.length ? (
              <p className="py-6 text-sm text-muted-foreground text-center">No signups yet.</p>
            ) : (
              <ul className="divide-y divide-border">
                {overview.data.recentSignups.slice(0, 5).map((u) => (
                  <li key={u.id} className="py-2.5 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-sm truncate">{u.email ?? "—"}</div>
                      <div className="text-xs text-muted-foreground">
                        {format(new Date(u.created_at), "MMM d, p")}
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs shrink-0">{u.provider}</Badge>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Recent leads</CardTitle>
                <CardDescription>Latest form submissions.</CardDescription>
              </div>
              <Button asChild variant="ghost" size="sm">
                <Link to="/admin/leads">
                  View all <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {recentLeads.isLoading ? (
              <div className="py-6 grid place-items-center text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin" />
              </div>
            ) : !recentLeads.data?.length ? (
              <p className="py-6 text-sm text-muted-foreground text-center">No leads yet.</p>
            ) : (
              <ul className="divide-y divide-border">
                {recentLeads.data.map((l) => (
                  <li key={l.id} className="py-2.5 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-sm truncate">{l.name || l.email}</div>
                      <div className="text-xs text-muted-foreground truncate">
                        {l.email} ·{" "}
                        {formatDistanceToNow(new Date(l.created_at), { addSuffix: true })}
                      </div>
                    </div>
                    <Badge
                      variant={l.status === "new" ? "default" : "secondary"}
                      className="text-xs shrink-0 capitalize"
                    >
                      {l.kind}
                    </Badge>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
