import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Settings,
  CreditCard,
  Shield,
  LogOut,
  Building2,
  Mail,
} from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { OrgSwitcher } from "@/components/dashboard/OrgSwitcher";
import { useAuth } from "@/hooks/useAuth";
import { useUserRoles } from "@/hooks/useUserRole";
import { useOrganization } from "@/hooks/useOrganization";
import { cn } from "@/lib/utils";

interface NavItem {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
  show: boolean;
}

export const DashboardShell = ({ children }: { children: ReactNode }) => {
  const { user, signOut } = useAuth();
  const { isAdmin } = useUserRoles();
  const { currentOrg } = useOrganization();
  const navigate = useNavigate();

  const canManageOrg = currentOrg?.role === "owner" || currentOrg?.role === "admin";

  const items: NavItem[] = [
    { to: "/dashboard", label: "Overview", icon: LayoutDashboard, show: true },
    { to: "/dashboard/invitations", label: "Invitations", icon: Mail, show: true },
    { to: "/dashboard/organization", label: "Organization", icon: Building2, show: !!currentOrg },
    { to: "/dashboard/members", label: "Members", icon: Users, show: !!currentOrg },
    { to: "/dashboard/billing", label: "Billing", icon: CreditCard, show: canManageOrg },
    { to: "/dashboard/settings", label: "Settings", icon: Settings, show: true },
    { to: "/admin", label: "Admin", icon: Shield, show: isAdmin },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen flex bg-background">
      <aside className="hidden lg:flex w-64 flex-col border-r border-border bg-card">
        <div className="px-6 py-5 border-b border-border">
          <Logo />
        </div>
        <div className="px-3 py-4 border-b border-border">
          <OrgSwitcher />
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {items
            .filter((i) => i.show)
            .map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/dashboard"}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )
                }
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            ))}
        </nav>
        <div className="px-3 py-4 border-t border-border space-y-2">
          <div className="px-3 py-2 text-xs text-muted-foreground truncate">{user?.email}</div>
          <Button variant="outline" size="sm" className="w-full" onClick={handleSignOut}>
            <LogOut className="h-4 w-4" />
            Sign out
          </Button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="lg:hidden border-b border-border bg-card">
          <div className="flex items-center justify-between px-4 py-3">
            <Logo />
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
          <div className="px-4 pb-3">
            <OrgSwitcher />
          </div>
        </header>
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};
