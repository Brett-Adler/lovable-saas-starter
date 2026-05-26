import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Download, Loader2, MailMinus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/Logo";
import { useAuth } from "@/hooks/useAuth";
import { useUserRoles } from "@/hooks/useUserRole";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

type Subscriber = {
  id: string;
  email: string;
  name: string | null;
  status: string;
  source: string | null;
  subscribed_at: string;
  confirmed_at: string | null;
  unsubscribed_at: string | null;
};

const STATUSES = ["all", "subscribed", "pending", "unsubscribed", "bounced"] as const;

export default function AdminSubscribers() {
  const { isAdmin, loading } = useUserRoles();
  const { signOut } = useAuth();
  const [rows, setRows] = useState<Subscriber[]>([]);
  const [fetching, setFetching] = useState(true);
  const [status, setStatus] = useState<(typeof STATUSES)[number]>("all");
  const [search, setSearch] = useState("");

  const load = async () => {
    setFetching(true);
    let q = supabase
      .from("marketing_subscribers")
      .select("id,email,name,status,source,subscribed_at,confirmed_at,unsubscribed_at")
      .order("subscribed_at", { ascending: false })
      .limit(1000);
    if (status !== "all") q = q.eq("status", status as never);
    const { data, error } = await q;
    if (error) toast.error(error.message);
    else setRows((data as Subscriber[]) ?? []);
    setFetching(false);
  };

  useEffect(() => {
    if (isAdmin) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin, status]);

  const filtered = useMemo(() => {
    if (!search.trim()) return rows;
    const q = search.toLowerCase().trim();
    return rows.filter((r) => r.email.toLowerCase().includes(q) || r.name?.toLowerCase().includes(q));
  }, [rows, search]);

  const counts = useMemo(() => {
    const c = { subscribed: 0, pending: 0, unsubscribed: 0 };
    for (const r of rows) {
      if (r.status === "subscribed") c.subscribed++;
      else if (r.status === "pending") c.pending++;
      else if (r.status === "unsubscribed") c.unsubscribed++;
    }
    return c;
  }, [rows]);

  const unsubscribe = async (id: string) => {
    if (!confirm("Mark this subscriber as unsubscribed?")) return;
    const { error } = await supabase
      .from("marketing_subscribers")
      .update({ status: "unsubscribed" as never, unsubscribed_at: new Date().toISOString() } as never)
      .eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success("Subscriber unsubscribed");
      load();
    }
  };

  const exportCsv = () => {
    const header = ["email", "name", "status", "source", "subscribed_at", "confirmed_at"];
    const lines = [header.join(",")];
    for (const r of filtered) {
      lines.push([
        r.email,
        (r.name ?? "").replace(/"/g, '""'),
        r.status,
        r.source ?? "",
        r.subscribed_at,
        r.confirmed_at ?? "",
      ].map((v) => `"${v}"`).join(","));
    }
    const blob = new Blob([lines.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `subscribers-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen grid place-items-center p-6">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Admins only</CardTitle>
            <CardDescription>You don't have permission to view this page.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link to="/dashboard"><ArrowLeft className="h-4 w-4" />Back</Link>
            </Button>
          </CardContent>
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
        <Button asChild variant="ghost" size="sm" className="mb-4">
          <Link to="/admin"><ArrowLeft className="h-4 w-4" />Back to admin</Link>
        </Button>
        <h1 className="text-3xl font-bold mb-2">Newsletter subscribers</h1>
        <p className="text-muted-foreground mb-6">
          Curtis is tracking {counts.subscribed} confirmed, {counts.pending} pending, and{" "}
          {counts.unsubscribed} unsubscribed.
        </p>

        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-wrap items-end gap-3 mb-4">
              <div className="flex-1 min-w-[200px]">
                <Label htmlFor="search" className="sr-only">Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  <Input
                    id="search"
                    placeholder="Search email or name…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              <div className="w-44">
                <Label htmlFor="status-filter" className="sr-only">Status</Label>
                <Select value={status} onValueChange={(v) => setStatus(v as never)}>
                  <SelectTrigger id="status-filter"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <Button variant="outline" onClick={exportCsv} disabled={!filtered.length}>
                <Download className="h-4 w-4" /> Export CSV
              </Button>
            </div>

            {fetching ? (
              <div className="py-12 text-center text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin mx-auto" />
              </div>
            ) : filtered.length === 0 ? (
              <p className="py-12 text-center text-muted-foreground">No subscribers match.</p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead>Subscribed</TableHead>
                      <TableHead>Confirmed</TableHead>
                      <TableHead className="w-[100px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((r) => (
                      <TableRow key={r.id}>
                        <TableCell className="font-medium">{r.email}{r.name && <span className="block text-xs text-muted-foreground">{r.name}</span>}</TableCell>
                        <TableCell>
                          <Badge variant={r.status === "subscribed" ? "default" : r.status === "pending" ? "secondary" : "outline"}>
                            {r.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{r.source ?? "—"}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{new Date(r.subscribed_at).toLocaleDateString()}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{r.confirmed_at ? new Date(r.confirmed_at).toLocaleDateString() : "—"}</TableCell>
                        <TableCell>
                          {r.status !== "unsubscribed" && (
                            <Button size="sm" variant="ghost" onClick={() => unsubscribe(r.id)} aria-label={`Unsubscribe ${r.email}`}>
                              <MailMinus className="h-4 w-4" />
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
