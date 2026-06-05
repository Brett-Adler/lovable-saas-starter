import type { FeatureStatus } from "@/components/marketing/StatusBadge";

export type RoadmapStatus = FeatureStatus | "planned";
export type RoadmapCategory =
  | "auth"
  | "billing"
  | "team"
  | "developer"
  | "comms"
  | "compliance"
  | "marketing"
  | "ops";


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
  ops: "Operations & reliability",
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
  { id: "live-chat", label: "AI support chat", status: "shipped", category: "comms", summary: "Anonymous AI assistant on marketing pages, rate-limited per IP." },
  { id: "blog", label: "Built-in blog", status: "shipped", category: "marketing", summary: "Markdown blog with categories and tags, admin editor included.", href: "/blog" },
  { id: "customers", label: "Customer stories", status: "soon", category: "marketing", notifySource: "coming_soon:customers", summary: "Case-study templates and a logo wall.", href: "/customers" },
  { id: "data-export", label: "Self-serve data export", status: "shipped", category: "compliance", href: "/dashboard/settings/data", summary: "Download all your data as JSON. Self-serve account deletion still on the way." },

  // Planned
  { id: "soc2", label: "SOC 2 Type II", status: "planned", category: "compliance", notifySource: "coming_soon:soc2", summary: "Roadmapped once we have design partners on the Team plan." },
  { id: "usage-billing", label: "Usage-based billing", status: "planned", category: "billing", notifySource: "coming_soon:usage_billing", summary: "Meter and bill custom events through Stripe." },

  // Day-one SaaS essentials — curated additions
  { id: "magic-link", label: "Magic-link login", status: "planned", category: "auth", notifySource: "coming_soon:magic_link", summary: "Passwordless email links as a one-click alternative to passwords." },
  { id: "passkeys", label: "Passkeys (WebAuthn)", status: "planned", category: "auth", notifySource: "coming_soon:passkeys", summary: "Phishing-resistant biometric login with device-bound credentials." },
  { id: "session-management", label: "Active sessions UI", status: "planned", category: "auth", notifySource: "coming_soon:sessions", summary: "Let users see and revoke active devices and sign out everywhere." },
  { id: "free-trial", label: "Free trials & paywall", status: "planned", category: "billing", notifySource: "coming_soon:free_trial", summary: "Time-boxed trials with automatic conversion and a soft paywall." },
  { id: "coupons", label: "Coupons & promo codes", status: "planned", category: "billing", notifySource: "coming_soon:coupons", summary: "Stripe-backed discount codes redeemable at checkout." },
  { id: "domain-autojoin", label: "Domain-based auto-join", status: "planned", category: "team", notifySource: "coming_soon:domain_autojoin", summary: "Verified email domains auto-join the matching organization." },
  { id: "custom-roles", label: "Custom roles & permissions", status: "planned", category: "team", notifySource: "coming_soon:custom_roles", summary: "Define org-level roles with fine-grained permission scopes." },
  { id: "public-api", label: "Public REST API + OpenAPI", status: "planned", category: "developer", notifySource: "coming_soon:public_api", summary: "Documented, versioned API with a generated OpenAPI spec." },
  { id: "sandbox-mode", label: "Sandbox / test mode", status: "planned", category: "developer", notifySource: "coming_soon:sandbox", summary: "Per-org test environment that mirrors production safely." },
  { id: "rate-limits", label: "Per-key rate limiting", status: "planned", category: "developer", notifySource: "coming_soon:rate_limits", summary: "Configurable quotas with 429s, headers, and overage alerts." },
  { id: "in-app-inbox", label: "In-app notification inbox", status: "planned", category: "comms", notifySource: "coming_soon:inbox", summary: "Persistent bell with read state, grouping, and deep links." },
  { id: "account-deletion", label: "Self-serve account deletion", status: "planned", category: "compliance", notifySource: "coming_soon:account_deletion", summary: "GDPR-compliant delete flow with grace period and audit trail." },
  { id: "referrals", label: "Referral program", status: "planned", category: "marketing", notifySource: "coming_soon:referrals", summary: "Unique invite links with reward tracking and fraud guards." },
  { id: "feature-flags", label: "Feature flags & A/B tests", status: "planned", category: "marketing", notifySource: "coming_soon:feature_flags", summary: "Server-evaluated flags with percentage rollouts and experiments." },
  { id: "maintenance-mode", label: "Maintenance mode", status: "planned", category: "ops", notifySource: "coming_soon:maintenance_mode", summary: "Site-wide read-only switch with a branded maintenance page." },
  { id: "background-jobs", label: "Background job queue", status: "planned", category: "ops", notifySource: "coming_soon:background_jobs", summary: "Durable jobs with retries, scheduling, and a runs dashboard." },
];

export const roadmapById = (id: string) => roadmap.find((r) => r.id === id);

