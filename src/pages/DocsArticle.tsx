import { useParams, Link } from "react-router-dom";
import { DocLayout } from "@/components/docs/DocLayout";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { PageSeo } from "@/components/seo/PageSeo";
import { findArticle, isAudience } from "@/data/docs";

const DocsArticle = () => {
  const { audience, slug } = useParams<{ audience: string; slug: string }>();

  if (!isAudience(audience) || !slug) {
    return notFound();
  }

  const article = findArticle(audience, slug);
  if (!article) return notFound();

  const Body = article.body;

  return (
    <DocLayout
      audience={audience}
      article={article}
      title={article.title}
      description={article.description}
      path={`/docs/${audience}/${slug}`}
    >
      <Body />
    </DocLayout>
  );
};

function notFound() {
  return (
    <MarketingLayout>
      <PageSeo path="/docs" title="Article not found" noindex />
      <section className="container py-20 text-center">
        <h1 className="text-3xl font-bold">Article not found</h1>
        <p className="mt-3 text-muted-foreground">
          The page you're looking for doesn't exist. <Link to="/docs" className="text-primary hover:underline">Browse all documentation</Link>.
        </p>
      </section>
    </MarketingLayout>
  );
}

export default DocsArticle;
