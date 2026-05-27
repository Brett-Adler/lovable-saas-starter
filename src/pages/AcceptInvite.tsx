import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Loader2, Mail, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Logo } from "@/components/Logo";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useOrganization } from "@/hooks/useOrganization";
import { toast } from "@/hooks/use-toast";

const AcceptInvite = () => {
  const { token } = useParams<{ token: string }>();
  const { user, loading: authLoading } = useAuth();
  const { refresh, setCurrentOrgId } = useOrganization();
  const navigate = useNavigate();
  const [accepting, setAccepting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!token) return;
    if (authLoading) return;
    if (!user) {
      // Persist token so user can be redirected back here after auth
      sessionStorage.setItem("pendingInviteToken", token);
      navigate(`/login?next=/invite/${token}`, { replace: true });
      return;
    }

    let cancelled = false;
    const accept = async () => {
      setAccepting(true);
      const { data, error } = await supabase.rpc("accept_organization_invite", { _token: token });
      if (cancelled) return;
      setAccepting(false);
      if (error) {
        setError(error.message);
        return;
      }
      setDone(true);
      toast({ title: "Joined organization!" });
      await refresh();
      if (typeof data === "string") setCurrentOrgId(data);
      sessionStorage.removeItem("pendingInviteToken");
    };
    accept();
    return () => {
      cancelled = true;
    };
  }, [token, user, authLoading, navigate, refresh, setCurrentOrgId]);

  return (
    <div className="min-h-dvh bg-background flex flex-col items-center justify-center p-6">
      <div className="mb-6">
        <Logo />
      </div>
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="h-12 w-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-3">
            <Mail className="h-6 w-6" />
          </div>
          <CardTitle>{done ? "You're in!" : error ? "Invite issue" : "Joining organization…"}</CardTitle>
          <CardDescription>
            {done
              ? "Welcome to the team. Let's get you to your dashboard."
              : error
                ? error
                : "Hang tight while we validate your invite."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {accepting && (
            <div className="flex justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          )}
          {(done || error) && (
            <Button asChild className="w-full">
              <Link to="/dashboard">
                Go to dashboard
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AcceptInvite;
