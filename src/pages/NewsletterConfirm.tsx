import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AlertCircle, CheckCircle2, Loader2, MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { supabase } from "@/integrations/supabase/client";

type State =
  | { kind: "loading" }
  | { kind: "ready" }
  | { kind: "confirming" }
  | { kind: "success" }
  | { kind: "already" }
  | { kind: "invalid" }
  | { kind: "error"; message: string };

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

export default function NewsletterConfirm() {
  const [params] = useSearchParams();
  const token = params.get("token");
  const [state, setState] = useState<State>({ kind: "loading" });

  useEffect(() => {
    document.title = "Confirm newsletter — SaaS Starter";
    if (!token) {
      setState({ kind: "invalid" });
      return;
    }
    (async () => {
      try {
        const res = await fetch(
          `${SUPABASE_URL}/functions/v1/confirm-newsletter-subscription?token=${encodeURIComponent(token)}`,
          { headers: { apikey: SUPABASE_KEY } },
        );
        const data = await res.json();
        if (data.valid) setState({ kind: "ready" });
        else if (data.reason === "already_confirmed") setState({ kind: "already" });
        else setState({ kind: "invalid" });
      } catch {
        setState({ kind: "invalid" });
      }
    })();
  }, [token]);

  const confirm = async () => {
    if (!token) return;
    setState({ kind: "confirming" });
    try {
      const { data, error } = await supabase.functions.invoke("confirm-newsletter-subscription", {
        body: { token },
      });
      if (error) throw error;
      if (data?.alreadyConfirmed) setState({ kind: "already" });
      else if (data?.success) setState({ kind: "success" });
      else setState({ kind: "error", message: "Couldn't confirm. Try again later." });
    } catch (err) {
      setState({
        kind: "error",
        message: err instanceof Error ? err.message : "Couldn't confirm.",
      });
    }
  };

  return (
    <MarketingLayout>
      <main className="container max-w-lg py-24" aria-labelledby="confirm-heading">
        <Card className="p-8 text-center" role="status" aria-live="polite">
          {state.kind === "loading" && (
            <div className="flex flex-col items-center gap-3 py-6">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" aria-hidden="true" />
              <p className="text-sm text-muted-foreground">Checking your link…</p>
            </div>
          )}

          {state.kind === "ready" && (
            <>
              <MailCheck className="h-12 w-12 text-primary mx-auto mb-4" aria-hidden="true" />
              <h1 id="confirm-heading" className="text-2xl font-bold mb-3">
                Confirm your subscription
              </h1>
              <p className="text-muted-foreground mb-6">
                Tap below to confirm you want monthly updates from SaaS Starter. One email a month,
                unsubscribe anytime.
              </p>
              <Button onClick={confirm} size="lg">
                Yes, add me to the list
              </Button>
            </>
          )}

          {state.kind === "confirming" && (
            <div className="flex flex-col items-center gap-3 py-6">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" aria-hidden="true" />
              <p className="text-sm text-muted-foreground">Adding you to the list…</p>
            </div>
          )}

          {state.kind === "success" && (
            <>
              <CheckCircle2 className="h-12 w-12 text-success mx-auto mb-4" aria-hidden="true" />
              <h1 id="confirm-heading" className="text-2xl font-bold mb-2">
                You're on the list
              </h1>
              <p className="text-muted-foreground mb-6">
                Welcome aboard. We'll see you in your inbox once a month — no more, no less.
              </p>
              <Button asChild variant="outline">
                <Link to="/">Back to site</Link>
              </Button>
            </>
          )}

          {state.kind === "already" && (
            <>
              <CheckCircle2 className="h-12 w-12 text-success mx-auto mb-4" aria-hidden="true" />
              <h1 id="confirm-heading" className="text-2xl font-bold mb-2">
                Already confirmed
              </h1>
              <p className="text-muted-foreground mb-6">
                Looks like you're already on the list. Thanks for sticking with us.
              </p>
              <Button asChild variant="outline">
                <Link to="/">Back to site</Link>
              </Button>
            </>
          )}

          {state.kind === "invalid" && (
            <>
              <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" aria-hidden="true" />
              <h1 id="confirm-heading" className="text-2xl font-bold mb-2">
                Link not valid
              </h1>
              <p className="text-muted-foreground mb-6">
                This confirmation link is invalid or has expired. Try subscribing again from the
                homepage.
              </p>
              <Button asChild variant="outline">
                <Link to="/newsletter">Back to newsletter</Link>
              </Button>
            </>
          )}

          {state.kind === "error" && (
            <>
              <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" aria-hidden="true" />
              <h1 id="confirm-heading" className="text-2xl font-bold mb-2">
                Something went wrong
              </h1>
              <p className="text-muted-foreground mb-6">{state.message}</p>
              <Button onClick={confirm}>Try again</Button>
            </>
          )}
        </Card>
      </main>
    </MarketingLayout>
  );
}
