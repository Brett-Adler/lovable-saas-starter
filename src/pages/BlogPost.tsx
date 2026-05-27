import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { PageSeo } from "@/components/seo/PageSeo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Calendar } from "lucide-react";

interface PostDetail {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content_md: string;
  cover_image_url: string | null;
  author_name: string | null;
  published_at: string | null;
  category: { slug: string; name: string } | null;
  blog_post_tags: { tag: { slug: string; name: string } }[];
}

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: post, isLoading } = useQuery({
    queryKey: ["blog-post", slug],
    enabled: !!slug,
    queryFn: async (): Promise<PostDetail | null> => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select(
          "id, slug, title, excerpt, content_md, cover_image_url, author_name, published_at, category:blog_categories(slug, name), blog_post_tags(tag:blog_tags(slug, name))",
        )
        .eq("slug", slug!)
        .eq("status", "published")
        .maybeSingle();
      if (error) throw error;
      return data as unknown as PostDetail | null;
    },
  });

  return (
    <MarketingLayout>
      <PageSeo
        path={`/blog/${slug}`}
        title={post?.title ?? "Blog post"}
        description={post?.excerpt ?? "Read on the blog."}
      />
      <article className="container max-w-3xl py-12 md:py-16">
        <Button asChild variant="ghost" size="sm" className="mb-6 -ml-3">
          <Link to="/blog">
            <ArrowLeft className="h-4 w-4" />
            All posts
          </Link>
        </Button>

        {isLoading ? (
          <p className="text-muted-foreground">Loading…</p>
        ) : !post ? (
          <div className="py-12 text-center">
            <h1 className="text-2xl font-bold mb-2">Post not found</h1>
            <p className="text-muted-foreground">This post may have been moved or unpublished.</p>
          </div>
        ) : (
          <>
            <header className="mb-8">
              {post.category && (
                <Link
                  to={`/blog?category=${post.category.slug}`}
                  className="text-xs uppercase tracking-wide text-primary font-medium"
                >
                  {post.category.name}
                </Link>
              )}
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight mt-2 mb-4">{post.title}</h1>
              {post.excerpt && <p className="text-lg text-muted-foreground">{post.excerpt}</p>}
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mt-5">
                {post.published_at && (
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    {new Date(post.published_at).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                )}
                {post.author_name && <span>By {post.author_name}</span>}
              </div>
            </header>

            {post.cover_image_url && (
              <img
                src={post.cover_image_url}
                alt={post.title}
                className="w-full rounded-lg mb-10 aspect-video object-cover"
              />
            )}

            <div className="prose prose-neutral dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-primary">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content_md}</ReactMarkdown>
            </div>

            {post.blog_post_tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-10 pt-6 border-t border-border">
                {post.blog_post_tags.map((pt) => (
                  <Link key={pt.tag.slug} to={`/blog?tag=${pt.tag.slug}`}>
                    <Badge variant="outline">#{pt.tag.name}</Badge>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </article>
    </MarketingLayout>
  );
};

export default BlogPost;
