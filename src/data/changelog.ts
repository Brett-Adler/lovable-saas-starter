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
    title: "Public changelog",
    changes: [
      { type: "added", text: "Public /changelog page listing notable releases." },
      { type: "added", text: "Footer link to the changelog under Resources." },
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
