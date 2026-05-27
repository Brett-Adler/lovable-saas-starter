import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { PageSeo } from "@/components/seo/PageSeo";
import { ComingSoonHero } from "@/components/marketing/ComingSoonHero";

const Customers = () => (
  <MarketingLayout>
    <PageSeo
      path="/customers"
      title="Customer stories"
      description="Case studies and customer stories — coming soon."
    />
    <ComingSoonHero
      eyebrow="Customer stories"
      title="Real teams shipping real products"
      description="We're collecting case studies from teams using this starter. Leave your email to be the first to read them — or to be one of them."
      source="coming_soon:customers"
    />
  </MarketingLayout>
);

export default Customers;
