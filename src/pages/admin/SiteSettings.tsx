import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { useUserRoles } from "@/hooks/useUserRole";
import { supabase } from "@/integrations/supabase/client";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const fields = [
  { key: "contact_email", label: "Public contact email", placeholder: "hello@yourdomain.com", type: "email" },
  { key: "social_twitter", label: "Twitter / X URL", placeholder: "https://twitter.com/...", type: "url" },
  { key: "social_github", label: "GitHub URL", placeholder: "https://github.com/...", type: "url" },
  { key: "social_linkedin", label: "LinkedIn URL", placeholder: "https://linkedin.com/company/...", type: "url" },
  { key: "social_instagram", label: "Instagram URL", placeholder: "https://instagram.com/...", type: "url" },
  { key: "social_youtube", label: "YouTube URL", placeholder: "https://youtube.com/@...", type: "url" },
  { key: "social_facebook", label: "Facebook URL", placeholder: "https://facebook.com/...", type: "url" },
  { key: "social_tiktok", label: "TikTok URL", placeholder: "https://tiktok.com/@...", type: "url" },
] as const;

const SiteSettingsPage = () => {
  const { isAdmin, loading } = useUserRoles();
  const { signOut } = useAuth();
  const { data: settings } = useSiteSettings();
  const qc = useQueryClient();
  const [form, setForm] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (settings) {
      const next: Record<string, string> = {};
      const s = settings as unknown as Record<string, string | null>;
      for (const f of fields) next[f.key] = s[f.key] ?? "";
      setForm(next);
    }
  }, [settings]);

  const save = async () => {
    setSaving(true);
    const payload: Record<string, string | number | null> = { id: 1 };
    for (const f of fields) payload[f.key] = form[f.key]?.trim() || null;
    const { error } = await supabase.from("site_settings").upsert(payload as never, { onConflict: "id" });
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Site settings saved");
    qc.invalidateQueries({ queryKey: ["site_settings"] });
  };

  if (loading) return <div className="min-h-screen grid place-items-center"><Loader2 className="h-6 w-6 animate-spin" /></div>;

  if (!isAdmin) {
    return (
      <div className="min-h-screen grid place-items-center p-6">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Admins only</CardTitle>
            <CardDescription>You don't have permission to view this page.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link to="/dashboard"><ArrowLeft className="h-4 w-4" />Back to dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container flex items-center justify-between py-4">
          <Logo />
          <Button variant="outline" size="sm" onClick={signOut}>Sign out</Button>
        </div>
      </header>
      <main className="container py-12 max-w-2xl">
        <Button asChild variant="ghost" size="sm" className="mb-4">
          <Link to="/admin"><ArrowLeft className="h-4 w-4" />Back to admin</Link>
        </Button>
        <h1 className="text-3xl font-bold mb-2">Site settings</h1>
        <p className="text-muted-foreground mb-8">
          Public contact email and social media links. Empty fields are hidden from the footer.
        </p>

        <Card>
          <CardContent className="pt-6 space-y-4">
            {fields.map((f) => (
              <div key={f.key}>
                <Label htmlFor={f.key}>{f.label}</Label>
                <Input
                  id={f.key}
                  type={f.type}
                  placeholder={f.placeholder}
                  value={form[f.key] ?? ""}
                  onChange={(e) => setForm((s) => ({ ...s, [f.key]: e.target.value }))}
                  className="mt-1.5"
                />
              </div>
            ))}
            <Button onClick={save} disabled={saving} className="w-full mt-2">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default SiteSettingsPage;
