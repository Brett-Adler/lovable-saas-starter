import { useQuery } from "@tanstack/react-query";
import { Link, useSearchParams } from "react-router-dom";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { PageSeo } from "@/components/seo/PageSeo";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, X } from "lucide-react";

interface PostRow {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  cover_image_url: string | null;
  author_name: string | null;
  published_at: string | null;
  category: { slug: string; name: string } | null;
  blog_post_tags: { tag: { slug: string; name: string } }[];
}

const Blog = () => {
  const [params, setParams] = useSearchParams();
  const categorySlug = params.get("category");
  const tagSlug = params.get("tag");

  const { data: categories } = useQuery({
    queryKey: ["blog-categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_categories")
        .select("slug, name")
        .order("name");
      if (error) throw error;
      return data ?? [];
    },
  });

  const { data: tags } = useQuery({
    queryKey: ["blog-tags"],
    queryFn: async () => {
      const { data, error } = await supabase.from("blog_tags").select("slug, name").order("name");
      if (error) throw error;
      return data ?? [];
    },
  });

  const { data: posts, isLoading } = useQuery({
    queryKey: ["blog-posts", categorySlug, tagSlug],
    queryFn: async (): Promise<PostRow[]> => {
      let query = supabase
        .from("blog_posts")
        .select(
          "id, slug, title, excerpt, cover_image_url, author_name, published_at, category:blog_categories(slug, name), blog_post_tags(tag:blog_tags(slug, name))",
        )
        .eq("status", "published")
        .not("published_at", "is", null)
        .lte("published_at", new Date().toISOString())
        .order("published_at", { ascending: false });

      if (categorySlug) {
        const { data: cat } = await supabase
          .from("blog_categories")
          .select("id")
          .eq("slug", categorySlug)
          .maybeSingle();
        if (cat) query = query.eq("category_id", cat.id);
      }

      const { data, error } = await query;
      if (error) throw error;
      let result = (data ?? []) as unknown as PostRow[];

      if (tagSlug) {
        result = result.filter((p) => p.blog_post_tags.some((pt) => pt.tag?.slug === tagSlug));
      }
      return result;
    },
  });

  const clearFilters = () => setParams({});

  return (
    <MarketingLayout>
      <PageSeo
        path="/blog"
        title="Blog"
        description="Engineering notes, product updates, and SaaS playbooks."
      />
      <section className="container py-16 md:py-20 max-w-5xl">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">Blog</h1>
          <p className="text-muted-foreground">Notes from building this starter and shipping SaaS.</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 mb-8 justify-center">
          {categories && categories.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {categories.map((c) => (
                <Link
                  key={c.slug}
                  to={`/blog?category=${c.slug}`}
                  className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                    categorySlug === c.slug
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-muted/40 hover:bg-muted"
                  }`}
                >
                  {c.name}
                </Link>
              ))}
            </div>
          )}
          {(categorySlug || tagSlug) && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="h-3.5 w-3.5" />
              Clear
            </Button>
          )}
        </div>

        {tagSlug && (
          <p className="text-sm text-muted-foreground mb-4 text-center">
            Filtered by tag: <span className="font-medium text-foreground">#{tagSlug}</span>
          </p>
        )}

        {isLoading ? (
          <p className="text-center text-muted-foreground py-12">Loading…</p>
        ) : !posts || posts.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground">No posts yet. Check back soon.</p>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {posts.map((p) => (
              <Card key={p.id} className="overflow-hidden hover:shadow-md transition-shadow flex flex-col">
                {p.cover_image_url && (
                  <Link to={`/blog/${p.slug}`} className="block aspect-video bg-muted overflow-hidden">
                    <img
                      src={p.cover_image_url}
                      alt={p.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </Link>
                )}
                <div className="p-5 flex-1 flex flex-col">
                  {p.category && (
                    <Link
                      to={`/blog?category=${p.category.slug}`}
                      className="text-xs uppercase tracking-wide text-primary font-medium mb-2"
                    >
                      {p.category.name}
                    </Link>
                  )}
                  <Link to={`/blog/${p.slug}`}>
                    <h2 className="text-xl font-semibold mb-2 hover:text-primary transition-colors">{p.title}</h2>
                  </Link>
                  {p.excerpt && <p className="text-sm text-muted-foreground mb-3 flex-1">{p.excerpt}</p>}
                  <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-3 w-3" />
                      {p.published_at && new Date(p.published_at).toLocaleDateString()}
                    </span>
                    {p.author_name && <span>{p.author_name}</span>}
                  </div>
                  {p.blog_post_tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {p.blog_post_tags.map((pt) => (
                        <Link key={pt.tag.slug} to={`/blog?tag=${pt.tag.slug}`}>
                          <Badge variant="outline" className="text-[10px]">
                            #{pt.tag.name}
                          </Badge>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}

        {tags && tags.length > 0 && (
          <div className="mt-12 pt-8 border-t border-border">
            <p className="text-xs uppercase tracking-wide text-muted-foreground mb-3 text-center">Tags</p>
            <div className="flex flex-wrap justify-center gap-1.5">
              {tags.map((t) => (
                <Link key={t.slug} to={`/blog?tag=${t.slug}`}>
                  <Badge
                    variant="outline"
                    className={tagSlug === t.slug ? "border-primary text-primary" : ""}
                  >
                    #{t.name}
                  </Badge>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>
    </MarketingLayout>
  );
};

export default Blog;
