import { AreaPage } from "@/components/test/AreaPage";

const PROMPT = `Run /skill:seo-review to refresh the SEO scan.

If any findings come back failing, follow the seo-review skill to fix them in
index.html (sitewide head defaults) and the per-page <PageSeo> components.
Mark findings fixed via update_findings once addressed.`;

export default function TestSeo() {
  return (
    <AreaPage
      areaKey="seo"
      title="SEO"
      description="Per-route head, canonical, sitemap, robots, JSON-LD, social cards."
      prompt={PROMPT}
    />
  );
}
