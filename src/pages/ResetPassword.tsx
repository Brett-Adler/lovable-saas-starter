import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthShell } from "@/components/auth/AuthShell";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const passwordSchema = z.string().min(8).max(128);

const ResetPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Supabase sets the recovery session automatically when the user lands here.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") setReady(true);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setReady(true);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const validated = passwordSchema.parse(password);
      if (validated !== confirm) {
        toast({ title: "Passwords don't match", variant: "destructive" });
        return;
      }
      setLoading(true);
      const { data: updated, error } = await supabase.auth.updateUser({ password: validated });
      if (error) throw error;
      // Fire-and-forget security notice.
      if (updated?.user?.email) {
        const email = updated.user.email;
        supabase.functions
          .invoke("send-transactional-email", {
            body: {
              templateName: "password-changed",
              recipientEmail: email,
              idempotencyKey: `pwd-changed-${updated.user.id}-${Date.now()}`,
              templateData: {
                name: updated.user.user_metadata?.display_name,
                changedAt: new Date().toLocaleString(),
              },
            },
          })
          .catch((e) => console.warn("password-changed email failed", e));
      }
      toast({ title: "Password updated", description: "You can now use your new password." });
      navigate("/dashboard", { replace: true });
    } catch (err) {
      const message =
        err instanceof z.ZodError
          ? err.errors[0]?.message ?? "Invalid password"
          : err instanceof Error
            ? err.message
            : "Something went wrong";
      toast({ title: "Couldn't update password", description: message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell title="Set a new password" subtitle="Choose something you'll remember">
      {!ready ? (
        <div className="flex justify-center py-6">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">New password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={8}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm">Confirm password</Label>
            <Input
              id="confirm"
              type="password"
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              minLength={8}
              required
            />
          </div>
          <Button type="submit" className="w-full h-11" disabled={loading}>
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            Update password
          </Button>
        </form>
      )}
    </AuthShell>
  );
};

export default ResetPassword;
