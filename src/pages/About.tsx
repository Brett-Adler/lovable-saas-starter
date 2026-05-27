import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { PageSeo } from "@/components/seo/PageSeo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const bullets = [
  "Auth, billing, teams, and email — production-ready from day one.",
  "A polished design system with light + dark themes.",
  "A super-admin panel and built-in analytics for the boring metrics.",
];

const About = () => (
  <MarketingLayout>
      <PageSeo path="/about" title="About" description="The story behind the SaaS Starter and the team building it." />
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

        <div className="mt-12 rounded-xl border border-border bg-muted/30 p-6">
          <h2 className="font-semibold mb-4">What's in the box</h2>
          <ul className="space-y-3">
            {bullets.map((b) => (
              <li key={b} className="flex gap-3 text-sm">
                <CheckCircle2 className="h-5 w-5 text-success shrink-0 mt-0.5" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-10 flex flex-col sm:flex-row gap-3">
          <Button asChild>
            <Link to="/pricing">See pricing <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/contact">Talk to us</Link>
          </Button>
        </div>
      </div>
    </section>
  </MarketingLayout>
);

export default About;
