import { AreaPage } from "@/components/test/AreaPage";

const PROMPT = `Decide on analytics for the public launch.

1. Confirm whether the launch needs product analytics (PostHog/Plausible/Vercel) — if not, mark this area as accepted-risk in docs/testing/test-strategy.md.
2. If yes: pick a provider, add the SDK behind a consent banner, and create src/lib/analytics.ts with typed track() helpers.
3. Document the event registry (signup_completed, checkout_started, checkout_succeeded, invite_sent, invite_accepted, newsletter_subscribed) in docs/testing/test-strategy.md.
4. Audit critical workflows and call track() at each success boundary; assert PII is not in event payloads.`;

export default function TestAnalytics() {
  return (
    <AreaPage
      areaKey="analytics"
      title="Analytics"
      description="Tracking plan, event coverage per critical workflow, PII checks, consent."
      prompt={PROMPT}
    />
  );
}
