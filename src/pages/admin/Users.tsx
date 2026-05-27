import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Search, Shield, ShieldOff } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useUserRoles } from "@/hooks/useUserRole";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AdminShell } from "@/components/admin/AdminShell";

type AuthUser = {
  id: string;
  email: string | null;
  last_sign_in_at: string | null;
  created_at: string | null;
  email_confirmed_at: string | null;
  providers: string[];
  banned_until: string | null;
};

type Profile = {
  id: string;
  email: string | null;
  display_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  created_at: string;
};

type Row = Profile & {
  auth?: AuthUser;
  roles: string[];
  org_count: number;
};

const Users = () => {
  const { isAdmin } = useUserRoles();
  const qc = useQueryClient();
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<Row | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-users"],
    enabled: isAdmin,
    queryFn: async () => {
      const [profilesRes, rolesRes, membersRes, authRes] = await Promise.all([
        supabase.from("profiles").select("id,email,display_name,avatar_url,phone,created_at").order("created_at", { ascending: false }).limit(1000),
        supabase.from("user_roles").select("user_id,role"),
        supabase.from("organization_members").select("user_id"),
        supabase.functions.invoke<{ users: AuthUser[] }>("admin-list-users", { method: "POST" }),
      ]);
      if (profilesRes.error) throw profilesRes.error;
      if (rolesRes.error) throw rolesRes.error;
      if (membersRes.error) throw membersRes.error;

      const rolesByUser = new Map<string, string[]>();
      for (const r of rolesRes.data ?? []) {
        const arr = rolesByUser.get(r.user_id) ?? [];
        arr.push(r.role);
        rolesByUser.set(r.user_id, arr);
      }
      const orgCountByUser = new Map<string, number>();
      for (const m of membersRes.data ?? []) {
        orgCountByUser.set(m.user_id, (orgCountByUser.get(m.user_id) ?? 0) + 1);
      }
      const authByUser = new Map<string, AuthUser>();
      for (const u of authRes.data?.users ?? []) authByUser.set(u.id, u);

      return (profilesRes.data as Profile[]).map<Row>((p) => ({
        ...p,
        roles: rolesByUser.get(p.id) ?? [],
        org_count: orgCountByUser.get(p.id) ?? 0,
        auth: authByUser.get(p.id),
      }));
    },
  });

  const filtered = useMemo(() => {
    if (!data) return [];
    const needle = q.trim().toLowerCase();
    if (!needle) return data;
    return data.filter((r) =>
      (r.email ?? "").toLowerCase().includes(needle) ||
      (r.display_name ?? "").toLowerCase().includes(needle),
    );
  }, [data, q]);

  const toggleAdmin = async (row: Row) => {
    const has = row.roles.includes("admin");
    if (has) {
      const { error } = await supabase.from("user_roles").delete().eq("user_id", row.id).eq("role", "admin");
      if (error) return toast.error(error.message);
      toast.success("Admin revoked");
    } else {
      const { error } = await supabase.from("user_roles").insert({ user_id: row.id, role: "admin" });
      if (error) return toast.error(error.message);
      toast.success("Admin granted");
    }
    qc.invalidateQueries({ queryKey: ["admin-users"] });
    if (selected?.id === row.id) {
      setSelected({
        ...selected,
        roles: has ? selected.roles.filter((r) => r !== "admin") : [...selected.roles, "admin"],
      });
    }
  };

  if (rolesLoading) return <div className="min-h-screen grid place-items-center"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  if (!isAdmin) {
    return (
      <div className="min-h-screen grid place-items-center p-6">
        <Card className="max-w-md w-full">
          <CardHeader><CardTitle>Admins only</CardTitle><CardDescription>You don't have permission to view this page.</CardDescription></CardHeader>
          <CardContent><Button asChild variant="outline" className="w-full"><Link to="/dashboard"><ArrowLeft className="h-4 w-4" />Back to dashboard</Link></Button></CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container flex items-center justify-between py-4">
          <Logo />
          <Button variant="outline" size="sm" onClick={signOut}>Sign out</Button>
        </div>
      </header>
      <main className="container py-12 max-w-6xl">
        <Button asChild variant="ghost" size="sm" className="mb-4"><Link to="/admin"><ArrowLeft className="h-4 w-4" />Back to admin</Link></Button>
        <h1 className="text-3xl font-bold mb-2">Users</h1>
        <p className="text-muted-foreground mb-6">Every account on the platform.</p>

        <div className="relative max-w-sm mb-4">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search email or name…" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>

        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Roles</TableHead>
                <TableHead>Provider</TableHead>
                <TableHead>Last sign-in</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Orgs</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={6} className="text-center py-12"><Loader2 className="h-5 w-5 animate-spin mx-auto" /></TableCell></TableRow>
              ) : !filtered.length ? (
                <TableRow><TableCell colSpan={6} className="text-center py-12 text-muted-foreground">No users found.</TableCell></TableRow>
              ) : filtered.map((r) => (
                <TableRow key={r.id} className="cursor-pointer" onClick={() => setSelected(r)}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        {r.avatar_url && <AvatarImage src={r.avatar_url} alt="" />}
                        <AvatarFallback className="text-xs">{(r.display_name ?? r.email ?? "?").slice(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <div className="font-medium truncate">{r.display_name ?? "—"}</div>
                        <div className="text-xs text-muted-foreground truncate">{r.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {r.roles.length ? r.roles.map((role) => (
                        <Badge key={role} variant={role === "admin" ? "default" : "secondary"}>{role}</Badge>
                      )) : <span className="text-xs text-muted-foreground">—</span>}
                    </div>
                  </TableCell>
                  <TableCell className="text-xs">
                    {r.auth?.providers?.length ? r.auth.providers.join(", ") : <span className="text-muted-foreground">—</span>}
                  </TableCell>
                  <TableCell className="text-xs whitespace-nowrap">
                    {r.auth?.last_sign_in_at ? format(new Date(r.auth.last_sign_in_at), "MMM d, p") : <span className="text-muted-foreground">Never</span>}
                  </TableCell>
                  <TableCell className="text-xs whitespace-nowrap text-muted-foreground">{format(new Date(r.created_at), "MMM d, yyyy")}</TableCell>
                  <TableCell className="text-xs">{r.org_count}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </main>

      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle>{selected.display_name ?? selected.email}</SheetTitle>
                <SheetDescription>
                  <a className="text-primary" href={`mailto:${selected.email}`}>{selected.email}</a>
                </SheetDescription>
              </SheetHeader>
              <div className="space-y-5 mt-6 text-sm">
                <div className="grid grid-cols-2 gap-3">
                  <div><div className="text-xs text-muted-foreground">Joined</div>{format(new Date(selected.created_at), "PP")}</div>
                  <div><div className="text-xs text-muted-foreground">Last sign-in</div>{selected.auth?.last_sign_in_at ? format(new Date(selected.auth.last_sign_in_at), "PPp") : "Never"}</div>
                  <div><div className="text-xs text-muted-foreground">Email confirmed</div>{selected.auth?.email_confirmed_at ? "Yes" : "No"}</div>
                  <div><div className="text-xs text-muted-foreground">Providers</div>{selected.auth?.providers?.join(", ") || "—"}</div>
                  <div><div className="text-xs text-muted-foreground">Phone</div>{selected.phone ?? "—"}</div>
                  <div><div className="text-xs text-muted-foreground">Organizations</div>{selected.org_count}</div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-muted-foreground uppercase mb-2">Roles</div>
                  <div className="flex flex-wrap gap-1">
                    {selected.roles.length ? selected.roles.map((r) => <Badge key={r}>{r}</Badge>) : <span className="text-muted-foreground">user</span>}
                  </div>
                </div>
                <div className="pt-2 border-t border-border">
                  <Button
                    variant={selected.roles.includes("admin") ? "destructive" : "default"}
                    size="sm"
                    onClick={() => toggleAdmin(selected)}
                  >
                    {selected.roles.includes("admin") ? <><ShieldOff className="h-4 w-4" />Revoke admin</> : <><Shield className="h-4 w-4" />Grant admin</>}
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Users;
