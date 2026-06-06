import { AreaPage } from "@/components/test/AreaPage";

const PROMPT = `Audit the codebase for raw Tailwind color classes and replace with semantic tokens.

1. Run: rg -n "text-(white|black|gray-[0-9]|slate-[0-9])|bg-(white|black|gray-[0-9])" src/components src/pages
2. Replace each hit with the matching semantic token (text-foreground, text-muted-foreground, bg-background, bg-card, border-border, bg-primary, etc.).
3. Add a screenshots-at-3-widths step (320, 768, 1280) to docs/testing/test-strategy.md so the next reviewer can spot responsive regressions.`;

export default function TestDesign() {
  return (
    <AreaPage
      areaKey="design"
      title="Design"
      description="Semantic token usage, responsive at 320/768/1280, dark-mode coverage."
      prompt={PROMPT}
    />
  );
}
