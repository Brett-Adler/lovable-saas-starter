import { Link } from "react-router-dom";
import { Construction } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DashboardShell } from "@/components/dashboard/DashboardShell";

const Settings = () => (
  <DashboardShell>
    <div className="p-6 lg:p-10 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">Settings</h1>
      <p className="text-muted-foreground mb-6">Account preferences and notifications.</p>
      <Card className="border-dashed">
        <CardHeader>
          <Construction className="h-6 w-6 text-muted-foreground mb-2" />
          <CardTitle>Coming in a later phase</CardTitle>
          <CardDescription>
            Profile editing, password change, and notification preferences.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild variant="outline">
            <Link to="/dashboard">Back to dashboard</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  </DashboardShell>
);

export default Settings;
