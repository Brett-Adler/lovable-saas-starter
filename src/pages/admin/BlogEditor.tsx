import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AdminShell } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Save, Trash2, X, Plus, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

interface FormState {
  slug: string;
  title: string;
  excerpt: string;
  content_md: string;
  cover_image_url: string;
  author_name: string;
  category_id: string | null;
  status: "draft" | "published";
  published_at: string | null;
}

const blank: FormState = {
  slug: "",
  title: "",
  excerpt: "",
  content_md: "",
  cover_image_url: "",
  author_name: "",
  category_id: null,
  status: "draft",
  published_at: null,
};

const AdminBlogEditor = () => {
  const { id } = useParams<{ id: string }>();
  const isNew = !id || id === "new";
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { user } = useAuth();

  const [form, setForm] = useState<FormState>(blank);
  const [tagIds, setTagIds] = useState<Set<string>>(new Set());
  const [newTagName, setNewTagName] = useState("");
  const [newCatName, setNewCatName] = useState("");
  const [saving, setSaving] = useState(false);

  const { data: post } = useQuery({
    queryKey: ["admin-blog-post", id],
    enabled: !isNew,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*, blog_post_tags(tag_id)")
        .eq("id", id!)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (post) {
      setForm({
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt ?? "",
        content_md: post.content_md ?? "",
        cover_image_url: post.cover_image_url ?? "",
        author_name: post.author_name ?? "",
        category_id: post.category_id,
        status: post.status as "draft" | "published",
        published_at: post.published_at,
      });
      const t = (post.blog_post_tags ?? []) as { tag_id: string }[];
      setTagIds(new Set(t.map((x) => x.tag_id)));
    }
  }, [post]);

  const { data: categories, refetch: refetchCats } = useQuery({
    queryKey: ["admin-blog-categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_categories")
        .select("id, name, slug")
        .order("name");
      if (error) throw error;
      return data ?? [];
    },
  });

  const { data: tags, refetch: refetchTags } = useQuery({
    queryKey: ["admin-blog-tags"],
    queryFn: async () => {
      const { data, error } = await supabase.from("blog_tags").select("id, name, slug").order("name");
      if (error) throw error;
      return data ?? [];
    },
  });

  const onTitleChange = (v: string) => {
    setForm((f) => ({ ...f, title: v, slug: isNew && !f.slug ? slugify(v) : f.slug }));
  };

  const addCategory = async () => {
    const name = newCatName.trim();
    if (!name) return;
    const { data, error } = await supabase
      .from("blog_categories")
      .insert({ name, slug: slugify(name) })
      .select("id")
      .single();
    if (error) {
      toast.error(error.message);
      return;
    }
    setNewCatName("");
    await refetchCats();
    setForm((f) => ({ ...f, category_id: data.id }));
  };

  const addTag = async () => {
    const name = newTagName.trim();
    if (!name) return;
    const { data, error } = await supabase
      .from("blog_tags")
      .insert({ name, slug: slugify(name) })
      .select("id")
      .single();
    if (error) {
      toast.error(error.message);
      return;
    }
    setNewTagName("");
    await refetchTags();
    setTagIds((s) => new Set(s).add(data.id));
  };

  const toggleTag = (tagId: string) => {
    setTagIds((s) => {
      const next = new Set(s);
      if (next.has(tagId)) next.delete(tagId);
      else next.add(tagId);
      return next;
    });
  };

  const save = async (publish?: boolean) => {
    if (!form.title.trim() || !form.slug.trim()) {
      toast.error("Title and slug are required");
      return;
    }
    setSaving(true);
    try {
      const status = publish === true ? "published" : publish === false ? "draft" : form.status;
      const payload = {
        slug: slugify(form.slug),
        title: form.title.trim(),
        excerpt: form.excerpt || null,
        content_md: form.content_md,
        cover_image_url: form.cover_image_url || null,
        author_name: form.author_name || null,
        author_id: user?.id ?? null,
        category_id: form.category_id,
        status,
        published_at:
          status === "published" ? form.published_at ?? new Date().toISOString() : form.published_at,
      };

      let postId = id;
      if (isNew) {
        const { data, error } = await supabase.from("blog_posts").insert(payload).select("id").single();
        if (error) throw error;
        postId = data.id;
      } else {
        const { error } = await supabase.from("blog_posts").update(payload).eq("id", id!);
        if (error) throw error;
      }

      // Sync tags
      if (postId) {
        await supabase.from("blog_post_tags").delete().eq("post_id", postId);
        if (tagIds.size > 0) {
          await supabase
            .from("blog_post_tags")
            .insert(Array.from(tagIds).map((tag_id) => ({ post_id: postId!, tag_id })));
        }
      }

      toast.success(publish === true ? "Published" : "Saved");
      qc.invalidateQueries({ queryKey: ["admin-blog-posts"] });
      qc.invalidateQueries({ queryKey: ["blog-posts"] });
      if (isNew && postId) navigate(`/admin/blog/${postId}`, { replace: true });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (isNew || !id) return;
    if (!confirm("Delete this post permanently?")) return;
    const { error } = await supabase.from("blog_posts").delete().eq("id", id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Deleted");
    navigate("/admin/blog");
  };

  return (
    <AdminShell
      title={isNew ? "New post" : "Edit post"}
      description="Markdown supported. Set status to Published to make it live."
      maxWidth="6xl"
      actions={
        <div className="flex items-center gap-2">
          {!isNew && form.status === "published" && (
            <Button variant="outline" size="sm" asChild>
              <a href={`/blog/${form.slug}`} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" />
                View
              </a>
            </Button>
          )}
          {!isNew && (
            <Button variant="ghost" size="sm" onClick={remove} className="text-destructive">
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={() => save(false)} disabled={saving}>
            <Save className="h-4 w-4" />
            Save draft
          </Button>
          <Button size="sm" onClick={() => save(true)} disabled={saving}>
            {form.status === "published" ? "Update" : "Publish"}
          </Button>
        </div>
      }
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <div className="space-y-4">
          <Card className="p-5 space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={form.title}
                onChange={(e) => onTitleChange(e.target.value)}
                placeholder="Post title"
                className="text-lg font-semibold"
              />
            </div>
            <div>
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={form.slug}
                onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                placeholder="post-url-slug"
              />
            </div>
            <div>
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea
                id="excerpt"
                value={form.excerpt}
                onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
                placeholder="Short summary for listings and SEO"
                rows={2}
              />
            </div>
            <div>
              <Label htmlFor="content">Content (Markdown)</Label>
              <Textarea
                id="content"
                value={form.content_md}
                onChange={(e) => setForm((f) => ({ ...f, content_md: e.target.value }))}
                placeholder="# Heading&#10;&#10;Write your post here in Markdown…"
                rows={20}
                className="font-mono text-sm"
              />
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="p-5 space-y-4">
            <div>
              <Label>Status</Label>
              <Select
                value={form.status}
                onValueChange={(v) => setForm((f) => ({ ...f, status: v as "draft" | "published" }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="cover">Cover image URL</Label>
              <Input
                id="cover"
                value={form.cover_image_url}
                onChange={(e) => setForm((f) => ({ ...f, cover_image_url: e.target.value }))}
                placeholder="https://…"
              />
            </div>
            <div>
              <Label htmlFor="author">Author name</Label>
              <Input
                id="author"
                value={form.author_name}
                onChange={(e) => setForm((f) => ({ ...f, author_name: e.target.value }))}
                placeholder="Jane Doe"
              />
            </div>
          </Card>

          <Card className="p-5 space-y-3">
            <Label>Category</Label>
            <Select
              value={form.category_id ?? "none"}
              onValueChange={(v) => setForm((f) => ({ ...f, category_id: v === "none" ? null : v }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="None" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {(categories ?? []).map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex gap-2">
              <Input
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                placeholder="New category…"
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCategory())}
              />
              <Button size="icon" variant="outline" onClick={addCategory} aria-label="Add category">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </Card>

          <Card className="p-5 space-y-3">
            <Label>Tags</Label>
            <div className="flex flex-wrap gap-1.5 min-h-[28px]">
              {(tags ?? []).map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => toggleTag(t.id)}
                  className="focus:outline-none"
                >
                  <Badge variant={tagIds.has(t.id) ? "default" : "outline"} className="cursor-pointer">
                    {tagIds.has(t.id) && <X className="h-3 w-3 mr-0.5" />}#{t.name}
                  </Badge>
                </button>
              ))}
              {(!tags || tags.length === 0) && (
                <p className="text-xs text-muted-foreground">No tags yet.</p>
              )}
            </div>
            <div className="flex gap-2">
              <Input
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                placeholder="New tag…"
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
              />
              <Button size="icon" variant="outline" onClick={addTag} aria-label="Add tag">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </AdminShell>
  );
};

export default AdminBlogEditor;
