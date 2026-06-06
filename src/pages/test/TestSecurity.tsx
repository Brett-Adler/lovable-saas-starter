import { AreaPage } from "@/components/test/AreaPage";

const PROMPT = `Run /skill:seo-security-convergence to converge SEO + security in one loop.

The skill alternates SEO and security scans, fixes findings, and stops when
both scans land clean in the same round. Respect existing ignored findings
(documented in mem://security-memory).`;

export default function TestSecurity() {
  return (
    <AreaPage
      areaKey="security"
      title="Security"
      description="RLS on every public table, GRANTs, auth gating, webhook signatures, dependency vulns."
      prompt={PROMPT}
    />
  );
}
