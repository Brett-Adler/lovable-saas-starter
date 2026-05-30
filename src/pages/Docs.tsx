import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { PageSeo } from "@/components/seo/PageSeo";
import { ReadmeContent } from "@/components/docs/ReadmeContent";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Activity, BookOpen, ExternalLink, GitBranch, History, Rocket, ShieldCheck } from "lucide-react";
import { LogoCloud } from "@/components/marketing/LogoCloud";
import { BrandIcon } from "@/components/marketing/BrandIcon";

const quickLinks = [
  { to: "/launch", label: "Launch checklist", icon: Rocket, desc: "Every credential to flip from preview to production." },
  { to: "/roadmap", label: "Roadmap", icon: GitBranch, desc: "What's live, in setup, and on the way." },
  { to: "/changelog", label: "Changelog", icon: History, desc: "Every user-visible release in order." },
  { to: "/status", label: "Status", icon: Activity, desc: "System health and incident history." },
  { to: "/security", label: "Security", icon: ShieldCheck, desc: "Posture, controls, and compliance." },
];

const externalDocs = [
  { slug: "lovable" as const, label: "Lovable docs", href: "https://docs.lovable.dev", desc: "Platform, AI gateway, and project guides." },
  { slug: "supabase" as const, label: "Supabase docs", href: "https://supabase.com/docs", desc: "Auth, database, RLS, and edge functions." },
  { slug: "stripe" as const, label: "Stripe docs", href: "https://docs.stripe.com", desc: "Subscriptions, customer portal, webhooks." },
  { slug: "resend" as const, label: "Resend docs", href: "https://resend.com/docs", desc: "Domains, broadcasts, and transactional email." },
  { slug: "react" as const, label: "React docs", href: "https://react.dev", desc: "Components, hooks, and patterns." },
  { slug: "tailwindcss" as const, label: "Tailwind docs", href: "https://tailwindcss.com/docs", desc: "Utility classes and theming." },
];

const Docs = () => (
  <MarketingLayout>
    <PageSeo
      path="/docs"
      title="Documentation"
      description="Setup, architecture, and customization docs for the SaaS Starter."
    />
    <section className="container py-20 md:py-28">
      <div className="max-w-3xl mx-auto">
        <Badge variant="outline" className="mb-4">Documentation</Badge>
        <h1 className="text-4xl md:text-5xl font-bold">Docs</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Everything you need to set up, customize, and ship the SaaS Starter. The full setup guide is below — use the
          shortcuts to jump straight to related resources.
        </p>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {quickLinks.map(({ to, label, icon: Icon, desc }) => (
            <Card key={to} className="p-4 hover:border-primary/40 transition-colors">
              <Link to={to} className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{label}</p>
                  <p className="text-sm text-muted-foreground">{desc}</p>
                </div>
              </Link>
            </Card>
          ))}
        </div>

        <div className="mt-12">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Powered by</h2>
          <LogoCloud
            items={[
              { slug: "lovable" }, { slug: "supabase" }, { slug: "stripe" }, { slug: "resend" },
              { slug: "react" }, { slug: "tailwindcss" }, { slug: "typescript" },
            ]}
            className="mb-8"
          />
          <div className="grid gap-3 sm:grid-cols-2">
            {externalDocs.map((d) => (
              <Card key={d.href} className="p-4 hover:border-primary/40 transition-colors">
                <a
                  href={d.href}
                  target="_blank"
                  rel="noopener noreferrer external"
                  className="flex items-start gap-3"
                  aria-label={`${d.label} — opens in new tab`}
                >
                  <div className="h-9 w-9 rounded-lg bg-muted text-muted-foreground flex items-center justify-center shrink-0">
                    <BrandIcon slug={d.slug} size={18} />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground inline-flex items-center gap-1.5">
                      {d.label} <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                    </p>
                    <p className="text-sm text-muted-foreground">{d.desc}</p>
                  </div>
                </a>
              </Card>
            ))}
          </div>
        </div>


        <div className="mt-10 flex items-center gap-2 text-sm text-muted-foreground">
          <BookOpen className="h-4 w-4" />
          <span>Setup &amp; customization guide</span>
        </div>
        <hr className="mt-2 mb-2 border-border" />
      </div>

      <ReadmeContent />
    </section>
  </MarketingLayout>
);

export default Docs;
