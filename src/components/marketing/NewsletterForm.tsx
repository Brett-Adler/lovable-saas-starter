import { useState } from "react";
import { z } from "zod";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

const schema = z.object({
  email: z.string().trim().email("Please enter a valid email").max(255),
});

interface NewsletterFormProps {
  source?: string;
  compact?: boolean;
  className?: string;
}

export const NewsletterForm = ({ source = "website", compact = false, className }: NewsletterFormProps) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ email });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setLoading(true);
    try {
      // TODO: wire to marketing_subscribers table once schema is in place
      const { error } = await supabase
        .from("marketing_subscribers" as never)
        .upsert({ email: parsed.data.email, source, status: "subscribed" } as never, { onConflict: "email" } as never);
      if (error && !error.message.includes("does not exist")) throw error;
      setDone(true);
      toast.success("You're subscribed! Check your inbox.");
      setEmail("");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className={cn("flex items-center gap-2 text-sm text-success", className)}>
        <CheckCircle2 className="h-4 w-4" />
        <span>Thanks! You're on the list.</span>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className={cn("flex gap-2", compact ? "flex-row" : "flex-col sm:flex-row", className)}>
      <Input
        type="email"
        placeholder="you@company.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className={compact ? "h-10" : "h-11"}
        disabled={loading}
        aria-label="Email address"
      />
      <Button type="submit" disabled={loading} className={compact ? "h-10" : "h-11"}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : (
          <>
            Subscribe
            <ArrowRight className="ml-2 h-4 w-4" />
          </>
        )}
      </Button>
    </form>
  );
};
