import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Loader2, Search } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useUserRoles } from "@/hooks/useUserRole";

type Row = {
  id: string;
  actor_user_id: string | null;
  actor_email: string | null;
  organization_id: string | null;
  action: string;
  target_type: string | null;
  target_id: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
};

const ACTIONS = [
  "all",
  "member.added",
  "member.role_changed",
  "member.removed",
  "invite.created",
  "invite.revoked",
  "role.granted",
  "role.revoked",
];

const Audit = () => {
  const { isAdmin } = useUserRoles();
  const [action, setAction] = useState<string>("all");
  const [search, setSearch] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["admin-audit", action],
    enabled: isAdmin,
    queryFn: async () => {
      let q = supabase
        .from("audit_log")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(300);
      if (action !== "all") q = q.eq("action", action);
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as unknown as Row[];
    },
  });

  const rows = (data ?? []).filter((r) => {
    if (!search) return true;
    const hay = `${r.actor_email ?? ""} ${r.action} ${r.target_id ?? ""} ${JSON.stringify(r.metadata)}`.toLowerCase();
    return hay.includes(search.toLowerCase());
  });

  return (
    <AdminShell
      title="Audit log"
      description="Every privileged action — member changes, role grants, invites — in chronological order."
      maxWidth="7xl"
    >
      <Card className="p-4 mb-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by actor, target, or metadata…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={action} onValueChange={setAction}>
          <SelectTrigger className="w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ACTIONS.map((a) => (
              <SelectItem key={a} value={a}>
                {a === "all" ? "All actions" : a}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Card>

      <Card>
        {isLoading ? (
          <div className="py-16 grid place-items-center text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
        ) : rows.length === 0 ? (
          <div className="py-16 text-center text-muted-foreground text-sm">
            No audit entries match your filters.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>When</TableHead>
                <TableHead>Actor</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Target</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                    {format(new Date(r.created_at), "MMM d, yyyy HH:mm")}
                  </TableCell>
                  <TableCell className="text-sm">
                    {r.actor_email ?? (
                      <span className="text-muted-foreground italic">system</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-mono text-xs">
                      {r.action}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground font-mono">
                    {r.target_type ? `${r.target_type}` : "—"}
                    {r.target_id && (
                      <span className="block truncate max-w-[200px]">{r.target_id}</span>
                    )}
                  </TableCell>
                  <TableCell className="text-xs max-w-[320px]">
                    {Object.keys(r.metadata ?? {}).length > 0 ? (
                      <code className="text-[11px] text-muted-foreground line-clamp-2 block">
                        {JSON.stringify(r.metadata)}
                      </code>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </AdminShell>
  );
};

export default Audit;
