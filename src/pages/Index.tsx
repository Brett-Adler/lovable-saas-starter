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

const features = [
  { icon: Lock, title: "Auth, batteries included", desc: "Email/password, Google, Apple, and SMS — wired and ready." },
  { icon: CreditCard, title: "Stripe payments", desc: "Subscriptions, customer portal, plan-gating, and admin billing." },
  { icon: Mail, title: "Branded emails", desc: "Auth + transactional templates. Marketing campaigns via Resend." },
  { icon: Users, title: "Teams & roles", desc: "Organizations, invites, and role-based access out of the box." },
  { icon: BarChart3, title: "Built-in analytics", desc: "Signups, MRR, churn, retention — your own self-hosted dashboard." },
  { icon: Smartphone, title: "SMS & notifications", desc: "Twilio for OTP login and critical alerts. Per-user preferences." },
  { icon: Shield, title: "Secure by default", desc: "Row-level security, separate roles table, validated inputs everywhere." },
  { icon: Sparkles, title: "Beautiful UI", desc: "Polished design system with light + dark mode and themable tokens." },
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

const faqs = [
  { q: "What's included?", a: "Authentication (email, Google, Apple, SMS OTP), Stripe payments with a 14-day trial, transactional and marketing email, in-app notifications, audit logs, teams and roles, full settings UI, super-admin dashboard, and built-in analytics. Plus scaffolding for SAML SSO, SMS via Twilio, and Web Push." },
  { q: "Are SMS, push, and SSO live out of the box?", a: "The UI, database, and edge functions are wired up. SMS waits for Twilio credentials, Web Push waits for VAPID keys, and SAML SSO waits for your identity provider — each is a credential swap, not a rewrite. See README.md for the pre-launch checklist." },
  { q: "Can I use this commercially?", a: "Yes. This is a starter template — once you've built your product on top, it's yours." },
  { q: "How do I add my logo?", a: "Drop your files into /public using the names listed in BRANDING.md. The app picks them up automatically." },
  { q: "Does it support dark mode?", a: "Yes — every component is themed via semantic tokens. Toggle in the header." },
  { q: "What about marketing emails?", a: "We use Resend on a separate subdomain so it never affects deliverability of your auth emails." },
];

const Index = () => {
  const { hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [hash]);

  return (
    <MarketingLayout>
      <PageSeo path="/" />
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

          {/* Mock product preview */}
          <div className="mt-16 max-w-5xl mx-auto animate-fade-in-up [animation-delay:200ms]">
            <Card className="overflow-hidden border-border/60 shadow-2xl">
              {/* Faux window chrome */}
              <div className="flex items-center gap-1.5 px-4 py-3 border-b border-border/60 bg-muted/40">
                <span className="h-3 w-3 rounded-full bg-destructive/70" />
                <span className="h-3 w-3 rounded-full bg-warning/70" />
                <span className="h-3 w-3 rounded-full bg-success/70" />
                <div className="mx-auto text-xs text-muted-foreground font-mono">app.saas-starter.com/dashboard</div>
              </div>

              <div className="aspect-[16/9] bg-gradient-to-br from-primary/5 via-background to-accent/5 grid grid-cols-[180px_1fr] text-left">
                {/* Sidebar */}
                <aside className="border-r border-border/60 bg-background/60 p-4 hidden sm:flex flex-col gap-1.5">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="h-7 w-7 rounded-lg gradient-primary grid place-items-center">
                      <Zap className="h-4 w-4 text-primary-foreground" />
                    </div>
                    <span className="text-sm font-semibold">Acme</span>
                  </div>
                  {[
                    { icon: BarChart3, label: "Overview", active: true },
                    { icon: Users, label: "Customers" },
                    { icon: CreditCard, label: "Billing" },
                    { icon: Mail, label: "Campaigns" },
                    { icon: MessageSquare, label: "Inbox" },
                    { icon: Shield, label: "Settings" },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className={`flex items-center gap-2 rounded-md px-2.5 py-1.5 text-xs ${
                        item.active ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground"
                      }`}
                    >
                      <item.icon className="h-3.5 w-3.5" />
                      {item.label}
                    </div>
                  ))}
                </aside>

                {/* Main area */}
                <div className="p-5 flex flex-col gap-4 min-w-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold">Good morning, Alex</div>
                      <div className="text-xs text-muted-foreground">Here's what's happening today</div>
                    </div>
                    <Badge variant="secondary" className="hidden sm:inline-flex">
                      <Sparkles className="h-3 w-3 mr-1" /> Pro plan
                    </Badge>
                  </div>

                  {/* Stat cards */}
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: "MRR", value: "$24.8k", delta: "+12.4%" },
                      { label: "Customers", value: "1,284", delta: "+86" },
                      { label: "Churn", value: "1.9%", delta: "-0.3%" },
                    ].map((s) => (
                      <div key={s.label} className="rounded-lg border border-border/60 bg-background/80 p-3">
                        <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.label}</div>
                        <div className="text-base font-semibold mt-0.5">{s.value}</div>
                        <div className="text-[10px] text-success mt-0.5">{s.delta}</div>
                      </div>
                    ))}
                  </div>

                  {/* Chart */}
                  <div className="flex-1 rounded-lg border border-border/60 bg-background/80 p-3 min-h-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-xs font-medium">Revenue</div>
                      <div className="text-[10px] text-muted-foreground">Last 30 days</div>
                    </div>
                    <svg viewBox="0 0 300 90" className="w-full h-full" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1">
                          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <path
                        d="M0,70 L25,60 L50,65 L75,50 L100,55 L125,40 L150,45 L175,30 L200,35 L225,22 L250,28 L275,15 L300,20 L300,90 L0,90 Z"
                        fill="url(#chartFill)"
                      />
                      <path
                        d="M0,70 L25,60 L50,65 L75,50 L100,55 L125,40 L150,45 L175,30 L200,35 L225,22 L250,28 L275,15 L300,20"
                        fill="none"
                        stroke="hsl(var(--primary))"
                        strokeWidth="2"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Logo cloud */}
      <section className="border-y border-border/40 bg-muted/20">
        <div className="container py-10">
          <p className="text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-6">
            Trusted by teams shipping faster
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4 opacity-60">
            {["Acme", "Globex", "Initech", "Umbrella", "Hooli", "Pied Piper"].map((name) => (
              <span key={name} className="font-display font-bold text-lg text-muted-foreground">{name}</span>
            ))}
          </div>
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
          {features.map((f, i) => (
            <Card key={f.title} className="p-6 border-border/60 shadow-card hover:shadow-md transition-shadow group">
              <div className="h-11 w-11 rounded-xl bg-primary-soft flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <f.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold mb-1">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </Card>
          ))}
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
        <div className="max-w-2xl mx-auto text-center mb-16">
          <Badge variant="outline" className="mb-4">Loved by builders</Badge>
          <h2 className="text-3xl md:text-5xl font-bold">Don't just take our word</h2>
        </div>
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
                <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
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
