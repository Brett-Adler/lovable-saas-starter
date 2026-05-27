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
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { NoIndex } from "@/components/seo/NoIndex";
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

interface NavGroup {
  label: string;
  items: NavItem[];
}

export const DashboardShell = ({ children }: { children: ReactNode }) => {
  const { user, signOut } = useAuth();
  const { isAdmin } = useUserRoles();
  const { currentOrg } = useOrganization();
  const navigate = useNavigate();

  const canManageOrg = currentOrg?.role === "owner" || currentOrg?.role === "admin";

  const groups: NavGroup[] = [
    {
      label: "Workspace",
      items: [
        { to: "/dashboard", label: "Overview", icon: LayoutDashboard, show: true },
        { to: "/dashboard/organization", label: "Organization", icon: Building2, show: !!currentOrg },
        { to: "/dashboard/members", label: "Members", icon: Users, show: !!currentOrg },
        { to: "/dashboard/billing", label: "Billing", icon: CreditCard, show: canManageOrg },
      ],
    },
    {
      label: "Account",
      items: [
        { to: "/dashboard/invitations", label: "Invitations", icon: Mail, show: true },
        { to: "/dashboard/settings", label: "Settings", icon: Settings, show: true },
      ],
    },
    {
      label: "Admin",
      items: [{ to: "/admin", label: "Admin panel", icon: Shield, show: isAdmin }],
    },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate("/", { replace: true });
  };

  return (
    <>
      <NoIndex />
    <div className="min-h-screen flex bg-background">
      <aside className="hidden lg:flex w-64 flex-col border-r border-border bg-card">
        <div className="px-6 py-5 border-b border-border">
          <Logo />
        </div>
        <div className="px-3 py-4 border-b border-border">
          <OrgSwitcher />
        </div>
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
          {groups
            .map((g) => ({ ...g, items: g.items.filter((i) => i.show) }))
            .filter((g) => g.items.length > 0)
            .map((group) => (
              <div key={group.label}>
                <div className="px-3 mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {group.label}
                </div>
                <div className="space-y-0.5">
                  {group.items.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.to === "/dashboard"}
                      className={({ isActive }) =>
                        cn(
                          "relative flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                          isActive
                            ? "bg-primary/10 text-primary before:absolute before:left-0 before:top-1.5 before:bottom-1.5 before:w-0.5 before:rounded-full before:bg-primary"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground",
                        )
                      }
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </NavLink>
                  ))}
                </div>
              </div>
            ))}
        </nav>
        <div className="px-3 py-4 border-t border-border space-y-2">
          <div className="flex items-center justify-between px-3">
            <div className="text-xs text-muted-foreground truncate">{user?.email}</div>
            <NotificationBell />
          </div>
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
            <div className="flex items-center gap-2">
              <NotificationBell />
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="px-4 pb-3">
            <OrgSwitcher />
          </div>
        </header>
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
    </>
  );
};
