import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { AlertTriangle, BookOpen, Github, MessageSquare, Palette, Rocket, ShieldAlert, Sparkles, Wrench } from "lucide-react";
import { Link } from "react-router-dom";

const Section = ({ icon: Icon, title, children }: { icon: any; title: string; children: React.ReactNode }) => (
  <section className="mt-12">
    <div className="flex items-center gap-3 mb-4">
      <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
        <Icon className="h-5 w-5" />
      </div>
      <h2 className="text-2xl font-bold">{title}</h2>
    </div>
    <div className="text-muted-foreground space-y-3 leading-relaxed">{children}</div>
  </section>
);

const Code = ({ children }: { children: React.ReactNode }) => (
  <code className="px-1.5 py-0.5 rounded bg-muted text-foreground text-sm font-mono">{children}</code>
);

export const ReadmeContent = () => (
      <div className="max-w-3xl mx-auto">
        <Badge variant="outline" className="mb-4">Docs</Badge>
        <h1 className="text-4xl md:text-5xl font-bold">Setup &amp; Customization Guide</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Everything you need to make this SaaS starter your own. There are three ways to start:
          <strong className="text-foreground"> remix</strong> the live Lovable project for a one-click copy,
          <strong className="text-foreground"> customize with a prompt</strong> to rebrand or pivot in seconds, or
          <strong className="text-foreground"> clone from GitHub</strong> if you want to run it locally.
        </p>

        {/* Use this starter */}
        <Section icon={Sparkles} title="Use this starter">
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="p-5">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <h3 className="font-semibold text-foreground">Remix on Lovable</h3>
              </div>
              <p className="text-sm mb-3">
                One click forks the live project into your own Lovable workspace with Cloud preconfigured. Best for non-developers.
              </p>
              <a
                href="https://lovable.dev/projects/65731117-aac8-4723-ab30-aec22d01517c?remix=1"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
              >
                Remix this project →
              </a>
            </Card>
            <Card className="p-5">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="h-4 w-4 text-primary" />
                <h3 className="font-semibold text-foreground">Customize with a prompt</h3>
              </div>
              <p className="text-sm">
                Once remixed, rebrand or pivot the whole app in one message. See the prompt library below.
              </p>
            </Card>
            <Card className="p-5">
              <div className="flex items-center gap-2 mb-2">
                <Github className="h-4 w-4 text-primary" />
                <h3 className="font-semibold text-foreground">Clone from GitHub</h3>
              </div>
              <p className="text-sm">
                Run locally and keep the codebase in your own repo. Best when you want a developer workflow alongside Lovable.
              </p>
            </Card>
          </div>

          <div className="mt-8 space-y-6">
            <div>
              <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" /> 1. Remix on Lovable
              </h3>
              <ol className="list-decimal list-inside space-y-1">
                <li>
                  Open the{" "}
                  <a href="https://lovable-saas-starter.lovable.app" target="_blank" rel="noreferrer" className="text-primary hover:underline">
                    live demo
                  </a>
                  {" "}or the{" "}
                  <a
                    href="https://lovable.dev/projects/65731117-aac8-4723-ab30-aec22d01517c"
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary hover:underline"
                  >
                    Lovable project page
                  </a>.
                </li>
                <li>Click <strong className="text-foreground">Remix</strong> in the top bar (or use the direct link in the card above).</li>
                <li>Sign in. Lovable copies the code and provisions a fresh Lovable Cloud backend for you automatically.</li>
                <li>Open the new project and start prompting — your remix is fully isolated from the original.</li>
              </ol>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-primary" /> 2. Customize with one prompt
              </h3>
              <p className="mb-3">
                Paste any of these into the chat after remixing. Each is intentionally one self-contained message so you spend a single credit's worth of work.
              </p>
              <div className="space-y-3">
                <Card className="p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Full rebrand</p>
                  <pre className="text-sm whitespace-pre-wrap font-mono text-foreground">
{`Rebrand this app as "Acme" — a project management tool for design teams.
Use a calm sage + cream palette, Inter for body and Space Grotesk for headings.
Update the home page hero, pricing copy, About page, and FAQ to match.
Replace "SaaS Starter" with "Acme" across logos, footer, and metadata.`}
                  </pre>
                </Card>
                <Card className="p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Change pricing</p>
                  <pre className="text-sm whitespace-pre-wrap font-mono text-foreground">
{`Change pricing to three tiers: Starter $0, Pro $19/mo, Business $49/mo,
with a 20% annual discount. Update /pricing, the landing teaser, and the
Stripe products in the checkout edge function. Add a changelog entry.`}
                  </pre>
                </Card>
                <Card className="p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Pivot to a niche</p>
                  <pre className="text-sm whitespace-pre-wrap font-mono text-foreground">
{`Turn this into a SaaS for fitness studios. Rewrite the marketing copy on
/, /about, /pricing, and the FAQ to speak to studio owners. Keep auth,
billing, teams, and admin exactly as-is.`}
                  </pre>
                </Card>
                <Card className="p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Swap a provider in docs</p>
                  <pre className="text-sm whitespace-pre-wrap font-mono text-foreground">
{`Update README and the /readme page to reference Postmark instead of Resend
for marketing email. Don't change any edge functions or runtime behavior —
docs only.`}
                  </pre>
                </Card>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                <Github className="h-4 w-4 text-primary" /> 3. Clone from GitHub
              </h3>
              <ol className="list-decimal list-inside space-y-2">
                <li>
                  In your Lovable project, open <strong className="text-foreground">Settings → GitHub</strong> and connect your account.
                  Lovable creates a repo and keeps it two-way synced with the editor.
                </li>
                <li>Clone it locally and install dependencies:</li>
              </ol>
              <Card className="p-4 mt-3">
                <pre className="text-sm whitespace-pre-wrap font-mono text-foreground">
{`git clone https://github.com/<your-username>/<your-repo>.git
cd <your-repo>
npm install        # or: bun install
npm run dev        # http://localhost:8080`}
                </pre>
              </Card>
              <p className="mt-3 text-sm">
                The <Code>.env</Code> file (containing the Lovable Cloud URL + anon key) is generated and synced automatically when the project is linked to Lovable —
                your local dev server talks to the same Cloud backend as the editor preview. Any push to the connected branch shows up in Lovable, and any prompt
                in Lovable commits back to GitHub.
              </p>
            </div>
          </div>
        </Section>

        {/* Quickstart */}
        <Section icon={Rocket} title="First-run quickstart">
          <ol className="list-decimal list-inside space-y-2">
            <li>
              Sign up at <Link to="/signup" className="text-primary hover:underline">/signup</Link>.
              <strong className="text-foreground"> The first account to register is automatically promoted to admin.</strong>
            </li>
            <li>Create your first organization from the dashboard empty state.</li>
            <li>
              Invite teammates from <Code>/dashboard/members</Code> — they'll get a unique invite link.
            </li>
            <li>Customize branding, copy, and pricing (see below).</li>
          </ol>
        </Section>

        {/* What's included */}
        <Section icon={BookOpen} title="What's included">
          <div className="grid gap-4 sm:grid-cols-2">
            <Card className="p-4">
              <h3 className="font-semibold text-foreground mb-2">Public routes</h3>
              <ul className="text-sm space-y-1">
                <li><Code>/</Code> — Landing</li>
                <li><Code>/pricing</Code></li>
                <li><Code>/about</Code>, <Code>/contact</Code></li>
                <li><Code>/demo</Code>, <Code>/waitlist</Code>, <Code>/newsletter</Code></li>
                <li><Code>/privacy</Code>, <Code>/terms</Code></li>
                <li><Code>/docs</Code>, <Code>/readme</Code>, <Code>/launch</Code>, <Code>/changelog</Code>, <Code>/roadmap</Code></li>
                <li><Code>/integrations</Code>, <Code>/security</Code>, <Code>/status</Code>, <Code>/compare</Code></li>
                <li><Code>/customers</Code>, <Code>/blog</Code>, <Code>/sitemap</Code>, <Code>/accessibility</Code></li>
              </ul>
            </Card>
            <Card className="p-4">
              <h3 className="font-semibold text-foreground mb-2">Auth</h3>
              <ul className="text-sm space-y-1">
                <li><Code>/login</Code>, <Code>/signup</Code></li>
                <li><Code>/forgot-password</Code>, <Code>/reset-password</Code></li>
                <li>Google OAuth, Apple OAuth</li>
                <li>Invite flow: <Code>/invite/:token</Code></li>
              </ul>
            </Card>
            <Card className="p-4">
              <h3 className="font-semibold text-foreground mb-2">Dashboard (authed)</h3>
              <ul className="text-sm space-y-1">
                <li><Code>/dashboard</Code></li>
                <li><Code>/dashboard/organization</Code></li>
                <li><Code>/dashboard/members</Code></li>
                <li><Code>/dashboard/invitations</Code></li>
                <li><Code>/dashboard/billing</Code></li>
                <li><Code>/dashboard/settings</Code></li>
              </ul>
            </Card>
            <Card className="p-4">
              <h3 className="font-semibold text-foreground mb-2">Admin (admin role only)</h3>
              <ul className="text-sm space-y-1">
                <li><Code>/admin</Code></li>
              </ul>
              <h3 className="font-semibold text-foreground mt-4 mb-2">Backend tables</h3>
              <p className="text-sm">
                <Code>profiles</Code>, <Code>user_roles</Code>, <Code>organizations</Code>,{" "}
                <Code>organization_members</Code>, <Code>organization_invites</Code>,{" "}
                <Code>subscriptions</Code>, <Code>leads</Code>,{" "}
                <Code>marketing_subscribers</Code>, <Code>marketing_segments</Code>,{" "}
                <Code>marketing_campaigns</Code>, <Code>notifications</Code>,{" "}
                <Code>notification_preferences</Code>, <Code>analytics_events</Code>
              </p>
            </Card>
          </div>
        </Section>

        {/* Customizing */}
        <Section icon={Palette} title="Customizing the app">
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
                The first user is auto-promoted. To add more admins later, ask Lovable:
                <em className="text-foreground"> "Make user@example.com an admin."</em> Or insert into the{" "}
                <Code>user_roles</Code> table with role <Code>admin</Code>.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">OAuth providers</h3>
              <p>
                Google and Apple Sign-In are pre-wired with managed credentials and work out of the box.
                To use your own OAuth client (for branding or compliance), configure it in the project's backend settings.
              </p>
            </div>
          </div>
        </Section>

        {/* Privacy & Terms warning */}
        <Section icon={ShieldAlert} title="⚠️ Privacy Policy & Terms of Service — placeholders">
          <Card className="p-6 border-warning/40 bg-warning/5">
            <div className="flex gap-3">
              <AlertTriangle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
              <div className="space-y-3">
                <p className="text-foreground font-semibold">
                  The <Link to="/privacy" className="text-primary hover:underline">/privacy</Link> and{" "}
                  <Link to="/terms" className="text-primary hover:underline">/terms</Link> pages ship with placeholder text.
                  You must replace them with real legal copy before launch.
                </p>
                <p>
                  This is template content. Consult legal counsel and replace those pages with documents that accurately describe
                  your business, data practices, and obligations to your users.
                </p>
                <div>
                  <p className="font-semibold text-foreground mb-1">Free generators to start from:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li><a href="https://www.iubenda.com/" target="_blank" rel="noreferrer" className="text-primary hover:underline">iubenda</a> — guided builder, free tier</li>
                    <li><a href="https://www.termsfeed.com/" target="_blank" rel="noreferrer" className="text-primary hover:underline">TermsFeed</a> — free privacy &amp; terms generators</li>
                    <li><a href="https://www.privacypolicies.com/" target="_blank" rel="noreferrer" className="text-primary hover:underline">PrivacyPolicies.com</a> — free + paid plans</li>
                  </ul>
                </div>
                <p>
                  When generating, disclose <strong className="text-foreground">all</strong> data processors this app uses out of the box:
                  Lovable Cloud (auth + database), Stripe (billing — once enabled), Resend (marketing email — once enabled),
                  Twilio (SMS — once enabled), and the built-in analytics in <Code>analytics_events</Code>.
                </p>
              </div>
            </div>
          </Card>
        </Section>

        {/* Roadmap */}
        <Section icon={Rocket} title="Roadmap">
          <ul className="space-y-2">
            <li>✅ <strong className="text-foreground">Phase 1–2</strong> — Branding, marketing site, legal scaffolding</li>
            <li>✅ <strong className="text-foreground">Phase 3</strong> — Authentication (email, Google, Apple, password reset)</li>
            <li>✅ <strong className="text-foreground">Phase 4</strong> — Organizations, invites, role-based UI</li>
            <li>✅ <strong className="text-foreground">Phase 5</strong> — Stripe billing</li>
            <li>✅ <strong className="text-foreground">Phase 6</strong> — Marketing email pipeline (wired — add <code>RESEND_API_KEY</code> + verified domain to enable)</li>
            <li>✅ <strong className="text-foreground">Phase 7</strong> — In-app notifications (bell + Realtime)</li>
            <li>✅ <strong className="text-foreground">Phase 8</strong> — Self-hosted analytics dashboard</li>
            <li>✅ <strong className="text-foreground">Phase 9</strong> — Admin tools (users, orgs, leads, campaigns, audit log)</li>
            <li>✅ <strong className="text-foreground">Phase 10</strong> — SMS/OTP auth, Web Push, SSO/SAML scaffolding</li>
            <li>⏳ <strong className="text-foreground">Phase 11</strong> — Live credentials swap (Stripe live, Resend, Twilio, VAPID, Apple, SAML) — see <Link to="/launch" className="text-primary hover:underline">/launch</Link></li>
          </ul>
        </Section>

        {/* Tech stack */}
        <Section icon={Wrench} title="Tech stack">
          <div className="space-y-5">
            <div>
              <h3 className="font-semibold text-foreground mb-1">Frontend</h3>
              <ul className="space-y-1">
                <li>React 18, Vite 5, TypeScript 5</li>
                <li>Tailwind CSS v3 with HSL design tokens, shadcn/ui components</li>
                <li>React Router v6, TanStack Query, React Hook Form + Zod</li>
                <li>Lucide icons, Sonner toasts, date-fns</li>
                <li>Vitest + Testing Library for unit tests</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-1">Lovable Cloud (managed Supabase)</h3>
              <ul className="space-y-1">
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
              <ul className="space-y-1">
                <li>Single <code>LOVABLE_API_KEY</code> — no per-provider keys to manage</li>
                <li>Used from edge functions for any future AI features (summaries, classification, etc.)</li>
                <li>Access to Google Gemini and OpenAI GPT-5 model families</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-1">Third-party services (swap-ready)</h3>
              <ul className="space-y-1">
                <li>Stripe — checkout, customer portal, webhooks (sandbox keys wired)</li>
                <li>Resend — transactional + marketing email delivery (notify.voicept.com)</li>
                <li>Twilio — SMS / OTP delivery (edge function stub ready)</li>
                <li>Web Push / VAPID — browser push notifications (service worker shipped)</li>
                <li>SAML 2.0 IdPs — Okta, Azure AD, Google Workspace (per-org config table ready)</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-1">Tooling</h3>
              <ul className="space-y-1">
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
