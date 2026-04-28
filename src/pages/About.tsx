import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { Badge } from "@/components/ui/badge";

const About = () => (
  <MarketingLayout>
    <section className="container py-20 md:py-28">
      <div className="max-w-3xl mx-auto">
        <Badge variant="outline" className="mb-4">About</Badge>
        <h1 className="text-4xl md:text-6xl font-bold">We build the boring stuff so you don't have to.</h1>
        <div className="prose prose-lg mt-10 max-w-none text-muted-foreground space-y-6">
          <p className="text-xl">
            Every SaaS founder spends their first three months building the same things: auth flows, billing portals, password resets, role permissions, email templates.
          </p>
          <p>
            We've built that foundation, made it beautiful, and made it yours. Drop in your branding, configure your products, and ship the thing only <em>you</em> can build.
          </p>
          <p>
            This template is for indie hackers, agencies, and teams who care about quality but don't want to reinvent the wheel.
          </p>
        </div>
      </div>
    </section>
  </MarketingLayout>
);

export default About;
