import { useState } from "react";
import { z } from "zod";
import { Loader2, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { PageSeo } from "@/components/seo/PageSeo";
import { BrowserMockup } from "@/components/marketing/BrowserMockup";
import { AppMockup } from "@/components/marketing/AppMockup";
import { supabase } from "@/integrations/supabase/client";

const schema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  company: z.string().trim().min(1).max(150),
  size: z.string().min(1).max(50),
  notes: z.string().trim().max(1000).optional().or(z.literal("")),
});

const Demo = () => {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = Object.fromEntries(fd.entries()) as Record<string, string>;
    const parsed = schema.safeParse(data);
    if (!parsed.success) { toast.error(parsed.error.issues[0].message); return; }
    setLoading(true);
    try {
      const { error } = await supabase.from("leads").insert({
        kind: "demo",
        name: parsed.data.name,
        email: parsed.data.email,
        company: parsed.data.company,
        source: `demo:size=${parsed.data.size}`,
        message: parsed.data.notes || null,
      });
      if (error) throw error;
      setDone(true);
      toast.success("Got it — we'll be in touch.");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally { setLoading(false); }
  };

  return (
    <MarketingLayout>
      <PageSeo path="/demo" title="Book a demo" description="See SaaS Starter in action — a 30-minute walkthrough tailored to your use case." />
      <section className="container py-20 md:py-28">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <div className="h-16 w-16 mx-auto rounded-2xl gradient-primary flex items-center justify-center shadow-glow mb-6">
              <Calendar className="h-7 w-7 text-primary-foreground" />
            </div>
            <Badge variant="outline" className="mb-4">Request a demo</Badge>
            <h1 className="text-4xl md:text-5xl font-bold">See it in action</h1>
            <p className="mt-4 text-lg text-muted-foreground">
              30-minute walkthrough tailored to your team. No sales pressure.
            </p>
          </div>
          <Card className="p-8 border-border/60">
            {done ? (
              <div className="text-center py-8">
                <h2 className="text-xl font-semibold">Got it — we'll be in touch.</h2>
                <p className="mt-2 text-muted-foreground">We received your request and will follow up by email.</p>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div><Label htmlFor="name">Name</Label><Input id="name" name="name" required className="mt-1.5" /></div>
                  <div><Label htmlFor="email">Work email</Label><Input id="email" name="email" type="email" required className="mt-1.5" /></div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div><Label htmlFor="company">Company</Label><Input id="company" name="company" required className="mt-1.5" /></div>
                  <div><Label htmlFor="size">Team size</Label><Input id="size" name="size" required placeholder="e.g. 1-10" className="mt-1.5" /></div>
                </div>
                <div><Label htmlFor="notes">What would you like to see?</Label><Textarea id="notes" name="notes" rows={4} className="mt-1.5" /></div>
                <Button type="submit" disabled={loading} className="w-full h-11">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Request demo"}
                </Button>
              </form>
            )}
          </Card>
        </div>
      </section>
    </MarketingLayout>
  );
};

export default Demo;
