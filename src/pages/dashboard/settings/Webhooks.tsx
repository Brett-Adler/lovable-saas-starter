import { Webhook } from "lucide-react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { DashboardComingSoon } from "@/components/dashboard/DashboardComingSoon";

const Webhooks = () => (
  <DashboardShell>
    <div className="p-6 lg:p-10 max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-1">Webhooks</h1>
        <p className="text-muted-foreground">Subscribe to events and receive them at your own endpoint.</p>
      </div>

      <DashboardComingSoon
        Icon={Webhook}
        title="Outbound webhooks"
        description="Get notified the instant something happens — new members, subscription changes, audit events."
        source="coming_soon:webhooks"
        bullets={[
          "HMAC-signed payloads",
          "Automatic retries with exponential backoff",
          "Per-event subscriptions and replay",
        ]}
      />
    </div>
  </DashboardShell>
);

export default Webhooks;
