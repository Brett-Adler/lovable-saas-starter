// Append new entries to the TOP of this array.
// See mem://changelog-policy for what qualifies as a changelog-worthy change.

export type ChangeType =
  | "added"
  | "changed"
  | "fixed"
  | "removed"
  | "security"
  | "deprecated";

export interface ChangelogChange {
  type: ChangeType;
  text: string;
}

export interface ChangelogEntry {
  /** ISO date, yyyy-mm-dd */
  date: string;
  /** Optional semver/version tag */
  version?: string;
  /** Short headline for the release */
  title: string;
  changes: ChangelogChange[];
}

export const changelog: ChangelogEntry[] = [
  {
    date: "2026-05-27",
    title: "Roadmap, integrations directory, and coming-soon pages for every gap",
    changes: [
      { type: "added", text: "Public Roadmap page (/roadmap) grouping every feature by category and status — Live, Needs setup, Coming soon, or Planned." },
      { type: "added", text: "Integrations directory (/integrations) listing Stripe, Google, Apple, Resend, Twilio, Web Push, SAML, plus upcoming Slack, Zapier, webhooks." },
      { type: "added", text: "Security & trust page (/security) summarising RLS, audit log, JWT rotation, and what's still on the roadmap." },
      { type: "added", text: "Static system status page (/status) and competitor compare page (/compare), both marked as placeholders on preview hosts." },
      { type: "added", text: "Coming-soon Customer stories (/customers) and Blog (/blog) pages with notify-me email capture." },
      { type: "added", text: "Dashboard → Settings → Advanced tab with stub pages for 2FA, API keys, webhooks, plus a working JSON data export and an account-deletion request flow." },
      { type: "added", text: "Roadmap, Integrations, Status, Security, Customers, Blog, and Compare links surfaced in the marketing header and footer." },
    ],
  },
  {
    date: "2026-05-27",
    title: "Honest status across every page",
    changes: [
    changes: [
      { type: "added", text: "New Live / Needs setup / Coming soon badges on the landing feature cards so it's clear which features ship working and which need credentials." },
      { type: "added", text: "Dismissible 'template placeholder' ribbons on landing logo cloud, testimonials, About, and Legal pages — only visible on Lovable preview hosts, hidden on custom domains." },
      { type: "added", text: "Admin-only inline notice on the Contact page when contact_email is still the placeholder, linking straight to Site Settings." },
      { type: "changed", text: "Demo and Waitlist forms now write to the real leads table (no more silently-dropped lead_submissions stub) and the success copy no longer promises calendar links or emails that aren't wired." },
      { type: "changed", text: "Contact page: replaced the never-shipped 'Live chat Mon–Fri' block with a truthful response-time card." },
      { type: "changed", text: "Pricing: SSO/SAML labelled as 'provisioned manually' on the Team plan, plus a small footnote naming the Stripe lookup_keys checkout expects." },
      { type: "fixed", text: "Accessibility and Legal pages: replaced the hardcoded 'January 1, 2026' last-updated date with a single LAST_UPDATED constant per page." },
      { type: "fixed", text: "Org SSO page: support email pulled from Site Settings instead of hardcoded support@example.com." },
    ],
  },
  {
    date: "2026-05-27",
    title: "Brand kit generator in admin",
    changes: [
      { type: "added", text: "New /admin/brand page: upload one logo and generate every favicon, iOS / Android / Windows icon, OG and Twitter social cards, splash screens, and PWA manifest." },
      { type: "added", text: "Generated assets are published to a public brand-assets storage bucket and override the site's favicons, theme color, and navbar logo at runtime." },
      { type: "added", text: "Download-all-as-zip and live previews of browser tab, home-screen icons, and social cards before publishing." },
    ],
  },
  {
    date: "2026-05-27",
    title: "Refreshed dashboard and admin overviews",
    changes: [
      { type: "added", text: "Dashboard now shows a getting-started checklist, subscription status, pending invites, recent notifications, and org activity." },
      { type: "added", text: "Admin overview gains a signups sparkline, 7-day email health card, and recent audit events." },
      { type: "changed", text: "Dashboard and admin sidebars regrouped with section eyebrows and an active-item indicator." },
    ],
  },
  {
    date: "2026-05-27",
    title: "SEO controls and per-page metadata",
    changes: [
      { type: "added", text: "README and /readme page now cover Remix, prompt-based customization, and GitHub clone workflows." },
      { type: "added", text: "Animated explainer video on the home page hero showing what's included out of the box." },
      { type: "added", text: "Admin SEO page (/admin/seo) to edit site-wide defaults and per-route overrides." },
      { type: "added", text: "Per-route titles, descriptions, canonicals, OG tags, and JSON-LD via React Helmet." },
      { type: "added", text: "Site-wide SEO baked into initial HTML at build time so social crawlers see correct previews." },
      { type: "added", text: "Organization, WebSite, FAQPage, and Product structured data for richer search results." },
      { type: "added", text: "/llms.txt published for AI assistants." },
      { type: "added", text: "Public changelog page listing notable releases." },
      { type: "fixed", text: "Footer links and anchor links now scroll to top / section on navigation." },
    ],
  },
  {
    date: "2026-05-26",
    title: "SMS, Web Push, and SSO scaffolding",
    changes: [
      { type: "added", text: "Phone / SMS OTP sign-in on the auth screen." },
      { type: "added", text: "Browser push notifications via service worker and VAPID-ready edge function." },
      { type: "added", text: "Per-organization SAML SSO configuration page (Team plan)." },
      { type: "changed", text: "README and pricing FAQ updated to match shipped feature set." },
    ],
  },
  {
    date: "2026-05-25",
    title: "In-app notifications and audit log",
    changes: [
      { type: "added", text: "Notification bell with Realtime updates in the dashboard shell." },
      { type: "added", text: "Audit log with security-definer triggers for roles, members, and invites." },
      { type: "added", text: "Plan gating via usePlan() hook and <RequirePlan> component." },
      { type: "added", text: "Admin Audit page for platform admins." },
    ],
  },
  {
    date: "2026-05-24",
    title: "Admin console and analytics",
    changes: [
      { type: "added", text: "Admin dashboard with users, organizations, subscriptions, leads, and analytics." },
      { type: "added", text: "Self-hosted analytics events table with admin overview dashboard." },
      { type: "added", text: "Marketing broadcast composer and subscriber management." },
    ],
  },
  {
    date: "2026-05-22",
    title: "Stripe billing and email pipeline",
    changes: [
      { type: "added", text: "Stripe checkout, customer portal, and webhook-driven subscription sync (sandbox)." },
      { type: "added", text: "Transactional + marketing email pipeline with pgmq batching and Resend-ready edge functions." },
      { type: "added", text: "Double opt-in newsletter with confirmation and unsubscribe flows." },
    ],
  },
  {
    date: "2026-05-20",
    title: "Organizations and team invites",
    changes: [
      { type: "added", text: "Multi-tenant organizations with owner / admin / member roles." },
      { type: "added", text: "Org invite tokens with email delivery and accept flow." },
      { type: "added", text: "Organization switcher in the dashboard sidebar." },
    ],
  },
  {
    date: "2026-05-18",
    title: "Authentication",
    changes: [
      { type: "added", text: "Email/password, Google, and Apple sign-in." },
      { type: "added", text: "Password reset and email verification flows." },
      { type: "security", text: "Roles stored in dedicated user_roles table with has_role() security-definer function." },
    ],
  },
  {
    date: "2026-05-15",
    title: "Initial scaffolding",
    changes: [
      { type: "added", text: "Marketing site: landing, pricing, about, contact, demo, waitlist, legal pages." },
      { type: "added", text: "Design system with HSL tokens, dark mode, and shadcn/ui components." },
    ],
  },
];
