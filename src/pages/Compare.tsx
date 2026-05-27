import { Fragment } from "react";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { PageSeo } from "@/components/seo/PageSeo";
import { Card } from "@/components/ui/card";
import { CheckCircle2, XCircle } from "lucide-react";
import { TemplatePlaceholderRibbon } from "@/components/marketing/TemplatePlaceholderRibbon";

const rows: { feature: string; us: boolean; diy: boolean | "weeks" }[] = [
  { feature: "Email + password auth with verification", us: true, diy: "weeks" },
  { feature: "Google + Apple OAuth", us: true, diy: "weeks" },
  { feature: "Multi-tenant orgs, invites, roles", us: true, diy: "weeks" },
  { feature: "Stripe subscriptions + customer portal", us: true, diy: "weeks" },
  { feature: "Transactional email pipeline", us: true, diy: "weeks" },
  { feature: "Audit log", us: true, diy: false },
  { feature: "Admin analytics", us: true, diy: false },
  { feature: "Brand kit generator", us: true, diy: false },
];

const Compare = () => (
  <MarketingLayout>
    <PageSeo
      path="/compare"
      title="Compare"
      description="Build it yourself vs. start with this starter."
    />
    <section className="container py-16 md:py-20">
      <div className="max-w-3xl mx-auto">
        <TemplatePlaceholderRibbon
          id="compare-page"
          message="Swap the table below with a real competitor comparison once you know who you compete with."
        />

        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Skip months of plumbing
          </h1>
          <p className="text-lg text-muted-foreground">
            Everything below is what a typical SaaS team spends 3–6 months building before shipping
            their first real feature.
          </p>
        </div>

        <Card className="overflow-hidden">
          <div className="grid grid-cols-[1fr_auto_auto] text-sm">
            <div className="px-5 py-3 font-semibold border-b border-border">Feature</div>
            <div className="px-5 py-3 font-semibold border-b border-border text-center">This starter</div>
            <div className="px-5 py-3 font-semibold border-b border-border text-center">DIY</div>
            {rows.map((r, i) => {
              const border = i < rows.length - 1 ? "border-b border-border" : "";
              return (
                <Fragment key={r.feature}>
                  <div className={`px-5 py-3 ${border}`}>{r.feature}</div>
                  <div className={`px-5 py-3 text-center ${border}`}>
                    {r.us ? <CheckCircle2 className="h-5 w-5 text-success mx-auto" /> : <XCircle className="h-5 w-5 text-muted-foreground mx-auto" />}
                  </div>
                  <div className={`px-5 py-3 text-center text-xs text-muted-foreground ${border}`}>
                    {r.diy === true ? "Yes" : r.diy === "weeks" ? "Weeks of work" : "Not typical"}
                  </div>
                </Fragment>
              );
            })}
          </div>
        </Card>
      </div>
    </section>
  </MarketingLayout>
);

export default Compare;
