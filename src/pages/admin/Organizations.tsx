import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Search } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useUserRoles } from "@/hooks/useUserRole";
import { supabase } from "@/integrations/supabase/client";
import { AdminShell } from "@/components/admin/AdminShell";

type Org = {
  id: string;
  name: string;
  slug: string;
  plan: string;
  logo_url: string | null;
  created_at: string;
  created_by: string | null;
};

type Member = { organization_id: string; user_id: string; role: string };
type Profile = { id: string; email: string | null; display_name: string | null };
type SubRow = { organization_id: string | null; status: string; product_name: string | null; current_period_end: string | null; environment: string };

const Organizations = () => {
  const { isAdmin } = useUserRoles();
  const [q, setQ] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-orgs"],
    enabled: isAdmin,
    queryFn: async () => {
      const [orgsRes, membersRes, profilesRes, subsRes] = await Promise.all([
        supabase.from("organizations").select("id,name,slug,plan,logo_url,created_at,created_by").order("created_at", { ascending: false }).limit(1000),
        supabase.from("organization_members").select("organization_id,user_id,role"),
        supabase.from("profiles").select("id,email,display_name"),
        supabase.from("subscriptions").select("organization_id,status,product_name,current_period_end,environment").not("organization_id", "is", null),
      ]);
      if (orgsRes.error) throw orgsRes.error;
      if (membersRes.error) throw membersRes.error;
      if (profilesRes.error) throw profilesRes.error;
      if (subsRes.error) throw subsRes.error;

      const membersByOrg = new Map<string, Member[]>();
      for (const m of (membersRes.data ?? []) as Member[]) {
        const arr = membersByOrg.get(m.organization_id) ?? [];
        arr.push(m);
        membersByOrg.set(m.organization_id, arr);
      }
      const profileById = new Map<string, Profile>();
      for (const p of (profilesRes.data ?? []) as Profile[]) profileById.set(p.id, p);
      const subsByOrg = new Map<string, SubRow[]>();
      for (const s of (subsRes.data ?? []) as SubRow[]) {
        if (!s.organization_id) continue;
        const arr = subsByOrg.get(s.organization_id) ?? [];
        arr.push(s);
        subsByOrg.set(s.organization_id, arr);
      }
      return { orgs: orgsRes.data as Org[], membersByOrg, profileById, subsByOrg };
    },
  });

  const orgs = data?.orgs ?? [];
  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return orgs;
    return orgs.filter((o) => o.name.toLowerCase().includes(needle) || o.slug.toLowerCase().includes(needle));
  }, [orgs, q]);

  const selected = orgs.find((o) => o.id === selectedId) ?? null;

  return (
    <AdminShell title="Organizations" description="Every workspace on the platform.">
      <div className="relative max-w-sm mb-4">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search name or slug…" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>

        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Members</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={6} className="text-center py-12"><Loader2 className="h-5 w-5 animate-spin mx-auto" /></TableCell></TableRow>
              ) : !filtered.length ? (
                <TableRow><TableCell colSpan={6} className="text-center py-12 text-muted-foreground">No organizations found.</TableCell></TableRow>
              ) : filtered.map((o) => {
                const members = data?.membersByOrg.get(o.id) ?? [];
                const owner = members.find((m) => m.role === "owner");
                const ownerProfile = owner ? data?.profileById.get(owner.user_id) : null;
                return (
                  <TableRow key={o.id} className="cursor-pointer" onClick={() => setSelectedId(o.id)}>
                    <TableCell className="font-medium">{o.name}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{o.slug}</TableCell>
                    <TableCell><Badge variant="outline">{o.plan}</Badge></TableCell>
                    <TableCell className="text-xs">{members.length}</TableCell>
                    <TableCell className="text-xs">{ownerProfile?.email ?? "—"}</TableCell>
                    <TableCell className="text-xs whitespace-nowrap text-muted-foreground">{format(new Date(o.created_at), "MMM d, yyyy")}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>
      </main>

      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelectedId(null)}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle>{selected.name}</SheetTitle>
                <SheetDescription>Slug: <code>{selected.slug}</code> · Plan: {selected.plan}</SheetDescription>
              </SheetHeader>
              <div className="space-y-5 mt-6 text-sm">
                <div>
                  <div className="text-xs font-semibold text-muted-foreground uppercase mb-2">Members</div>
                  <ul className="space-y-1.5">
                    {(data?.membersByOrg.get(selected.id) ?? []).map((m) => {
                      const p = data?.profileById.get(m.user_id);
                      return (
                        <li key={m.user_id} className="flex items-center justify-between gap-2">
                          <span className="truncate">{p?.email ?? m.user_id}</span>
                          <Badge variant={m.role === "owner" ? "default" : "secondary"}>{m.role}</Badge>
                        </li>
                      );
                    })}
                  </ul>
                </div>
                <div>
                  <div className="text-xs font-semibold text-muted-foreground uppercase mb-2">Subscriptions</div>
                  {(data?.subsByOrg.get(selected.id) ?? []).length === 0 ? (
                    <p className="text-muted-foreground text-sm">No subscription on file.</p>
                  ) : (
                    <ul className="space-y-1.5">
                      {(data?.subsByOrg.get(selected.id) ?? []).map((s, i) => (
                        <li key={i} className="flex items-center justify-between gap-2">
                          <span className="truncate">{s.product_name ?? "Plan"} <span className="text-xs text-muted-foreground">({s.environment})</span></span>
                          <Badge variant={s.status === "active" || s.status === "trialing" ? "default" : "secondary"}>{s.status}</Badge>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="text-xs text-muted-foreground">Created {format(new Date(selected.created_at), "PPpp")}</div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Organizations;
