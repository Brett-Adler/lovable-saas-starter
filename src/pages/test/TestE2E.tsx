import { AreaPage } from "@/components/test/AreaPage";

const PROMPT = `Stand up E2E coverage for the critical workflows listed in docs/testing/test-strategy.md.

1. Pick Playwright (recommended for this stack). Add it as a dev dependency and scaffold playwright.config.ts pointed at the local preview.
2. Author one happy-path spec per critical workflow: signup, login (email + Google stub), create org, invite teammate + accept, start Stripe checkout (test mode), newsletter double opt-in.
3. Add edge-function Deno tests for the remaining functions (auth-email-hook, create-checkout, payments-webhook, notify-user, send-transactional-email) following the pattern in supabase/functions/subscribe-newsletter/index_test.ts.
4. Wire bun run test:e2e and document it in src/test/README.md.`;

export default function TestE2E() {
  return (
    <AreaPage
      areaKey="functional-e2e"
      title="Functional E2E"
      description="Happy-path coverage per critical workflow, error states, auth flows."
      prompt={PROMPT}
    />
  );
}
