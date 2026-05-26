import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { Badge } from "@/components/ui/badge";
import { useSiteSettings } from "@/hooks/useSiteSettings";

interface LegalProps {
  title: string;
  kind: "privacy" | "terms" | "cookies";
}

const Legal = ({ title, kind }: LegalProps) => {
  const { data: settings } = useSiteSettings();
  const email = settings?.contact_email ?? "hello@example.com";

  return (
    <MarketingLayout>
      <section className="container py-20 md:py-28">
        <div className="max-w-3xl mx-auto">
          <Badge variant="outline" className="mb-4">Legal</Badge>
          <h1 className="text-4xl md:text-5xl font-bold">{title}</h1>
          <p className="mt-4 text-sm text-muted-foreground">Last updated: January 1, 2026</p>
          <div className="prose prose-lg mt-10 max-w-none text-muted-foreground space-y-5">
            <p className="text-foreground font-semibold">
              ⚠️ Template placeholder — replace this with your own {kind} content reviewed by legal
              counsel before launch. Free generators: <a href="https://www.iubenda.com/" className="text-primary">iubenda</a>,{" "}
              <a href="https://www.termsfeed.com/" className="text-primary">TermsFeed</a>,{" "}
              <a href="https://www.privacypolicies.com/" className="text-primary">PrivacyPolicies.com</a>.
            </p>

            {kind === "privacy" && (
              <>
                <h2 className="text-foreground">1. Information we collect</h2>
                <p>Account information (email, name), product usage data, payment information (handled by Stripe), and communications you send us.</p>
                <h2 className="text-foreground">2. How we use it</h2>
                <p>To provide and improve the service, send transactional emails, process payments, and — only with your opt-in — send marketing updates.</p>
                <h2 className="text-foreground">3. Third parties</h2>
                <p>We share data only with processors required to run the service: Stripe (payments), our email provider, and our analytics tooling.</p>
                <h2 className="text-foreground">4. Retention</h2>
                <p>We retain account data for the lifetime of your account and 90 days after deletion. Billing records are kept as required by law.</p>
                <h2 className="text-foreground">5. Your rights</h2>
                <p>You can access, export, or delete your data at any time from your account settings, or by emailing us.</p>
                <h2 className="text-foreground">6. Contact</h2>
                <p>Questions? Email <a href={`mailto:${email}`} className="text-primary">{email}</a>.</p>
              </>
            )}

            {kind === "terms" && (
              <>
                <h2 className="text-foreground">1. Acceptance of terms</h2>
                <p>By using this service you agree to these terms. If you do not agree, do not use the service.</p>
                <h2 className="text-foreground">2. Accounts</h2>
                <p>You are responsible for activity under your account and for keeping your credentials secure.</p>
                <h2 className="text-foreground">3. Acceptable use</h2>
                <p>No abuse, scraping, reverse engineering, or use that violates applicable law.</p>
                <h2 className="text-foreground">4. Subscriptions and billing</h2>
                <p>Paid plans renew automatically. Cancel anytime; access continues to the end of the current period.</p>
                <h2 className="text-foreground">5. Termination</h2>
                <p>We may suspend accounts that violate these terms. You may close your account at any time.</p>
                <h2 className="text-foreground">6. Disclaimer & liability</h2>
                <p>Service is provided "as is" without warranty. Our liability is limited to fees paid in the prior 12 months.</p>
                <h2 className="text-foreground">7. Contact</h2>
                <p>Email <a href={`mailto:${email}`} className="text-primary">{email}</a>.</p>
              </>
            )}

            {kind === "cookies" && (
              <>
                <h2 className="text-foreground">1. What cookies we use</h2>
                <p>Essential cookies for authentication and session state, plus a minimal analytics cookie to understand product usage.</p>
                <h2 className="text-foreground">2. Third-party cookies</h2>
                <p>Stripe sets cookies during checkout for fraud prevention. Our email links may include tracking parameters to measure deliverability.</p>
                <h2 className="text-foreground">3. Managing cookies</h2>
                <p>You can block or delete cookies in your browser settings. Disabling essential cookies will prevent you from staying signed in.</p>
                <h2 className="text-foreground">4. Contact</h2>
                <p>Email <a href={`mailto:${email}`} className="text-primary">{email}</a>.</p>
              </>
            )}
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
};

export default Legal;
