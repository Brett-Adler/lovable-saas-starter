import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { PageSeo } from "@/components/seo/PageSeo";
import { Card } from "@/components/ui/card";
import { StatusBadge, type FeatureStatus } from "@/components/marketing/StatusBadge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, ExternalLink } from "lucide-react";
import { BrandIcon } from "@/components/marketing/BrandIcon";
import { LogoCloud } from "@/components/marketing/LogoCloud";
import { brandIcons, type BrandSlug } from "@/lib/brand/icons";

interface Integration {
  name: string;
  brand?: BrandSlug;
  description: string;
  status: FeatureStatus;
  href?: string;
  external?: string;
  note?: string;
}

const integrations: Integration[] = [
  { name: "Stripe", brand: "stripe", description: "Subscriptions, customer portal, webhooks.", status: "setup", href: "/pricing", external: brandIcons.stripe.url, note: "Create products with lookup_keys: pro_monthly, pro_yearly, team_monthly, team_yearly." },
  { name: "Google OAuth", brand: "google", description: "One-click sign-in for your users.", status: "shipped", href: "/login", external: brandIcons.google.url },
  { name: "Apple OAuth", brand: "apple", description: "Sign in with Apple ID.", status: "shipped", href: "/login", external: brandIcons.apple.url },
  { name: "Resend", brand: "resend", description: "Marketing broadcasts to confirmed subscribers.", status: "setup", external: brandIcons.resend.url, note: "Add RESEND_API_KEY and verify a sending domain." },
  { name: "Twilio", brand: "twilio", description: "SMS OTP login for high-trust auth.", status: "setup", external: brandIcons.twilio.url, note: "Add TWILIO_ACCOUNT_SID, AUTH_TOKEN, FROM_NUMBER." },
  { name: "Web Push (VAPID)", description: "Browser push notifications.", status: "setup", note: "Generate VAPID keys (public, private, subject)." },
  { name: "SAML SSO", brand: "okta", description: "Okta, Azure AD, OneLogin, JumpCloud.", status: "setup", href: "/dashboard/organization/sso", external: brandIcons.okta.url },
  { name: "AI support chat", brand: "lovable", description: "First-party AI assistant powered by Lovable AI.", status: "shipped", external: brandIcons.lovable.url },
  { name: "Slack", brand: "slack", description: "Pipe events into a channel.", status: "soon", external: brandIcons.slack.url },
  { name: "Zapier", brand: "zapier", description: "Triggers and actions across 6,000+ apps.", status: "soon", external: brandIcons.zapier.url },
  { name: "Outbound webhooks", brand: "github", description: "Subscribe to events with retries and signing.", status: "soon" },
];

const Integrations = () => (
  <MarketingLayout>
    <PageSeo
      path="/integrations"
      title="Integrations"
      description="Every integration this starter supports — what ships live, what needs setup, and what's coming."
    />
    <section className="container py-16 md:py-20">
      <div className="max-w-3xl mx-auto text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Integrations</h1>
        <p className="text-lg text-muted-foreground">
          Connect the tools you already use. Live integrations work out of the box; "Needs setup"
          items just want their API keys.
        </p>
      </div>

      <LogoCloud
        className="mb-14 max-w-3xl mx-auto"
        caption="Works with the tools you already use"
        items={[
          { slug: "stripe" }, { slug: "supabase" }, { slug: "google" }, { slug: "apple" },
          { slug: "resend" }, { slug: "twilio" }, { slug: "slack" }, { slug: "zapier" },
        ]}
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
        {integrations.map((i) => (
          <Card key={i.name} className="p-5 flex flex-col gap-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3 min-w-0">
                <span className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground shrink-0">
                  {i.brand ? <BrandIcon slug={i.brand} size={20} /> : <span className="text-xs font-semibold">{i.name.slice(0, 2)}</span>}
                </span>
                <h3 className="font-semibold truncate">{i.name}</h3>
              </div>
              <StatusBadge status={i.status} tooltip={i.note} />
            </div>
            <p className="text-sm text-muted-foreground flex-1">{i.description}</p>
            <div className="flex items-center gap-1 flex-wrap">
              {i.href && (
                <Button asChild variant="ghost" size="sm" className="-ml-3">
                  <Link to={i.href}>
                    Open <ArrowRight className="h-3.5 w-3.5 ml-1" />
                  </Link>
                </Button>
              )}
              {i.external && (
                <Button asChild variant="ghost" size="sm" className={i.href ? "" : "-ml-3"}>
                  <a href={i.external} target="_blank" rel="noopener noreferrer external" aria-label={`${i.name} website — opens in new tab`}>
                    Learn more <ExternalLink className="h-3.5 w-3.5 ml-1" />
                  </a>
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </section>
  </MarketingLayout>
);

export default Integrations;
