import { useState } from "react";
import { Download, Trash2, Loader2 } from "lucide-react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { StatusBadge } from "@/components/marketing/StatusBadge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const DataSettings = () => {
  const { user } = useAuth();
  const [exporting, setExporting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleExport = async () => {
    if (!user) return;
    setExporting(true);
    try {
      const [profile, memberships, invites, notifications, auditLog] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
        supabase.from("organization_members").select("*").eq("user_id", user.id),
        supabase.from("organization_invites").select("*").eq("email", user.email ?? ""),
        supabase.from("notifications").select("*").eq("user_id", user.id),
        supabase.from("audit_log").select("*").eq("actor_user_id", user.id).limit(1000),
      ]);

      const payload = {
        exported_at: new Date().toISOString(),
        user: { id: user.id, email: user.email },
        profile: profile.data,
        organization_memberships: memberships.data ?? [],
        organization_invites: invites.data ?? [],
        notifications: notifications.data ?? [],
        audit_log: auditLog.data ?? [],
      };

      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `my-data-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Export downloaded.");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Export failed");
    } finally {
      setExporting(false);
    }
  };

  const handleDeleteRequest = async () => {
    if (!user) return;
    setDeleting(true);
    try {
      const { error } = await supabase.from("leads").insert({
        kind: "other",
        email: user.email ?? "",
        source: "coming_soon:account_deletion",
        message: `Account deletion requested by ${user.id}`,
      });
      if (error) throw error;
      toast.success("Request submitted. We'll process it within 30 days.");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to submit request");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <DashboardShell>
      <div className="p-6 lg:p-10 max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">Your data</h1>
          <p className="text-muted-foreground">Export everything we have about you, or request account deletion.</p>
        </div>

        <Card className="p-6 space-y-4">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Download className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-lg font-semibold">Export my data</h2>
                <StatusBadge status="shipped" />
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Downloads a JSON file containing your profile, memberships, invites, notifications, and the audit
                events you triggered.
              </p>
              <Button onClick={handleExport} disabled={exporting}>
                {exporting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}
                Download JSON
              </Button>
            </div>
          </div>
        </Card>

        <Card className="p-6 space-y-4 border-destructive/40">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-md bg-destructive/10 text-destructive flex items-center justify-center shrink-0">
              <Trash2 className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-lg font-semibold">Delete my account</h2>
                <StatusBadge status="soon" tooltip="Self-serve deletion lands soon — for now we process requests within 30 days." />
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Self-serve account deletion is on the way. In the meantime, submit a request and we'll process it
                manually within 30 days.
              </p>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" disabled={deleting}>
                    {deleting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Trash2 className="h-4 w-4 mr-2" />}
                    Request deletion
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Request account deletion?</AlertDialogTitle>
                    <AlertDialogDescription>
                      We'll receive your request and email you once it's processed (within 30 days). Your account
                      will keep working until then.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteRequest}>Submit request</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </Card>
      </div>
    </DashboardShell>
  );
};

export default DataSettings;
