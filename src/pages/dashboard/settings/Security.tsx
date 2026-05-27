import { ShieldCheck } from "lucide-react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { DashboardComingSoon } from "@/components/dashboard/DashboardComingSoon";

const SecuritySettings = () => (
  <DashboardShell>
    <div className="p-6 lg:p-10 max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-1">Security</h1>
        <p className="text-muted-foreground">Two-factor auth, active sessions, and account recovery.</p>
      </div>

      <DashboardComingSoon
        Icon={ShieldCheck}
        title="Two-factor authentication (TOTP)"
        description="Add an extra layer of security with an authenticator app like 1Password, Authy, or Google Authenticator."
        source="coming_soon:2fa"
        bullets={[
          "Works with any TOTP authenticator app",
          "Backup codes for recovery",
          "Enforce 2FA across an entire organization",
        ]}
      />

      <DashboardComingSoon
        Icon={ShieldCheck}
        title="Active sessions"
        description="See every device signed into your account and revoke any one of them."
        source="coming_soon:sessions"
      />
    </div>
  </DashboardShell>
);

export default SecuritySettings;
