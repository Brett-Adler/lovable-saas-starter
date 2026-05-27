import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { PageSeo } from "@/components/seo/PageSeo";
import { Card } from "@/components/ui/card";
import { StatusBadge, type FeatureStatus } from "@/components/marketing/StatusBadge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface Integration {
  name: string;
  description: string;
  status: FeatureStatus;
  href?: string;
  note?: string;
}

const integrations: Integration[] = [
  { name: "Stripe", description: "Subscriptions, customer portal, webhooks.", status: "setup", href: "/pricing", note: "Create products with lookup_keys: pro_monthly, pro_yearly, team_monthly, team_yearly." },
  { name: "Google OAuth", description: "One-click sign-in for your users.", status: "shipped", href: "/login" },
  { name: "Apple OAuth", description: "Sign in with Apple ID.", status: "shipped", href: "/login" },
  { name: "Resend", description: "Marketing broadcasts to confirmed subscribers.", status: "setup", note: "Add RESEND_API_KEY and verify a sending domain." },
  { name: "Twilio", description: "SMS OTP login for high-trust auth.", status: "setup", note: "Add TWILIO_ACCOUNT_SID, AUTH_TOKEN, FROM_NUMBER." },
  { name: "Web Push (VAPID)", description: "Browser push notifications.", status: "setup", note: "Generate VAPID keys (public, private, subject)." },
  { name: "SAML SSO", description: "Okta, Azure AD, OneLogin, JumpCloud.", status: "setup", href: "/dashboard/organization/sso" },
  { name: "AI support chat", description: "First-party AI assistant powered by Lovable AI.", status: "shipped" },
  { name: "Slack", description: "Pipe events into a channel.", status: "soon" },
  { name: "Zapier", description: "Triggers and actions across 6,000+ apps.", status: "soon" },
  { name: "Outbound webhooks", description: "Subscribe to events with retries and signing.", status: "soon" },
];

const Integrations = () => (
  <MarketingLayout>
    <PageSeo
      path="/integrations"
      title="Integrations"
      description="Every integration this starter supports — what ships live, what needs setup, and what's coming."
    />
    <section className="container py-16 md:py-20">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Integrations</h1>
        <p className="text-lg text-muted-foreground">
          Connect the tools you already use. Live integrations work out of the box; "Needs setup"
          items just want their API keys.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
        {integrations.map((i) => (
          <Card key={i.name} className="p-5 flex flex-col gap-3">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold">{i.name}</h3>
              <StatusBadge status={i.status} tooltip={i.note} />
            </div>
            <p className="text-sm text-muted-foreground flex-1">{i.description}</p>
            {i.href && (
              <Button asChild variant="ghost" size="sm" className="self-start -ml-3">
                <Link to={i.href}>
                  Open <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </Link>
              </Button>
            )}
          </Card>
        ))}
      </div>
    </section>
  </MarketingLayout>
);

export default Integrations;
