import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { Badge } from "@/components/ui/badge";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const Accessibility = () => {
  const { data: settings } = useSiteSettings();
  const email = settings?.contact_email ?? "hello@example.com";

  return (
    <MarketingLayout>
      <section className="container py-20 md:py-28">
        <div className="max-w-3xl mx-auto">
          <Badge variant="outline" className="mb-4">Accessibility</Badge>
          <h1 className="text-4xl md:text-5xl font-bold">Accessibility statement</h1>
          <p className="mt-4 text-sm text-muted-foreground">Last updated: January 1, 2026</p>
          <div className="prose prose-lg mt-10 max-w-none text-muted-foreground space-y-5">
            <p>
              We are committed to making this product usable for everyone, regardless of ability or
              the technology they use. We aim to conform to the Web Content Accessibility Guidelines
              (WCAG) 2.1 Level AA.
            </p>
            <h2 className="text-foreground">What we do</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Use semantic HTML and ARIA attributes where appropriate.</li>
              <li>Maintain sufficient color contrast in both light and dark themes.</li>
              <li>Support full keyboard navigation across interactive elements.</li>
              <li>Provide visible focus states and skip links where relevant.</li>
              <li>Caption media and provide alt text for meaningful images.</li>
            </ul>
            <h2 className="text-foreground">Known limitations</h2>
            <p>
              Some third-party embeds and legacy components may not fully meet our targets yet.
              We're actively improving these.
            </p>
            <h2 className="text-foreground">Report a problem</h2>
            <p>
              If you encounter an accessibility barrier, please email{" "}
              <a href={`mailto:${email}`} className="text-primary">{email}</a>. We aim to respond
              within 5 business days.
            </p>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
};

export default Accessibility;
