import { useState } from "react";
import { z } from "zod";
import { Loader2, Bell, CheckCircle2, type LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge, type FeatureStatus } from "@/components/marketing/StatusBadge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface Props {
  Icon: LucideIcon;
  title: string;
  description: string;
  source: string;
  status?: FeatureStatus;
  bullets?: string[];
  children?: React.ReactNode;
}

const schema = z.object({ email: z.string().email() });

/**
 * Inline "Coming soon" block used inside dashboard settings pages.
 * Pre-fills the user's email and writes a lead row with the given source.
 */
export const DashboardComingSoon = ({
  Icon,
  title,
  description,
  source,
  status = "soon",
  bullets,
  children,
}: Props) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = schema.safeParse({ email: String(fd.get("email") || user?.email || "") });
    if (!parsed.success) {
      toast.error("Enter a valid email");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.from("leads").insert({
        kind: "waitlist",
        email: parsed.data.email,
        source,
        message: `Dashboard notify-me for ${title}`,
      });
      if (error) throw error;
      setDone(true);
      toast.success("We'll email you when it ships.");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 space-y-5">
      <div className="flex items-start gap-3">
        <div className="h-10 w-10 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0">
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h2 className="text-lg font-semibold">{title}</h2>
            <StatusBadge status={status} />
          </div>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>

      {bullets && bullets.length > 0 && (
        <ul className="space-y-1.5 text-sm text-muted-foreground pl-1">
          {bullets.map((b) => (
            <li key={b} className="flex gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
      )}

      {children}

      <div className="border-t border-border pt-5">
        {done ? (
          <div className="flex items-center gap-2 text-success text-sm">
            <CheckCircle2 className="h-4 w-4" />
            You're on the list — we'll be in touch.
          </div>
        ) : (
          <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-3">
            <Input
              name="email"
              type="email"
              required
              defaultValue={user?.email ?? ""}
              placeholder="you@company.com"
              aria-label="Email"
              className="flex-1"
            />
            <Button type="submit" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Bell className="h-4 w-4 mr-1.5" />}
              Notify me when ready
            </Button>
          </form>
        )}
      </div>
    </Card>
  );
};
