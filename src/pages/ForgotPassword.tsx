import { useState } from "react";
import { Link } from "react-router-dom";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthShell } from "@/components/auth/AuthShell";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const emailSchema = z.string().trim().email().max(255);

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const validated = emailSchema.parse(email);
      setLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(validated, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      setSent(true);
      toast({ title: "Check your inbox", description: "We sent you a password reset link." });
    } catch (err) {
      const message =
        err instanceof z.ZodError
          ? err.errors[0]?.message ?? "Invalid email"
          : err instanceof Error
            ? err.message
            : "Something went wrong";
      toast({ title: "Couldn't send reset link", description: message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Reset your password"
      subtitle="We'll email you a link to set a new password"
      footer={
        <>
          Remembered it?{" "}
          <Link to="/login" className="text-primary font-medium">
            Log in
          </Link>
        </>
      }
    >
      {sent ? (
        <div className="text-center space-y-3">
          <p className="text-sm text-muted-foreground">
            If an account exists for <span className="font-medium text-foreground">{email}</span>, you'll get a reset link shortly.
          </p>
          <Button variant="outline" className="w-full" onClick={() => setSent(false)}>
            Send to a different email
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>
          <Button type="submit" className="w-full h-11" disabled={loading}>
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            Send reset link
          </Button>
        </form>
      )}
    </AuthShell>
  );
};

export default ForgotPassword;
