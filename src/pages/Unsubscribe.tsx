import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { PageSeo } from "@/components/seo/PageSeo";
import { supabase } from "@/integrations/supabase/client";
import { useSiteSeo } from "@/hooks/useSiteSeo";

type State =
  | { kind: "loading" }
  | { kind: "valid" }
  | { kind: "already" }
  | { kind: "invalid" }
  | { kind: "submitting" }
  | { kind: "success" }
  | { kind: "error"; message: string };

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

export default function Unsubscribe() {
  const [params] = useSearchParams();
  const token = params.get("token");
  const [state, setState] = useState<State>({ kind: "loading" });
  const { data: seo } = useSiteSeo();
  const siteName = seo?.site_name || "us";

  useEffect(() => {
    if (!token) {
      setState({ kind: "invalid" });
      return;
    }
    (async () => {
      try {
        const res = await fetch(
          `${SUPABASE_URL}/functions/v1/handle-email-unsubscribe?token=${encodeURIComponent(token)}`,
          { headers: { apikey: SUPABASE_KEY } },
        );
        const data = await res.json();
        if (data.valid) setState({ kind: "valid" });
        else if (data.reason === "already_unsubscribed") setState({ kind: "already" });
        else setState({ kind: "invalid" });
      } catch {
        setState({ kind: "invalid" });
      }
    })();
  }, [token]);

  const confirm = async () => {
    if (!token) return;
    setState({ kind: "submitting" });
    try {
      const { data, error } = await supabase.functions.invoke("handle-email-unsubscribe", {
        body: { token },
      });
      if (error) throw error;
      if (data?.success || data?.reason === "already_unsubscribed") setState({ kind: "success" });
      else setState({ kind: "error", message: "Couldn't unsubscribe. Try again later." });
    } catch (err) {
      setState({
        kind: "error",
        message: err instanceof Error ? err.message : "Couldn't unsubscribe.",
      });
    }
  };

  return (
    <MarketingLayout>
      <PageSeo
        path="/unsubscribe"
        title="Unsubscribe"
        description="Manage your email preferences and unsubscribe from marketing messages."
        noindex
      />
      <div className="container max-w-lg py-24">
        <Card className="p-8 text-center">
          {state.kind === "loading" && (
            <div className="flex flex-col items-center gap-3 py-6">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Checking your link…</p>
            </div>
          )}

          {state.kind === "valid" && (
            <>
              <h1 className="text-2xl font-bold mb-3">Unsubscribe from emails?</h1>
              <p className="text-muted-foreground mb-6">
                You'll stop receiving non-essential emails from {siteName}. You'll still
                get critical account and security messages.
              </p>
              <Button onClick={confirm} size="lg">Confirm unsubscribe</Button>
            </>
          )}

          {state.kind === "submitting" && (
            <div className="flex flex-col items-center gap-3 py-6">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Updating your preferences…</p>
            </div>
          )}

          {state.kind === "success" && (
            <>
              <CheckCircle2 className="h-12 w-12 text-success mx-auto mb-4" />
              <h1 className="text-2xl font-bold mb-2">You're unsubscribed</h1>
              <p className="text-muted-foreground mb-6">
                We won't send you any more marketing emails. Sorry to see you go!
              </p>
              <Button asChild variant="outline"><Link to="/">Back to site</Link></Button>
            </>
          )}

          {state.kind === "already" && (
            <>
              <CheckCircle2 className="h-12 w-12 text-success mx-auto mb-4" />
              <h1 className="text-2xl font-bold mb-2">Already unsubscribed</h1>
              <p className="text-muted-foreground mb-6">
                This email address is already opted out. No further action needed.
              </p>
              <Button asChild variant="outline"><Link to="/">Back to site</Link></Button>
            </>
          )}

          {state.kind === "invalid" && (
            <>
              <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
              <h1 className="text-2xl font-bold mb-2">Link not valid</h1>
              <p className="text-muted-foreground mb-6">
                This unsubscribe link is invalid or expired. If you're still receiving
                emails you don't want, reply to any one of them and we'll handle it.
              </p>
              <Button asChild variant="outline"><Link to="/">Back to site</Link></Button>
            </>
          )}

          {state.kind === "error" && (
            <>
              <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
              <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
              <p className="text-muted-foreground mb-6">{state.message}</p>
              <Button onClick={confirm}>Try again</Button>
            </>
          )}
        </Card>
      </div>
    </MarketingLayout>
  );
}
