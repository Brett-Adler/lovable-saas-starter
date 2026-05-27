import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { PageSeo } from "@/components/seo/PageSeo";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { StatusBadge, type FeatureStatus } from "@/components/marketing/StatusBadge";
import { Link } from "react-router-dom";
import { ArrowRight, ExternalLink } from "lucide-react";

type Item = {
  id: string;
  title: string;
  status: FeatureStatus;
  what: string;
  where: { label: string; to?: string; href?: string }[];
  secrets?: string[];
};

const items: Item[] = [
  {
    id: "brand",
    title: "Brand & SEO",
    status: "shipped",
    what: "Upload one logo and the brand-kit generator produces every favicon, splash screen, social card, and PWA icon. Edit site name, default meta, and per-page SEO from the admin.",
    where: [
      { label: "Brand kit", to: "/admin/brand" },
      { label: "Site settings", to: "/admin/site-settings" },
      { label: "Per-page SEO", to: "/admin/seo" },
    ],
  },
  {
    id: "first-admin",
    title: "Create your first admin",
    status: "shipped",
    what: "The first account to sign up is automatically promoted to admin. After that, ask Lovable to promote teammates or insert into the user_roles table.",
    where: [{ label: "Sign up", to: "/signup" }],
  },
  {
    id: "legal",
    title: "Replace legal pages",
    status: "setup",
    what: "Privacy and Terms ship with placeholder text. You must replace them with real legal copy that lists every data processor (Lovable Cloud, Stripe, Resend, Twilio, analytics) before launch.",
    where: [
      { label: "Privacy", to: "/privacy" },
      { label: "Terms", to: "/terms" },
    ],
  },
  {
    id: "stripe",
    title: "Stripe — go live",
    status: "setup",
    what: "Sandbox keys are already wired and test checkout works. To accept real money: add a live STRIPE_API_KEY, create four products in Stripe with the documented lookup_keys, and point your live webhook at the payments-webhook function.",
    secrets: ["STRIPE_API_KEY", "PAYMENTS_WEBHOOK_SECRET"],
    where: [
      { label: "Pricing page", to: "/pricing" },
      { label: "Stripe dashboard", href: "https://dashboard.stripe.com" },
    ],
  },
  {
    id: "marketing-email",
    title: "Marketing email — Resend",
    status: "setup",
    what: "The broadcast pipeline, segments, and unsubscribe flow are built. Add a Resend API key and verify your sending domain to start sending. Transactional + auth emails already work through Lovable's managed sender.",
    secrets: ["RESEND_API_KEY"],
    where: [
      { label: "Broadcasts", to: "/admin/broadcasts" },
      { label: "Resend", href: "https://resend.com" },
    ],
  },
  {
    id: "sms",
    title: "SMS OTP login — Twilio",
    status: "setup",
    what: "Phone-number login UI, OTP storage, and the send-sms edge function are ready. Add Twilio credentials and a sending number to enable.",
    secrets: ["TWILIO_ACCOUNT_SID", "TWILIO_AUTH_TOKEN", "TWILIO_FROM_NUMBER"],
    where: [{ label: "Twilio", href: "https://www.twilio.com" }],
  },
  {
    id: "push",
    title: "Web Push — VAPID",
    status: "setup",
    what: "Service worker, subscription storage, and send-push function ship. Generate VAPID keys (npx web-push generate-vapid-keys) and add all three secrets.",
    secrets: ["VAPID_PUBLIC_KEY", "VAPID_PRIVATE_KEY", "VAPID_SUBJECT"],
    where: [],
  },
  {
    id: "apple",
    title: "Apple Sign-In — your credentials (optional)",
    status: "setup",
    what: "Apple Sign-In works out of the box using Lovable's managed credentials. For your own branding / App Store compliance, swap in your Apple Developer credentials from the backend auth settings.",
    where: [{ label: "Apple Developer", href: "https://developer.apple.com" }],
  },
  {
    id: "saml",
    title: "SAML SSO — per workspace",
    status: "setup",
    what: "The submission form is live. Each customer submits their IdP metadata and you provision the connection manually. No global setup needed.",
    where: [{ label: "SSO submission", to: "/dashboard/organization/sso" }],
  },
  {
    id: "publish",
    title: "Publish",
    status: "shipped",
    what: "When the checklist is green, publish to your custom domain. Sitemap, robots, and SEO are already generated.",
    where: [{ label: "Sitemap", to: "/sitemap" }],
  },
];

const Launch = () => (
  <MarketingLayout>
    <PageSeo
      path="/launch"
      title="Launch checklist"
      description="Every credential and copy swap needed to take this SaaS starter from preview to production."
    />
    <section className="container py-20 md:py-28">
      <div className="max-w-3xl mx-auto">
        <Badge variant="outline" className="mb-4">Launch</Badge>
        <h1 className="text-4xl md:text-5xl font-bold">Launch checklist</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          The app is feature-complete out of the box. The list below is everything you (the operator) still need to do
          to flip from sandbox to production. Items marked <strong className="text-foreground">Live</strong> already
          work; <strong className="text-foreground">Needs setup</strong> means add a credential or replace placeholder
          copy.
        </p>
        <p className="mt-4 text-sm text-muted-foreground">
          Just remixed? Start with the{" "}
          <Link to="/use-template/lovable" className="text-primary hover:underline">Lovable setup guide</Link>
          {" "}or the{" "}
          <Link to="/use-template/github" className="text-primary hover:underline">GitHub setup guide</Link>
          {" "}first.
        </p>

        <div className="mt-10 space-y-4">
          {items.map((item, i) => (
            <Card key={item.id} className="p-5">
              <div className="flex items-start gap-4">
                <div className="h-8 w-8 rounded-full bg-muted text-foreground/70 flex items-center justify-center text-sm font-semibold shrink-0">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-semibold text-foreground">{item.title}</h2>
                    <StatusBadge status={item.status} />
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{item.what}</p>

                  {item.secrets && item.secrets.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {item.secrets.map((s) => (
                        <code key={s} className="px-1.5 py-0.5 rounded bg-muted text-xs font-mono text-foreground">
                          {s}
                        </code>
                      ))}
                    </div>
                  )}

                  {item.where.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-3">
                      {item.where.map((w) =>
                        w.to ? (
                          <Link
                            key={w.label}
                            to={w.to}
                            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                          >
                            {w.label} <ArrowRight className="h-3 w-3" />
                          </Link>
                        ) : (
                          <a
                            key={w.label}
                            href={w.href}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                          >
                            {w.label} <ExternalLink className="h-3 w-3" />
                          </a>
                        ),
                      )}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        <p className="mt-10 text-sm text-muted-foreground">
          See the{" "}
          <Link to="/docs" className="text-primary hover:underline">
            full docs
          </Link>{" "}
          for architecture, customization, and the prompt library.
        </p>
      </div>
    </section>
  </MarketingLayout>
);

export default Launch;
