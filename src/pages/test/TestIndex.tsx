import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { coverage } from "@/data/test-coverage";
import { NoIndex } from "@/components/seo/NoIndex";
import { PageSeo } from "@/components/seo/PageSeo";

const areaSlug: Record<string, string> = {
  accessibility: "accessibility",
  performance: "performance",
  seo: "seo",
  security: "security",
  design: "design",
  "functional-e2e": "e2e",
  analytics: "analytics",
};

export default function TestIndex() {
  const { summary, areas, generatedAt } = coverage;
  return (
    <main className="mx-auto max-w-5xl px-4 py-10 space-y-10">
      <PageSeo
        title="Test Coverage — Launch Readiness"
        description="Coverage dashboard, scan results, and prioritized launch checklist."
        path="/test"
        noindex
      />
      <NoIndex />

      <section>
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-2xl font-bold">Launch readiness</h2>
            <p className="text-muted-foreground text-sm mt-1">
              Snapshot generated {generatedAt}. Re-run <code>/test</code> in chat to refresh.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">Overall</span>
            <Progress value={(summary.overallScore / 5) * 100} className="w-40" />
            <span className="font-medium">{summary.overallScore}/5</span>
          </div>
        </div>
      </section>

      <section>
        <h3 className="text-lg font-semibold mb-3">Checklist</h3>
        <div className="space-y-2">
          {summary.blocking.map((item) => (
            <Link
              key={item.id}
              to={`/test/${areaSlug[item.area] ?? item.area}`}
              className="flex items-start gap-3 border border-border rounded-md p-3 hover:bg-muted transition-colors"
            >
              <Badge variant="destructive">Blocking</Badge>
              <div>
                <div className="font-medium">{item.title}</div>
                <div className="text-sm text-muted-foreground">{item.detail}</div>
              </div>
            </Link>
          ))}
          {summary.recommended.map((item) => (
            <Link
              key={item.id}
              to={`/test/${areaSlug[item.area] ?? item.area}`}
              className="flex items-start gap-3 border border-border rounded-md p-3 hover:bg-muted transition-colors"
            >
              <Badge variant="secondary">Recommended</Badge>
              <div>
                <div className="font-medium">{item.title}</div>
                <div className="text-sm text-muted-foreground">{item.detail}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-lg font-semibold mb-3">Areas</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {Object.entries(areas).map(([key, a]) => (
            <Card key={key}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base capitalize">
                  {key.replace("-", " ")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2">{a.summary}</p>
                <div className="mt-3 flex items-center justify-between gap-3">
                  <Progress value={(a.score / 5) * 100} className="flex-1" />
                  <span className="text-sm font-medium tabular-nums">{a.score}/5</span>
                </div>
                <Link
                  to={`/test/${areaSlug[key] ?? key}`}
                  className="inline-block mt-3 text-sm text-primary hover:underline"
                >
                  Open details →
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="border border-border rounded-md p-4 bg-muted/40">
        <h3 className="text-sm font-semibold mb-1">Strategy doc</h3>
        <p className="text-sm text-muted-foreground">
          Human-owned goals, risks, and exit criteria live in{" "}
          <code>docs/testing/test-strategy.md</code>. Edit it freely — the dashboard
          regenerates around it.
        </p>
      </section>
    </main>
  );
}
