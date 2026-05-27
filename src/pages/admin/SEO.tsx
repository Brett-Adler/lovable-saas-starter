import { useEffect, useState } from "react";
import { Loader2, Plus, Trash2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { useSiteSeo, useSeoPages, type SeoPage } from "@/hooks/useSiteSeo";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AdminShell } from "@/components/admin/AdminShell";

const KNOWN_ROUTES = [
  "/", "/pricing", "/about", "/contact", "/demo", "/waitlist",
  "/newsletter", "/readme", "/changelog", "/sitemap",
  "/privacy", "/terms", "/cookies", "/accessibility",
];

const globalFields = [
  { key: "site_name", label: "Site name", placeholder: "Acme", type: "text" as const },
  { key: "base_url", label: "Base URL (used in canonical / og:url)", placeholder: "https://acme.com", type: "url" as const },
  { key: "default_title", label: "Default page title", placeholder: "Acme — short tagline", type: "text" as const },
  { key: "title_template", label: "Title template (use %s for page title)", placeholder: "%s — Acme", type: "text" as const },
  { key: "default_description", label: "Default meta description", placeholder: "What your site is about, 50–160 chars.", type: "textarea" as const },
  { key: "default_og_image_url", label: "Default OG image URL (absolute)", placeholder: "https://acme.com/og.png", type: "url" as const },
  { key: "twitter_handle", label: "Twitter / X handle", placeholder: "@acme", type: "text" as const },
  { key: "theme_color", label: "Theme color (hex)", placeholder: "#FF5C2A", type: "text" as const },
];

const SeoAdmin = () => {
  const { data: siteSeo } = useSiteSeo();
  const { data: pages } = useSeoPages();
  const qc = useQueryClient();
  const [global, setGlobal] = useState<Record<string, string>>({});
  const [savingGlobal, setSavingGlobal] = useState(false);
  const [pageRows, setPageRows] = useState<SeoPage[]>([]);
  const [newPath, setNewPath] = useState<string>("");

  useEffect(() => {
    if (siteSeo) {
      const g: Record<string, string> = {};
      for (const f of globalFields) g[f.key] = (siteSeo as unknown as Record<string, string | null>)[f.key] ?? "";
      setGlobal(g);
    }
  }, [siteSeo]);

  useEffect(() => {
    if (pages) setPageRows(pages);
  }, [pages]);

  const saveGlobal = async () => {
    setSavingGlobal(true);
    const payload: Record<string, unknown> = { id: 1 };
    for (const f of globalFields) payload[f.key] = global[f.key]?.trim() || null;
    const { error } = await supabase.from("site_seo" as never).upsert(payload as never, { onConflict: "id" });
    setSavingGlobal(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Saved. New values ship in the initial HTML on the next publish.");
    qc.invalidateQueries({ queryKey: ["site_seo"] });
  };

  const updateRow = (i: number, patch: Partial<SeoPage>) => {
    setPageRows((rs) => rs.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  };

  const savePage = async (row: SeoPage) => {
    const payload = {
      path: row.path,
      title: row.title?.trim() || null,
      description: row.description?.trim() || null,
      og_image_url: row.og_image_url?.trim() || null,
      keywords: row.keywords?.trim() || null,
      noindex: !!row.noindex,
      canonical_override: row.canonical_override?.trim() || null,
    };
    const { error } = await supabase.from("seo_pages" as never).upsert(payload as never, { onConflict: "path" });
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(`Saved ${row.path}`);
    qc.invalidateQueries({ queryKey: ["seo_pages"] });
  };

  const deletePage = async (path: string) => {
    const { error } = await supabase.from("seo_pages" as never).delete().eq("path", path);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(`Removed override for ${path}`);
    qc.invalidateQueries({ queryKey: ["seo_pages"] });
  };

  const addPage = async () => {
    const p = newPath.trim();
    if (!p.startsWith("/")) {
      toast.error("Path must start with /");
      return;
    }
    if (pageRows.some((r) => r.path === p)) {
      toast.error("Override already exists");
      return;
    }
    const { error } = await supabase
      .from("seo_pages" as never)
      .insert({ path: p } as never);
    if (error) {
      toast.error(error.message);
      return;
    }
    setNewPath("");
    qc.invalidateQueries({ queryKey: ["seo_pages"] });
  };

  return (
    <AdminShell
      title="SEO"
      description="Site-wide SEO defaults and per-page overrides. Changes load with the initial HTML on the next publish."
      maxWidth="6xl"
    >
      <Alert className="mb-6">
        <AlertTitle>How SEO is served</AlertTitle>
        <AlertDescription>
          Per-route titles, descriptions, canonicals, OG tags, and JSON-LD render on every page via React Helmet (great for Google).
          Site-wide defaults — homepage title/description, OG image, Organization &amp; WebSite schema — are also baked into{" "}
          <code className="text-xs">index.html</code> at build time so social-preview crawlers (LinkedIn, Slack, Facebook) see them in the initial payload.
          Save changes here, then publish to ship.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="global" className="space-y-6">
        <TabsList>
          <TabsTrigger value="global">Site defaults</TabsTrigger>
          <TabsTrigger value="pages">Per-page overrides</TabsTrigger>
        </TabsList>

        <TabsContent value="global">
          <Card className="max-w-3xl">
            <CardHeader>
              <CardTitle>Site-wide SEO</CardTitle>
              <CardDescription>
                These render on every page and form the initial HTML payload. Keep descriptions 50–160 characters.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {globalFields.map((f) => (
                <div key={f.key}>
                  <Label htmlFor={f.key}>{f.label}</Label>
                  {f.type === "textarea" ? (
                    <Textarea
                      id={f.key}
                      placeholder={f.placeholder}
                      value={global[f.key] ?? ""}
                      onChange={(e) => setGlobal((s) => ({ ...s, [f.key]: e.target.value }))}
                      className="mt-1.5"
                      rows={3}
                      maxLength={300}
                    />
                  ) : (
                    <Input
                      id={f.key}
                      type={f.type}
                      placeholder={f.placeholder}
                      value={global[f.key] ?? ""}
                      onChange={(e) => setGlobal((s) => ({ ...s, [f.key]: e.target.value }))}
                      className="mt-1.5"
                    />
                  )}
                </div>
              ))}
              <Button onClick={saveGlobal} disabled={savingGlobal} className="w-full mt-2">
                {savingGlobal ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save site defaults"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pages">
          <Card>
            <CardHeader>
              <CardTitle>Per-page overrides</CardTitle>
              <CardDescription>
                Override title, description, OG image, or noindex for any route. Empty fields fall back to the site defaults.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <select
                  className="flex-1 h-10 rounded-md border border-input bg-background px-3 text-sm"
                  value={newPath}
                  onChange={(e) => setNewPath(e.target.value)}
                >
                  <option value="">Pick a route…</option>
                  {KNOWN_ROUTES.filter((r) => !pageRows.some((p) => p.path === r)).map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
                <Button onClick={addPage} disabled={!newPath}>
                  <Plus className="h-4 w-4 mr-1" /> Add override
                </Button>
              </div>

              {pageRows.length === 0 ? (
                <p className="text-sm text-muted-foreground py-6 text-center">
                  No per-page overrides yet. All routes use the site defaults above.
                </p>
              ) : (
                <div className="space-y-4">
                  {pageRows.map((row, i) => (
                    <Card key={row.path} className="bg-muted/30">
                      <CardContent className="pt-6 space-y-3">
                        <div className="flex items-center justify-between">
                          <a
                            href={row.path}
                            target="_blank"
                            rel="noreferrer"
                            className="font-mono text-sm font-semibold inline-flex items-center gap-1 hover:underline"
                          >
                            {row.path} <ExternalLink className="h-3 w-3" />
                          </a>
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label={`Remove override for ${row.path}`}
                            onClick={() => deletePage(row.path)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                        <div>
                          <Label htmlFor={`title-${i}`}>Title</Label>
                          <Input
                            id={`title-${i}`}
                            value={row.title ?? ""}
                            placeholder="Leave blank for default"
                            onChange={(e) => updateRow(i, { title: e.target.value })}
                            className="mt-1.5"
                            maxLength={120}
                          />
                        </div>
                        <div>
                          <Label htmlFor={`desc-${i}`}>Description</Label>
                          <Textarea
                            id={`desc-${i}`}
                            value={row.description ?? ""}
                            placeholder="50–160 characters"
                            onChange={(e) => updateRow(i, { description: e.target.value })}
                            className="mt-1.5"
                            rows={2}
                            maxLength={300}
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <Label htmlFor={`og-${i}`}>OG image URL</Label>
                            <Input
                              id={`og-${i}`}
                              type="url"
                              value={row.og_image_url ?? ""}
                              placeholder="Absolute URL"
                              onChange={(e) => updateRow(i, { og_image_url: e.target.value })}
                              className="mt-1.5"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`kw-${i}`}>Keywords</Label>
                            <Input
                              id={`kw-${i}`}
                              value={row.keywords ?? ""}
                              placeholder="comma, separated, optional"
                              onChange={(e) => updateRow(i, { keywords: e.target.value })}
                              className="mt-1.5"
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor={`canon-${i}`}>Canonical override</Label>
                          <Input
                            id={`canon-${i}`}
                            type="url"
                            value={row.canonical_override ?? ""}
                            placeholder="Leave blank to self-reference"
                            onChange={(e) => updateRow(i, { canonical_override: e.target.value })}
                            className="mt-1.5"
                          />
                        </div>
                        <div className="flex items-center justify-between pt-2">
                          <div className="flex items-center gap-2">
                            <Switch
                              id={`noindex-${i}`}
                              checked={!!row.noindex}
                              onCheckedChange={(v) => updateRow(i, { noindex: v })}
                            />
                            <Label htmlFor={`noindex-${i}`} className="font-normal">
                              Hide from search engines (noindex)
                            </Label>
                          </div>
                          <Button onClick={() => savePage(row)}>Save</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AdminShell>
  );
};

export default SeoAdmin;
