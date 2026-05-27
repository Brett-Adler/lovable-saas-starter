import { KeyRound } from "lucide-react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { DashboardComingSoon } from "@/components/dashboard/DashboardComingSoon";

const ApiKeys = () => (
  <DashboardShell>
    <div className="p-6 lg:p-10 max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-1">API keys</h1>
        <p className="text-muted-foreground">Programmatic access to your workspace.</p>
      </div>

      <DashboardComingSoon
        Icon={KeyRound}
        title="Personal & workspace API keys"
        description="Mint scoped keys to call our API from your own scripts, CI, or another product."
        source="coming_soon:api_keys"
        bullets={[
          "Per-key scopes (read, write, admin)",
          "One-click rotation and revoke",
          "Last-used timestamps and audit trail",
        ]}
      />
    </div>
  </DashboardShell>
);

export default ApiKeys;
