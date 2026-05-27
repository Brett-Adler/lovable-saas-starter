import { useState } from "react";
import { z } from "zod";
import { Loader2, Bell, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { StatusBadge, type FeatureStatus } from "@/components/marketing/StatusBadge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Props {
  eyebrow?: string;
  title: string;
  description: string;
  /** leads.source value (e.g. "coming_soon:blog") */
  source: string;
  status?: FeatureStatus;
  children?: React.ReactNode;
}

const schema = z.object({ email: z.string().email("Enter a valid email") });

export const ComingSoonHero = ({
  eyebrow,
  title,
  description,
  source,
  status = "soon",
  children,
}: Props) => {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = schema.safeParse({ email: String(fd.get("email") || "") });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.from("leads").insert({
        kind: "waitlist",
        email: parsed.data.email,
        source,
        message: `Notify-me for ${title}`,
      });
      if (error) throw error;
      setDone(true);
      toast.success("We'll let you know when it's ready.");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="container py-20 md:py-28">
      <div className="max-w-2xl mx-auto text-center">
        {eyebrow && (
          <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3">{eyebrow}</p>
        )}
        <div className="flex justify-center mb-4">
          <StatusBadge status={status} />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">{title}</h1>
        <p className="text-lg text-muted-foreground mb-8">{description}</p>

        <Card className="p-6 text-left">
          {done ? (
            <div className="flex items-center gap-3 text-success">
              <CheckCircle2 className="h-5 w-5" />
              <p className="text-sm font-medium">You're on the list — thanks!</p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-3">
              <Input
                name="email"
                type="email"
                required
                placeholder="you@company.com"
                aria-label="Email"
                className="flex-1"
              />
              <Button type="submit" disabled={loading} className="shadow-glow">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Bell className="h-4 w-4 mr-1.5" />}
                Notify me
              </Button>
            </form>
          )}
        </Card>

        {children && <div className="mt-10 text-left">{children}</div>}
      </div>
    </section>
  );
};
