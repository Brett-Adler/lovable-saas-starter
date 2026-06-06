import { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { coverage, type AreaCoverage } from "@/data/test-coverage";
import { NoIndex } from "@/components/seo/NoIndex";
import { PageSeo } from "@/components/seo/PageSeo";

interface Props {
  areaKey: keyof typeof coverage.areas | string;
  title: string;
  description: string;
  prompt: string;
  children?: ReactNode;
}

export function AreaPage({ areaKey, title, description, prompt, children }: Props) {
  const area: AreaCoverage = (coverage.areas as Record<string, AreaCoverage>)[areaKey] ?? {
    score: 0,
    tests: {},
    findings: [],
    gaps: [],
    summary: "No data yet.",
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 space-y-6">
      <PageSeo
        title={`${title} — Test Coverage`}
        description={description}
        path={`/test/${areaKey}`}
        noindex
      />
      <NoIndex />

      <header>
        <h2 className="text-3xl font-bold">{title}</h2>
        <p className="text-muted-foreground mt-2">{description}</p>
        <div className="mt-4 flex items-center gap-3">
          <span className="text-sm text-muted-foreground">Score</span>
          <Progress value={(area.score / 5) * 100} className="w-40" />
          <span className="text-sm font-medium">{area.score}/5</span>
        </div>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Current status</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-3">
          <p>{area.summary}</p>
          {Object.keys(area.tests).length > 0 && (
            <div className="flex flex-wrap gap-2">
              {Object.entries(area.tests).map(([kind, count]) => (
                <Badge key={kind} variant="outline" className="text-xs">
                  {kind}: {count}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <section>
        <h3 className="text-lg font-semibold mb-2">Gaps</h3>
        {area.gaps.length === 0 ? (
          <p className="text-sm text-muted-foreground">No gaps — all checks green.</p>
        ) : (
          <ul className="space-y-2">
            {area.gaps.map((g, i) => (
              <li
                key={i}
                className="flex items-start gap-2 border border-border rounded-md p-3"
              >
                <Badge variant={g.severity === "blocking" ? "destructive" : "secondary"}>
                  {g.severity}
                </Badge>
                <span className="text-sm">{g.title}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h3 className="text-lg font-semibold mb-2">Run in Lovable</h3>
        <pre className="bg-muted text-foreground rounded-md p-4 text-xs whitespace-pre-wrap font-mono">
          {prompt}
        </pre>
        <Button
          className="mt-2"
          size="sm"
          variant="outline"
          onClick={() => navigator.clipboard.writeText(prompt)}
        >
          Copy prompt
        </Button>
      </section>

      {children}
      {/* USER EDITS BELOW — preserved across /test re-runs */}
    </main>
  );
}
