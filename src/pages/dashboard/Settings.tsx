import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldCheck, KeyRound, Webhook, Download } from "lucide-react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { ProfileTab } from "@/pages/dashboard/settings/ProfileTab";
import { SecurityTab } from "@/pages/dashboard/settings/SecurityTab";
import { NotificationsTab } from "@/pages/dashboard/settings/NotificationsTab";
import { StatusBadge } from "@/components/marketing/StatusBadge";

const advanced = [
  { to: "/dashboard/settings/security", Icon: ShieldCheck, label: "Two-factor auth", desc: "Authenticator codes and active sessions.", status: "soon" as const },
  { to: "/dashboard/settings/api-keys", Icon: KeyRound, label: "API keys", desc: "Programmatic access for scripts and CI.", status: "soon" as const },
  { to: "/dashboard/settings/webhooks", Icon: Webhook, label: "Webhooks", desc: "Subscribe to events at your own endpoint.", status: "soon" as const },
  { to: "/dashboard/settings/data", Icon: Download, label: "Your data", desc: "Export everything or request deletion.", status: "shipped" as const },
];

const Settings = () => (
  <DashboardShell>
    <div className="p-6 lg:p-10 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-1">Settings</h1>
      <p className="text-muted-foreground mb-6">Profile, security, and notification preferences.</p>
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Password</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>
        <TabsContent value="profile"><ProfileTab /></TabsContent>
        <TabsContent value="security"><SecurityTab /></TabsContent>
        <TabsContent value="notifications"><NotificationsTab /></TabsContent>
        <TabsContent value="advanced">
          <div className="grid gap-3 sm:grid-cols-2">
            {advanced.map((a) => (
              <Card key={a.to} className="p-4">
                <div className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <a.Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{a.label}</h3>
                      <StatusBadge status={a.status} />
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{a.desc}</p>
                    <Button asChild variant="ghost" size="sm" className="-ml-3">
                      <Link to={a.to}>
                        Open <ArrowRight className="h-3.5 w-3.5 ml-1" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  </DashboardShell>
);

export default Settings;
