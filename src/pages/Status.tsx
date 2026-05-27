import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { PageSeo } from "@/components/seo/PageSeo";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2 } from "lucide-react";
import { TemplatePlaceholderRibbon } from "@/components/marketing/TemplatePlaceholderRibbon";

const components = [
  { name: "Authentication", status: "Operational" },
  { name: "Database & API", status: "Operational" },
  { name: "Transactional email", status: "Operational" },
  { name: "Payments (Stripe)", status: "Operational" },
  { name: "File storage", status: "Operational" },
];

const Status = () => (
  <MarketingLayout>
    <PageSeo
      path="/status"
      title="System status"
      description="Live status of every system that powers your workspace."
    />
    <section className="container py-16 md:py-20">
      <div className="max-w-3xl mx-auto">
        <TemplatePlaceholderRibbon>
          This is a static placeholder. Wire it to a real monitoring provider (BetterStack,
          Instatus, etc.) before launch.
        </TemplatePlaceholderRibbon>

        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">All systems normal</h1>
          <p className="text-muted-foreground">Last checked just now.</p>
        </div>

        <Card className="divide-y divide-border">
          {components.map((c) => (
            <div key={c.name} className="flex items-center justify-between px-5 py-4">
              <span className="font-medium">{c.name}</span>
              <Badge variant="outline" className="gap-1.5 border-success/30 bg-success/10 text-success">
                <CheckCircle2 className="h-3.5 w-3.5" />
                {c.status}
              </Badge>
            </div>
          ))}
        </Card>

        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-3">Incident history</h2>
          <Card className="p-6 text-sm text-muted-foreground">
            No incidents reported in the last 90 days.
          </Card>
        </div>
      </div>
    </section>
  </MarketingLayout>
);

export default Status;
