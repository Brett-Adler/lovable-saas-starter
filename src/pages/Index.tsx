import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ArrowRight, CheckCircle2, Zap, Shield, CreditCard, Mail, Users, BarChart3,
  Smartphone, Sparkles, MessageSquare, Lock, Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { PageSeo } from "@/components/seo/PageSeo";
import { NewsletterForm } from "@/components/marketing/NewsletterForm";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { publicNavGroups } from "@/lib/public-routes";
import { StatusBadge, type FeatureStatus } from "@/components/marketing/StatusBadge";
import { TemplatePlaceholderRibbon } from "@/components/marketing/TemplatePlaceholderRibbon";
import { LogoCloud } from "@/components/marketing/LogoCloud";

import analyticsShot from "@/assets/screenshots/analytics.png.asset.json";
import billingShot from "@/assets/screenshots/billing.png.asset.json";

type Feature = {
  icon: typeof Lock;
  title: string;
  desc: string;
  status: FeatureStatus;
  tooltip?: string;
};

const features: Feature[] = [
  { icon: Lock, title: "Auth, batteries included", desc: "Email/password, Google, and Apple — wired and ready.", status: "shipped" },
  { icon: CreditCard, title: "Stripe payments", desc: "Subscriptions, customer portal, plan-gating, and admin billing.", status: "setup", tooltip: "Add your Stripe products with lookup_keys: pro_monthly, pro_yearly, team_monthly, team_yearly." },
  { icon: Mail, title: "Branded emails", desc: "Transactional + auth emails are live. Marketing broadcasts via Resend ship as a wired pipeline.", status: "setup", tooltip: "Transactional/auth emails work out of the box on notify.voicept.com. Add RESEND_API_KEY and verify a sending domain to enable marketing broadcasts." },
  { icon: Users, title: "Teams & roles", desc: "Organizations, invites, and role-based access out of the box.", status: "shipped" },
  { icon: BarChart3, title: "Built-in analytics", desc: "Signups, MRR, churn, retention — your own self-hosted dashboard.", status: "shipped" },
  { icon: Smartphone, title: "SMS & push", desc: "Twilio for OTP/alerts, Web Push for in-app — stubs ready to enable.", status: "setup", tooltip: "Add Twilio credentials for SMS and VAPID keys for Web Push. See the Readme." },
  { icon: Shield, title: "Secure by default", desc: "Row-level security, separate roles table, validated inputs everywhere.", status: "shipped" },
  { icon: Sparkles, title: "Beautiful UI", desc: "Polished design system with light + dark mode and themable tokens.", status: "shipped" },
];

const steps = [
  { n: "01", title: "Replace branding", desc: "Swap files in /public — favicons, logos, social images. No code changes." },
  { n: "02", title: "Configure Stripe", desc: "Edit sample products and pricing. Customer portal works automatically." },
  { n: "03", title: "Customize emails", desc: "All email templates are React Email components. Edit and redeploy." },
  { n: "04", title: "Ship your features", desc: "The boring stuff is done. Focus on what makes your product unique." },
];

const testimonials = [
  { quote: "Saved us 3 weeks of setup. Auth, billing, and emails just worked.", name: "Maya R.", role: "Founder, Loop" },
  { quote: "The analytics dashboard alone was worth it. MRR tracking on day one.", name: "James K.", role: "CEO, Quanta" },
  { quote: "Cleanest SaaS starter I've used. Beautiful design, real architecture.", name: "Priya S.", role: "Engineer, Drift" },
];

type Faq = { q: string; a: string; status?: FeatureStatus; tooltip?: string };

const faqs: Faq[] = [
  { q: "What's included?", a: "Authentication (email, Google, Apple), Stripe subscriptions, transactional + auth email, in-app notifications, audit logs, teams and roles, full settings UI, super-admin dashboard, brand-kit generator, and built-in analytics. Marketing broadcasts, SMS OTP, Web Push, and SAML SSO ship as wired pipelines you enable with credentials — see the launch checklist." },
  {
    q: "Are SMS, push, and SSO live out of the box?",
    a: "The UI, database, and edge functions are wired up but ship as stubs. SMS waits for Twilio credentials, Web Push waits for VAPID keys, and SAML SSO accepts your IdP config through a form and is then provisioned manually — each is a credential or config swap, not a rewrite. See the Readme for the pre-launch checklist.",
    status: "setup",
    tooltip: "SMS: add Twilio (TWILIO_ACCOUNT_SID, AUTH_TOKEN, FROM_NUMBER). Push: VAPID keys. SSO: submit IdP config via the form.",
  },
  { q: "Can I use this commercially?", a: "Yes. This is a starter template — once you've built your product on top, it's yours." },
  { q: "How do I add my logo?", a: "Drop your files into /public using the names listed in BRANDING.md. The app picks them up automatically." },
  {
    q: "Does it support dark mode?",
    a: "Yes — every component is themed via semantic tokens. Toggle in the header.",
    status: "shipped",
  },
  {
    q: "What about marketing emails?",
    a: "We use Resend on a separate subdomain so it never affects deliverability of your auth emails.",
    status: "setup",
    tooltip: "Add RESEND_API_KEY and verify your sending domain in Resend.",
  },
];

const Index = () => {
  const { hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [hash]);

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <MarketingLayout>
      <PageSeo
        path="/"
        title="SaaS Starter — production-ready SaaS template"
        description="Launch faster with a production-ready SaaS starter for auth, billing, teams, emails, analytics, and admin workflows."
        jsonLd={faqJsonLd}
      />
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-mesh opacity-80" aria-hidden />
        <div className="container relative pt-20 pb-24 md:pt-28 md:pb-32">
          <div className="max-w-3xl mx-auto text-center animate-fade-in-up">
            <Badge variant="outline" className="mb-6 gap-1.5 bg-card/90 text-foreground backdrop-blur border-border/60 hover:bg-card">
              <Sparkles className="h-3 w-3 text-primary" />
              The complete SaaS starter
            </Badge>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.05]">
              Build your SaaS in <span className="text-gradient">days</span>,
              <br className="hidden sm:inline" /> not months.
            </h1>
            <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Auth, payments, emails, teams, analytics — every boring SaaS feature, polished and wired up. Replace the branding and ship.
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
            <div className="mt-8 flex items-center justify-center gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-success" />No credit card</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-success" />14-day trial</span>
              <span className="hidden sm:flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-success" />Cancel anytime</span>
            </div>
          </div>

          {/* Explainer video */}
          <div className="mt-16 max-w-5xl mx-auto animate-fade-in-up [animation-delay:200ms]">
            <Card className="overflow-hidden border-border/60 shadow-2xl">
              {/* Faux window chrome */}
              <div className="flex items-center gap-1.5 px-4 py-3 border-b border-border/60 bg-muted/40">
                <span className="h-3 w-3 rounded-full bg-destructive/70" />
                <span className="h-3 w-3 rounded-full bg-warning/70" />
                <span className="h-3 w-3 rounded-full bg-success/70" />
                <div className="mx-auto text-xs text-muted-foreground font-mono">app.yourdomain.com/dashboard</div>
              </div>
              <video
                className="w-full aspect-[16/9] object-cover bg-muted"
                src="/explainer.mp4"
                poster="/explainer-poster.jpg"
                width={1280}
                height={720}
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                aria-label="SaaS Starter explainer — build your SaaS in days, not months"
              />
            </Card>
          </div>
        </div>
      </section>

      {/* Logo cloud — tech stack & integrations */}
      <section className="border-y border-border/40 bg-muted/20">
        <div className="container py-12">
          <LogoCloud
            caption="Built on tools you already trust"
            items={[
              { slug: "lovable" }, { slug: "supabase" }, { slug: "stripe" }, { slug: "resend" },
              { slug: "react" }, { slug: "tailwindcss" }, { slug: "typescript" },
            ]}
          />
        </div>
      </section>

      {/* Features */}
      <section id="features" className="container py-24 scroll-mt-20">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <Badge variant="outline" className="mb-4">Features</Badge>
          <h2 className="text-3xl md:text-5xl font-bold">Everything a SaaS needs</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Every feature you'd build in your first six months — already done, tested, and themed.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <Card key={f.title} className="p-6 border-border/60 shadow-card hover:shadow-md transition-shadow group">
              <div className="flex items-start justify-between mb-4">
                <div className="h-11 w-11 rounded-xl bg-primary-soft flex items-center justify-center group-hover:scale-110 transition-transform">
                  <f.icon className="h-5 w-5 text-primary" />
                </div>
                <StatusBadge status={f.status} tooltip={f.tooltip} />
              </div>
              <h3 className="font-semibold mb-1">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </Card>
          ))}
        </div>

        {/* Visual previews — real product screenshots */}
        <div className="mt-16 grid gap-6 lg:grid-cols-2 max-w-6xl mx-auto">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Built-in analytics</p>
            <img
              src={analyticsShot.url}
              alt="Admin analytics page with MRR, signups, and churn metrics"
              loading="lazy"
              width={1696}
              height={1060}
              className="w-full h-auto rounded-xl"
            />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Stripe billing, wired</p>
            <img
              src={billingShot.url}
              alt="Per-organization billing page with current plan and upgrade CTA"
              loading="lazy"
              width={1696}
              height={1060}
              className="w-full h-auto rounded-xl"
            />
          </div>
        </div>
        <div className="mt-8 text-center">
          <Link to="/features" className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
            See every feature in detail
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>


      {/* How it works */}
      <section className="bg-muted/30 border-y border-border/40">
        <div className="container py-24">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <Badge variant="outline" className="mb-4">How it works</Badge>
            <h2 className="text-3xl md:text-5xl font-bold">From clone to launch in 4 steps</h2>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((s) => (
              <div key={s.n} className="relative">
                <div className="text-6xl font-display font-bold text-gradient mb-3">{s.n}</div>
                <h3 className="font-semibold text-lg mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container py-24">
        <div className="max-w-2xl mx-auto text-center mb-10">
          <Badge variant="outline" className="mb-4">Loved by builders</Badge>
          <h2 className="text-3xl md:text-5xl font-bold">Don't just take our word</h2>
        </div>
        <TemplatePlaceholderRibbon
          id="index-testimonials"
          className="max-w-md mx-auto mb-8"
          message="Placeholder testimonials — replace in src/pages/Index.tsx"
          hint="Visible only on Lovable preview hosts — never shown on your custom domain."
        />
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <Card key={t.name} className="p-6 border-border/60">
              <div className="flex gap-1 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                ))}
              </div>
              <p className="text-foreground mb-6 leading-relaxed">"{t.quote}"</p>
              <div>
                <p className="font-semibold text-sm">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Pricing teaser */}
      <section className="bg-muted/30 border-y border-border/40">
        <div className="container py-24 text-center">
          <Badge variant="outline" className="mb-4">Simple pricing</Badge>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Start free. Scale when ready.</h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-8">
            Three plans, no surprises. Cancel anytime.
          </p>
          <Button size="lg" asChild className="h-12 px-8">
            <Link to="/pricing">Compare plans <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
      </section>

      {/* FAQ */}
      <section className="container py-24">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">FAQ</Badge>
            <h2 className="text-3xl md:text-5xl font-bold">Questions, answered</h2>
          </div>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((f, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger className="text-left">
                  <span className="flex-1">{f.q}</span>
                  {f.status && (
                    <StatusBadge status={f.status} tooltip={f.tooltip} className="ml-3 mr-2 shrink-0" />
                  )}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Explore everything */}
      <section className="container py-16 border-t border-border/40">
        <div className="max-w-4xl mx-auto text-center mb-8">
          <Badge variant="outline" className="mb-4">Explore</Badge>
          <h2 className="text-2xl md:text-3xl font-bold">Every page on this site</h2>
        </div>
        <div className="max-w-4xl mx-auto grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {publicNavGroups.map((g) => (
            <div key={g.title}>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">{g.title}</h3>
              <ul className="space-y-1.5">
                {g.links.map((l) => (
                  <li key={l.to}>
                    {l.to.startsWith("/#") ? (
                      <a href={l.to} className="text-sm hover:text-primary">{l.label}</a>
                    ) : (
                      <Link to={l.to} className="text-sm hover:text-primary">{l.label}</Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="container pb-24">
        <Card className="p-12 md:p-16 border-border/60 overflow-hidden relative">
          <div className="absolute inset-0 gradient-mesh opacity-60" aria-hidden />
          <div className="relative max-w-2xl mx-auto text-center">
            <MessageSquare className="h-12 w-12 mx-auto mb-6 text-primary" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Get notified when we ship</h2>
            <p className="text-muted-foreground mb-8">
              One email a month. Product updates, new templates, and behind-the-scenes.
            </p>
            <NewsletterForm source="landing-cta" className="max-w-md mx-auto" />
          </div>
        </Card>
      </section>
    </MarketingLayout>
  );
};

export default Index;
