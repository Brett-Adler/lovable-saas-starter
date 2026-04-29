import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { Loader2, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useOrganization } from "@/hooks/useOrganization";
import { toast } from "@/hooks/use-toast";

const nameSchema = z.string().trim().min(2, "Name must be at least 2 characters").max(60);

const slugify = (input: string) =>
  input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);

const NewOrganization = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { refresh, setCurrentOrgId } = useOrganization();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [touchedSlug, setTouchedSlug] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleNameChange = (value: string) => {
    setName(value);
    if (!touchedSlug) setSlug(slugify(value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const validatedName = nameSchema.parse(name);
      const finalSlug = (slug || slugify(validatedName)) + "-" + Math.random().toString(36).slice(2, 7);
      setLoading(true);
      const { data, error } = await supabase
        .from("organizations")
        .insert({ name: validatedName, slug: finalSlug, created_by: user!.id })
        .select("id")
        .single();
      if (error) throw error;
      await refresh();
      setCurrentOrgId(data.id);
      toast({ title: "Organization created" });
      navigate("/dashboard/members");
    } catch (err) {
      const message =
        err instanceof z.ZodError
          ? err.errors[0]?.message ?? "Invalid input"
          : err instanceof Error
            ? err.message
            : "Something went wrong";
      toast({ title: "Could not create organization", description: message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardShell>
      <div className="p-6 lg:p-10 max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <div className="h-12 w-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-3">
              <Building2 className="h-6 w-6" />
            </div>
            <CardTitle>Create an organization</CardTitle>
            <CardDescription>
              Organizations let you collaborate with teammates and share a subscription.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="org-name">Organization name</Label>
                <Input
                  id="org-name"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Acme Inc."
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="org-slug">URL slug</Label>
                <Input
                  id="org-slug"
                  value={slug}
                  onChange={(e) => {
                    setTouchedSlug(true);
                    setSlug(slugify(e.target.value));
                  }}
                  placeholder="acme"
                />
                <p className="text-xs text-muted-foreground">
                  A short identifier used in URLs. We'll add a unique suffix automatically.
                </p>
              </div>
              <Button type="submit" disabled={loading} className="w-full">
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                Create organization
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
};

export default NewOrganization;
