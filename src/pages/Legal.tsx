import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { Badge } from "@/components/ui/badge";

interface LegalProps {
  title: string;
  kind: "privacy" | "terms";
}

const Legal = ({ title, kind }: LegalProps) => (
  <MarketingLayout>
    <section className="container py-20 md:py-28">
      <div className="max-w-3xl mx-auto">
        <Badge variant="outline" className="mb-4">Legal</Badge>
        <h1 className="text-4xl md:text-5xl font-bold">{title}</h1>
        <p className="mt-4 text-sm text-muted-foreground">Last updated: January 1, 2026</p>
        <div className="prose prose-lg mt-10 max-w-none text-muted-foreground space-y-4">
          <p className="text-foreground font-semibold">
            ⚠️ Placeholder — replace with your own {kind} policy before launch.
          </p>
          <p>
            This is template content. You should consult legal counsel and replace this page with a {kind} policy that accurately describes your business, data practices, and obligations to your users.
          </p>
          <p>
            Free generators: <a href="https://www.iubenda.com/" className="text-primary">iubenda</a>,{" "}
            <a href="https://www.termsfeed.com/" className="text-primary">TermsFeed</a>,{" "}
            <a href="https://www.privacypolicies.com/" className="text-primary">PrivacyPolicies.com</a>.
          </p>
          <h2 className="text-foreground">1. Introduction</h2>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          <h2 className="text-foreground">2. Information we collect</h2>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          <h2 className="text-foreground">3. How we use it</h2>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          <h2 className="text-foreground">4. Your rights</h2>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          <h2 className="text-foreground">5. Contact</h2>
          <p>Email us at hello@example.com with any questions.</p>
        </div>
      </div>
    </section>
  </MarketingLayout>
);

export default Legal;
