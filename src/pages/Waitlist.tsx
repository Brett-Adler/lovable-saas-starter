import { useState } from "react";
import { z } from "zod";
import { Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { PageSeo } from "@/components/seo/PageSeo";
import { supabase } from "@/integrations/supabase/client";

const schema = z.object({
  email: z.string().trim().email().max(255),
  name: z.string().trim().max(100).optional().or(z.literal("")),
  use_case: z.string().trim().max(500).optional().or(z.literal("")),
});

const Waitlist = () => {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget).entries()) as Record<string, string>;
    const parsed = schema.safeParse(data);
    if (!parsed.success) { toast.error(parsed.error.issues[0].message); return; }
    setLoading(true);
    try {
      const { error } = await supabase
        .from("lead_submissions" as never)
        .insert({ type: "waitlist", payload: parsed.data, status: "new" } as never);
      if (error && !error.message.includes("does not exist")) throw error;
      setDone(true);
      toast.success("You're on the list!");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally { setLoading(false); }
  };

  return (
    <MarketingLayout>
      <PageSeo path="/waitlist" title="Join the waitlist" description="Be first in line when we open up access. No spam, unsubscribe anytime." />
      <section className="container py-20 md:py-28">
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-10">
            <div className="h-16 w-16 mx-auto rounded-2xl gradient-primary flex items-center justify-center shadow-glow mb-6">
              <Sparkles className="h-7 w-7 text-primary-foreground" />
            </div>
            <Badge variant="outline" className="mb-4">Waitlist</Badge>
            <h1 className="text-4xl md:text-5xl font-bold">Join the waitlist</h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Be among the first to know when we launch new features.
            </p>
          </div>
          <Card className="p-8 border-border/60">
            {done ? (
              <div className="text-center py-6">
                <h2 className="text-xl font-semibold">You're in 🎉</h2>
                <p className="mt-2 text-muted-foreground">We'll email you the moment access opens.</p>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-4">
                <div><Label htmlFor="email">Email</Label><Input id="email" name="email" type="email" required className="mt-1.5" /></div>
                <div><Label htmlFor="name">Name (optional)</Label><Input id="name" name="name" className="mt-1.5" /></div>
                <div><Label htmlFor="use_case">What would you use it for? (optional)</Label><Input id="use_case" name="use_case" className="mt-1.5" /></div>
                <Button type="submit" disabled={loading} className="w-full h-11">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Join waitlist"}
                </Button>
              </form>
            )}
          </Card>
        </div>
      </section>
    </MarketingLayout>
  );
};

export default Waitlist;
