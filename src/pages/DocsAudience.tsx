import { useParams, Link } from "react-router-dom";
import { DocLayout } from "@/components/docs/DocLayout";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { PageSeo } from "@/components/seo/PageSeo";
import { audienceById, articlesByAudience, groupByCategory, isAudience } from "@/data/docs";
import { Card } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

const DocsAudience = () => {
  const { audience } = useParams<{ audience: string }>();

  if (!isAudience(audience)) {
    return (
      <MarketingLayout>
        <PageSeo path="/docs" title="Documentation" noindex />
        <section className="container py-20 text-center">
          <h1 className="text-3xl font-bold">Section not found</h1>
          <p className="mt-3 text-muted-foreground">
            <Link to="/docs" className="text-primary hover:underline">Back to documentation</Link>
          </p>
        </section>
      </MarketingLayout>
    );
  }

  const meta = audienceById[audience];
  const groups = groupByCategory(articlesByAudience(audience));

  return (
    <DocLayout
      audience={audience}
      title={meta.label}
      description={meta.description}
      path={`/docs/${audience}`}
    >
      <div className="space-y-10">
        {groups.map(({ category, items }) => (
          <div key={category}>
            <h2 className="text-lg font-semibold tracking-tight mb-3">{category}</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {items.map((a) => (
                <Card key={a.slug} className="p-4 hover:border-primary/40 transition-colors focus-within:ring-2 focus-within:ring-primary">
                  <Link to={`/docs/${audience}/${a.slug}`} className="block focus:outline-none">
                    <p className="font-medium text-foreground inline-flex items-center gap-1.5">
                      {a.title}
                      <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">{a.description}</p>
                  </Link>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </DocLayout>
  );
};

export default DocsAudience;
