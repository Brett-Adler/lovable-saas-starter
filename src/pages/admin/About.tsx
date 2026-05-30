import { useEffect, useMemo, useState } from "react";
import { Loader2, Plus, Trash2, ArrowUp, ArrowDown, Upload } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { AdminShell } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import {
  ABOUT_GROUPS,
  useAboutPage,
  useAboutPeople,
  useAboutSections,
  type AboutPage,
  type AboutPerson,
  type AboutSection,
  type AboutSectionKind,
} from "@/hooks/useAboutContent";

const PAGE_FIELDS: { key: keyof AboutPage; label: string; type?: "text" | "textarea" }[] = [
  { key: "eyebrow", label: "Eyebrow" },
  { key: "headline", label: "Headline" },
  { key: "subhead", label: "Subhead", type: "textarea" },
  { key: "primary_cta_label", label: "Primary CTA label" },
  { key: "primary_cta_href", label: "Primary CTA href" },
  { key: "secondary_cta_label", label: "Secondary CTA label" },
  { key: "secondary_cta_href", label: "Secondary CTA href" },
  { key: "mission_title", label: "Mission heading" },
  { key: "mission_body", label: "Mission body", type: "textarea" },
  { key: "vision_title", label: "Vision heading" },
  { key: "vision_body", label: "Vision body", type: "textarea" },
  { key: "story_title", label: "Story title" },
  { key: "story_body", label: "Story body", type: "textarea" },
  { key: "story_image_url", label: "Story image URL" },
  { key: "values_title", label: "Values section title" },
  { key: "stats_title", label: "Stats section title" },
  { key: "milestones_title", label: "Milestones section title" },
  { key: "team_title", label: "Team section title" },
  { key: "team_subtitle", label: "Team subtitle" },
  { key: "press_title", label: "Press section title" },
  { key: "cta_title", label: "Closing CTA title" },
  { key: "cta_body", label: "Closing CTA body", type: "textarea" },
  { key: "cta_primary_label", label: "Closing CTA primary label" },
  { key: "cta_primary_href", label: "Closing CTA primary href" },
  { key: "cta_secondary_label", label: "Closing CTA secondary label" },
  { key: "cta_secondary_href", label: "Closing CTA secondary href" },
];

const VISIBILITY_FIELDS: { key: keyof AboutPage; label: string }[] = [
  { key: "show_mission", label: "Mission & vision" },
  { key: "show_story", label: "Founding story" },
  { key: "show_values", label: "Values" },
  { key: "show_stats", label: "Stats" },
  { key: "show_milestones", label: "Milestones" },
  { key: "show_team", label: "Team" },
  { key: "show_press", label: "Press" },
  { key: "show_cta", label: "Closing CTA" },
];

function PageEditor() {
  const { data: page } = useAboutPage();
  const qc = useQueryClient();
  const [form, setForm] = useState<Partial<AboutPage>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (page) setForm(page);
  }, [page]);

  const update = <K extends keyof AboutPage>(key: K, value: AboutPage[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const save = async () => {
    setSaving(true);
    const payload: Record<string, unknown> = { id: 1 };
    for (const f of PAGE_FIELDS) payload[f.key as string] = (form[f.key] as string) ?? null;
    for (const f of VISIBILITY_FIELDS) payload[f.key as string] = form[f.key] ?? true;
    const { error } = await supabase
      .from("about_page" as never)
      .upsert(payload as never, { onConflict: "id" });
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("About page saved");
    qc.invalidateQueries({ queryKey: ["about_page"] });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Page copy</CardTitle>
        <CardDescription>Hero, mission, vision, story, section titles, and closing CTA.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {PAGE_FIELDS.map((f) => (
          <div key={f.key as string}>
            <Label htmlFor={f.key as string}>{f.label}</Label>
            {f.type === "textarea" ? (
              <Textarea
                id={f.key as string}
                value={(form[f.key] as string) ?? ""}
                onChange={(e) => update(f.key, e.target.value as never)}
                rows={4}
                className="mt-1.5"
              />
            ) : (
              <Input
                id={f.key as string}
                value={(form[f.key] as string) ?? ""}
                onChange={(e) => update(f.key, e.target.value as never)}
                className="mt-1.5"
              />
            )}
          </div>
        ))}
        <div className="pt-4 border-t border-border">
          <Label className="mb-3 block">Section visibility</Label>
          <div className="grid sm:grid-cols-2 gap-3">
            {VISIBILITY_FIELDS.map((f) => (
              <label key={f.key as string} className="flex items-center justify-between gap-3 rounded-md border border-border px-3 py-2">
                <span className="text-sm">{f.label}</span>
                <Switch
                  checked={(form[f.key] as boolean) ?? true}
                  onCheckedChange={(v) => update(f.key, v as never)}
                />
              </label>
            ))}
          </div>
        </div>
        <div className="pt-4">
          <Button onClick={save} disabled={saving}>
            {saving && <Loader2 className="h-4 w-4 animate-spin" />} Save page
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

interface SectionFieldSpec {
  key: keyof AboutSection;
  label: string;
  placeholder?: string;
  type?: "text" | "textarea";
}

const KIND_FIELDS: Record<AboutSectionKind, { title: string; fields: SectionFieldSpec[] }> = {
  value: {
    title: "Values",
    fields: [
      { key: "title", label: "Title" },
      { key: "body", label: "Description", type: "textarea" },
      { key: "icon", label: "Lucide icon name", placeholder: "Sparkles, Settings, ShieldCheck, Heart, Rocket, Users, Globe, Zap, Star" },
    ],
  },
  stat: {
    title: "Stats",
    fields: [
      { key: "title", label: "Value", placeholder: "12k+" },
      { key: "subtitle", label: "Label", placeholder: "Builders shipped" },
    ],
  },
  milestone: {
    title: "Milestones",
    fields: [
      { key: "subtitle", label: "Date / year", placeholder: "2024" },
      { key: "title", label: "Title" },
      { key: "body", label: "Description", type: "textarea" },
    ],
  },
  press: {
    title: "Press logos",
    fields: [
      { key: "title", label: "Name (used as alt + fallback text)" },
      { key: "image_url", label: "Logo image URL (optional)" },
      { key: "link_url", label: "Link URL" },
    ],
  },
};

function SectionList({ kind }: { kind: AboutSectionKind }) {
  const { data: sections = [], isLoading } = useAboutSections(kind, true);
  const qc = useQueryClient();
  const [items, setItems] = useState<AboutSection[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => setItems(sections), [sections]);

  const update = (id: string, patch: Partial<AboutSection>) =>
    setItems((arr) => arr.map((s) => (s.id === id ? { ...s, ...patch } : s)));

  const addNew = async () => {
    const { data, error } = await supabase
      .from("about_sections" as never)
      .insert({ kind, position: items.length, published: true } as never)
      .select()
      .single();
    if (error) {
      toast.error(error.message);
      return;
    }
    qc.invalidateQueries({ queryKey: ["about_sections"] });
    setItems((arr) => [...arr, data as AboutSection]);
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this item?")) return;
    const { error } = await supabase.from("about_sections" as never).delete().eq("id", id);
    if (error) {
      toast.error(error.message);
      return;
    }
    setItems((arr) => arr.filter((s) => s.id !== id));
    qc.invalidateQueries({ queryKey: ["about_sections"] });
  };

  const move = (id: string, dir: -1 | 1) => {
    setItems((arr) => {
      const idx = arr.findIndex((s) => s.id === id);
      const target = idx + dir;
      if (idx < 0 || target < 0 || target >= arr.length) return arr;
      const next = [...arr];
      [next[idx], next[target]] = [next[target], next[idx]];
      return next.map((s, i) => ({ ...s, position: i }));
    });
  };

  const saveAll = async () => {
    setSaving(true);
    for (const s of items) {
      const { error } = await supabase
        .from("about_sections" as never)
        .update({
          title: s.title,
          subtitle: s.subtitle,
          body: s.body,
          icon: s.icon,
          image_url: s.image_url,
          link_url: s.link_url,
          position: s.position,
          published: s.published,
        } as never)
        .eq("id", s.id);
      if (error) {
        toast.error(error.message);
        setSaving(false);
        return;
      }
    }
    setSaving(false);
    toast.success("Saved");
    qc.invalidateQueries({ queryKey: ["about_sections"] });
  };

  const spec = KIND_FIELDS[kind];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>{spec.title}</CardTitle>
          <CardDescription>Reorder, edit, or remove. Toggle off to hide an item.</CardDescription>
        </div>
        <Button size="sm" onClick={addNew}>
          <Plus className="h-4 w-4" /> Add
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : items.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nothing yet — click Add.</p>
        ) : (
          items.map((s, i) => (
            <div key={s.id} className="rounded-lg border border-border p-4 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="text-xs text-muted-foreground">#{i + 1}</div>
                <div className="flex items-center gap-1">
                  <Button size="icon" variant="ghost" onClick={() => move(s.id, -1)}>
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => move(s.id, 1)}>
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                  <label className="flex items-center gap-2 text-xs px-2">
                    <Switch
                      checked={s.published}
                      onCheckedChange={(v) => update(s.id, { published: v })}
                    />
                    Published
                  </label>
                  <Button size="icon" variant="ghost" onClick={() => remove(s.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              {spec.fields.map((f) => (
                <div key={f.key as string}>
                  <Label>{f.label}</Label>
                  {f.type === "textarea" ? (
                    <Textarea
                      value={(s[f.key] as string) ?? ""}
                      onChange={(e) => update(s.id, { [f.key]: e.target.value } as Partial<AboutSection>)}
                      placeholder={f.placeholder}
                      rows={3}
                      className="mt-1.5"
                    />
                  ) : (
                    <Input
                      value={(s[f.key] as string) ?? ""}
                      onChange={(e) => update(s.id, { [f.key]: e.target.value } as Partial<AboutSection>)}
                      placeholder={f.placeholder}
                      className="mt-1.5"
                    />
                  )}
                </div>
              ))}
            </div>
          ))
        )}
        {items.length > 0 && (
          <div className="pt-2">
            <Button onClick={saveAll} disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 animate-spin" />} Save all
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

const SOCIAL_KEYS = ["linkedin", "x", "github", "website"] as const;

function PeopleEditor() {
  const { data: people = [], isLoading } = useAboutPeople(true);
  const qc = useQueryClient();
  const [items, setItems] = useState<AboutPerson[]>([]);
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => setItems(people), [people]);

  const update = (id: string, patch: Partial<AboutPerson>) =>
    setItems((arr) => arr.map((p) => (p.id === id ? { ...p, ...patch } : p)));

  const updateLink = (id: string, key: string, value: string) =>
    setItems((arr) =>
      arr.map((p) => {
        if (p.id !== id) return p;
        const links = { ...(p.links ?? {}) };
        if (value) links[key] = value;
        else delete links[key];
        return { ...p, links };
      }),
    );

  const addNew = async () => {
    const { data, error } = await supabase
      .from("about_people" as never)
      .insert({
        name: "New person",
        group_key: filter !== "all" ? filter : "team",
        position: items.length,
        published: true,
      } as never)
      .select()
      .single();
    if (error) {
      toast.error(error.message);
      return;
    }
    qc.invalidateQueries({ queryKey: ["about_people"] });
    setItems((arr) => [...arr, data as AboutPerson]);
  };

  const remove = async (id: string) => {
    if (!confirm("Remove this person?")) return;
    const { error } = await supabase.from("about_people" as never).delete().eq("id", id);
    if (error) {
      toast.error(error.message);
      return;
    }
    setItems((arr) => arr.filter((p) => p.id !== id));
    qc.invalidateQueries({ queryKey: ["about_people"] });
  };

  const uploadPhoto = async (id: string, file: File) => {
    const ext = file.name.split(".").pop() ?? "jpg";
    const path = `about/people/${id}-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("brand-assets").upload(path, file, {
      upsert: true,
      contentType: file.type,
      cacheControl: "31536000",
    });
    if (error) {
      toast.error(error.message);
      return;
    }
    const { data } = supabase.storage.from("brand-assets").getPublicUrl(path);
    update(id, { photo_url: data.publicUrl });
    toast.success("Photo uploaded — remember to save");
  };

  const saveAll = async () => {
    setSaving(true);
    for (const p of items) {
      const { error } = await supabase
        .from("about_people" as never)
        .update({
          name: p.name,
          role: p.role,
          group_key: p.group_key,
          bio: p.bio,
          photo_url: p.photo_url,
          links: p.links ?? {},
          position: p.position,
          published: p.published,
        } as never)
        .eq("id", p.id);
      if (error) {
        toast.error(error.message);
        setSaving(false);
        return;
      }
    }
    setSaving(false);
    toast.success("Saved");
    qc.invalidateQueries({ queryKey: ["about_people"] });
  };

  const customGroups = useMemo(() => {
    const known = new Set(ABOUT_GROUPS.map((g) => g.key));
    return Array.from(new Set(items.map((p) => p.group_key))).filter((k) => !known.has(k));
  }, [items]);

  const visible = filter === "all" ? items : items.filter((p) => p.group_key === filter);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-3">
        <div>
          <CardTitle>People</CardTitle>
          <CardDescription>
            Leadership, team, board, investors, advisors, pets — anyone you want to feature.
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All groups</SelectItem>
              {ABOUT_GROUPS.map((g) => (
                <SelectItem key={g.key} value={g.key}>
                  {g.label}
                </SelectItem>
              ))}
              {customGroups.map((k) => (
                <SelectItem key={k} value={k}>
                  {k}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button size="sm" onClick={addNew}>
            <Plus className="h-4 w-4" /> Add person
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : visible.length === 0 ? (
          <p className="text-sm text-muted-foreground">No one in this group yet.</p>
        ) : (
          visible.map((p) => (
            <div key={p.id} className="rounded-lg border border-border p-4 space-y-3">
              <div className="flex items-start gap-4">
                <div className="shrink-0">
                  {p.photo_url ? (
                    <img
                      src={p.photo_url}
                      alt={p.name}
                      className="h-16 w-16 rounded-full object-cover border border-border"
                    />
                  ) : (
                    <div className="h-16 w-16 rounded-full bg-muted border border-border flex items-center justify-center text-xs text-muted-foreground">
                      No photo
                    </div>
                  )}
                  <label className="mt-2 inline-flex items-center gap-1 text-xs cursor-pointer text-muted-foreground hover:text-foreground">
                    <Upload className="h-3 w-3" /> Upload
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) void uploadPhoto(p.id, f);
                      }}
                    />
                  </label>
                </div>
                <div className="flex-1 grid sm:grid-cols-2 gap-3">
                  <div>
                    <Label>Name</Label>
                    <Input
                      value={p.name}
                      onChange={(e) => update(p.id, { name: e.target.value })}
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label>Role</Label>
                    <Input
                      value={p.role ?? ""}
                      onChange={(e) => update(p.id, { role: e.target.value })}
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label>Group</Label>
                    <Select
                      value={p.group_key}
                      onValueChange={(v) => update(p.id, { group_key: v })}
                    >
                      <SelectTrigger className="mt-1.5">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ABOUT_GROUPS.map((g) => (
                          <SelectItem key={g.key} value={g.key}>
                            {g.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Custom group (overrides)</Label>
                    <Input
                      value={p.group_key}
                      onChange={(e) => update(p.id, { group_key: e.target.value })}
                      className="mt-1.5"
                      placeholder="e.g. operations"
                    />
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <label className="flex items-center gap-2 text-xs">
                    <Switch
                      checked={p.published}
                      onCheckedChange={(v) => update(p.id, { published: v })}
                    />
                    Published
                  </label>
                  <Button size="icon" variant="ghost" onClick={() => remove(p.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div>
                <Label>Bio</Label>
                <Textarea
                  value={p.bio ?? ""}
                  onChange={(e) => update(p.id, { bio: e.target.value })}
                  rows={3}
                  className="mt-1.5"
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {SOCIAL_KEYS.map((k) => (
                  <div key={k}>
                    <Label className="capitalize">{k}</Label>
                    <Input
                      value={p.links?.[k] ?? ""}
                      onChange={(e) => updateLink(p.id, k, e.target.value)}
                      placeholder={`https://…`}
                      className="mt-1.5"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
        {items.length > 0 && (
          <div className="pt-2">
            <Button onClick={saveAll} disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 animate-spin" />} Save all
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

const AdminAboutPage = () => (
  <AdminShell
    title="About page"
    description="Edit every section of the public /about page."
    maxWidth="6xl"
  >
    <Tabs defaultValue="page">
      <TabsList>
        <TabsTrigger value="page">Page</TabsTrigger>
        <TabsTrigger value="values">Values</TabsTrigger>
        <TabsTrigger value="stats">Stats</TabsTrigger>
        <TabsTrigger value="milestones">Milestones</TabsTrigger>
        <TabsTrigger value="press">Press</TabsTrigger>
        <TabsTrigger value="people">People</TabsTrigger>
      </TabsList>
      <TabsContent value="page" className="mt-6">
        <PageEditor />
      </TabsContent>
      <TabsContent value="values" className="mt-6">
        <SectionList kind="value" />
      </TabsContent>
      <TabsContent value="stats" className="mt-6">
        <SectionList kind="stat" />
      </TabsContent>
      <TabsContent value="milestones" className="mt-6">
        <SectionList kind="milestone" />
      </TabsContent>
      <TabsContent value="press" className="mt-6">
        <SectionList kind="press" />
      </TabsContent>
      <TabsContent value="people" className="mt-6">
        <PeopleEditor />
      </TabsContent>
    </Tabs>
  </AdminShell>
);

export default AdminAboutPage;
