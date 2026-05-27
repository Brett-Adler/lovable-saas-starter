import { useEffect, useMemo, useState } from "react";
import { Loader2, Plus, Send, FlaskConical, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useUserRoles } from "@/hooks/useUserRole";
import { supabase } from "@/integrations/supabase/client";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { toast } from "sonner";
import { AdminShell } from "@/components/admin/AdminShell";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type Campaign = {
  id: string;
  name: string;
  subject: string;
  preheader: string | null;
  body_text: string | null;
  body_html: string | null;
  from_name: string | null;
  from_email: string | null;
  reply_to: string | null;
  status: string;
  sent_at: string | null;
  stats: Record<string, number>;
  created_at: string;
};

const empty: Partial<Campaign> = {
  name: "",
  subject: "",
  preheader: "",
  body_text: "",
};

export default function AdminBroadcasts() {
  const { isAdmin } = useUserRoles();
  const { data: settings } = useSiteSettings();
  const [list, setList] = useState<Campaign[]>([]);
  const [fetching, setFetching] = useState(true);
  const [editing, setEditing] = useState<Partial<Campaign>>(empty);
  const [saving, setSaving] = useState(false);
  const [sending, setSending] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [testEmail, setTestEmail] = useState("");

  const load = async () => {
    setFetching(true);
    const { data, error } = await supabase
      .from("marketing_campaigns")
      .select("id,name,subject,preheader,body_text,body_html,from_name,from_email,reply_to,status,sent_at,stats,created_at")
      .order("created_at", { ascending: false })
      .limit(100);
    if (error) toast.error(error.message);
    else setList((data as Campaign[]) ?? []);
    setFetching(false);
  };

  useEffect(() => { if (isAdmin) load(); }, [isAdmin]);

  const save = async () => {
    if (!editing.subject?.trim() || !editing.name?.trim()) {
      toast.error("Name and subject are required");
      return;
    }
    setSaving(true);
    const payload = {
      name: editing.name,
      subject: editing.subject,
      preheader: editing.preheader || null,
      body_text: editing.body_text || null,
      from_name: editing.from_name || null,
      from_email: editing.from_email || null,
      reply_to: editing.reply_to || null,
      status: "draft" as const,
    };
    let res;
    if (editing.id) {
      res = await supabase.from("marketing_campaigns").update(payload as never).eq("id", editing.id).select().maybeSingle();
    } else {
      res = await supabase.from("marketing_campaigns").insert(payload as never).select().maybeSingle();
    }
    setSaving(false);
    if (res.error) { toast.error(res.error.message); return; }
    toast.success("Draft saved");
    setEditing(res.data as Campaign);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this campaign? This cannot be undone.")) return;
    const { error } = await supabase.from("marketing_campaigns").delete().eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Deleted"); if (editing.id === id) setEditing(empty); load(); }
  };

  const sendTest = async () => {
    if (!editing.id) { toast.error("Save the draft first"); return; }
    if (!testEmail.trim()) { toast.error("Enter a test email"); return; }
    setSending(true);
    const { data, error } = await supabase.functions.invoke("send-marketing-broadcast", {
      body: { campaign_id: editing.id, test_email: testEmail.trim() },
    });
    setSending(false);
    if (error) { toast.error(error.message); return; }
    if (data?.sent) toast.success(`Test sent to ${testEmail}`);
    else toast.error(data?.error ?? "Test failed");
  };

  const sendAll = async () => {
    if (!editing.id) return;
    if (confirmText !== "SEND") { toast.error("Type SEND to confirm"); return; }
    setSending(true);
    setConfirmOpen(false);
    const { data, error } = await supabase.functions.invoke("send-marketing-broadcast", {
      body: { campaign_id: editing.id },
    });
    setSending(false);
    setConfirmText("");
    if (error) { toast.error(error.message); return; }
    if (data?.success) {
      toast.success(`Sent ${data.sent} · ${data.failed} failed · ${data.skipped} skipped`);
      load();
    } else {
      toast.error(data?.error ?? "Broadcast failed");
    }
  };

  const preview = useMemo(() => {
    const body = editing.body_text ?? "";
    return body
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/\n\n/g, "</p><p>")
      .replace(/\n/g, "<br>");
  }, [editing.body_text]);

  return (
    <AdminShell
      title="Broadcasts"
      description="Send the monthly newsletter via Resend. Mailing address and unsubscribe footer are appended automatically."
      actions={
        <Button onClick={() => setEditing(empty)} variant={!editing.id ? "default" : "outline"} size="sm">
          <Plus className="h-4 w-4" /> New campaign
        </Button>
      }
    >

        <div className="grid lg:grid-cols-[280px_1fr] gap-6">
          <Card className="self-start">
            <CardContent className="pt-6 space-y-2">
              <Button onClick={() => setEditing(empty)} variant={!editing.id ? "default" : "outline"} size="sm" className="w-full justify-start">
                <Plus className="h-4 w-4" /> New campaign
              </Button>
              {fetching ? (
                <Loader2 className="h-4 w-4 animate-spin mx-auto my-6" />
              ) : (
                list.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setEditing(c)}
                    className={`w-full text-left rounded-md px-3 py-2 text-sm hover:bg-muted ${editing.id === c.id ? "bg-muted" : ""}`}
                  >
                    <div className="font-medium truncate">{c.name}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">{c.status}</Badge>
                      <span className="text-xs text-muted-foreground">{new Date(c.created_at).toLocaleDateString()}</span>
                    </div>
                  </button>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="c-name">Internal name</Label>
                  <Input id="c-name" value={editing.name ?? ""} onChange={(e) => setEditing({ ...editing, name: e.target.value })} placeholder="December update" className="mt-1.5" />
                </div>
                <div>
                  <Label htmlFor="c-subject">Subject line</Label>
                  <Input id="c-subject" value={editing.subject ?? ""} onChange={(e) => setEditing({ ...editing, subject: e.target.value })} placeholder="We're on a mission" className="mt-1.5" />
                </div>
              </div>
              <div>
                <Label htmlFor="c-preheader">Preheader (preview text)</Label>
                <Input id="c-preheader" value={editing.preheader ?? ""} onChange={(e) => setEditing({ ...editing, preheader: e.target.value })} placeholder="What ships next, and what we learned" className="mt-1.5" />
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="c-from-name">From name</Label>
                  <Input id="c-from-name" value={editing.from_name ?? ""} onChange={(e) => setEditing({ ...editing, from_name: e.target.value })} placeholder={settings?.from_name ?? "Jake & Elwood"} className="mt-1.5" />
                </div>
                <div>
                  <Label htmlFor="c-from-email">From email</Label>
                  <Input id="c-from-email" type="email" value={editing.from_email ?? ""} onChange={(e) => setEditing({ ...editing, from_email: e.target.value })} placeholder={settings?.from_email ?? ""} className="mt-1.5" />
                </div>
                <div>
                  <Label htmlFor="c-reply">Reply-to</Label>
                  <Input id="c-reply" type="email" value={editing.reply_to ?? ""} onChange={(e) => setEditing({ ...editing, reply_to: e.target.value })} placeholder={settings?.reply_to ?? ""} className="mt-1.5" />
                </div>
              </div>
              <div>
                <Label htmlFor="c-body">Body (markdown supported: # ## **bold** *italic* [link](url) - lists)</Label>
                <Textarea
                  id="c-body"
                  value={editing.body_text ?? ""}
                  onChange={(e) => setEditing({ ...editing, body_text: e.target.value })}
                  rows={14}
                  placeholder={"# Big month, Elwood\n\nWe shipped three things and one of them actually worked.\n\n- New templates\n- Faster checkout\n- A bug Joliet Jake reported"}
                  className="mt-1.5 font-mono text-sm"
                />
              </div>

              <details className="rounded-md border border-border p-3">
                <summary className="cursor-pointer text-sm font-medium">Preview</summary>
                <div className="mt-3 rounded border border-border bg-card p-4 text-sm leading-relaxed">
                  <div className="text-xs text-muted-foreground mb-2">{editing.preheader}</div>
                  <div dangerouslySetInnerHTML={{ __html: `<p>${preview}</p>` }} />
                  <hr className="my-4 border-border" />
                  <p className="text-xs text-muted-foreground">
                    You're getting this because you confirmed your subscription to our newsletter.
                    <br />
                    {settings?.company_legal_name ?? "Company"} · {settings?.mailing_address ?? "Mailing address not set"}
                  </p>
                </div>
              </details>

              <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
                <Button onClick={save} disabled={saving}>
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save draft"}
                </Button>
                {editing.id && (
                  <>
                    <div className="flex items-center gap-2">
                      <Input
                        type="email"
                        placeholder="test@you.com"
                        value={testEmail}
                        onChange={(e) => setTestEmail(e.target.value)}
                        className="w-48"
                        aria-label="Test email address"
                      />
                      <Button variant="outline" onClick={sendTest} disabled={sending}>
                        <FlaskConical className="h-4 w-4" /> Send test
                      </Button>
                    </div>
                    <Button onClick={() => setConfirmOpen(true)} disabled={sending || editing.status === "sent"}>
                      <Send className="h-4 w-4" /> Send to all confirmed
                    </Button>
                    <Button variant="ghost" onClick={() => remove(editing.id!)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </>
                )}
              </div>
              {editing.id && editing.stats && Object.keys(editing.stats).length > 0 && (
                <p className="text-xs text-muted-foreground pt-2">
                  Last run: sent {editing.stats.sent ?? 0} · failed {editing.stats.failed ?? 0} · skipped {editing.stats.skipped ?? 0}
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Send to all confirmed subscribers?</AlertDialogTitle>
              <AlertDialogDescription>
                This will email every confirmed subscriber via Resend. Type <strong>SEND</strong>{" "}
                to confirm.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <Input value={confirmText} onChange={(e) => setConfirmText(e.target.value)} placeholder="SEND" aria-label="Type SEND to confirm" />
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setConfirmText("")}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={sendAll} disabled={confirmText !== "SEND"}>Send</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </div>
  );
}
