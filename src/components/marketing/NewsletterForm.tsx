import { useState } from "react";
import { z } from "zod";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

const schema = z.object({
  email: z.string().trim().email("Please enter a valid email").max(320),
});

const CONSENT_TEXT =
  "I agree to receive the monthly newsletter and accept the Privacy Policy. I can unsubscribe at any time.";

interface NewsletterFormProps {
  source?: string;
  compact?: boolean;
  className?: string;
}

export const NewsletterForm = ({ source = "website", compact = false, className }: NewsletterFormProps) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState<null | "confirm" | "already">(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const parsed = schema.safeParse({ email });
    if (!parsed.success) {
      setErrorMsg(parsed.error.issues[0].message);
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("subscribe-newsletter", {
        body: {
          email: parsed.data.email,
          source,
          consent_text: CONSENT_TEXT,
        },
      });
      if (error) throw error;
      if (data?.reason === "suppressed") {
        setErrorMsg(data?.message ?? "This address previously opted out.");
        return;
      }
      if (data?.alreadyConfirmed) {
        setDone("already");
        toast.success("You're already on the list — thanks!");
      } else {
        setDone("confirm");
        toast.success("Check your inbox to confirm.");
      }
      setEmail("");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div
        role="status"
        aria-live="polite"
        className={cn("flex items-start gap-3 text-sm text-success", className)}
      >
        <CheckCircle2 className="h-5 w-5 mt-0.5 shrink-0" aria-hidden="true" />
        <div className="text-left">
          {done === "confirm" ? (
            <>
              <p className="font-medium text-foreground">Check your inbox to confirm.</p>
              <p className="text-muted-foreground mt-1">
                Even Elwood had to click the link. We sent a confirmation email — once you tap the
                button in there, you're on the list.
              </p>
            </>
          ) : (
            <p className="font-medium text-foreground">
              You're already on the list — thanks for sticking with us.
            </p>
          )}
        </div>
      </div>
    );
  }

  const errorId = "newsletter-email-error";

  return (
    <form onSubmit={submit} className={cn("space-y-2", className)} noValidate>
      <div className={cn("flex gap-2", compact ? "flex-row" : "flex-col sm:flex-row")}>
        <div className="flex-1">
          <Label htmlFor="newsletter-email" className="sr-only">
            Email address
          </Label>
          <Input
            id="newsletter-email"
            type="email"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className={compact ? "h-10" : "h-11"}
            disabled={loading}
            aria-invalid={errorMsg ? "true" : "false"}
            aria-describedby={errorMsg ? errorId : "newsletter-consent"}
          />
        </div>
        <Button type="submit" disabled={loading} className={compact ? "h-10" : "h-11"}>
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-label="Submitting" />
          ) : (
            <>
              Subscribe
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
            </>
          )}
        </Button>
      </div>
      {errorMsg && (
        <p id={errorId} role="alert" className="text-sm text-destructive">
          {errorMsg}
        </p>
      )}
      <p id="newsletter-consent" className="text-xs text-muted-foreground">
        By subscribing you agree to receive the monthly newsletter and accept the{" "}
        <Link to="/privacy" className="underline underline-offset-2 hover:text-foreground">
          Privacy Policy
        </Link>
        . Unsubscribe anytime — every email has a one-click unsubscribe link.
      </p>
    </form>
  );
};
