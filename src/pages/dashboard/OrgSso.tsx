import { useEffect, useState } from "react";
import { Loader2, Save, Copy, ExternalLink } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { RequirePlan } from "@/components/billing/RequirePlan";
import { useOrganization } from "@/hooks/useOrganization";
import { supabase } from "@/integrations/supabase/client";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { toast } from "sonner";

const PROJECT_ID = import.meta.env.VITE_SUPABASE_PROJECT_ID;
const ACS_URL = `https://${PROJECT_ID}.supabase.co/auth/v1/sso/saml/acs`;
const ENTITY_ID = `https://${PROJECT_ID}.supabase.co/auth/v1/sso/saml/metadata`;

type SsoConfig = {
  id?: string;
  metadata_url: string;
  idp_entity_id: string;
  email_domains: string;
  notes: string;
  status: string;
  enabled: boolean;
};

const EMPTY: SsoConfig = {
  metadata_url: "",
  idp_entity_id: "",
  email_domains: "",
  notes: "",
  status: "draft",
  enabled: false,
};

const OrgSso = () => {
  const { currentOrg } = useOrganization();
  const [config, setConfig] = useState<SsoConfig>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const isOwner = currentOrg?.role === "owner";

  useEffect(() => {
    if (!currentOrg) return;
    supabase
      .from("org_sso_config")
      .select("*")
      .eq("organization_id", currentOrg.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setConfig({
            id: data.id,
            metadata_url: data.metadata_url ?? "",
            idp_entity_id: data.idp_entity_id ?? "",
            email_domains: (data.email_domains ?? []).join(", "),
            notes: data.notes ?? "",
            status: data.status ?? "draft",
            enabled: data.enabled ?? false,
          });
        } else {
          setConfig(EMPTY);
        }
        setLoading(false);
      });
  }, [currentOrg]);

  const copy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied`);
  };

  const save = async () => {
    if (!currentOrg) return;
    setSaving(true);
    const domains = config.email_domains
      .split(",")
      .map((d) => d.trim().toLowerCase())
      .filter(Boolean);
    const { error } = await supabase
      .from("org_sso_config")
      .upsert(
        {
          organization_id: currentOrg.id,
          metadata_url: config.metadata_url || null,
          idp_entity_id: config.idp_entity_id || null,
          acs_url: ACS_URL,
          email_domains: domains,
          notes: config.notes || null,
          status: "pending_review",
        },
        { onConflict: "organization_id" },
      );
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("SSO configuration saved. We'll reach out to finish provisioning.");
    setConfig((c) => ({ ...c, status: "pending_review" }));
  };

  if (!currentOrg) {
    return (
      <DashboardShell>
        <div className="p-6 lg:p-10 max-w-3xl mx-auto">
          <p className="text-muted-foreground">Select an organization first.</p>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <div className="p-6 lg:p-10 max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Single Sign-On (SAML)</h1>
          <p className="text-muted-foreground">
            Let your team sign in with your corporate identity provider.
          </p>
        </div>

        <RequirePlan tier="team" feature="SAML SSO">
          {!isOwner ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                Only organization owners can configure SSO.
              </CardContent>
            </Card>
          ) : loading ? (
            <Card>
              <CardContent className="py-12 grid place-items-center">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </CardContent>
            </Card>
          ) : (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Service provider details</CardTitle>
                  <CardDescription>
                    Paste these into your identity provider (Okta, Entra ID, OneLogin, etc.).
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>ACS / Reply URL</Label>
                    <div className="flex gap-2">
                      <Input value={ACS_URL} readOnly className="font-mono text-xs" />
                      <Button variant="outline" size="icon" onClick={() => copy(ACS_URL, "ACS URL")}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Entity ID / Audience URI</Label>
                    <div className="flex gap-2">
                      <Input value={ENTITY_ID} readOnly className="font-mono text-xs" />
                      <Button variant="outline" size="icon" onClick={() => copy(ENTITY_ID, "Entity ID")}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <CardTitle>Your identity provider</CardTitle>
                      <CardDescription>
                        Save your IdP details — we'll wire it up and email you when SSO is live.
                      </CardDescription>
                    </div>
                    <Badge variant={config.enabled ? "default" : "secondary"}>
                      {config.enabled ? "Active" : config.status.replace("_", " ")}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="metadata">IdP Metadata URL</Label>
                    <Input
                      id="metadata"
                      type="url"
                      placeholder="https://your-idp.example.com/metadata"
                      value={config.metadata_url}
                      onChange={(e) => setConfig({ ...config, metadata_url: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="entity">IdP Entity ID (optional)</Label>
                    <Input
                      id="entity"
                      placeholder="https://your-idp.example.com/saml"
                      value={config.idp_entity_id}
                      onChange={(e) => setConfig({ ...config, idp_entity_id: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="domains">Email domains</Label>
                    <Input
                      id="domains"
                      placeholder="acme.com, acme.co.uk"
                      value={config.email_domains}
                      onChange={(e) => setConfig({ ...config, email_domains: e.target.value })}
                    />
                    <p className="text-xs text-muted-foreground">
                      Comma-separated. Users with these email domains will be routed to SSO.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes (optional)</Label>
                    <Textarea
                      id="notes"
                      placeholder="Anything we should know — group attribute mapping, MFA requirements, etc."
                      value={config.notes}
                      onChange={(e) => setConfig({ ...config, notes: e.target.value })}
                      rows={3}
                    />
                  </div>
                  <div className="flex items-center justify-between border-t border-border pt-4">
                    <a
                      href="mailto:support@example.com?subject=Finish SAML SSO setup"
                      className="text-sm text-primary inline-flex items-center gap-1 hover:underline"
                    >
                      Contact support to finish provisioning
                      <ExternalLink className="h-3 w-3" />
                    </a>
                    <Button onClick={save} disabled={saving}>
                      {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                      Save configuration
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </RequirePlan>
      </div>
    </DashboardShell>
  );
};

export default OrgSso;
