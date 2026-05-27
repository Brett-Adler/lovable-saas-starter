import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { PageSeo } from "@/components/seo/PageSeo";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ArrowRight, ExternalLink, Sparkles, Heart, Share2, Rocket, ImageIcon, Copy, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

type Step = {
  title: string;
  body: string;
  where?: { label: string; to?: string; href?: string }[];
};

const steps: Step[] = [
  {
    title: "Open the template in Lovable",
    body: "Visit the live demo and click through to open it in the Lovable editor. You don't need an account yet — Lovable will prompt you when you remix.",
    where: [
      { label: "Live demo", href: "https://lovable-saas-starter.lovable.app" },
    ],
  },
  {
    title: "Click Remix",
    body: "Hit the Remix button in the top bar. Lovable copies the code into a fresh project on your account and provisions a brand-new Lovable Cloud backend automatically — database, auth, edge functions, storage, all isolated from the original.",
  },
  {
    title: "Sign up inside your remix",
    body: "Open your new project's live preview and create your first account. The first signup is automatically promoted to admin — no SQL required.",
    where: [{ label: "After remix: /signup", to: "/signup" }],
  },
  {
    title: "Rebrand in one prompt",
    body: "Paste one of the ready-made prompts below into Lovable chat. The whole app — landing, pricing copy, About page, logo placeholders, and metadata — updates in a single pass.",
  },
  {
    title: "Upload your logo",
    body: "Open the Brand kit page in the admin. Drop in one logo and the generator produces every favicon, splash screen, social card, and PWA icon for you.",
    where: [{ label: "Brand kit", to: "/admin/brand" }],
  },
  {
    title: "Edit site name and meta",
    body: "Site name, default SEO title and description, social handles, and the From: email address for transactional mail all live in Site settings.",
    where: [
      { label: "Site settings", to: "/admin/site-settings" },
      { label: "Per-page SEO", to: "/admin/seo" },
    ],
  },
  {
    title: "Replace the legal pages",
    body: "Privacy and Terms ship with placeholder text. Before launch, replace them with real copy that lists every data processor (Lovable Cloud, Stripe, Resend, Twilio, analytics).",
    where: [
      { label: "Privacy", to: "/privacy" },
      { label: "Terms", to: "/terms" },
    ],
  },
  {
    title: "Walk the launch checklist",
    body: "When the brand is yours and the copy is right, open the launch checklist. It lists every external credential (live Stripe key, sending domain, optional Twilio/Web Push) you still need before flipping to production.",
    where: [{ label: "Launch checklist", to: "/launch" }],
  },
];

const prompts: { title: string; body: string }[] = [
  {
    title: "Full rebrand",
    body: `Rebrand this app as "Acme" — a project management tool for design teams.
Use a calm sage + cream palette, Inter for body and Space Grotesk for headings.
Update the home page hero, pricing copy, About page, and FAQ to match.
Replace "SaaS Starter" with "Acme" across logos, footer, and metadata.`,
  },
  {
    title: "Change pricing",
    body: `Change pricing to three tiers: Starter $0, Pro $19/mo, Business $49/mo,
with a 20% annual discount. Update /pricing, the landing teaser, and the
Stripe products in the checkout edge function. Add a changelog entry.`,
  },
  {
    title: "Pivot to a niche",
    body: `Turn this into a SaaS for fitness studios. Rewrite the marketing copy on
/, /about, /pricing, and the FAQ to speak to studio owners. Keep auth,
billing, teams, and admin exactly as-is.`,
  },
];

const listing = {
  title: "SaaS Starter — production-ready multi-tenant SaaS",
  tagline: "Auth, orgs, Stripe billing, admin, emails, and notifications. Remix and ship in a weekend.",
  category: "Business apps → SaaS templates",
  about: `SaaS Starter is a complete, production-grade SaaS template. Remix it and you get a working app with multi-tenant organizations (owner / admin / member roles), email + Google authentication, Stripe Checkout and Customer Portal, an admin panel, transactional email pipeline, realtime notifications, a brand kit generator, and a launch checklist.

Everything is wired to Lovable Cloud — no separate Supabase project to spin up, no API keys to copy. The first account you create is automatically promoted to admin.

Rebrand the whole app in a single prompt: drop in your logo, change the palette, rewrite the marketing copy. Walk the built-in launch checklist when you're ready to flip on live Stripe and a custom sending domain.

Great for: indie SaaS founders, agencies launching client products, hackathon teams, and anyone tired of rebuilding auth + billing + admin for every new idea.`,
};

const checklist: { label: string; detail: string }[] = [
  { label: "App icon (1024×1024)", detail: "Use the generated icon-1024.png from /admin/brand, or upload your own logo first." },
  { label: "Cover image (1600×900)", detail: "A hero screenshot of the landing page. The Brand kit page exports a social card you can reuse." },
  { label: "2–4 in-app screenshots", detail: "Suggested: landing hero, pricing page, dashboard, admin overview. Take them at 1440px wide." },
  { label: "Title (≤60 chars)", detail: "Lead with what it is, then the differentiator. See suggested copy below." },
  { label: "Tagline (≤120 chars)", detail: "One sentence on the outcome. Avoid jargon." },
  { label: "About (3–5 paragraphs)", detail: "What it does, what's included, who it's for, and how to get started." },
  { label: "Category", detail: "Business apps → SaaS templates is the closest fit." },
];

const UseTemplateLovable = () => {
  const [copied, setCopied] = useState<string | null>(null);
  const copy = (key: string, text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(key);
      setTimeout(() => setCopied((c) => (c === key ? null : c)), 1500);
    });
  };
  return (

  <MarketingLayout>
    <PageSeo
      path="/use-template/lovable"
      title="Use this template on Lovable — remix in one click"
      description="Step-by-step guide to remixing the SaaS Starter on Lovable. No terminal, no setup — Cloud backend is provisioned automatically."
    />
    <section className="container py-20 md:py-28">
      <div className="max-w-3xl mx-auto">
        <Badge variant="outline" className="mb-4">For Lovable users</Badge>
        <h1 className="text-4xl md:text-5xl font-bold">Use this template on Lovable</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Remix the project in one click. Lovable provisions a fresh Cloud backend for you, the
          first signup becomes admin, and you can rebrand the whole app in a single prompt.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3 text-sm">
          <Link
            to="/use-template/github"
            className="inline-flex items-center gap-1 text-primary hover:underline font-medium"
          >
            Prefer GitHub? See the developer guide <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        <Card className="mt-8 p-5 bg-muted/40 border-dashed">
          <div className="flex items-start gap-3">
            <Sparkles className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div className="text-sm text-muted-foreground leading-relaxed">
              <p className="font-medium text-foreground">What you don't have to set up</p>
              <p className="mt-1">
                Database, auth (email + Google), transactional emails, sandbox Stripe, admin panel,
                analytics, and the realtime notification system are all preconfigured. You can sign
                up, create an organization, invite a teammate, and run a test checkout within
                minutes of remixing.
              </p>
            </div>
          </div>
        </Card>

        <div className="mt-10 space-y-4">
          {steps.map((step, i) => (
            <Card key={step.title} className="p-5">
              <div className="flex items-start gap-4">
                <div className="h-8 w-8 rounded-full bg-muted text-foreground/70 flex items-center justify-center text-sm font-semibold shrink-0">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-semibold text-foreground">{step.title}</h2>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{step.body}</p>
                  {step.where && step.where.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-3">
                      {step.where.map((w) =>
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

        <h2 id="listing-preview" className="mt-16 text-2xl font-bold">Template listing preview</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          A mock of how this project would appear in the Lovable template gallery, plus the assets and copy
          you'll want ready before you publish. Hit copy on any field to grab the suggested text.
        </p>

        {/* Mock listing card */}
        <Card className="mt-6 overflow-hidden">
          <div className="p-5 border-b border-border flex items-start gap-4">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary/30 to-primary/10 border border-border flex items-center justify-center shrink-0">
              <Rocket className="h-7 w-7 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs text-muted-foreground">{listing.category}</div>
              <h3 className="mt-1 text-lg font-semibold text-foreground truncate">{listing.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{listing.tagline}</p>
            </div>
            <div className="hidden sm:flex flex-col items-end gap-2 shrink-0">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground">
                  Visit <ExternalLink className="h-3 w-3" />
                </span>
                <span className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-xs font-medium">
                  Share <Share2 className="h-3 w-3" />
                </span>
                <span className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1.5 text-xs">
                  <Heart className="h-3 w-3" /> 0
                </span>
              </div>
              <span className="text-xs text-muted-foreground">Preview only</span>
            </div>
          </div>

          <div className="p-5 grid grid-cols-2 sm:grid-cols-4 gap-3 bg-muted/30">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="aspect-video rounded-md border border-dashed border-border bg-background flex flex-col items-center justify-center text-xs text-muted-foreground gap-1"
              >
                <ImageIcon className="h-4 w-4" />
                Screenshot {i}
              </div>
            ))}
          </div>

          <div className="p-5">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold">About</h4>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={() => copy("about", listing.about)}
              >
                {copied === "about" ? (
                  <><Check className="h-3 w-3 mr-1" /> Copied</>
                ) : (
                  <><Copy className="h-3 w-3 mr-1" /> Copy</>
                )}
              </Button>
            </div>
            <div className="mt-2 text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
              {listing.about}
            </div>
          </div>
        </Card>

        {/* Field-by-field copy helpers */}
        <div className="mt-6 grid sm:grid-cols-2 gap-3">
          {[
            { key: "title", label: "Title", value: listing.title },
            { key: "tagline", label: "Tagline", value: listing.tagline },
            { key: "category", label: "Category", value: listing.category },
          ].map((f) => (
            <Card key={f.key} className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {f.label}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-xs"
                  onClick={() => copy(f.key, f.value)}
                >
                  {copied === f.key ? (
                    <><Check className="h-3 w-3 mr-1" /> Copied</>
                  ) : (
                    <><Copy className="h-3 w-3 mr-1" /> Copy</>
                  )}
                </Button>
              </div>
              <p className="mt-1 text-sm text-foreground">{f.value}</p>
            </Card>
          ))}
        </div>

        {/* Asset checklist */}
        <h3 className="mt-10 text-lg font-semibold">What to prepare before publishing</h3>
        <Card className="mt-3 p-5">
          <ul className="divide-y divide-border">
            {checklist.map((c) => (
              <li key={c.label} className="py-3 flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4">
                <span className="text-sm font-medium text-foreground sm:w-56 shrink-0">{c.label}</span>
                <span className="text-sm text-muted-foreground">{c.detail}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-muted-foreground">
            Tip: open <Link to="/admin/brand" className="text-primary hover:underline">Brand kit</Link> to export
            every icon size in one click, and the <Link to="/" className="text-primary hover:underline">landing page</Link>{" "}
            already has a polished hero you can screenshot for the cover image.
          </p>
        </Card>

        <h2 id="prompts" className="mt-16 text-2xl font-bold">Ready-made rebrand prompts</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Each prompt is one self-contained message. Paste into Lovable chat after remixing.
        </p>
        <div className="mt-6 space-y-4">
          {prompts.map((p) => (
            <Card key={p.title} className="p-5">
              <h3 className="text-base font-semibold">{p.title}</h3>
              <pre className="mt-3 text-xs font-mono whitespace-pre-wrap text-muted-foreground bg-muted/40 rounded-md p-3 overflow-x-auto">
                {p.body}
              </pre>
            </Card>
          ))}
        </div>

        <Card className="mt-10 p-5 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-semibold">Ready for production?</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Walk the launch checklist for live Stripe, custom domain, and sending domain setup.
            </p>
          </div>
          <Link
            to="/launch"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            Open launch checklist <ArrowRight className="h-3 w-3" />
          </Link>
        </Card>

        <p className="mt-10 text-sm text-muted-foreground">
          Want the full developer reference? See the{" "}
          <Link to="/readme" className="text-primary hover:underline">
            setup guide
          </Link>{" "}
          or{" "}
          <Link to="/docs" className="text-primary hover:underline">
            architecture docs
          </Link>
          .
        </p>
      </div>
    </section>
    </MarketingLayout>
  );
};

export default UseTemplateLovable;

