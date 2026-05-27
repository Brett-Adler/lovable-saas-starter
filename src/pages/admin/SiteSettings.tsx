import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUserRoles } from "@/hooks/useUserRole";
import { supabase } from "@/integrations/supabase/client";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AdminShell } from "@/components/admin/AdminShell";

const fields = [
  { key: "contact_email", label: "Public contact email", placeholder: "hello@yourdomain.com", type: "email" },
  { key: "company_legal_name", label: "Company legal name (CAN-SPAM footer)", placeholder: "Blues Brothers Holdings, LLC", type: "text" },
  { key: "mailing_address", label: "Mailing address (CAN-SPAM footer)", placeholder: "1060 W Addison St, Chicago, IL 60613, USA", type: "text" },
  { key: "from_name", label: "Default newsletter From name", placeholder: "Jake & Elwood", type: "text" },
  { key: "from_email", label: "Default newsletter From email", placeholder: "newsletter@notify.yourdomain.com", type: "email" },
  { key: "reply_to", label: "Default newsletter Reply-to", placeholder: "hello@yourdomain.com", type: "email" },
  { key: "social_twitter", label: "Twitter / X URL", placeholder: "https://twitter.com/...", type: "url" },
  { key: "social_github", label: "GitHub URL", placeholder: "https://github.com/...", type: "url" },
  { key: "social_linkedin", label: "LinkedIn URL", placeholder: "https://linkedin.com/company/...", type: "url" },
  { key: "social_instagram", label: "Instagram URL", placeholder: "https://instagram.com/...", type: "url" },
  { key: "social_youtube", label: "YouTube URL", placeholder: "https://youtube.com/@...", type: "url" },
  { key: "social_facebook", label: "Facebook URL", placeholder: "https://facebook.com/...", type: "url" },
  { key: "social_tiktok", label: "TikTok URL", placeholder: "https://tiktok.com/@...", type: "url" },
] as const;

const SiteSettingsPage = () => {
  const { isAdmin } = useUserRoles();
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

  return (
    <AdminShell
      title="Site settings"
      description="Public contact email and social media links. Empty fields are hidden from the footer."
      maxWidth="5xl"
    >
      <Card className="max-w-2xl">
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
