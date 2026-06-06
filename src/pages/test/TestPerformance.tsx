import { AreaPage } from "@/components/test/AreaPage";

const PROMPT = `Establish a performance baseline.

1. Publish the latest frontend so Lighthouse re-scores against current code.
2. Add a bundle-size budget to vite.config.ts (warn over 250KB gzip per chunk).
3. Profile /, /pricing, and /dashboard with the browser performance tool and record LCP, INP, CLS in docs/testing/test-strategy.md.
4. Lazy-load below-the-fold images and route-split heavy admin pages with React.lazy where they aren't already.`;

export default function TestPerformance() {
  return (
    <AreaPage
      areaKey="performance"
      title="Performance"
      description="Core Web Vitals, bundle size, route-level code splitting."
      prompt={PROMPT}
    />
  );
}
