import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Bell, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { isPushSupported, subscribeToPush, unsubscribeFromPush } from "@/lib/push";

type Prefs = {
  email_marketing: boolean;
  email_product: boolean;
  email_security: boolean;
  sms_enabled: boolean;
  push_enabled: boolean;
  in_app_enabled: boolean;
};

const DEFAULTS: Prefs = {
  email_marketing: true,
  email_product: true,
  email_security: true,
  sms_enabled: false,
  push_enabled: true,
  in_app_enabled: true,
};

const rows: { key: keyof Prefs; label: string; desc: string; locked?: boolean }[] = [
  { key: "email_security", label: "Security emails", desc: "Sign-in alerts, password changes — always on.", locked: true },
  { key: "email_product", label: "Product emails", desc: "Important updates about features you use." },
  { key: "email_marketing", label: "Marketing emails", desc: "Tips, news, and occasional offers." },
  { key: "in_app_enabled", label: "In-app notifications", desc: "Toasts and the notification bell." },
  { key: "push_enabled", label: "Push notifications", desc: "Browser push (where supported)." },
  { key: "sms_enabled", label: "SMS notifications", desc: "Texts for critical events. Standard rates apply." },
];

export const NotificationsTab = () => {
  const { user } = useAuth();
  const [prefs, setPrefs] = useState<Prefs>(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [pushBusy, setPushBusy] = useState(false);
  const [pushSubbed, setPushSubbed] = useState(false);
  const pushSupported = typeof window !== "undefined" && isPushSupported();

  useEffect(() => {
    if (!pushSupported) return;
    navigator.serviceWorker
      .getRegistration()
      .then((reg) => reg?.pushManager.getSubscription())
      .then((sub) => setPushSubbed(!!sub))
      .catch(() => {});
  }, [pushSupported]);

  const enablePush = async () => {
    if (!user) return;
    setPushBusy(true);
    try {
      await subscribeToPush(user.id);
      setPushSubbed(true);
      toast.success("Browser notifications enabled");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to enable push");
    } finally {
      setPushBusy(false);
    }
  };

  const disablePush = async () => {
    setPushBusy(true);
    try {
      await unsubscribeFromPush();
      setPushSubbed(false);
      toast.success("Browser notifications disabled");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to disable push");
    } finally {
      setPushBusy(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    supabase
      .from("notification_preferences")
      .select("email_marketing,email_product,email_security,sms_enabled,push_enabled,in_app_enabled")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) setPrefs(data as Prefs);
        setLoading(false);
      });
  }, [user]);

  const update = async (key: keyof Prefs, value: boolean) => {
    if (!user) return;
    setSaving(key);
    const next = { ...prefs, [key]: value };
    setPrefs(next);
    const { error } = await supabase
      .from("notification_preferences")
      .upsert({ user_id: user.id, ...next }, { onConflict: "user_id" });
    setSaving(null);
    if (error) {
      toast.error(error.message);
      setPrefs(prefs);
      return;
    }
    toast.success("Preferences saved");
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-12 grid place-items-center">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Choose what we contact you about.</CardDescription>
        </CardHeader>
        <CardContent className="divide-y divide-border">
          {rows.map((r) => (
            <div key={r.key} className="flex items-start justify-between gap-4 py-4 first:pt-0 last:pb-0">
              <div className="flex-1 min-w-0">
                <Label htmlFor={r.key} className="text-sm font-medium">{r.label}</Label>
                <p className="text-sm text-muted-foreground mt-0.5">{r.desc}</p>
              </div>
              <Switch
                id={r.key}
                checked={!!prefs[r.key]}
                disabled={r.locked || saving === r.key}
                onCheckedChange={(v) => !r.locked && update(r.key, v)}
                aria-label={r.label}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {prefs.push_enabled && pushSupported && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-4 w-4" /> Browser notifications
            </CardTitle>
            <CardDescription>
              {pushSubbed
                ? "This browser is subscribed to push notifications."
                : "Allow this browser to receive push notifications even when the tab is closed."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {pushSubbed ? (
              <Button variant="outline" onClick={disablePush} disabled={pushBusy}>
                {pushBusy && <Loader2 className="h-4 w-4 animate-spin" />}
                Disable on this browser
              </Button>
            ) : (
              <Button onClick={enablePush} disabled={pushBusy}>
                {pushBusy && <Loader2 className="h-4 w-4 animate-spin" />}
                Enable on this browser
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Public newsletter</CardTitle>
          <CardDescription>
            The marketing newsletter is a separate, double opt-in list. Unsubscribe any time — no account required.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild variant="outline">
            <Link to={`/unsubscribe${user?.email ? `?email=${encodeURIComponent(user.email)}` : ""}`}>
              Manage newsletter subscription
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
