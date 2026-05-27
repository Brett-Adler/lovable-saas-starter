import type { FeatureStatus } from "@/components/marketing/StatusBadge";

export interface FeatureStatusEntry {
  id: string;
  label: string;
  status: FeatureStatus;
  /** One-line note explaining what's needed when not shipped */
  note?: string;
}

/**
 * Single source of truth for what works out of the box vs what the user
 * still has to configure. Consumed by the landing feature cards, the Readme
 * status table, and the dashboard onboarding checklist.
 */
export const featureStatus: FeatureStatusEntry[] = [
  { id: "auth-email", label: "Email + password sign-in", status: "shipped" },
  { id: "auth-google", label: "Google sign-in", status: "shipped" },
  { id: "auth-apple", label: "Apple sign-in", status: "shipped" },
  {
    id: "auth-sms",
    label: "SMS OTP login",
    status: "setup",
    note: "Add Twilio credentials (TWILIO_ACCOUNT_SID, AUTH_TOKEN, FROM_NUMBER).",
  },
  {
    id: "stripe",
    label: "Stripe subscriptions + portal",
    status: "setup",
    note: "Create products in Stripe with lookup_keys: pro_monthly, pro_yearly, team_monthly, team_yearly.",
  },
  { id: "teams", label: "Organizations, invites, roles", status: "shipped" },
  { id: "transactional-email", label: "Transactional + auth emails", status: "shipped" },
  {
    id: "marketing-email",
    label: "Marketing broadcasts (Resend)",
    status: "setup",
    note: "Add RESEND_API_KEY and verify your sending domain in Resend.",
  },
  { id: "analytics", label: "Built-in admin analytics", status: "shipped" },
  { id: "audit-log", label: "Audit log", status: "shipped" },
  { id: "brand-kit", label: "Brand kit generator", status: "shipped" },
  {
    id: "push",
    label: "Web Push notifications",
    status: "setup",
    note: "Generate VAPID keys (VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_SUBJECT).",
  },
  {
    id: "saml",
    label: "SAML SSO (Team plan)",
    status: "setup",
    note: "Submission form is live; final activation is provisioned manually.",
  },
  {
    id: "live-chat",
    label: "AI support chat",
    status: "shipped",
    note: "Anonymous AI assistant on every marketing page, rate-limited per IP.",
  },
  { id: "blog", label: "Blog with categories & tags", status: "shipped" },
  { id: "status-page", label: "Self-hosted status page", status: "shipped" },
];

export const isShipped = (id: string) =>
  featureStatus.find((f) => f.id === id)?.status === "shipped";
