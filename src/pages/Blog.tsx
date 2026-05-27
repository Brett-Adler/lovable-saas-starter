import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { PageSeo } from "@/components/seo/PageSeo";
import { ComingSoonHero } from "@/components/marketing/ComingSoonHero";

const Blog = () => (
  <MarketingLayout>
    <PageSeo path="/blog" title="Blog" description="Engineering notes, product updates, and SaaS playbooks — coming soon." />
    <ComingSoonHero
      eyebrow="Blog"
      title="Notes from the build"
      description="Deep dives on auth, billing, infra, and growth — all the things we learned shipping this starter. Subscribe to get the first post."
      source="coming_soon:blog"
    />
  </MarketingLayout>
);

export default Blog;
