import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { PageSeo } from "@/components/seo/PageSeo";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/marketing/StatusBadge";
import { ShieldCheck, Lock, FileCheck, KeyRound, Database, Mail } from "lucide-react";

const practices = [
  { Icon: Lock, title: "Row-level security", desc: "Every table is gated by Postgres RLS — users can only ever see their own data.", status: "shipped" as const },
  { Icon: KeyRound, title: "JWT rotation", desc: "API keys can be rotated without downtime; sessions refresh automatically.", status: "shipped" as const },
  { Icon: FileCheck, title: "Audit log", desc: "Immutable record of every privileged action (invites, role changes, removals).", status: "shipped" as const },
  { Icon: Database, title: "Daily backups", desc: "Point-in-time recovery handled at the database layer.", status: "shipped" as const },
  { Icon: Mail, title: "Email verification", desc: "New accounts must confirm their address before sign-in.", status: "shipped" as const },
  { Icon: ShieldCheck, title: "Two-factor (TOTP)", desc: "Authenticator app codes layered on top of any login method.", status: "soon" as const },
  { Icon: ShieldCheck, title: "SAML SSO", desc: "Enterprise SSO with Okta, Azure AD, JumpCloud, OneLogin.", status: "setup" as const },
  { Icon: ShieldCheck, title: "SOC 2 Type II", desc: "On the roadmap; happy to share our security posture in the meantime.", status: "soon" as const },
];

const Security = () => (
  <MarketingLayout>
    <PageSeo
      path="/security"
      title="Security & trust"
      description="How we keep your data safe — and what's still on the roadmap."
    />
    <section className="container py-16 md:py-20">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <ShieldCheck className="h-12 w-12 text-primary mx-auto mb-4" />
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Security & trust</h1>
        <p className="text-lg text-muted-foreground">
          Security isn't a feature — it's the foundation. Here's exactly what's in place today and
          what we're working on next.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 max-w-4xl mx-auto">
        {practices.map((p) => (
          <Card key={p.title} className="p-5">
            <div className="flex items-start gap-3">
              <div className="h-9 w-9 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <p.Icon className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h3 className="font-semibold">{p.title}</h3>
                  <StatusBadge status={p.status} />
                </div>
                <p className="text-sm text-muted-foreground">{p.desc}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="max-w-2xl mx-auto mt-12 text-center text-sm text-muted-foreground">
        Reporting a vulnerability? Email us at the address on the{" "}
        <a href="/contact" className="text-primary hover:underline">contact page</a>.
      </div>
    </section>
  </MarketingLayout>
);

export default Security;
