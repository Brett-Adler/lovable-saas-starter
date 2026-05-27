import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AdminShell } from "@/components/admin/AdminShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Plus, Trash2, Save, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const COMPONENT_STATUSES = [
  { value: "operational", label: "Operational" },
  { value: "degraded", label: "Degraded performance" },
  { value: "partial_outage", label: "Partial outage" },
  { value: "major_outage", label: "Major outage" },
  { value: "maintenance", label: "Maintenance" },
];

const INCIDENT_SEVERITIES = ["minor", "major", "critical", "maintenance"];
const INCIDENT_STATUSES = ["investigating", "identified", "monitoring", "resolved"];

const AdminStatus = () => {
  const qc = useQueryClient();

  const { data: components } = useQuery({
    queryKey: ["admin-status-components"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("status_components")
        .select("*")
        .order("position");
      if (error) throw error;
      return data ?? [];
    },
  });

  const { data: incidents } = useQuery({
    queryKey: ["admin-status-incidents"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("status_incidents")
        .select("*")
        .order("started_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return data ?? [];
    },
  });

  const updateComponent = async (id: string, patch: Record<string, unknown>) => {
    const { error } = await supabase.from("status_components").update(patch).eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success("Updated");
      qc.invalidateQueries({ queryKey: ["admin-status-components"] });
      qc.invalidateQueries({ queryKey: ["status-components"] });
    }
  };

  const addComponent = async () => {
    const name = prompt("Component name?");
    if (!name) return;
    const pos = (components?.length ?? 0) + 1;
    const { error } = await supabase.from("status_components").insert({ name, position: pos });
    if (error) toast.error(error.message);
    else qc.invalidateQueries({ queryKey: ["admin-status-components"] });
  };

  const deleteComponent = async (id: string) => {
    if (!confirm("Delete this component?")) return;
    const { error } = await supabase.from("status_components").delete().eq("id", id);
    if (error) toast.error(error.message);
    else qc.invalidateQueries({ queryKey: ["admin-status-components"] });
  };

  // Incident form
  const [incForm, setIncForm] = useState({
    title: "",
    body_md: "",
    severity: "minor",
    status: "investigating",
  });

  const createIncident = async () => {
    if (!incForm.title.trim()) {
      toast.error("Title required");
      return;
    }
    const { error } = await supabase.from("status_incidents").insert({
      title: incForm.title.trim(),
      body_md: incForm.body_md || null,
      severity: incForm.severity,
      status: incForm.status,
    });
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Incident posted");
    setIncForm({ title: "", body_md: "", severity: "minor", status: "investigating" });
    qc.invalidateQueries({ queryKey: ["admin-status-incidents"] });
    qc.invalidateQueries({ queryKey: ["status-incidents"] });
  };

  const updateIncident = async (id: string, patch: Record<string, unknown>) => {
    const { error } = await supabase.from("status_incidents").update(patch).eq("id", id);
    if (error) toast.error(error.message);
    else {
      qc.invalidateQueries({ queryKey: ["admin-status-incidents"] });
      qc.invalidateQueries({ queryKey: ["status-incidents"] });
    }
  };

  const resolveIncident = (id: string) =>
    updateIncident(id, { status: "resolved", resolved_at: new Date().toISOString() });

  const deleteIncident = async (id: string) => {
    if (!confirm("Delete this incident?")) return;
    const { error } = await supabase.from("status_incidents").delete().eq("id", id);
    if (error) toast.error(error.message);
    else {
      qc.invalidateQueries({ queryKey: ["admin-status-incidents"] });
      qc.invalidateQueries({ queryKey: ["status-incidents"] });
    }
  };

  return (
    <AdminShell
      title="Status page"
      description="Edit components and post incidents shown on /status."
    >
      <div className="space-y-8">
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Components</h2>
            <Button size="sm" variant="outline" onClick={addComponent}>
              <Plus className="h-4 w-4" />
              Add component
            </Button>
          </div>
          <div className="space-y-3">
            {(components ?? []).map((c) => (
              <div key={c.id} className="flex items-center gap-3 flex-wrap border border-border rounded-md p-3">
                <Input
                  defaultValue={c.name}
                  onBlur={(e) => e.target.value !== c.name && updateComponent(c.id, { name: e.target.value })}
                  className="flex-1 min-w-[140px]"
                />
                <Select
                  value={c.current_status}
                  onValueChange={(v) => updateComponent(c.id, { current_status: v })}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {COMPONENT_STATUSES.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="ghost" size="icon" onClick={() => deleteComponent(c.id)} className="text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="font-semibold mb-4">Post new incident</h2>
          <div className="space-y-3">
            <div>
              <Label htmlFor="inc-title">Title</Label>
              <Input
                id="inc-title"
                value={incForm.title}
                onChange={(e) => setIncForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="Elevated API errors"
              />
            </div>
            <div>
              <Label htmlFor="inc-body">Details (Markdown)</Label>
              <Textarea
                id="inc-body"
                value={incForm.body_md}
                onChange={(e) => setIncForm((f) => ({ ...f, body_md: e.target.value }))}
                rows={3}
                placeholder="What's happening, who's affected, what's the ETA…"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Severity</Label>
                <Select value={incForm.severity} onValueChange={(v) => setIncForm((f) => ({ ...f, severity: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {INCIDENT_SEVERITIES.map((s) => (
                      <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Status</Label>
                <Select value={incForm.status} onValueChange={(v) => setIncForm((f) => ({ ...f, status: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {INCIDENT_STATUSES.map((s) => (
                      <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button onClick={createIncident}>
              <Save className="h-4 w-4" />
              Post incident
            </Button>
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="font-semibold mb-4">Incidents</h2>
          {(incidents ?? []).length === 0 ? (
            <p className="text-sm text-muted-foreground">No incidents posted.</p>
          ) : (
            <div className="space-y-3">
              {(incidents ?? []).map((inc) => (
                <div key={inc.id} className="border border-border rounded-md p-3">
                  <div className="flex items-center justify-between gap-2 flex-wrap mb-2">
                    <p className="font-medium">{inc.title}</p>
                    <div className="flex items-center gap-2">
                      <Select value={inc.status} onValueChange={(v) => updateIncident(inc.id, { status: v, resolved_at: v === "resolved" ? new Date().toISOString() : null })}>
                        <SelectTrigger className="w-[140px] h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {INCIDENT_STATUSES.map((s) => (
                            <SelectItem key={s} value={s} className="capitalize text-xs">{s}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {inc.status !== "resolved" && (
                        <Button size="sm" variant="outline" onClick={() => resolveIncident(inc.id)}>
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Resolve
                        </Button>
                      )}
                      <Button size="icon" variant="ghost" onClick={() => deleteIncident(inc.id)} className="text-destructive h-8 w-8">
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                  {inc.body_md && <p className="text-sm text-muted-foreground whitespace-pre-wrap">{inc.body_md}</p>}
                  <p className="text-xs text-muted-foreground mt-2">
                    {new Date(inc.started_at).toLocaleString()}
                    {inc.resolved_at && ` · resolved ${new Date(inc.resolved_at).toLocaleString()}`}
                  </p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </AdminShell>
  );
};

export default AdminStatus;
