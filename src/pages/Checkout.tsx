import { useEffect, useMemo } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Check, Lock, ShieldCheck } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StripeEmbeddedCheckout } from "@/components/StripeEmbeddedCheckout";
import { PaymentTestModeBanner } from "@/components/PaymentTestModeBanner";
import { PageSeo } from "@/components/seo/PageSeo";
import { useAuth } from "@/hooks/useAuth";

type Cadence = "monthly" | "yearly";

interface Tier {
  slug: string;
  name: string;
  monthly: number;
  yearly: number;
  priceMonthly: string;
  priceYearly: string;
  features: string[];
}

const tiers: Tier[] = [
  {
    slug: "pro",
    name: "Pro",
    monthly: 19,
    yearly: 15,
    priceMonthly: "pro_monthly",
    priceYearly: "pro_yearly",
    features: [
      "Unlimited projects",
      "Up to 10 team members",
      "Priority email support",
      "Advanced analytics",
      "Custom domain",
      "Marketing emails",
    ],
  },
  {
    slug: "team",
    name: "Team",
    monthly: 49,
    yearly: 39,
    priceMonthly: "team_monthly",
    priceYearly: "team_yearly",
    features: [
      "Everything in Pro",
      "Unlimited team members",
      "SSO / SAML (provisioned manually)",
      "Dedicated success manager",
      "99.9% SLA",
      "Audit logs",
    ],
  },
];

const Checkout = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  const planSlug = params.get("plan");
  const cadence: Cadence = params.get("cadence") === "monthly" ? "monthly" : "yearly";
  const tier = useMemo(() => tiers.find((t) => t.slug === planSlug) ?? null, [planSlug]);

  useEffect(() => {
    if (loading) return;
    if (!tier) {
      navigate("/pricing", { replace: true });
      return;
    }
    if (!user) {
      const next = `/checkout?plan=${tier.slug}&cadence=${cadence}`;
      navigate(`/signup?next=${encodeURIComponent(next)}`, { replace: true });
    }
  }, [loading, tier, user, cadence, navigate]);

  if (!tier || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-muted-foreground">
        Preparing secure checkout…
      </div>
    );
  }

  const priceId = cadence === "yearly" ? tier.priceYearly : tier.priceMonthly;
  const unit = cadence === "yearly" ? tier.yearly : tier.monthly;
  const annualTotal = tier.yearly * 12;

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col">
      <PageSeo path="/checkout" title="Secure checkout" description="Complete your subscription securely." noindex />
      <PaymentTestModeBanner />

      {/* Minimal top bar */}
      <header className="bg-background border-b border-border">
        <div className="container h-16 flex items-center justify-between">
          <Link to="/" aria-label="Home">
            <Logo />
          </Link>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Lock className="h-3.5 w-3.5 text-success" />
            Secure payment by Stripe
          </div>
        </div>
      </header>

      <main className="flex-1 container py-8 md:py-12">
        <div className="mb-6">
          <Button asChild variant="ghost" size="sm" className="-ml-3">
            <Link to="/pricing">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Change plan
            </Link>
          </Button>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Order summary */}
          <aside className="lg:col-span-2">
            <div className="lg:sticky lg:top-8 rounded-xl border border-border bg-background p-6 shadow-sm">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Order summary</p>
              <div className="mt-3 flex items-center justify-between">
                <h1 className="text-2xl font-bold">{tier.name}</h1>
                <Badge variant="outline" className="rounded-full capitalize">{cadence}</Badge>
              </div>

              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-bold">${unit}</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              {cadence === "yearly" ? (
                <p className="mt-1 text-sm text-muted-foreground">
                  Billed <span className="font-medium text-foreground">${annualTotal}</span> annually
                </p>
              ) : (
                <p className="mt-1 text-sm text-muted-foreground">Billed monthly · cancel anytime</p>
              )}

              <div className="mt-5 border-t border-border pt-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground mb-3">Includes</p>
                <ul className="space-y-2">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-success mt-0.5 shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <ul className="mt-5 border-t border-border pt-4 space-y-2 text-xs text-muted-foreground">
                <li className="flex items-center gap-2"><ShieldCheck className="h-3.5 w-3.5 text-success" /> Cancel anytime</li>
                <li className="flex items-center gap-2"><ShieldCheck className="h-3.5 w-3.5 text-success" /> 256-bit TLS encryption</li>
                <li className="flex items-center gap-2"><ShieldCheck className="h-3.5 w-3.5 text-success" /> PCI-DSS compliant via Stripe</li>
              </ul>

              <p className="mt-5 text-xs text-muted-foreground border-t border-border pt-4">
                Signed in as <span className="font-medium text-foreground">{user.email}</span>
              </p>
            </div>
          </aside>

          {/* Stripe form */}
          <section className="lg:col-span-3">
            <div className="rounded-xl border border-border bg-background p-2 sm:p-4 shadow-sm">
              <StripeEmbeddedCheckout
                priceId={priceId}
                customerEmail={user.email ?? undefined}
                userId={user.id}
              />
            </div>
            <p className="mt-4 text-xs text-muted-foreground text-center">
              By completing this purchase you agree to our{" "}
              <Link to="/terms" className="underline">Terms</Link> and{" "}
              <Link to="/privacy" className="underline">Privacy Policy</Link>.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Checkout;
