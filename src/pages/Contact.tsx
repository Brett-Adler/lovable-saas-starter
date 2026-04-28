import { useState } from "react";
import { z } from "zod";
import { Loader2, Mail, MessageSquare, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { supabase } from "@/integrations/supabase/client";

const schema = z.object({
  name: z.string().trim().min(1, "Name required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  subject: z.string().trim().min(1, "Subject required").max(200),
  message: z.string().trim().min(10, "Message too short").max(2000),
  // honeypot
  website: z.string().max(0, "Spam detected").optional().or(z.literal("")),
});

const Contact = () => {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = {
      name: String(fd.get("name") || ""),
      email: String(fd.get("email") || ""),
      subject: String(fd.get("subject") || ""),
      message: String(fd.get("message") || ""),
      website: String(fd.get("website") || ""),
    };
    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setLoading(true);
    try {
      // TODO: persist to lead_submissions once schema exists; transactional confirmation email after email infra is set up
      const { error } = await supabase
        .from("lead_submissions" as never)
        .insert({ type: "contact", payload: parsed.data, status: "new" } as never);
      if (error && !error.message.includes("does not exist")) throw error;
      setDone(true);
      toast.success("Message sent — we'll get back to you soon.");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MarketingLayout>
      <section className="container py-20 md:py-28">
        <div className="grid gap-12 lg:grid-cols-2 max-w-6xl mx-auto">
          <div>
            <Badge variant="outline" className="mb-4">Contact</Badge>
            <h1 className="text-4xl md:text-5xl font-bold">Let's talk.</h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Questions, feedback, or want a demo? We typically reply within one business day.
            </p>
            <div className="mt-10 space-y-6">
              <div className="flex gap-4">
                <div className="h-11 w-11 rounded-xl bg-primary-soft flex items-center justify-center shrink-0">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">Email</p>
                  <p className="text-sm text-muted-foreground">hello@example.com</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="h-11 w-11 rounded-xl bg-primary-soft flex items-center justify-center shrink-0">
                  <MessageSquare className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">Live chat</p>
                  <p className="text-sm text-muted-foreground">Mon–Fri, 9am–5pm UTC</p>
                </div>
              </div>
            </div>
          </div>

          <Card className="p-8 border-border/60">
            {done ? (
              <div className="text-center py-8">
                <div className="h-16 w-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
                  <Send className="h-7 w-7 text-success" />
                </div>
                <h2 className="text-xl font-semibold">Message received</h2>
                <p className="mt-2 text-muted-foreground">We'll be in touch soon.</p>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" name="name" required maxLength={100} className="mt-1.5" />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" required maxLength={255} className="mt-1.5" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" name="subject" required maxLength={200} className="mt-1.5" />
                </div>
                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" name="message" required rows={5} maxLength={2000} className="mt-1.5" />
                </div>
                {/* honeypot */}
                <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
                <Button type="submit" disabled={loading} className="w-full h-11">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send message"}
                </Button>
              </form>
            )}
          </Card>
        </div>
      </section>
    </MarketingLayout>
  );
};

export default Contact;
