import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { PageSeo } from "@/components/seo/PageSeo";
import { PaymentTestModeBanner } from "@/components/PaymentTestModeBanner";
import { DismissibleNotice } from "@/components/marketing/DismissibleNotice";
import { PlanConfirmDialog } from "@/components/pricing/PlanConfirmDialog";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

type Tier = {
  name: string;
  description: string;
  monthly: number;
  yearly: number;
  cta: string;
  highlight?: boolean;
  priceMonthly?: string;
  priceYearly?: string;
  features: string[];
  missing: string[];
};

const tiers: Tier[] = [
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
    cta: "Subscribe to Pro",
    highlight: true,
    priceMonthly: "pro_monthly",
    priceYearly: "pro_yearly",
    features: ["Unlimited projects", "Up to 10 team members", "Priority email support", "Advanced analytics", "Custom domain", "Marketing emails"],
    missing: ["SSO / SAML"],
  },
  {
    name: "Team",
    description: "For organizations with serious needs.",
    monthly: 49,
    yearly: 39,
    cta: "Subscribe to Team",
    priceMonthly: "team_monthly",
    priceYearly: "team_yearly",
    features: ["Everything in Pro", "Unlimited team members", "SSO / SAML (provisioned manually)", "Dedicated success manager", "99.9% SLA", "Audit logs"],
    missing: [],
  },
];

const Pricing = () => {
  const [yearly, setYearly] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [confirmTier, setConfirmTier] = useState<Tier | null>(null);

  const handleSubscribe = (tier: Tier) => {
    const priceId = yearly ? tier.priceYearly : tier.priceMonthly;
    if (!priceId) {
      navigate("/signup");
      return;
    }
    if (!user) {
      const next = `/checkout?plan=${tier.name.toLowerCase()}&cadence=${yearly ? "yearly" : "monthly"}`;
      navigate(`/signup?next=${encodeURIComponent(next)}`);
      return;
    }
    setConfirmTier(tier);
  };

  const handleConfirm = () => {
    if (!confirmTier) return;
    const slug = confirmTier.name.toLowerCase();
    const cadence = yearly ? "yearly" : "monthly";
    setConfirmTier(null);
    navigate(`/checkout?plan=${slug}&cadence=${cadence}`);
  };

  const productSchemas = tiers.map((t) => ({
    "@context": "https://schema.org",
    "@type": "Product",
    name: `SaaS Starter — ${t.name}`,
    description: t.description,
    offers: {
      "@type": "Offer",
      price: (yearly ? t.yearly : t.monthly).toString(),
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
  }));

  return (
    <MarketingLayout>
      <PageSeo path="/pricing" title="Pricing" description="Simple, transparent pricing. Start free, upgrade when you grow. Cancel anytime." jsonLd={productSchemas} />
      <PaymentTestModeBanner />
      <div className="container pt-8">
        <DismissibleNotice
          id="pricing-free-template"
          tone="info"
          title="This is a free template"
          className="max-w-3xl mx-auto"
        >
          SaaS Starter Suite is an open Lovable template. The pricing below is example content to demonstrate a subscription flow — you are not being charged to use the template. Remix it and replace these tiers with your own.
        </DismissibleNotice>
      </div>
      <section className="container py-20 md:py-28">
        <div className="max-w-2xl mx-auto text-center">
          <Badge variant="outline" className="mb-4">Pricing</Badge>
          <h1 className="text-4xl md:text-6xl font-bold">Simple, fair pricing</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Start free. Upgrade when you're ready. Cancel anytime.
          </p>
          <div className="mt-8 inline-flex items-center gap-3 bg-muted/50 rounded-full px-4 py-2">
            <span className={cn("text-sm font-medium", !yearly && "text-foreground")}>Monthly</span>
            <Switch checked={yearly} onCheckedChange={setYearly} aria-label="Toggle between monthly and yearly billing" />
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
              <h2 className="text-xl font-bold">{t.name}</h2>
              <p className="text-sm text-muted-foreground mt-1">{t.description}</p>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-5xl font-bold">${yearly ? t.yearly : t.monthly}</span>
                <span className="text-muted-foreground">/mo</span>
              </div>
              {yearly && t.monthly > 0 && (
                <p className="text-xs text-muted-foreground mt-1">Billed annually</p>
              )}
              {t.priceMonthly ? (
                <Button
                  onClick={() => handleSubscribe(t)}
                  className={cn("w-full mt-6", t.highlight && "shadow-glow")}
                  variant={t.highlight ? "default" : "outline"}
                >
                  {t.cta}
                </Button>
              ) : (
                <Button asChild className="w-full mt-6" variant="outline">
                  <Link to="/signup">{t.cta}</Link>
                </Button>
              )}
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
        <p className="text-center text-xs text-muted-foreground mt-4 max-w-2xl mx-auto">
          Checkout uses Stripe <code className="px-1 rounded bg-muted">lookup_keys</code>: <code className="px-1 rounded bg-muted">pro_monthly</code>, <code className="px-1 rounded bg-muted">pro_yearly</code>, <code className="px-1 rounded bg-muted">team_monthly</code>, <code className="px-1 rounded bg-muted">team_yearly</code>. Create those products in your Stripe dashboard before going live — see <Link to="/readme" className="text-primary">Readme</Link>.
        </p>
      </section>

      <PlanConfirmDialog
        open={!!confirmTier}
        onOpenChange={(v) => !v && setConfirmTier(null)}
        tier={confirmTier}
        yearly={yearly}
        userEmail={user?.email}
        onConfirm={handleConfirm}
      />
    </MarketingLayout>
  );
};

export default Pricing;
