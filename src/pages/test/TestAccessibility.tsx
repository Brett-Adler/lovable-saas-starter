import { AreaPage } from "@/components/test/AreaPage";

const PROMPT = `Add @axe-core/react accessibility assertions to the page smoke tests.

1. bun add -D @axe-core/react jest-axe
2. In src/test/smoke/pages.test.tsx, after each render, run \`axe(container)\` and assert no violations of impact "serious" or "critical".
3. Add a manual keyboard-pass checklist to docs/testing/test-strategy.md covering: main nav, dialog open/close, dropdown menus, the support chat widget.
4. Fix any violations surfaced, preferring shadcn primitives and aria-label on icon-only buttons.`;

export default function TestAccessibility() {
  return (
    <AreaPage
      areaKey="accessibility"
      title="Accessibility"
      description="WCAG AA, keyboard, ARIA on custom widgets, icon-only buttons."
      prompt={PROMPT}
    />
  );
}
