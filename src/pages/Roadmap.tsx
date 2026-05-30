import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { PageSeo } from "@/components/seo/PageSeo";
import { RoadmapList } from "@/components/marketing/RoadmapList";
import { BrowserMockup } from "@/components/marketing/BrowserMockup";
import { AppMockup } from "@/components/marketing/AppMockup";

const Roadmap = () => (
  <MarketingLayout>
    <PageSeo
      path="/roadmap"
      title="Roadmap"
      description="What's live, what needs setup, and what's coming next."
    />
    <section className="container py-16 md:py-20">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Roadmap</h1>
        <p className="text-lg text-muted-foreground">
          An honest view of what ships out of the box, what needs your keys, and what's
          coming next. Click any "Notify me" item to get an email when it lands.
        </p>
      </div>
      <div className="max-w-4xl mx-auto mb-16">
        <BrowserMockup url="app.yourdomain.com/roadmap">
          <AppMockup variant="roadmap" />
        </BrowserMockup>
        <p className="mt-3 text-center text-xs text-muted-foreground">
          Illustrative placeholder — not a real product screen.
        </p>
      </div>
      <RoadmapList />
    </section>
  </MarketingLayout>
);

export default Roadmap;
