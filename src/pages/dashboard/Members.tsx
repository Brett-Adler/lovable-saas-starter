import { useCallback, useEffect, useState } from "react";
import { z } from "zod";
import { Loader2, Mail, Trash2, UserPlus, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useOrganization, type OrgRole } from "@/hooks/useOrganization";
import { toast } from "@/hooks/use-toast";

const emailSchema = z.string().trim().email().max(255);

interface MemberRow {
  id: string;
  user_id: string;
  role: OrgRole;
  email: string | null;
  display_name: string | null;
}

interface InviteRow {
  id: string;
  email: string;
  role: OrgRole;
  token: string;
  expires_at: string;
  accepted_at: string | null;
}

const Members = () => {
  const { user } = useAuth();
  const { currentOrg, refresh } = useOrganization();
  const [members, setMembers] = useState<MemberRow[]>([]);
  const [invites, setInvites] = useState<InviteRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<OrgRole>("member");
  const [inviting, setInviting] = useState(false);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  const canManage = currentOrg?.role === "owner" || currentOrg?.role === "admin";

  const load = useCallback(async () => {
    if (!currentOrg) return;
    setLoading(true);
    const [{ data: m }, { data: i }] = await Promise.all([
      supabase
        .from("organization_members")
        .select("id, user_id, role, profiles:user_id (email, display_name)")
        .eq("organization_id", currentOrg.id),
      supabase
        .from("organization_invites")
        .select("id, email, role, token, expires_at, accepted_at")
        .eq("organization_id", currentOrg.id)
        .is("accepted_at", null)
        .order("created_at", { ascending: false }),
    ]);

    setMembers(
      (m ?? []).map((row: any) => ({
        id: row.id,
        user_id: row.user_id,
        role: row.role,
        email: row.profiles?.email ?? null,
        display_name: row.profiles?.display_name ?? null,
      })),
    );
    setInvites((i ?? []) as InviteRow[]);
    setLoading(false);
  }, [currentOrg]);

  useEffect(() => {
    load();
  }, [load]);

  if (!currentOrg) {
    return (
      <DashboardShell>
        <div className="p-6 lg:p-10 max-w-2xl mx-auto">
          <p className="text-muted-foreground">Select an organization first.</p>
        </div>
      </DashboardShell>
    );
  }

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const validated = emailSchema.parse(inviteEmail);
      setInviting(true);
      const { error } = await supabase.from("organization_invites").insert({
        organization_id: currentOrg.id,
        email: validated.toLowerCase(),
        role: inviteRole,
        invited_by: user!.id,
      });
      if (error) throw error;
      toast({ title: "Invite created", description: `Sent to ${validated}` });
      setInviteEmail("");
      setInviteRole("member");
      load();
    } catch (err) {
      const msg = err instanceof z.ZodError ? err.errors[0]?.message ?? "Invalid email" : err instanceof Error ? err.message : "Failed";
      toast({ title: "Invite failed", description: msg, variant: "destructive" });
    } finally {
      setInviting(false);
    }
  };

  const handleRoleChange = async (memberId: string, role: OrgRole) => {
    const { error } = await supabase.from("organization_members").update({ role }).eq("id", memberId);
    if (error) {
      toast({ title: "Could not update role", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Role updated" });
    load();
    refresh();
  };

  const handleRemoveMember = async (memberId: string) => {
    const { error } = await supabase.from("organization_members").delete().eq("id", memberId);
    if (error) {
      toast({ title: "Could not remove", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Member removed" });
    load();
  };

  const handleRevokeInvite = async (inviteId: string) => {
    const { error } = await supabase.from("organization_invites").delete().eq("id", inviteId);
    if (error) {
      toast({ title: "Could not revoke", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Invite revoked" });
    load();
  };

  const copyInviteLink = async (token: string) => {
    const url = `${window.location.origin}/invite/${token}`;
    await navigator.clipboard.writeText(url);
    setCopiedToken(token);
    toast({ title: "Invite link copied" });
    setTimeout(() => setCopiedToken(null), 2000);
  };

  return (
    <DashboardShell>
      <div className="p-6 lg:p-10 max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Members</h1>
          <p className="text-muted-foreground">Manage who has access to {currentOrg.name}.</p>
        </div>

        {canManage && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-primary" />
                Invite a teammate
              </CardTitle>
              <CardDescription>
                We'll create a unique invite link. Share it with your teammate to let them join.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleInvite} className="grid sm:grid-cols-[1fr_140px_auto] gap-3">
                <div className="space-y-1">
                  <Label htmlFor="invite-email" className="sr-only">Email</Label>
                  <Input
                    id="invite-email"
                    type="email"
                    placeholder="teammate@company.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    required
                  />
                </div>
                <Select value={inviteRole} onValueChange={(v) => setInviteRole(v as OrgRole)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="member">Member</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    {currentOrg.role === "owner" && (
                      <SelectItem value="owner">Owner</SelectItem>
                    )}
                  </SelectContent>
                </Select>
                <Button type="submit" disabled={inviting}>
                  {inviting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
                  Invite
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Members ({members.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="py-8 flex justify-center">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="w-[1%]" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {members.map((m) => {
                    const isMe = m.user_id === user?.id;
                    return (
                      <TableRow key={m.id}>
                        <TableCell>
                          <div className="font-medium">
                            {m.display_name ?? m.email ?? m.user_id.slice(0, 8)}
                            {isMe && <span className="text-muted-foreground"> (you)</span>}
                          </div>
                          {m.email && <div className="text-xs text-muted-foreground">{m.email}</div>}
                        </TableCell>
                        <TableCell>
                          {canManage && !isMe ? (
                            <Select value={m.role} onValueChange={(v) => handleRoleChange(m.id, v as OrgRole)}>
                              <SelectTrigger className="w-[120px] h-8">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="member">Member</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                                {currentOrg.role === "owner" && (
                                  <SelectItem value="owner">Owner</SelectItem>
                                )}
                              </SelectContent>
                            </Select>
                          ) : (
                            <Badge variant="secondary" className="capitalize">{m.role}</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {canManage && !isMe && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveMember(m.id)}
                              aria-label="Remove member"
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {canManage && invites.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Pending invites ({invites.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Expires</TableHead>
                    <TableHead className="w-[1%]" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invites.map((inv) => (
                    <TableRow key={inv.id}>
                      <TableCell className="font-medium">{inv.email}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="capitalize">{inv.role}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(inv.expires_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => copyInviteLink(inv.token)}
                          aria-label="Copy invite link"
                        >
                          {copiedToken === inv.token ? (
                            <Check className="h-4 w-4 text-primary" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRevokeInvite(inv.id)}
                          aria-label="Revoke invite"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardShell>
  );
};

export default Members;
