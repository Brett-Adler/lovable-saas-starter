import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { useUserRoles } from "@/hooks/useUserRole";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AdminShell } from "@/components/admin/AdminShell";
import type { Database } from "@/integrations/supabase/types";

type Lead = Database["public"]["Tables"]["leads"]["Row"];
type LeadKind = Database["public"]["Enums"]["lead_kind"];
type LeadStatus = Database["public"]["Enums"]["lead_status"];

const KINDS: (LeadKind | "all")[] = ["all", "contact", "demo", "waitlist", "newsletter", "other"];
const STATUSES: LeadStatus[] = ["new", "contacted", "qualified", "converted", "archived"];

const Leads = () => {
  const { isAdmin } = useUserRoles();
  const qc = useQueryClient();
  const [kind, setKind] = useState<LeadKind | "all">("all");
  const [status, setStatus] = useState<LeadStatus | "all">("all");
  const [selected, setSelected] = useState<Lead | null>(null);

  const { data: leads, isLoading } = useQuery({
    queryKey: ["admin-leads", kind, status],
    enabled: isAdmin,
    queryFn: async () => {
      let q = supabase.from("leads").select("*").order("created_at", { ascending: false }).limit(200);
      if (kind !== "all") q = q.eq("kind", kind);
      if (status !== "all") q = q.eq("status", status);
      const { data, error } = await q;
      if (error) throw error;
      return data as Lead[];
    },
  });

  const updateLead = async (id: string, patch: Partial<Pick<Lead, "status" | "notes">>) => {
    const { error } = await supabase.from("leads").update(patch).eq("id", id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Saved");
    qc.invalidateQueries({ queryKey: ["admin-leads"] });
    if (selected?.id === id) setSelected({ ...selected, ...patch } as Lead);
  };

  return (
    <AdminShell title="Leads" description="Contact, demo, and waitlist submissions.">
      <div className="flex flex-wrap gap-3 mb-6">
          <Select value={kind} onValueChange={(v) => setKind(v as LeadKind | "all")}>
            <SelectTrigger className="w-44"><SelectValue placeholder="Kind" /></SelectTrigger>
            <SelectContent>
              {KINDS.map((k) => <SelectItem key={k} value={k}>{k === "all" ? "All kinds" : k}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={(v) => setStatus(v as LeadStatus | "all")}>
            <SelectTrigger className="w-44"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Received</TableHead>
                <TableHead>Kind</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={6} className="text-center py-12"><Loader2 className="h-5 w-5 animate-spin mx-auto" /></TableCell></TableRow>
              ) : !leads?.length ? (
                <TableRow><TableCell colSpan={6} className="text-center py-12 text-muted-foreground">No leads yet.</TableCell></TableRow>
              ) : (
                leads.map((l) => (
                  <TableRow key={l.id} className="cursor-pointer" onClick={() => setSelected(l)}>
                    <TableCell className="text-xs text-muted-foreground whitespace-nowrap">{format(new Date(l.created_at), "MMM d, p")}</TableCell>
                    <TableCell><Badge variant="outline">{l.kind}</Badge></TableCell>
                    <TableCell>{l.name ?? "—"}</TableCell>
                    <TableCell className="text-sm">{l.email}</TableCell>
                    <TableCell className="max-w-[240px] truncate">{l.source ?? "—"}</TableCell>
                    <TableCell><Badge variant={l.status === "new" ? "default" : "secondary"}>{l.status}</Badge></TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      </main>

      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle>{selected.source || `${selected.kind} lead`}</SheetTitle>
                <SheetDescription>
                  From <a className="text-primary" href={`mailto:${selected.email}`}>{selected.email}</a>
                  {selected.name && ` · ${selected.name}`}
                </SheetDescription>
              </SheetHeader>
              <div className="space-y-5 mt-6">
                <div>
                  <div className="text-xs font-semibold text-muted-foreground uppercase mb-2">Message</div>
                  <div className="text-sm whitespace-pre-wrap rounded-md border border-border bg-muted/30 p-3">
                    {selected.message || "—"}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-muted-foreground uppercase mb-2">Status</div>
                  <Select value={selected.status} onValueChange={(v) => updateLead(selected.id, { status: v as LeadStatus })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <div className="text-xs font-semibold text-muted-foreground uppercase mb-2">Internal notes</div>
                  <Textarea
                    defaultValue={selected.notes ?? ""}
                    rows={4}
                    onBlur={(e) => {
                      if (e.target.value !== (selected.notes ?? "")) {
                        updateLead(selected.id, { notes: e.target.value });
                      }
                    }}
                  />
                </div>
                <div className="text-xs text-muted-foreground">
                  Received {format(new Date(selected.created_at), "PPpp")}
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Leads;
