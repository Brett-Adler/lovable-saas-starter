import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { PageSeo } from "@/components/seo/PageSeo";
import { DocsSearch } from "@/components/docs/DocsSearch";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Activity, ArrowRight, ExternalLink, GitBranch, History, Rocket, ShieldCheck } from "lucide-react";
import { LogoCloud } from "@/components/marketing/LogoCloud";
import { BrandIcon } from "@/components/marketing/BrandIcon";
import { audiences, articlesByAudience } from "@/data/docs";

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
      description="Help center and developer docs for the SaaS Starter — split by audience."
    />
    <section className="container py-20 md:py-24">
      <div className="max-w-3xl">
        <Badge variant="outline" className="mb-4">Documentation</Badge>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Docs</h1>
        <p className="mt-4 text-lg text-foreground/85 leading-relaxed">
          Everything you need to use, administer, and build on the SaaS Starter. Pick the section
          that matches your role, or search across every article below.
        </p>
        <div className="mt-6 max-w-xl">
          <DocsSearch placeholder="Search every doc..." />
        </div>
      </div>

      {/* Audience cards */}
      <div className="mt-12 grid gap-5 lg:grid-cols-3">
        {audiences.map((a) => {
          const items = articlesByAudience(a.id).slice(0, 5);
          const Icon = a.icon;
          return (
            <Card key={a.id} className="p-6 flex flex-col hover:border-primary/40 transition-colors">
              <div className="flex items-center gap-3">
                <div aria-hidden="true" className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <Icon className="h-5 w-5" />
                </div>
                <h2 className="text-xl font-semibold tracking-tight">{a.label}</h2>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{a.description}</p>
              <ul className="mt-5 space-y-1.5 text-sm">
                {items.map((article) => (
                  <li key={article.slug}>
                    <Link
                      to={`/docs/${a.id}/${article.slug}`}
                      className="text-foreground/85 hover:text-primary inline-flex items-start gap-1.5"
                    >
                      <ArrowRight className="h-3.5 w-3.5 mt-1 text-muted-foreground shrink-0" aria-hidden="true" />
                      <span>{article.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-5">
                <Link
                  to={`/docs/${a.id}`}
                  className="text-sm font-medium text-primary hover:underline inline-flex items-center gap-1"
                >
                  Browse all {a.short.toLowerCase()} docs <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="mt-16 max-w-3xl">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">Related resources</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {quickLinks.map(({ to, label, icon: Icon, desc }) => (
            <Card key={to} className="p-4 hover:border-primary/40 transition-colors focus-within:ring-2 focus-within:ring-primary">
              <Link to={to} className="flex items-start gap-3 focus:outline-none">
                <div aria-hidden="true" className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
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
      </div>

      <div className="mt-16 max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">Powered by</p>
        <LogoCloud
          items={[
            { slug: "lovable" }, { slug: "supabase" }, { slug: "stripe" }, { slug: "resend" },
            { slug: "react" }, { slug: "tailwindcss" }, { slug: "typescript" },
          ]}
          className="mb-8"
        />
        <div className="grid gap-3 sm:grid-cols-2">
          {externalDocs.map((d) => (
            <Card key={d.href} className="p-4 hover:border-primary/40 transition-colors focus-within:ring-2 focus-within:ring-primary">
              <a
                href={d.href}
                target="_blank"
                rel="noopener noreferrer external"
                className="flex items-start gap-3 focus:outline-none"
              >
                <div aria-hidden="true" className="h-9 w-9 rounded-lg bg-muted text-muted-foreground flex items-center justify-center shrink-0">
                  <BrandIcon slug={d.slug} size={18} />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-foreground inline-flex items-center gap-1.5">
                    {d.label} <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
                    <span className="sr-only"> (opens in new tab)</span>
                  </p>
                  <p className="text-sm text-muted-foreground">{d.desc}</p>
                </div>
              </a>
            </Card>
          ))}
        </div>
      </div>

      <div className="mt-16 max-w-3xl">
        <p className="text-sm text-muted-foreground">
          Looking for the original end-to-end setup walkthrough? It lives at{" "}
          <Link to="/readme" className="text-primary hover:underline">/readme</Link>.
        </p>
      </div>
    </section>
  </MarketingLayout>
);

export default Docs;
