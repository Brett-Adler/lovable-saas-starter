import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const CheckoutReturn = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <Card className="max-w-md w-full">
        <CardHeader>
          {sessionId ? (
            <>
              <CheckCircle2 className="h-10 w-10 text-success mb-2" />
              <CardTitle>Payment complete</CardTitle>
              <CardDescription>
                Thanks! Your subscription is being activated — you'll see it in Billing in a moment.
              </CardDescription>
            </>
          ) : (
            <>
              <AlertCircle className="h-10 w-10 text-destructive mb-2" />
              <CardTitle>No session found</CardTitle>
              <CardDescription>We couldn't find your checkout session.</CardDescription>
            </>
          )}
        </CardHeader>
        <CardContent className="flex gap-3">
          <Button asChild className="flex-1">
            <Link to="/dashboard/billing">Go to billing</Link>
          </Button>
          <Button asChild variant="outline" className="flex-1">
            <Link to="/dashboard">Dashboard</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default CheckoutReturn;
