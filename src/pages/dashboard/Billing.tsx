import { Link } from "react-router-dom";
import { Construction } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DashboardShell } from "@/components/dashboard/DashboardShell";

const Billing = () => (
  <DashboardShell>
    <div className="p-6 lg:p-10 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">Billing</h1>
      <p className="text-muted-foreground mb-6">Manage your plan and invoices.</p>
      <Card className="border-dashed">
        <CardHeader>
          <Construction className="h-6 w-6 text-muted-foreground mb-2" />
          <CardTitle>Stripe integration coming next phase</CardTitle>
          <CardDescription>
            We'll wire up subscriptions, plan changes, and invoice history here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild variant="outline">
            <Link to="/pricing">View available plans</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  </DashboardShell>
);

export default Billing;
