import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { PageSeo } from "@/components/seo/PageSeo";
import { DocsSidebar } from "@/components/docs/DocsSidebar";
import { DocsSearch } from "@/components/docs/DocsSearch";
import { Audience, audienceById, DocArticle, adjacentArticles } from "@/data/docs";

interface Props {
  audience: Audience;
  article?: DocArticle;
  title: string;
  description: string;
  path: string;
  children: ReactNode;
}

export function DocLayout({ audience, article, title, description, path, children }: Props) {
  const meta = audienceById[audience];
  const { prev, next } = article ? adjacentArticles(article) : { prev: undefined, next: undefined };

  return (
    <MarketingLayout>
      <PageSeo path={path} title={title} description={description} />
      <section className="container py-12 md:py-16">
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground">
          <Link to="/docs" className="hover:text-foreground">Docs</Link>
          <ChevronRight aria-hidden="true" className="h-3.5 w-3.5" />
          <Link to={`/docs/${audience}`} className="hover:text-foreground">{meta.label}</Link>
          {article && (
            <>
              <ChevronRight aria-hidden="true" className="h-3.5 w-3.5" />
              <span className="text-foreground">{article.title}</span>
            </>
          )}
        </nav>

        <div className="lg:grid lg:grid-cols-[240px_1fr] lg:gap-10">
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-6">
              <DocsSearch placeholder="Search docs..." />
              <DocsSidebar audience={audience} activeSlug={article?.slug} />
            </div>
          </aside>

          <article className="min-w-0 max-w-3xl">
            <div className="lg:hidden mb-6">
              <DocsSearch />
            </div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {meta.label}{article ? ` · ${article.category}` : ""}
            </p>
            <h1 className="mt-2 text-3xl md:text-4xl font-bold tracking-tight">{title}</h1>
            {description && (
              <p className="mt-3 text-lg text-foreground/80 leading-relaxed">{description}</p>
            )}
            <div className="mt-8">{children}</div>

            {article && (prev || next) && (
              <div className="mt-16 pt-6 border-t border-border grid gap-3 sm:grid-cols-2">
                {prev ? (
                  <Link
                    to={`/docs/${audience}/${prev.slug}`}
                    className="rounded-lg border border-border p-4 hover:border-primary/40 transition-colors text-left"
                  >
                    <span className="text-xs uppercase tracking-wider text-muted-foreground">Previous</span>
                    <span className="block mt-1 font-medium text-foreground">{prev.title}</span>
                  </Link>
                ) : <span />}
                {next ? (
                  <Link
                    to={`/docs/${audience}/${next.slug}`}
                    className="rounded-lg border border-border p-4 hover:border-primary/40 transition-colors text-right sm:text-right"
                  >
                    <span className="text-xs uppercase tracking-wider text-muted-foreground">Next</span>
                    <span className="block mt-1 font-medium text-foreground">{next.title}</span>
                  </Link>
                ) : <span />}
              </div>
            )}

            {article && (
              <div className="mt-10 lg:hidden">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                  More in {meta.short}
                </p>
                <DocsSidebar audience={audience} activeSlug={article.slug} />
              </div>
            )}
          </article>
        </div>
      </section>
    </MarketingLayout>
  );
}
