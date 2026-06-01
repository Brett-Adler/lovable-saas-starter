import { P, H2, UL, OL, A, Ext, Note, Prose, Code } from "@/components/docs/prose";

export const buildersContent: Record<string, () => JSX.Element> = {
  overview: () => (
    <Prose>
      <P>This starter is a multi-tenant SaaS template built on React, Vite, Tailwind, and a managed backend (Supabase via Lovable Cloud). It ships with auth, organizations, role-based access, Stripe billing, transactional email, analytics, an admin console, and a marketing site.</P>
      <P>The deepest end-to-end setup walkthrough lives at <A to="/readme">/readme</A>. The articles in this section break that guide into focused topics you can link to or skim.</P>
      <H2>Start here</H2>
      <UL>
        <li><A to="/docs/builders/quickstart">Quickstart</A> — run the project locally in under five minutes.</li>
        <li><A to="/docs/builders/architecture">Architecture & tech stack</A> — how the pieces fit together.</li>
        <li><A to="/launch">Launch checklist</A> — every credential needed to flip from preview to production.</li>
      </UL>
    </Prose>
  ),

  quickstart: () => (
    <Prose>
      <P>Three paths depending on how you want to work:</P>
      <H2>1. Remix on Lovable (recommended)</H2>
      <OL>
        <li>Open this project in Lovable and click <strong>Remix</strong>.</li>
        <li>Lovable copies the code and provisions a fresh Cloud backend automatically.</li>
        <li>Open the new project and start prompting.</li>
      </OL>
      <H2>2. Clone from GitHub</H2>
      <P>Connect GitHub from your Lovable project settings, then locally:</P>
      <P><Code>git clone &lt;your-repo&gt; && cd &lt;your-repo&gt; && npm install && npm run dev</Code></P>
      <P>The <Code>.env</Code> file (Cloud URL + anon key) is generated and synced automatically.</P>
      <H2>3. First-run checklist</H2>
      <P>Once running, follow the <A to="/launch">launch checklist</A> to fill in brand, secrets, and Stripe products.</P>
    </Prose>
  ),

  "whats-included": () => (
    <Prose>
      <H2>Public routes</H2>
      <P>Marketing site (<Code>/</Code>, <Code>/pricing</Code>, <Code>/features</Code>, <Code>/about</Code>, <Code>/contact</Code>, <Code>/blog</Code>, <Code>/customers</Code>), product pages (<Code>/demo</Code>, <Code>/waitlist</Code>, <Code>/newsletter</Code>, <Code>/integrations</Code>, <Code>/compare</Code>), docs & meta (<Code>/docs</Code>, <Code>/readme</Code>, <Code>/launch</Code>, <Code>/changelog</Code>, <Code>/roadmap</Code>, <Code>/security</Code>, <Code>/status</Code>, <Code>/sitemap</Code>), and legal (<Code>/privacy</Code>, <Code>/terms</Code>, <Code>/cookies</Code>).</P>
      <H2>Auth</H2>
      <P>Email + password, Google, Apple, magic-link reset, and SSO/SAML scaffolding. Invitation flow at <Code>/invite/:token</Code>.</P>
      <H2>Dashboard</H2>
      <P>Workspace switcher, members, invitations, billing, profile settings, security, API keys, webhooks, and data export.</P>
      <H2>Admin</H2>
      <P>Users, organizations, subscriptions, analytics, audit log, leads, subscribers, broadcasts, SEO, blog editor, status, brand.</P>
      <H2>Backend</H2>
      <P>Tables: <Code>profiles</Code>, <Code>user_roles</Code>, <Code>organizations</Code>, <Code>organization_members</Code>, <Code>organization_invites</Code>, <Code>subscriptions</Code>, <Code>leads</Code>, <Code>marketing_subscribers</Code>, <Code>marketing_campaigns</Code>, <Code>notifications</Code>, <Code>analytics_events</Code>, and more.</P>
    </Prose>
  ),

  architecture: () => (
    <Prose>
      <P>Single-page React app served by Vite. All persistence and server logic runs in the managed backend (Postgres + Edge Functions). No custom Node server.</P>
      <H2>Stack</H2>
      <UL>
        <li><strong>Frontend:</strong> React 18, Vite 5, TypeScript 5, Tailwind v3, shadcn/ui, react-router, TanStack Query.</li>
        <li><strong>Backend:</strong> Lovable Cloud (managed Supabase) — Postgres with RLS, Auth, Storage, and Deno Edge Functions.</li>
        <li><strong>Payments:</strong> Stripe Checkout + Customer Portal via edge functions.</li>
        <li><strong>Email:</strong> Resend for transactional and broadcast email, with a domain-verified sender.</li>
        <li><strong>Analytics:</strong> in-app <Code>analytics_events</Code> table written from the client and aggregated in the admin dashboard.</li>
      </UL>
      <H2>Request flow</H2>
      <P>Client → Supabase JS SDK → Postgres (RLS-enforced) or Edge Function → external provider (Stripe, Resend, etc.) → response. Auth tokens are stored in HTTP-only-equivalent local storage with automatic refresh.</P>
    </Prose>
  ),

  branding: () => (
    <Prose>
      <P>All branding files live in <Code>public/</Code> — swap them in place. See <Code>public/BRANDING.md</Code> for exact dimensions of favicons, app icons, OG images, and logos.</P>
      <H2>Colors & typography</H2>
      <P>HSL design tokens live in <Code>src/index.css</Code> and <Code>tailwind.config.ts</Code>. Always reference semantic tokens (<Code>bg-background</Code>, <Code>text-primary</Code>) instead of raw colors. Light + dark mode supported out of the box.</P>
      <H2>Copy</H2>
      <P>Marketing copy is colocated with each page under <Code>src/pages/</Code>. Site-wide brand name and tagline are pulled from <Code>PUBLIC_SITE_NAME</Code> and admin site settings — never hardcoded.</P>
      <Note>Don't commit secrets to the codebase. Brand and copy: in code. Credentials: in secrets.</Note>
    </Prose>
  ),

  "auth-providers": () => (
    <Prose>
      <P>Authentication is handled by Supabase Auth. Out of the box you get email/password, Google OAuth, Apple OAuth, password reset, and an invitation flow.</P>
      <H2>Enable a provider</H2>
      <OL>
        <li>Configure the provider in your backend settings (provider client ID + secret).</li>
        <li>The provider button appears automatically on <A to="/login">/login</A> and <A to="/signup">/signup</A>.</li>
      </OL>
      <H2>SSO / SAML</H2>
      <P>SAML scaffolding lives under <Code>/dashboard/organization/sso</Code>. Configure your IdP metadata there; group → role mapping is enforced server-side via the <Code>has_role()</Code> security-definer function.</P>
      <Note>Do NOT store roles on the profile or users table. The starter uses a dedicated <Code>user_roles</Code> table with <Code>has_role()</Code> to prevent privilege escalation.</Note>
    </Prose>
  ),

  "billing-stripe": () => (
    <Prose>
      <P>Billing is Stripe Checkout + the hosted Customer Portal. Edge functions handle creating sessions and processing webhooks.</P>
      <H2>Files to know</H2>
      <UL>
        <li><Code>supabase/functions/create-checkout/index.ts</Code> — creates a Checkout session from a price ID.</li>
        <li><Code>supabase/functions/customer-portal/index.ts</Code> — returns a portal URL for the signed-in customer.</li>
        <li><Code>supabase/functions/stripe-webhook/index.ts</Code> — syncs subscription state into the <Code>subscriptions</Code> table.</li>
      </UL>
      <H2>Going live</H2>
      <OL>
        <li>Create live products and prices in Stripe.</li>
        <li>Replace the test price IDs in <Code>create-checkout</Code>.</li>
        <li>Set <Code>STRIPE_API_KEY</Code> (live) and <Code>STRIPE_WEBHOOK_SECRET</Code> as secrets.</li>
        <li>Point the live webhook at your <Code>stripe-webhook</Code> function URL.</li>
      </OL>
      <P>The full credential swap lives on the <A to="/launch">launch checklist</A>.</P>
    </Prose>
  ),

  "email-pipeline": () => (
    <Prose>
      <P>Transactional and marketing email both flow through Resend. The starter expects <Code>PUBLIC_SITE_NAME</Code>, <Code>PUBLIC_SITE_URL</Code>, and <Code>SENDER_DOMAIN</Code> in env — these drive the From address, From name, and links inside every email. Never hardcode brand or sender domain.</P>
      <H2>Setup</H2>
      <OL>
        <li>Add and verify your sending domain in Resend (DKIM, SPF, return-path).</li>
        <li>Set <Code>RESEND_API_KEY</Code> and the three <Code>PUBLIC_*</Code> / <Code>SENDER_DOMAIN</Code> vars as secrets.</li>
        <li>Send a test broadcast from <A to="/admin/broadcasts">Admin → Broadcasts</A> to confirm delivery.</li>
      </OL>
      <H2>Templates</H2>
      <P>React-based email templates live under <Code>supabase/functions/_shared/emails/</Code> and are rendered server-side. Auth emails (invite, recovery, magic-link) can be customized in your backend Auth settings.</P>
    </Prose>
  ),

  "edge-functions": () => (
    <Prose>
      <P>Server logic lives in <Code>supabase/functions/</Code>. Each folder is a deployable Deno function. Most ship with <Code>verify_jwt = false</Code> when they need to handle anonymous traffic (webhooks, public forms); user-context functions verify the JWT.</P>
      <H2>Secrets</H2>
      <P>Set secrets in your backend dashboard or via the Lovable Cloud UI. The starter expects, at minimum: <Code>STRIPE_API_KEY</Code>, <Code>STRIPE_WEBHOOK_SECRET</Code>, <Code>RESEND_API_KEY</Code>, plus the public <Code>PUBLIC_*</Code> / <Code>SENDER_DOMAIN</Code> vars.</P>
      <H2>Local dev</H2>
      <P>Functions deploy automatically on every change — no manual deploy step in Lovable. To run them locally, use <Ext href="https://supabase.com/docs/guides/functions/local-development">the Supabase CLI</Ext>.</P>
    </Prose>
  ),

  "database-rls": () => (
    <Prose>
      <P>Every table in the <Code>public</Code> schema is RLS-enabled. Default-deny is the rule — explicit policies grant access scoped to <Code>auth.uid()</Code> and workspace membership.</P>
      <H2>Conventions</H2>
      <UL>
        <li>Never reference <Code>auth.users</Code> as a foreign key from app tables. Use a <Code>profiles</Code> table mirroring user IDs.</li>
        <li>Every <Code>CREATE TABLE public.&lt;name&gt;</Code> must be followed by <Code>GRANT</Code> statements in the same migration — RLS alone is not enough.</li>
        <li>Roles live in <Code>user_roles</Code> and are checked via the <Code>has_role(uid, role)</Code> security-definer function. Don't store roles on profiles.</li>
        <li>Use validation triggers, not CHECK constraints, for time-based validations (CHECKs must be immutable).</li>
      </UL>
      <H2>Migrations</H2>
      <P>Schema changes are managed via the migration tool in Lovable Cloud. Don't edit <Code>src/integrations/supabase/types.ts</Code> by hand — it's regenerated.</P>
    </Prose>
  ),

  "roles-permissions": () => (
    <Prose>
      <P>Three workspace roles: <Code>owner</Code>, <Code>admin</Code>, <Code>member</Code>. Plus an app-level admin role for backoffice access.</P>
      <H2>Server-side</H2>
      <P>RLS policies call <Code>public.has_role(auth.uid(), 'admin'::app_role)</Code>. The function is <Code>SECURITY DEFINER</Code> so it bypasses RLS on the <Code>user_roles</Code> table itself, avoiding recursive policy loops.</P>
      <H2>Client-side</H2>
      <P>Use the <Code>useUserRole()</Code> hook to gate UI. Never trust client-side role checks for sensitive operations — server policies are the source of truth.</P>
      <Note>Never check admin status using local/session storage or hardcoded credentials. Always validate server-side.</Note>
    </Prose>
  ),

  "analytics-and-audit": () => (
    <Prose>
      <P>The starter ships its own analytics pipeline (no third-party SDK required). Events are written to <Code>analytics_events</Code> from the client via a thin <Code>track()</Code> helper, then aggregated in <A to="/admin/analytics">Admin → Analytics</A>.</P>
      <H2>Audit log</H2>
      <P>Security-sensitive actions (sign-in, role change, billing change, member removal) are written to an append-only audit table by triggers and by explicit calls in edge functions. View at <A to="/admin/audit">Admin → Audit log</A>.</P>
      <H2>Plug in a third-party tool</H2>
      <P>To layer PostHog, Mixpanel, or similar, wire it into the same <Code>track()</Code> helper so calls go to both sinks.</P>
    </Prose>
  ),

  deploy: () => (
    <Prose>
      <H2>Publish</H2>
      <P>Hit <strong>Publish</strong> in Lovable to deploy to a <Code>*.lovable.app</Code> subdomain. Every publish is a full snapshot — rollbacks are instant.</P>
      <H2>Custom domain</H2>
      <OL>
        <li>Add your domain in Lovable project settings.</li>
        <li>Add the CNAME / A records it shows you to your DNS provider.</li>
        <li>SSL is provisioned automatically once DNS resolves.</li>
        <li>Update <Code>PUBLIC_SITE_URL</Code> and <Code>VITE_BASE_URL</Code> secrets to your new domain so emails, sitemap, and canonical URLs use it.</li>
      </OL>
      <H2>Production checklist</H2>
      <P>Run through <A to="/launch">/launch</A> to flip every credential from sandbox to live before announcing.</P>
    </Prose>
  ),

  legal: () => (
    <Prose>
      <P>The starter ships placeholder Privacy and Terms documents at <A to="/privacy">/privacy</A> and <A to="/terms">/terms</A>. They are template text, <strong>not legal advice</strong>.</P>
      <H2>Before you launch</H2>
      <UL>
        <li>Have a lawyer review and customize the documents for your jurisdiction and product.</li>
        <li>Update the company name, mailing address, and contact email in <A to="/admin/site-settings">Admin → Site settings</A> — both pages pull from there.</li>
        <li>Decide whether you need a Cookie banner (the starter includes one if your audience requires GDPR/UK compliance).</li>
      </UL>
    </Prose>
  ),

  "changelog-and-roadmap": () => (
    <Prose>
      <P>User-visible changes go in <Code>src/data/changelog.ts</Code>. Append the newest entry to the top, group by date, and use the existing <Code>added / changed / fixed / removed / security / deprecated</Code> taxonomy.</P>
      <H2>Roadmap</H2>
      <P>The public roadmap lives at <A to="/roadmap">/roadmap</A> and is editable from a single data file. Keep statuses honest (shipped / in-progress / planned) so users trust it.</P>
      <H2>Status page</H2>
      <P>System health and incident history are at <A to="/status">/status</A>. Manage incidents from <A to="/admin/status">Admin → Status</A>.</P>
    </Prose>
  ),
};
