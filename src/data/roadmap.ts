import type { FeatureStatus } from "@/components/marketing/StatusBadge";

export type RoadmapStatus = FeatureStatus | "planned";
export type RoadmapCategory =
  | "auth"
  | "billing"
  | "team"
  | "developer"
  | "comms"
  | "compliance"
  | "marketing";

export interface RoadmapEntry {
  id: string;
  label: string;
  summary: string;
  status: RoadmapStatus;
  category: RoadmapCategory;
  /** leads.source value when a user clicks "Notify me" */
  notifySource?: string;
  /** Internal link for live items */
  href?: string;
}

export const categoryLabels: Record<RoadmapCategory, string> = {
  auth: "Authentication",
  billing: "Billing & payments",
  team: "Teams & collaboration",
  developer: "Developer platform",
  comms: "Communications",
  compliance: "Security & compliance",
  marketing: "Marketing & growth",
};

export const roadmap: RoadmapEntry[] = [
  // Shipped
  { id: "auth-email", label: "Email + password", status: "shipped", category: "auth", summary: "Email/password with verification and password reset.", href: "/login" },
  { id: "auth-google", label: "Google sign-in", status: "shipped", category: "auth", href: "/login", summary: "One-click Google OAuth." },
  { id: "auth-apple", label: "Apple sign-in", status: "shipped", category: "auth", href: "/login", summary: "Sign in with Apple." },
  { id: "teams", label: "Orgs, invites & roles", status: "shipped", category: "team", href: "/dashboard/members", summary: "Multi-tenant organizations with owner/admin/member roles and email invites." },
  { id: "audit-log", label: "Audit log", status: "shipped", category: "compliance", href: "/admin/audit", summary: "Immutable record of every privileged action." },
  { id: "brand-kit", label: "Brand kit generator", status: "shipped", category: "marketing", href: "/admin/brand", summary: "Upload one logo, get favicons, splash screens, social cards, PWA icons." },
  { id: "transactional-email", label: "Transactional emails", status: "shipped", category: "comms", summary: "Auth + app emails delivered via a queued pipeline.", href: "/admin/broadcasts" },
  { id: "analytics", label: "Admin analytics", status: "shipped", category: "marketing", href: "/admin/analytics", summary: "Signups, MRR, churn, traffic — all in one place." },

  // Needs setup
  { id: "stripe", label: "Stripe subscriptions", status: "setup", category: "billing", summary: "Wired end-to-end. Create products in Stripe with the documented lookup_keys.", href: "/pricing" },
  { id: "auth-sms", label: "SMS OTP login", status: "setup", category: "auth", summary: "Add Twilio credentials to enable phone login." },
  { id: "marketing-email", label: "Marketing broadcasts (Resend)", status: "setup", category: "comms", summary: "Add RESEND_API_KEY and verify a sending domain.", href: "/admin/broadcasts" },
  { id: "push", label: "Web Push notifications", status: "setup", category: "comms", summary: "Generate VAPID keys to enable browser push." },
  { id: "saml", label: "SAML SSO", status: "setup", category: "compliance", summary: "Form is live. Final activation is provisioned manually per workspace.", href: "/dashboard/organization/sso" },

  // Coming soon — cheap stubs with notify-me
  { id: "2fa", label: "Two-factor auth (TOTP)", status: "soon", category: "auth", notifySource: "coming_soon:2fa", summary: "Authenticator app codes layered on top of any login method." },
  { id: "api-keys", label: "API keys", status: "soon", category: "developer", notifySource: "coming_soon:api_keys", summary: "Per-org keys with scopes, rotation, and revoke." },
  { id: "webhooks", label: "Outbound webhooks", status: "soon", category: "developer", notifySource: "coming_soon:webhooks", summary: "Subscribe to events with retries and signing." },
  { id: "zapier", label: "Zapier integration", status: "soon", category: "developer", notifySource: "coming_soon:zapier", summary: "Trigger and action templates for thousands of apps." },
  { id: "slack", label: "Slack notifications", status: "soon", category: "comms", notifySource: "coming_soon:slack", summary: "Pipe critical events into a Slack channel." },
  { id: "live-chat", label: "Live chat widget", status: "soon", category: "comms", notifySource: "coming_soon:live_chat", summary: "Drop-in Crisp/Intercom adapter for in-app conversations." },
  { id: "blog", label: "Built-in blog", status: "soon", category: "marketing", notifySource: "coming_soon:blog", summary: "MDX-powered blog with SEO baked in.", href: "/blog" },
  { id: "customers", label: "Customer stories", status: "soon", category: "marketing", notifySource: "coming_soon:customers", summary: "Case-study templates and a logo wall.", href: "/customers" },
  { id: "data-export", label: "Self-serve data export", status: "soon", category: "compliance", notifySource: "coming_soon:data_export", summary: "Download all your data as JSON. Manual delete-account flow today." },

  // Planned
  { id: "soc2", label: "SOC 2 Type II", status: "planned", category: "compliance", notifySource: "coming_soon:soc2", summary: "Roadmapped once we have design partners on the Team plan." },
  { id: "usage-billing", label: "Usage-based billing", status: "planned", category: "billing", notifySource: "coming_soon:usage_billing", summary: "Meter and bill custom events through Stripe." },
];

export const roadmapById = (id: string) => roadmap.find((r) => r.id === id);
