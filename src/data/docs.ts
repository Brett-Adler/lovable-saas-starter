import { BookOpen, Building2, Code2, LucideIcon } from "lucide-react";
import { usersContent } from "@/content/docs/users";
import { adminsContent } from "@/content/docs/admins";
import { buildersContent } from "@/content/docs/builders";

export type Audience = "users" | "admins" | "builders";

export interface DocArticle {
  slug: string;
  title: string;
  description: string;
  audience: Audience;
  category: string;
  body: () => JSX.Element;
}

export interface AudienceMeta {
  id: Audience;
  label: string;
  short: string;
  description: string;
  icon: LucideIcon;
}

export const audiences: AudienceMeta[] = [
  {
    id: "users",
    label: "For users",
    short: "Users",
    description: "Day-to-day help for anyone using the product — signing up, profile, notifications, and account settings.",
    icon: BookOpen,
  },
  {
    id: "admins",
    label: "For admins & owners",
    short: "Admins",
    description: "Running a workspace: roles, invitations, billing, SSO, audit log, and compliance.",
    icon: Building2,
  },
  {
    id: "builders",
    label: "For builders",
    short: "Builders",
    description: "Developer reference for the starter: architecture, auth, billing, email, RLS, deploy, and more.",
    icon: Code2,
  },
];

export const audienceById = Object.fromEntries(
  audiences.map((a) => [a.id, a]),
) as Record<Audience, AudienceMeta>;

interface ArticleSeed {
  slug: string;
  title: string;
  description: string;
  category: string;
}

const usersSeeds: ArticleSeed[] = [
  { slug: "create-account", title: "Create your account", description: "Sign up with email, Google, or Apple in under a minute.", category: "Getting started" },
  { slug: "sign-in", title: "Sign in and sign out", description: "How to access the product from any device and end your session.", category: "Getting started" },
  { slug: "reset-password", title: "Reset your password", description: "Recover access to your account if you forgot your password.", category: "Getting started" },
  { slug: "profile", title: "Set up your profile", description: "Update your display name, avatar, time zone, and language.", category: "Getting started" },
  { slug: "theme", title: "Switch dark or light theme", description: "Change theme per device, or follow your operating system.", category: "Getting started" },
  { slug: "what-is-an-organization", title: "What is an organization", description: "Workspaces, members, and how they relate to billing.", category: "Your workspace" },
  { slug: "accept-invite", title: "Accept an invitation", description: "Join an existing workspace from an email invite.", category: "Your workspace" },
  { slug: "switch-workspaces", title: "Switch between workspaces", description: "Move between organizations without signing out.", category: "Your workspace" },
  { slug: "notifications", title: "Notifications and email preferences", description: "Control which events trigger an in-app or email notification.", category: "Account & security" },
  { slug: "change-password", title: "Change your password", description: "Rotate your password and sign out other devices.", category: "Account & security" },
  { slug: "connected-providers", title: "Connected sign-in providers", description: "Add or remove Google, Apple, or password sign-in.", category: "Account & security" },
  { slug: "delete-account", title: "Delete your account or export data", description: "Export your data and permanently delete your account.", category: "Account & security" },
  { slug: "troubleshooting", title: "Troubleshooting", description: "Missing emails, test-mode banners, and how to report a bug.", category: "Help" },
];

const adminsSeeds: ArticleSeed[] = [
  { slug: "roles", title: "Roles: owner, admin, member", description: "What each role can do inside a workspace.", category: "Workspace basics" },
  { slug: "workspace-branding", title: "Rename and brand your workspace", description: "Set the workspace name, slug, and logo.", category: "Workspace basics" },
  { slug: "invite-teammates", title: "Invite teammates", description: "Send invitations by email and pick a role.", category: "Team management" },
  { slug: "manage-roles", title: "Change or revoke roles", description: "Promote, demote, or transfer ownership.", category: "Team management" },
  { slug: "remove-members", title: "Remove members", description: "Revoke access for anyone in the workspace.", category: "Team management" },
  { slug: "pending-invites", title: "Pending invitations", description: "Resend, revoke, or copy invitation links.", category: "Team management" },
  { slug: "choose-plan", title: "Choose a plan", description: "How plans, trials, and the checkout flow work.", category: "Billing" },
  { slug: "payment-method", title: "Update payment method", description: "Manage your card, address, tax ID, and invoices.", category: "Billing" },
  { slug: "cancel-and-refunds", title: "Cancel, refunds, and proration", description: "End a subscription and understand how charges work.", category: "Billing" },
  { slug: "analytics", title: "Read the analytics dashboard", description: "Understand DAU, funnels, top events, and revenue.", category: "Insights" },
  { slug: "sso", title: "Single sign-on (SSO / SAML)", description: "Connect Okta, Azure AD, Google Workspace, and others.", category: "Security & compliance" },
  { slug: "audit-log", title: "Audit log", description: "What's recorded, how long it's kept, and how to filter.", category: "Security & compliance" },
  { slug: "compliance", title: "Compliance and data handling", description: "DPA, subprocessors, SOC 2 reports, and data residency.", category: "Security & compliance" },
];

const buildersSeeds: ArticleSeed[] = [
  { slug: "overview", title: "Overview", description: "What's in the starter and how the pieces fit together.", category: "Get started" },
  { slug: "quickstart", title: "Quickstart", description: "Remix, clone, or run locally in under five minutes.", category: "Get started" },
  { slug: "whats-included", title: "What's included", description: "Inventory of routes, tables, and admin tools.", category: "Get started" },
  { slug: "architecture", title: "Architecture and tech stack", description: "React + Vite frontend with Lovable Cloud backend.", category: "Get started" },
  { slug: "branding", title: "Branding and design tokens", description: "Swap logos, fonts, and colors using semantic tokens.", category: "Customize" },
  { slug: "auth-providers", title: "Auth providers", description: "Email, Google, Apple, magic links, and SAML SSO.", category: "Backend" },
  { slug: "billing-stripe", title: "Billing and Stripe wiring", description: "Checkout, customer portal, and webhook handling.", category: "Backend" },
  { slug: "email-pipeline", title: "Email pipeline", description: "Resend, sender domain, and transactional templates.", category: "Backend" },
  { slug: "edge-functions", title: "Edge functions and secrets", description: "Deploying serverless logic and managing env vars.", category: "Backend" },
  { slug: "database-rls", title: "Database, RLS, and migrations", description: "Schema conventions, RLS policies, and grants.", category: "Backend" },
  { slug: "roles-permissions", title: "Roles and permissions", description: "user_roles, has_role, and gating UI safely.", category: "Backend" },
  { slug: "analytics-and-audit", title: "Analytics and audit internals", description: "How events and audit entries flow through the app.", category: "Backend" },
  { slug: "deploy", title: "Deploying and custom domains", description: "Publish to Lovable and wire up your own domain.", category: "Ship" },
  { slug: "legal", title: "Privacy and Terms placeholders", description: "What ships, what to customize, what needs a lawyer.", category: "Ship" },
  { slug: "changelog-and-roadmap", title: "Changelog, roadmap, and status", description: "Conventions for keeping public timelines honest.", category: "Ship" },
];

const bodyMaps: Record<Audience, Record<string, () => JSX.Element>> = {
  users: usersContent,
  admins: adminsContent,
  builders: buildersContent,
};

function buildArticles(audience: Audience, seeds: ArticleSeed[]): DocArticle[] {
  return seeds.map((s) => {
    const body = bodyMaps[audience][s.slug];
    if (!body) {
      throw new Error(`Missing docs body for ${audience}/${s.slug}`);
    }
    return { ...s, audience, body };
  });
}

export const docs: DocArticle[] = [
  ...buildArticles("users", usersSeeds),
  ...buildArticles("admins", adminsSeeds),
  ...buildArticles("builders", buildersSeeds),
];

export function articlesByAudience(audience: Audience): DocArticle[] {
  return docs.filter((a) => a.audience === audience);
}

export function findArticle(audience: Audience, slug: string): DocArticle | undefined {
  return docs.find((a) => a.audience === audience && a.slug === slug);
}

export function groupByCategory(articles: DocArticle[]): { category: string; items: DocArticle[] }[] {
  const order: string[] = [];
  const map = new Map<string, DocArticle[]>();
  for (const a of articles) {
    if (!map.has(a.category)) {
      order.push(a.category);
      map.set(a.category, []);
    }
    map.get(a.category)!.push(a);
  }
  return order.map((category) => ({ category, items: map.get(category)! }));
}

export function adjacentArticles(article: DocArticle): { prev?: DocArticle; next?: DocArticle } {
  const list = articlesByAudience(article.audience);
  const i = list.findIndex((a) => a.slug === article.slug);
  return { prev: list[i - 1], next: list[i + 1] };
}

export function isAudience(value: string | undefined): value is Audience {
  return value === "users" || value === "admins" || value === "builders";
}
