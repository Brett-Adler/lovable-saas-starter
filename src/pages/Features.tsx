import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Sparkles, BarChart3, CreditCard, Users, Shield, History, LayoutDashboard } from "lucide-react";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { PageSeo } from "@/components/seo/PageSeo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import dashboardShot from "@/assets/screenshots/dashboard.png.asset.json";
import analyticsShot from "@/assets/screenshots/analytics.png.asset.json";
import billingShot from "@/assets/screenshots/billing.png.asset.json";
import membersShot from "@/assets/screenshots/members.png.asset.json";
import usersShot from "@/assets/screenshots/users.png.asset.json";
import auditShot from "@/assets/screenshots/audit.png.asset.json";

type Feature = {
  eyebrow: string;
  title: string;
  desc: string;
  bullets: string[];
  icon: React.ComponentType<{ className?: string }>;
  image: { url: string };
  alt: string;
};

const features: Feature[] = [
  {
    eyebrow: "Dashboard",
    title: "A workspace your users will actually open",
    desc: "Every account lands in an opinionated overview with onboarding, plan status, and the inbox they need — no blank-state stare-down.",
    bullets: [
      "Per-organization workspace with role-aware UI",
      "Onboarding checklist that tracks real progress",
      "Inline notifications and pending invites",
    ],
    icon: LayoutDashboard,
    image: dashboardShot,
    alt: "SaaS Starter dashboard with onboarding checklist, subscription panel, and inbox",
  },
  {
    eyebrow: "Analytics",
    title: "Know your MRR, signups, and churn at a glance",
    desc: "An admin analytics view wired up to your real Stripe and auth data — no third-party paste-in scripts required.",
    bullets: [
      "MRR, active subs, signups, churn, and newsletter growth",
      "Signups-over-time and plan distribution charts",
      "Leads-by-source breakdown for marketing attribution",
    ],
    icon: BarChart3,
    image: analyticsShot,
    alt: "Admin analytics page with revenue and signup metrics",
  },
  {
    eyebrow: "Billing & subscriptions",
    title: "Stripe billing, wired end-to-end",
    desc: "Plan selection, hosted-grade checkout, customer portal, webhooks, and a test-mode banner so you ship without surprises.",
    bullets: [
      "Dedicated /checkout route with embedded Stripe",
      "Per-organization subscription state and history",
      "Test-mode banner so preview never charges real cards",
    ],
    icon: CreditCard,
    image: billingShot,
    alt: "Billing page showing the organization's current plan",
  },
  {
    eyebrow: "Teams & roles",
    title: "Invite teammates, assign roles, ship together",
    desc: "Multi-tenant from day one. Owners, admins, and members each see exactly what they're allowed to — enforced by RLS, not the UI.",
    bullets: [
      "Owner / admin / member roles per organization",
      "Email invites with secure single-use tokens",
      "Row-level security across every tenant table",
    ],
    icon: Users,
    image: membersShot,
    alt: "Members page with an invite form and roster",
  },
  {
    eyebrow: "User admin",
    title: "See every account, role, and login provider",
    desc: "A platform-wide admin panel with search, role badges, and provider data — perfect for support, debugging, and trust & safety.",
    bullets: [
      "Search across every email and display name",
      "Role badges with one-click grant and revoke",
      "Last sign-in, join date, and org membership count",
    ],
    icon: Shield,
    image: usersShot,
    alt: "Admin users table with role badges and last sign-in",
  },
  {
    eyebrow: "Audit log",
    title: "Every privileged action, in chronological order",
    desc: "Role grants, invites, and member changes are tracked automatically — searchable, filterable, and exportable when you need it.",
    bullets: [
      "Automatic capture of role and membership events",
      "Filter by action, actor, or target",
      "Rich metadata payload for forensic review",
    ],
    icon: History,
    image: auditShot,
    alt: "Audit log with action filters and metadata column",
  },
];

const FeatureRow = ({ feature, reverse }: { feature: Feature; reverse: boolean }) => {
  const Icon = feature.icon;
  return (
    <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
      <div className={reverse ? "lg:order-2" : ""}>
        <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary mb-4">
          <span className="h-7 w-7 rounded-md bg-primary-soft inline-flex items-center justify-center">
            <Icon className="h-3.5 w-3.5" />
          </span>
          {feature.eyebrow}
        </div>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{feature.title}</h2>
        <p className="mt-4 text-lg text-muted-foreground">{feature.desc}</p>
        <ul className="mt-6 space-y-3">
          {feature.bullets.map((b) => (
            <li key={b} className="flex items-start gap-2.5 text-sm">
              <CheckCircle2 className="h-5 w-5 text-success shrink-0 mt-0.5" />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className={reverse ? "lg:order-1" : ""}>
        <img
          src={feature.image.url}
          alt={feature.alt}
          loading="lazy"
          width={1696}
          height={1060}
          className="w-full h-auto rounded-xl"
        />
      </div>
    </div>
  );
};

const Features = () => {
  return (
    <MarketingLayout>
      <PageSeo
        path="/features"
        title="Features — SaaS Starter"
        description="Dashboards, analytics, Stripe billing, teams and roles, user admin, and audit logs — every boring SaaS feature, already built and themed."
      />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/40">
        <div className="absolute inset-0 gradient-mesh opacity-80" aria-hidden />
        <div className="container relative pt-20 pb-16 md:pt-28 md:pb-20">
          <div className="max-w-3xl mx-auto text-center animate-fade-in-up">
            <Badge variant="outline" className="mb-6 gap-1.5 bg-card/90 text-foreground backdrop-blur border-border/60">
              <Sparkles className="h-3 w-3 text-primary" />
              Features
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold leading-[1.05]">
              Everything a SaaS needs, <span className="text-gradient">already built</span>.
            </h1>
            <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Real screenshots of the real product. No marketing renders — what you see is what ships when you clone the template.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
              <Button size="lg" asChild className="h-12 px-8 shadow-glow text-base">
                <Link to="/signup">
                  Start free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="h-12 px-8 text-base">
                <Link to="/pricing">See pricing</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Feature rows */}
      <section className="container py-20 md:py-28">
        <div className="space-y-24 md:space-y-32 max-w-6xl mx-auto">
          {features.map((f, i) => (
            <FeatureRow key={f.title} feature={f} reverse={i % 2 === 1} />
          ))}
        </div>
      </section>

      {/* CTA band */}
      <section className="bg-muted/30 border-t border-border/40">
        <div className="container py-20 text-center">
          <h2 className="text-3xl md:text-4xl font-bold">Ready to ship your SaaS?</h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
            Clone the template, replace the branding, and you're three commands from production.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Button size="lg" asChild className="h-12 px-8 shadow-glow text-base">
              <Link to="/signup">
                Start free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="h-12 px-8 text-base">
              <Link to="/docs">Read the docs</Link>
            </Button>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
};

export default Features;
