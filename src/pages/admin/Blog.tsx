import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { AdminShell } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit3, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const AdminBlog = () => {
  const { data: posts, isLoading } = useQuery({
    queryKey: ["admin-blog-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("id, slug, title, status, published_at, updated_at, category:blog_categories(name)")
        .order("updated_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  return (
    <AdminShell
      title="Blog"
      description="Write, publish, and organize blog posts."
      actions={
        <Button asChild>
          <Link to="/admin/blog/new">
            <Plus className="h-4 w-4" />
            New post
          </Link>
        </Button>
      }
    >
      <Card>
        {isLoading ? (
          <p className="p-6 text-muted-foreground">Loading…</p>
        ) : !posts || posts.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-muted-foreground mb-4">No posts yet.</p>
            <Button asChild>
              <Link to="/admin/blog/new">
                <Plus className="h-4 w-4" />
                Write your first post
              </Link>
            </Button>
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {posts.map((p) => (
              <li key={p.id} className="flex items-center gap-4 px-5 py-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <Link to={`/admin/blog/${p.id}`} className="font-medium hover:text-primary truncate">
                      {p.title || "(untitled)"}
                    </Link>
                    <Badge variant={p.status === "published" ? "default" : "secondary"} className="text-[10px]">
                      {p.status}
                    </Badge>
                    {p.category && (
                      <Badge variant="outline" className="text-[10px]">
                        {(p.category as { name: string }).name}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    /blog/{p.slug} · updated {new Date(p.updated_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  {p.status === "published" && (
                    <Button variant="ghost" size="icon" asChild className="h-8 w-8">
                      <a href={`/blog/${p.slug}`} target="_blank" rel="noopener noreferrer" aria-label="View live">
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </Button>
                  )}
                  <Button variant="ghost" size="icon" asChild className="h-8 w-8">
                    <Link to={`/admin/blog/${p.id}`} aria-label="Edit">
                      <Edit3 className="h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </AdminShell>
  );
};

export default AdminBlog;
