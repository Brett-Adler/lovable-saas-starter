import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { Badge } from "@/components/ui/badge";
import { NewsletterForm } from "@/components/marketing/NewsletterForm";
import { Mail } from "lucide-react";
import { Card } from "@/components/ui/card";

const Newsletter = () => (
  <MarketingLayout>
    <section className="container py-20 md:py-28">
      <div className="max-w-2xl mx-auto text-center">
        <div className="h-16 w-16 mx-auto rounded-2xl gradient-primary flex items-center justify-center shadow-glow mb-6">
          <Mail className="h-7 w-7 text-primary-foreground" />
        </div>
        <Badge variant="outline" className="mb-4">Newsletter</Badge>
        <h1 className="text-4xl md:text-5xl font-bold">Stay in the loop</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Monthly product updates, new templates, and behind-the-scenes from the team. No spam, unsubscribe anytime.
        </p>
        <Card className="mt-10 p-8 border-border/60">
          <NewsletterForm source="newsletter-page" className="max-w-md mx-auto" />
          <p className="mt-4 text-xs text-muted-foreground">By subscribing, you agree to our Privacy Policy.</p>
        </Card>
      </div>
    </section>
  </MarketingLayout>
);

export default Newsletter;
