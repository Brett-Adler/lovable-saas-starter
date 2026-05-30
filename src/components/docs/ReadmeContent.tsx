import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  ExternalLink,
  Github,
  MessageSquare,
  Palette,
  Rocket,
  ShieldAlert,
  Sparkles,
  Wrench,
} from "lucide-react";
import { Link } from "react-router-dom";
import { ReactNode } from "react";
import { CodeBlock } from "./CodeBlock";

export const docsSections = [
  { id: "use-this-starter", label: "Use this starter" },
  { id: "first-run-quickstart", label: "First-run quickstart" },
  { id: "whats-included", label: "What's included" },
  { id: "customizing", label: "Customizing the app" },
  { id: "legal-placeholders", label: "Privacy & Terms" },
  { id: "roadmap", label: "Roadmap" },
  { id: "tech-stack", label: "Tech stack" },
];

const Section = ({
  id,
  icon: Icon,
  title,
  children,
}: {
  id: string;
  icon: any;
  title: string;
  children: ReactNode;
}) => (
  <section className="mt-14 scroll-mt-24" aria-labelledby={id}>
    <div className="flex items-center gap-3 mb-5">
      <div
        aria-hidden="true"
        className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center"
      >
        <Icon className="h-5 w-5" />
      </div>
      <h2 id={id} className="text-2xl md:text-3xl font-bold tracking-tight">
        {title}
      </h2>
    </div>
    <div className="text-foreground/85 leading-relaxed space-y-4">{children}</div>
  </section>
);

const Code = ({ children }: { children: ReactNode }) => (
  <code className="px-1.5 py-0.5 rounded bg-muted text-foreground text-[0.875em] font-mono font-medium break-words">
    {children}
  </code>
);

const ExtLink = ({ href, children }: { href: string; children: ReactNode }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer external"
    className="inline-flex items-center gap-1 text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
  >
    {children}
    <ExternalLink className="h-3 w-3" aria-hidden="true" />
    <span className="sr-only"> (opens in new tab)</span>
  </a>
);

const PROMPT_REBRAND = `Rebrand this app as "Acme" — a project management tool for design teams.
Use a calm sage + cream palette, Inter for body and Space Grotesk for headings.
Update the home page hero, pricing copy, About page, and FAQ to match.
Replace "SaaS Starter" with "Acme" across logos, footer, and metadata.`;

const PROMPT_PRICING = `Change pricing to three tiers: Starter $0, Pro $19/mo, Business $49/mo,
with a 20% annual discount. Update /pricing, the landing teaser, and the
Stripe products in the checkout edge function. Add a changelog entry.`;

const PROMPT_PIVOT = `Turn this into a SaaS for fitness studios. Rewrite the marketing copy on
/, /about, /pricing, and the FAQ to speak to studio owners. Keep auth,
billing, teams, and admin exactly as-is.`;

const PROMPT_SWAP = `Update README and the /readme page to reference Postmark instead of Resend
for marketing email. Don't change any edge functions or runtime behavior —
docs only.`;

const GIT_CLONE = `git clone https://github.com/<your-username>/<your-repo>.git
cd <your-repo>
npm install        # or: bun install
npm run dev        # http://localhost:8080`;

const roadmap: { phase: string; label: string; status: "shipped" | "in-progress"; note?: ReactNode }[] = [
  { phase: "Phase 1–2", label: "Branding, marketing site, legal scaffolding", status: "shipped" },
  { phase: "Phase 3", label: "Authentication (email, Google, Apple, password reset)", status: "shipped" },
  { phase: "Phase 4", label: "Organizations, invites, role-based UI", status: "shipped" },
  { phase: "Phase 5", label: "Stripe billing", status: "shipped" },
  {
    phase: "Phase 6",
    label: "Marketing email pipeline",
    status: "shipped",
    note: (
      <>
        wired — add <Code>RESEND_API_KEY</Code> + verified domain to enable
      </>
    ),
  },
  { phase: "Phase 7", label: "In-app notifications (bell + Realtime)", status: "shipped" },
  { phase: "Phase 8", label: "Self-hosted analytics dashboard", status: "shipped" },
  { phase: "Phase 9", label: "Admin tools (users, orgs, leads, campaigns, audit log)", status: "shipped" },
  { phase: "Phase 10", label: "SMS/OTP auth, Web Push, SSO/SAML scaffolding", status: "shipped" },
  {
    phase: "Phase 11",
    label: "Live credentials swap (Stripe live, Resend, Twilio, VAPID, Apple, SAML)",
    status: "in-progress",
    note: (
      <>
        see{" "}
        <Link to="/launch" className="text-primary hover:underline">
          /launch
        </Link>
      </>
    ),
  },
];

export const ReadmeContent = () => (
  <div className="max-w-3xl">
    <Badge variant="outline" className="mb-4">Docs</Badge>
    <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Setup &amp; Customization Guide</h2>
    <p className="mt-4 text-lg text-foreground/85 leading-relaxed">
      Everything you need to make this SaaS starter your own. Three ways to start:{" "}
      <strong className="text-foreground">remix</strong> the live Lovable project for a one-click copy,{" "}
      <strong className="text-foreground">customize with a prompt</strong> to rebrand or pivot in seconds, or{" "}
      <strong className="text-foreground">clone from GitHub</strong> to run it locally.
    </p>

    {/* First-run checklist */}
    <Card className="mt-8 p-6 border-primary/30 bg-primary/5">
      <div className="flex items-center gap-2 mb-3">
        <Rocket className="h-5 w-5 text-primary" aria-hidden="true" />
        <h3 className="text-lg font-bold text-foreground">First-run checklist</h3>
      </div>
      <p className="text-sm text-foreground/80 mb-4">
        Do these once right after remixing. Each step is a credential or content swap — no code changes required.
      </p>
      <ul className="space-y-2 text-sm">
        {[
          <>Set <Code>PUBLIC_SITE_NAME</Code>, <Code>PUBLIC_SITE_URL</Code>, <Code>SENDER_DOMAIN</Code>, and <Code>VITE_BASE_URL</Code> in project secrets so emails, sitemap, and meta tags use your brand.</>,
          <>Open <Link to="/admin/site-settings" className="text-primary hover:underline">Admin → Site settings</Link> and fill in company name, mailing address, contact email, and social links.</>,
          <>Open <Link to="/admin/brand" className="text-primary hover:underline">Admin → Brand</Link> to upload logo, favicon, and OG image. Set name and description in <Link to="/admin/seo" className="text-primary hover:underline">Admin → SEO</Link>.</>,
          <>Replace placeholder files in <Code>/public</Code> — see <Code>public/BRANDING.md</Code> for the swap list.</>,
          <>Swap Stripe test products for live ones in <Code>supabase/functions/create-checkout/index.ts</Code>, then update <Code>STRIPE_API_KEY</Code> + webhook secret.</>,
          <>Verify your sending domain in Resend (or your provider) and update the From address in Admin → Site settings.</>,
        ].map((item, i) => (
          <li key={i} className="flex gap-2">
            <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" aria-hidden="true" />
            <span className="text-foreground/85">{item}</span>
          </li>
        ))}
      </ul>
    </Card>

    {/* Coming-soon notice */}
    <Card className="mt-4 p-5 border-warning/40 bg-warning/10">
      <div className="flex items-center gap-2 mb-2">
        <AlertTriangle className="h-4 w-4 text-warning" aria-hidden="true" />
        <h3 className="font-semibold text-foreground text-sm">Coming-soon screens</h3>
      </div>
      <p className="text-sm text-foreground/85">
        A few dashboard pages ship as placeholders — <Code>/dashboard/settings/security</Code>,{" "}
        <Code>/dashboard/settings/api-keys</Code>, <Code>/dashboard/settings/webhooks</Code>, and the marketing{" "}
        <Code>/customers</Code> page. Build them out or remove the nav links before launch.
      </p>
    </Card>

    {/* Use this starter */}
    <Section id="use-this-starter" icon={Sparkles} title="Use this starter">
      <div className="grid gap-4 md:grid-cols-3 not-prose">
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-4 w-4 text-primary" aria-hidden="true" />
            <h3 className="font-semibold text-foreground">Remix on Lovable</h3>
          </div>
          <p className="text-sm text-foreground/80">
            One click forks this project into your Lovable workspace with Cloud preconfigured. Best for non-developers.
          </p>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="h-4 w-4 text-primary" aria-hidden="true" />
            <h3 className="font-semibold text-foreground">Customize with a prompt</h3>
          </div>
          <p className="text-sm text-foreground/80">
            Once remixed, rebrand or pivot the whole app in one message. See the prompt library below.
          </p>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-2">
            <Github className="h-4 w-4 text-primary" aria-hidden="true" />
            <h3 className="font-semibold text-foreground">Clone from GitHub</h3>
          </div>
          <p className="text-sm text-foreground/80">
            Run locally and keep the codebase in your own repo. Best alongside a developer workflow.
          </p>
        </Card>
      </div>

      <div className="mt-8 space-y-8">
        <div>
          <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" aria-hidden="true" /> 1. Remix on Lovable
          </h3>
          <ol className="list-decimal pl-6 space-y-1 marker:text-muted-foreground">
            <li>Open this project in Lovable.</li>
            <li>Click <strong className="text-foreground">Remix</strong> in the top bar.</li>
            <li>Sign in. Lovable copies the code and provisions a fresh Cloud backend automatically.</li>
            <li>Open the new project and start prompting — your remix is fully isolated from the original.</li>
          </ol>
        </div>

        <div>
          <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-primary" aria-hidden="true" /> 2. Customize with one prompt
          </h3>
          <p className="mb-3">
            Paste any of these into the chat after remixing. Each is one self-contained message.
          </p>
          <div className="space-y-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Full rebrand</p>
              <CodeBlock label="Rebrand prompt" code={PROMPT_REBRAND} />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Change pricing</p>
              <CodeBlock label="Pricing prompt" code={PROMPT_PRICING} />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Pivot to a niche</p>
              <CodeBlock label="Pivot prompt" code={PROMPT_PIVOT} />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Swap a provider in docs</p>
              <CodeBlock label="Provider swap prompt" code={PROMPT_SWAP} />
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
            <Github className="h-4 w-4 text-primary" aria-hidden="true" /> 3. Clone from GitHub
          </h3>
          <ol className="list-decimal pl-6 space-y-2 marker:text-muted-foreground">
            <li>
              In your Lovable project, open <strong className="text-foreground">Settings → GitHub</strong> and connect your account.
              Lovable creates a repo and keeps it two-way synced with the editor.
            </li>
            <li>Clone it locally and install dependencies:</li>
          </ol>
          <CodeBlock label="Clone and install commands" code={GIT_CLONE} className="mt-3" />
          <p className="mt-3 text-sm">
            The <Code>.env</Code> file (Lovable Cloud URL + anon key) is generated and synced automatically when the project is linked.
            Any push to the connected branch shows up in Lovable, and any prompt in Lovable commits back to GitHub.
          </p>
        </div>
      </div>
    </Section>

    {/* Quickstart */}
    <Section id="first-run-quickstart" icon={Rocket} title="First-run quickstart">
      <ol className="list-decimal pl-6 space-y-2 marker:text-muted-foreground">
        <li>
          Sign up at <Link to="/signup" className="text-primary hover:underline">/signup</Link>.{" "}
          <strong className="text-foreground">The first account is automatically promoted to admin.</strong>
        </li>
        <li>Create your first organization from the dashboard empty state.</li>
        <li>
          Invite teammates from <Code>/dashboard/members</Code> — they'll get a unique invite link.
        </li>
        <li>Customize branding, copy, and pricing (see below).</li>
      </ol>
    </Section>

    {/* What's included */}
    <Section id="whats-included" icon={BookOpen} title="What's included">
      <div className="grid gap-4 sm:grid-cols-2 not-prose">
        <Card className="p-4">
          <h3 className="font-semibold text-foreground mb-3">Public routes</h3>
          <div className="space-y-3 text-sm">
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Marketing</h4>
              <p className="flex flex-wrap gap-1.5"><Code>/</Code><Code>/pricing</Code><Code>/about</Code><Code>/contact</Code><Code>/customers</Code><Code>/blog</Code></p>
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Product</h4>
              <p className="flex flex-wrap gap-1.5"><Code>/demo</Code><Code>/waitlist</Code><Code>/newsletter</Code><Code>/integrations</Code><Code>/compare</Code></p>
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Docs &amp; meta</h4>
              <p className="flex flex-wrap gap-1.5"><Code>/docs</Code><Code>/readme</Code><Code>/launch</Code><Code>/changelog</Code><Code>/roadmap</Code><Code>/security</Code><Code>/status</Code><Code>/sitemap</Code><Code>/accessibility</Code></p>
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Legal</h4>
              <p className="flex flex-wrap gap-1.5"><Code>/privacy</Code><Code>/terms</Code></p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <h3 className="font-semibold text-foreground mb-3">Auth</h3>
          <ul className="text-sm space-y-1 text-foreground/85">
            <li><Code>/login</Code>, <Code>/signup</Code></li>
            <li><Code>/forgot-password</Code>, <Code>/reset-password</Code></li>
            <li>Google OAuth, Apple OAuth</li>
            <li>Invite flow: <Code>/invite/:token</Code></li>
          </ul>
        </Card>
        <Card className="p-4">
          <h3 className="font-semibold text-foreground mb-3">Dashboard (authed)</h3>
          <ul className="text-sm space-y-1 text-foreground/85">
            <li><Code>/dashboard</Code></li>
            <li><Code>/dashboard/organization</Code></li>
            <li><Code>/dashboard/members</Code></li>
            <li><Code>/dashboard/invitations</Code></li>
            <li><Code>/dashboard/billing</Code></li>
            <li><Code>/dashboard/settings</Code></li>
          </ul>
        </Card>
        <Card className="p-4">
          <h3 className="font-semibold text-foreground mb-3">Admin &amp; backend</h3>
          <ul className="text-sm space-y-1 text-foreground/85">
            <li><Code>/admin</Code> (admin role only)</li>
          </ul>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mt-4 mb-2">Backend tables</h4>
          <p className="text-sm flex flex-wrap gap-1.5">
            <Code>profiles</Code><Code>user_roles</Code><Code>organizations</Code><Code>organization_members</Code>
            <Code>organization_invites</Code><Code>subscriptions</Code><Code>leads</Code>
            <Code>marketing_subscribers</Code><Code>marketing_segments</Code><Code>marketing_campaigns</Code>
            <Code>notifications</Code><Code>notification_preferences</Code><Code>analytics_events</Code>
          </p>
        </Card>
      </div>
    </Section>

    {/* Customizing */}
    <Section id="customizing" icon={Palette} title="Customizing the app">
      <div className="space-y-6">
        <div>
          <h3 className="font-semibold text-foreground mb-1">Branding &amp; assets</h3>
          <p>
            All branding files live in <Code>public/</Code>. Swap them in place — no code changes needed.
            See <Code>public/BRANDING.md</Code> for exact dimensions of favicons, app icons, OG images, and logos.
            Update <Code>index.html</Code> with your real <Code>&lt;title&gt;</Code> and meta description.
          </p>
        </div>
        <div>
          <h3 className="font-semibold text-foreground mb-1">Colors &amp; design system</h3>
          <p>
            HSL design tokens live in <Code>src/index.css</Code> and <Code>tailwind.config.ts</Code>.
            Always reference semantic tokens (<Code>bg-background</Code>, <Code>text-primary</Code>) — never hard-code colors.
            Light + dark mode supported out of the box.
          </p>
        </div>
        <div>
          <h3 className="font-semibold text-foreground mb-1">Marketing copy</h3>
          <p>
            Each page is one file in <Code>src/pages/</Code> — edit <Code>Index.tsx</Code>,{" "}
            <Code>Pricing.tsx</Code>, <Code>About.tsx</Code>, <Code>Contact.tsx</Code> directly.
          </p>
        </div>
        <div>
          <h3 className="font-semibold text-foreground mb-1">Promoting more admins</h3>
          <p>
            The first user is auto-promoted. To add more later, ask Lovable:{" "}
            <em className="text-foreground">"Make user@example.com an admin."</em> Or insert into{" "}
            <Code>user_roles</Code> with role <Code>admin</Code>.
          </p>
        </div>
        <div>
          <h3 className="font-semibold text-foreground mb-1">OAuth providers</h3>
          <p>
            Google and Apple Sign-In are pre-wired with managed credentials and work out of the box.
            To use your own OAuth client (branding or compliance), configure it in the project's backend settings.
          </p>
        </div>
      </div>
    </Section>

    {/* Privacy & Terms warning */}
    <Section id="legal-placeholders" icon={ShieldAlert} title="Privacy Policy & Terms — placeholders">
      <Card className="p-6 border-warning/40 bg-warning/10">
        <div className="flex gap-3">
          <AlertTriangle className="h-5 w-5 text-warning shrink-0 mt-0.5" aria-hidden="true" />
          <div className="space-y-3">
            <p className="text-foreground font-semibold">
              The <Link to="/privacy" className="text-primary hover:underline">/privacy</Link> and{" "}
              <Link to="/terms" className="text-primary hover:underline">/terms</Link> pages ship with placeholder text.
              Replace them with real legal copy before launch.
            </p>
            <p className="text-foreground/85">When you write yours, make sure to:</p>
            <ul className="list-disc pl-6 space-y-1 marker:text-muted-foreground text-foreground/85">
              <li>Consult legal counsel — this template is not legal advice.</li>
              <li>Match your actual business, data practices, and obligations to users.</li>
              <li>
                Disclose <strong className="text-foreground">all</strong> data processors this app uses out of the box:
                Lovable Cloud (auth + database), Stripe (billing, once enabled), Resend (marketing email, once enabled),
                Twilio (SMS, once enabled), and the built-in analytics in <Code>analytics_events</Code>.
              </li>
              <li>Re-review every time you add a third-party service.</li>
            </ul>
            <div>
              <p className="font-semibold text-foreground mb-1">Free generators to start from:</p>
              <ul className="list-disc pl-6 space-y-1 marker:text-muted-foreground text-foreground/85">
                <li><ExtLink href="https://www.iubenda.com/">iubenda</ExtLink> — guided builder, free tier</li>
                <li><ExtLink href="https://www.termsfeed.com/">TermsFeed</ExtLink> — free privacy &amp; terms generators</li>
                <li><ExtLink href="https://www.privacypolicies.com/">PrivacyPolicies.com</ExtLink> — free + paid plans</li>
              </ul>
            </div>
          </div>
        </div>
      </Card>
    </Section>

    {/* Roadmap */}
    <Section id="roadmap" icon={Rocket} title="Roadmap">
      <ul className="space-y-2 not-prose">
        {roadmap.map((r) => (
          <li key={r.phase} className="flex items-start gap-3">
            <Badge
              variant={r.status === "shipped" ? "secondary" : "outline"}
              className="shrink-0 mt-0.5"
            >
              {r.status === "shipped" ? "Shipped" : "In progress"}
            </Badge>
            <div className="text-foreground/85">
              <strong className="text-foreground">{r.phase}</strong> — {r.label}
              {r.note && <span className="text-muted-foreground"> ({r.note})</span>}
            </div>
          </li>
        ))}
      </ul>
    </Section>

    {/* Tech stack */}
    <Section id="tech-stack" icon={Wrench} title="Tech stack">
      <div className="space-y-5">
        <div>
          <h3 className="font-semibold text-foreground mb-1">Frontend</h3>
          <ul className="list-disc pl-6 space-y-1 marker:text-muted-foreground">
            <li>React 18, Vite 5, TypeScript 5</li>
            <li>Tailwind CSS v3 with HSL design tokens, shadcn/ui components</li>
            <li>React Router v6, TanStack Query, React Hook Form + Zod</li>
            <li>Lucide icons, Sonner toasts, date-fns</li>
            <li>Vitest + Testing Library for unit tests</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-foreground mb-1">Lovable Cloud (managed Supabase)</h3>
          <ul className="list-disc pl-6 space-y-1 marker:text-muted-foreground">
            <li>Postgres with strict Row Level Security on every public table</li>
            <li>Auth: email/password, Google, Apple, phone OTP, SAML SSO scaffolding</li>
            <li>Edge Functions (Deno) for Stripe, email pipeline, push, admin tools</li>
            <li>Realtime channels for in-app notifications and subscriptions</li>
            <li>pgmq message queues for transactional + marketing email batching</li>
            <li>Storage buckets (ready, no buckets configured yet)</li>
            <li>Auto-generated TypeScript types from the live schema</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-foreground mb-1">Lovable AI Gateway</h3>
          <ul className="list-disc pl-6 space-y-1 marker:text-muted-foreground">
            <li>Single <Code>LOVABLE_API_KEY</Code> — no per-provider keys to manage</li>
            <li>Used from edge functions for AI features (summaries, classification, etc.)</li>
            <li>Access to Google Gemini and OpenAI GPT-5 model families</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-foreground mb-1">Third-party services (swap-ready)</h3>
          <ul className="list-disc pl-6 space-y-1 marker:text-muted-foreground">
            <li>Stripe — checkout, customer portal, webhooks (sandbox keys wired)</li>
            <li>Resend — transactional + marketing email (configure your verified sender domain)</li>
            <li>Twilio — SMS / OTP delivery (edge function stub ready)</li>
            <li>Web Push / VAPID — browser push notifications (service worker shipped)</li>
            <li>SAML 2.0 IdPs — Okta, Azure AD, Google Workspace (per-org config table ready)</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-foreground mb-1">Tooling</h3>
          <ul className="list-disc pl-6 space-y-1 marker:text-muted-foreground">
            <li>ESLint, Prettier-compatible formatting</li>
            <li>Sitemap generator script, SEO meta + JSON-LD per page</li>
            <li>Deployed via Lovable (custom domain ready)</li>
          </ul>
        </div>
      </div>
    </Section>
  </div>
);

export default ReadmeContent;
