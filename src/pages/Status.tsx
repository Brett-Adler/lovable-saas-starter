import { useQuery } from "@tanstack/react-query";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { PageSeo } from "@/components/seo/PageSeo";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, AlertTriangle, AlertCircle, Wrench, Info } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type ComponentStatus = "operational" | "degraded" | "partial_outage" | "major_outage" | "maintenance";
type IncidentStatus = "investigating" | "identified" | "monitoring" | "resolved";

const statusStyles: Record<ComponentStatus, { label: string; className: string; Icon: typeof CheckCircle2 }> = {
  operational: { label: "Operational", className: "border-success/30 bg-success/10 text-success", Icon: CheckCircle2 },
  degraded: { label: "Degraded performance", className: "border-warning/30 bg-warning/10 text-warning", Icon: AlertTriangle },
  partial_outage: { label: "Partial outage", className: "border-warning/30 bg-warning/10 text-warning", Icon: AlertTriangle },
  major_outage: { label: "Major outage", className: "border-destructive/30 bg-destructive/10 text-destructive", Icon: AlertCircle },
  maintenance: { label: "Maintenance", className: "border-muted-foreground/30 bg-muted text-muted-foreground", Icon: Wrench },
};

const overallStatus = (statuses: ComponentStatus[]): { label: string; tone: "ok" | "warn" | "bad" | "maint" } => {
  if (statuses.some((s) => s === "major_outage")) return { label: "Major outage in progress", tone: "bad" };
  if (statuses.some((s) => s === "partial_outage")) return { label: "Partial outage in progress", tone: "warn" };
  if (statuses.some((s) => s === "degraded")) return { label: "Some systems degraded", tone: "warn" };
  if (statuses.some((s) => s === "maintenance")) return { label: "Scheduled maintenance", tone: "maint" };
  return { label: "All systems operational", tone: "ok" };
};

const Status = () => {
  const { data: components } = useQuery({
    queryKey: ["status-components"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("status_components")
        .select("id, name, description, current_status, position")
        .order("position");
      if (error) throw error;
      return data ?? [];
    },
    refetchInterval: 60_000,
  });

  const { data: incidents } = useQuery({
    queryKey: ["status-incidents"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("status_incidents")
        .select("id, title, body_md, severity, status, started_at, resolved_at")
        .order("started_at", { ascending: false })
        .limit(20);
      if (error) throw error;
      return data ?? [];
    },
    refetchInterval: 60_000,
  });

  const activeIncidents = (incidents ?? []).filter((i) => (i.status as IncidentStatus) !== "resolved");
  const pastIncidents = (incidents ?? []).filter((i) => (i.status as IncidentStatus) === "resolved");

  const overall = overallStatus(((components ?? []).map((c) => c.current_status as ComponentStatus)));

  const overallToneClass = {
    ok: "border-success/30 bg-success/10 text-success",
    warn: "border-warning/30 bg-warning/10 text-warning",
    bad: "border-destructive/30 bg-destructive/10 text-destructive",
    maint: "border-muted-foreground/30 bg-muted text-muted-foreground",
  }[overall.tone];

  return (
    <MarketingLayout>
      <PageSeo
        path="/status"
        title="System status"
        description="Live status of every system that powers the product."
      />
      <section className="container py-16 md:py-20 max-w-3xl">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">System status</h1>
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${overallToneClass}`}>
            <CheckCircle2 className="h-4 w-4" />
            <span className="font-medium">{overall.label}</span>
          </div>
        </div>

        <Alert className="mb-8">
          <Info className="h-4 w-4" />
          <AlertDescription className="text-xs">
            Status here is reported from inside the app and updated by the team. For independent uptime
            monitoring, connect a third-party monitor (BetterStack, Instatus, Statuspage).
          </AlertDescription>
        </Alert>

        {activeIncidents.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-3">Active incidents</h2>
            <div className="space-y-3">
              {activeIncidents.map((inc) => (
                <Card key={inc.id} className="p-5">
                  <div className="flex items-start justify-between gap-3 mb-2 flex-wrap">
                    <h3 className="font-semibold">{inc.title}</h3>
                    <div className="flex gap-1.5">
                      <Badge variant="outline" className="text-[10px] capitalize">{inc.severity}</Badge>
                      <Badge variant="outline" className="text-[10px] capitalize">{inc.status}</Badge>
                    </div>
                  </div>
                  {inc.body_md && (
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{inc.body_md}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-3">
                    Started {new Date(inc.started_at).toLocaleString()}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        )}

        <h2 className="text-lg font-semibold mb-3">Components</h2>
        <Card className="divide-y divide-border">
          {(components ?? []).map((c) => {
            const s = statusStyles[c.current_status as ComponentStatus];
            return (
              <div key={c.id} className="flex items-center justify-between px-5 py-4 gap-4">
                <div className="min-w-0">
                  <p className="font-medium">{c.name}</p>
                  {c.description && (
                    <p className="text-xs text-muted-foreground truncate">{c.description}</p>
                  )}
                </div>
                <Badge variant="outline" className={`gap-1.5 ${s.className}`}>
                  <s.Icon className="h-3.5 w-3.5" />
                  {s.label}
                </Badge>
              </div>
            );
          })}
        </Card>

        <div className="mt-10">
          <h2 className="text-lg font-semibold mb-3">Incident history</h2>
          {pastIncidents.length === 0 ? (
            <Card className="p-6 text-sm text-muted-foreground">
              No resolved incidents on record.
            </Card>
          ) : (
            <div className="space-y-3">
              {pastIncidents.map((inc) => (
                <Card key={inc.id} className="p-4">
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <p className="font-medium">{inc.title}</p>
                    <span className="text-xs text-muted-foreground">
                      {new Date(inc.started_at).toLocaleDateString()}
                      {inc.resolved_at && ` → ${new Date(inc.resolved_at).toLocaleDateString()}`}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </MarketingLayout>
  );
};

export default Status;
