import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { Loader2, Save, Trash2, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { supabase } from "@/integrations/supabase/client";
import { useOrganization } from "@/hooks/useOrganization";
import { toast } from "@/hooks/use-toast";

const nameSchema = z.string().trim().min(2).max(60);

const OrganizationSettings = () => {
  const navigate = useNavigate();
  const { currentOrg, refresh } = useOrganization();
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    setName(currentOrg?.name ?? "");
  }, [currentOrg]);

  if (!currentOrg) {
    return (
      <DashboardShell>
        <div className="p-6 lg:p-10 max-w-2xl mx-auto">
          <p className="text-muted-foreground">Select an organization first.</p>
        </div>
      </DashboardShell>
    );
  }

  const canManage = currentOrg.role === "owner" || currentOrg.role === "admin";
  const isOwner = currentOrg.role === "owner";

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const validated = nameSchema.parse(name);
      setSaving(true);
      const { error } = await supabase
        .from("organizations")
        .update({ name: validated })
        .eq("id", currentOrg.id);
      if (error) throw error;
      await refresh();
      toast({ title: "Saved" });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to save";
      toast({ title: "Save failed", description: msg, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    const { error } = await supabase.from("organizations").delete().eq("id", currentOrg.id);
    setDeleting(false);
    if (error) {
      toast({ title: "Delete failed", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Organization deleted" });
    await refresh();
    navigate("/dashboard");
  };

  return (
    <DashboardShell>
      <div className="p-6 lg:p-10 max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Organization settings</h1>
          <p className="text-muted-foreground">Manage details for {currentOrg.name}.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>General</CardTitle>
            <CardDescription>Update your organization's display name.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="org-name">Name</Label>
                <Input
                  id="org-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={!canManage}
                />
              </div>
              <div className="space-y-2">
                <Label>Slug</Label>
                <Input value={currentOrg.slug} disabled />
              </div>
              {canManage && (
                <Button type="submit" disabled={saving}>
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Save
                </Button>
              )}
            </form>
          </CardContent>
        </Card>

        {isOwner && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <KeyRound className="h-4 w-4" /> Single Sign-On
              </CardTitle>
              <CardDescription>
                Connect your SAML identity provider so your team signs in with corporate credentials.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline">
                <Link to="/dashboard/organization/sso">Configure SSO</Link>
              </Button>
            </CardContent>
          </Card>
        )}



        {isOwner && (
          <Card className="border-destructive/40">
            <CardHeader>
              <CardTitle className="text-destructive">Danger zone</CardTitle>
              <CardDescription>
                Deleting an organization removes all members, invites, and data permanently.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash2 className="h-4 w-4" />
                    Delete organization
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete {currentOrg.name}?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. All organization data will be permanently removed.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      disabled={deleting}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      {deleting && <Loader2 className="h-4 w-4 animate-spin" />}
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardShell>
  );
};

export default OrganizationSettings;
