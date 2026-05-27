import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { PageSeo } from "@/components/seo/PageSeo";
import { ReadmeContent } from "@/components/docs/ReadmeContent";
import { Card } from "@/components/ui/card";

const Readme = () => (
  <MarketingLayout>
    <PageSeo path="/readme" title="Readme" description="Tech stack, architecture, and roadmap for the SaaS Starter project." />
    <section className="container py-20 md:py-28">
      <div className="max-w-3xl mx-auto mb-8">
        <Card className="p-4 bg-muted/40 border-dashed flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            New here? Start with a guided walkthrough instead of the full reference.
          </p>
          <div className="flex flex-wrap gap-4 text-sm font-medium">
            <Link to="/use-template/lovable" className="inline-flex items-center gap-1 text-primary hover:underline">
              Lovable guide <ArrowRight className="h-3 w-3" />
            </Link>
            <Link to="/use-template/github" className="inline-flex items-center gap-1 text-primary hover:underline">
              GitHub guide <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </Card>
      </div>
      <ReadmeContent />
    </section>
  </MarketingLayout>
);

export default Readme;
