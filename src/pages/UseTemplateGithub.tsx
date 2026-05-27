import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { PageSeo } from "@/components/seo/PageSeo";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ArrowRight, ExternalLink, GitBranch } from "lucide-react";

type Step = {
  title: string;
  body: string;
  code?: string;
  where?: { label: string; to?: string; href?: string }[];
};

const steps: Step[] = [
  {
    title: "Remix on Lovable first",
    body: "Even with a GitHub-first workflow, you remix on Lovable once so Cloud provisions a fresh backend for you (database, auth, edge functions, storage). After that, you can stay in your editor and treat Lovable as an optional collaborator.",
    where: [
      { label: "Live demo / template", href: "https://lovable-saas-starter.lovable.app" },
    ],
  },
  {
    title: "Connect your GitHub account",
    body: "In your remixed project, open Settings → GitHub. Lovable creates a new repo on your account and turns on two-way sync: any commit on the connected branch shows up in the Lovable editor, and any prompt in Lovable commits back to GitHub.",
    where: [
      { label: "Git integration docs", href: "https://docs.lovable.dev/integrations/git" },
    ],
  },
  {
    title: "Clone and install locally",
    body: "Once the repo exists, clone it and install dependencies. The dev server runs on http://localhost:8080.",
    code: `git clone https://github.com/<your-username>/<your-repo>.git
cd <your-repo>
npm install        # or: bun install
npm run dev`,
  },
  {
    title: "Your .env is already there",
    body: "The .env file (Lovable Cloud URL + anon key) is generated and kept in sync automatically once the project is linked to Lovable. Your local dev server talks to the same Cloud backend as the editor preview — no separate Supabase project to spin up.",
  },
  {
    title: "Know where things live",
    body: "Pages live in src/pages, shared UI in src/components, edge functions in supabase/functions/*, and database migrations in supabase/migrations/. Migrations run automatically; edge functions deploy on save inside Lovable.",
  },
  {
    title: "Push, pull, prompt",
    body: "Treat the connected branch like any other GitHub branch. Push from your editor and the changes appear in Lovable on the next sync. Run a prompt in Lovable and you'll see the commit land in GitHub. Avoid editing the same file in both places at the same time.",
  },
  {
    title: "Walk the launch checklist",
    body: "When you're ready to ship, run through the launch checklist for live Stripe keys, sending domain verification, optional Twilio / Web Push, and custom domain setup.",
    where: [{ label: "Launch checklist", to: "/launch" }],
  },
];

const layout: { path: string; what: string }[] = [
  { path: "src/pages/", what: "Route components (marketing, auth, dashboard, admin)." },
  { path: "src/components/", what: "Shared UI, shadcn primitives, marketing chrome." },
  { path: "src/hooks/", what: "Auth, organization, plan, subscription, site settings." },
  { path: "supabase/functions/", what: "Edge functions — Stripe, email pipeline, push, SMS." },
  { path: "supabase/migrations/", what: "Database schema, RLS policies, triggers, GRANTs." },
  { path: "src/data/changelog.ts", what: "Append user-visible changes here." },
  { path: "public/", what: "Logos, favicons, sitemap, robots, llms.txt — swap branding here." },
];

const UseTemplateGithub = () => (
  <MarketingLayout>
    <PageSeo
      path="/use-template/github"
      title="Use this template on GitHub — clone and sync"
      description="Developer guide to using the SaaS Starter with GitHub. Clone locally, keep Lovable as a collaborator, ship from your own editor."
    />
    <section className="container py-20 md:py-28">
      <div className="max-w-3xl mx-auto">
        <Badge variant="outline" className="mb-4">For GitHub users</Badge>
        <h1 className="text-4xl md:text-5xl font-bold">Use this template on GitHub</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Keep the code in your own repo, run it locally, and ship from the editor you already use.
          Lovable stays as an optional two-way collaborator.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3 text-sm">
          <Link
            to="/use-template/lovable"
            className="inline-flex items-center gap-1 text-primary hover:underline font-medium"
          >
            Prefer the no-code flow? See the Lovable guide <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        <Card className="mt-8 p-5 bg-muted/40 border-dashed">
          <div className="flex items-start gap-3">
            <GitBranch className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div className="text-sm text-muted-foreground leading-relaxed">
              <p className="font-medium text-foreground">Why you still need Lovable once</p>
              <p className="mt-1">
                Lovable Cloud provisions your backend (database, auth, edge functions, storage) and
                manages the synced .env. Forking the GitHub repo directly without remixing first
                won't give you a working backend — you'd need to wire up a Supabase project by hand.
                Remix once on Lovable, then live in GitHub.
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
                  {step.code && (
                    <pre className="mt-3 text-xs font-mono whitespace-pre-wrap text-muted-foreground bg-muted/40 rounded-md p-3 overflow-x-auto">
                      {step.code}
                    </pre>
                  )}
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

        <h2 className="mt-16 text-2xl font-bold">Project layout</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The bits you'll edit most often.
        </p>
        <Card className="mt-6 p-5">
          <ul className="divide-y divide-border">
            {layout.map((l) => (
              <li key={l.path} className="py-3 flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4">
                <code className="text-xs font-mono text-foreground bg-muted/40 rounded px-2 py-0.5 w-fit shrink-0">
                  {l.path}
                </code>
                <span className="text-sm text-muted-foreground">{l.what}</span>
              </li>
            ))}
          </ul>
        </Card>

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
          For the full architecture reference — RLS patterns, edge function conventions, plan
          gating — see the{" "}
          <Link to="/readme" className="text-primary hover:underline">
            setup guide
          </Link>{" "}
          and{" "}
          <Link to="/docs" className="text-primary hover:underline">
            docs
          </Link>
          .
        </p>
      </div>
    </section>
  </MarketingLayout>
);

export default UseTemplateGithub;
