import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { PageSeo } from "@/components/seo/PageSeo";
import { ReadmeContent } from "@/components/docs/ReadmeContent";

const Readme = () => (
  <MarketingLayout>
    <PageSeo path="/readme" title="Readme" description="Tech stack, architecture, and roadmap for the SaaS Starter project." />
    <section className="container py-20 md:py-28">
      <ReadmeContent />
    </section>
  </MarketingLayout>
);

export default Readme;
