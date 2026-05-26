import { Link } from "react-router-dom";
import { Shield, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { useAuth } from "@/hooks/useAuth";
import { useUserRoles } from "@/hooks/useUserRole";

const AdminIndex = () => {
  const { isAdmin, loading } = useUserRoles();
  const { signOut } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Admins only</CardTitle>
            <CardDescription>You don't have permission to view this page.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link to="/dashboard">
                <ArrowLeft className="h-4 w-4" />
                Back to dashboard
              </Link>
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
      <main className="container py-12 max-w-5xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-3">
          <Shield className="h-3.5 w-3.5" />
          Admin
        </div>
        <h1 className="text-3xl font-bold mb-2">Admin panel</h1>
        <p className="text-muted-foreground mb-8">
          Tools for managing users, organizations, and billing across the entire platform.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { title: "Users", desc: "Browse, search, and grant admin", to: "/admin/users" },
            { title: "Organizations", desc: "Every workspace and its members", to: "/admin/organizations" },
            { title: "Subscriptions", desc: "All Stripe customers and plans", to: "/admin/subscriptions" },
            { title: "Analytics", desc: "Signups, MRR, churn, and events", to: "/admin/analytics" },
            { title: "Leads", desc: "Contact, demo, and waitlist submissions", to: "/admin/leads" },
            { title: "Subscribers", desc: "Newsletter list & confirmation status", to: "/admin/subscribers" },
            { title: "Broadcasts", desc: "Compose & send the monthly newsletter", to: "/admin/broadcasts" },
            { title: "Site settings", desc: "Contact email, social links, mailing address", to: "/admin/site-settings" },
          ].map((item) => (
            <Card key={item.title}>
              <CardHeader>
                <CardTitle className="text-base">{item.title}</CardTitle>
                <CardDescription>{item.desc}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" size="sm" className="w-full">
                  <Link to={item.to}>Open</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-8">
          <Button asChild variant="outline">
            <Link to="/dashboard">
              <ArrowLeft className="h-4 w-4" />
              Back to dashboard
            </Link>
          </Button>
        </div>
      </main>
    </div>
  );
};

export default AdminIndex;
