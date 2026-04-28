import { useState } from "react";
import { Link } from "react-router-dom";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { cn } from "@/lib/utils";

const tiers = [
  {
    name: "Free",
    description: "For side projects and trying things out.",
    monthly: 0,
    yearly: 0,
    cta: "Start free",
    features: ["Up to 3 projects", "1 team member", "Community support", "Basic analytics"],
    missing: ["Custom domain", "Priority support"],
  },
  {
    name: "Pro",
    description: "For growing teams ready to ship.",
    monthly: 19,
    yearly: 15,
    cta: "Start 14-day trial",
    highlight: true,
    features: ["Unlimited projects", "Up to 10 team members", "Priority email support", "Advanced analytics", "Custom domain", "Marketing emails"],
    missing: ["SSO / SAML"],
  },
  {
    name: "Team",
    description: "For organizations with serious needs.",
    monthly: 49,
    yearly: 39,
    cta: "Start 14-day trial",
    features: ["Everything in Pro", "Unlimited team members", "SSO / SAML", "Dedicated success manager", "99.9% SLA", "Audit logs"],
    missing: [],
  },
];

const Pricing = () => {
  const [yearly, setYearly] = useState(true);

  return (
    <MarketingLayout>
      <section className="container py-20 md:py-28">
        <div className="max-w-2xl mx-auto text-center">
          <Badge variant="outline" className="mb-4">Pricing</Badge>
          <h1 className="text-4xl md:text-6xl font-bold">Simple, fair pricing</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Start free. Upgrade when you're ready. Cancel anytime.
          </p>
          <div className="mt-8 inline-flex items-center gap-3 bg-muted/50 rounded-full px-4 py-2">
            <span className={cn("text-sm font-medium", !yearly && "text-foreground")}>Monthly</span>
            <Switch checked={yearly} onCheckedChange={setYearly} />
            <span className={cn("text-sm font-medium", yearly && "text-foreground")}>
              Yearly <Badge variant="secondary" className="ml-1">Save 20%</Badge>
            </span>
          </div>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3 max-w-6xl mx-auto">
          {tiers.map((t) => (
            <Card
              key={t.name}
              className={cn(
                "p-8 border-border/60 relative",
                t.highlight && "border-primary shadow-glow ring-1 ring-primary/20"
              )}
            >
              {t.highlight && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 gradient-primary text-primary-foreground border-0">
                  Most popular
                </Badge>
              )}
              <h3 className="text-xl font-bold">{t.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">{t.description}</p>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-5xl font-bold">${yearly ? t.yearly : t.monthly}</span>
                <span className="text-muted-foreground">/mo</span>
              </div>
              {yearly && t.monthly > 0 && (
                <p className="text-xs text-muted-foreground mt-1">Billed annually</p>
              )}
              <Button
                asChild
                className={cn("w-full mt-6", t.highlight && "shadow-glow")}
                variant={t.highlight ? "default" : "outline"}
              >
                <Link to="/signup">{t.cta}</Link>
              </Button>
              <ul className="mt-8 space-y-3">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-success mt-0.5 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
                {t.missing.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <X className="h-4 w-4 mt-0.5 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-12">
          Need something custom? <Link to="/contact" className="text-primary font-medium">Talk to sales</Link>
        </p>
      </section>
    </MarketingLayout>
  );
};

export default Pricing;
