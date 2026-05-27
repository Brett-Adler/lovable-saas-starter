import { useEffect, useState, type ReactNode } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users as UsersIcon,
  Building2,
  CreditCard,
  BarChart3,
  Inbox,
  Mail,
  Send,
  Settings as SettingsIcon,
  Shield,
  ArrowLeft,
  LogOut,
  Menu,
  ExternalLink,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { useAuth } from "@/hooks/useAuth";
import { useUserRoles } from "@/hooks/useUserRole";
import { cn } from "@/lib/utils";

type NavItem = { to: string; label: string; icon: typeof LayoutDashboard; end?: boolean };
type NavGroup = { label: string; items: NavItem[] };

const GROUPS: NavGroup[] = [
  {
    label: "Overview",
    items: [{ to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true }],
  },
  {
    label: "People",
    items: [
      { to: "/admin/users", label: "Users", icon: UsersIcon },
      { to: "/admin/organizations", label: "Organizations", icon: Building2 },
    ],
  },
  {
    label: "Revenue",
    items: [
      { to: "/admin/subscriptions", label: "Subscriptions", icon: CreditCard },
      { to: "/admin/analytics", label: "Analytics", icon: BarChart3 },
    ],
  },
  {
    label: "Growth",
    items: [
      { to: "/admin/leads", label: "Leads", icon: Inbox },
      { to: "/admin/subscribers", label: "Subscribers", icon: Mail },
      { to: "/admin/broadcasts", label: "Broadcasts", icon: Send },
    ],
  },
  {
    label: "Configure",
    items: [{ to: "/admin/site-settings", label: "Site settings", icon: SettingsIcon }],
  },
];

interface AdminShellProps {
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
  maxWidth?: "5xl" | "6xl" | "7xl" | "full";
  children: ReactNode;
}

const widthClass: Record<NonNullable<AdminShellProps["maxWidth"]>, string> = {
  "5xl": "max-w-5xl",
  "6xl": "max-w-6xl",
  "7xl": "max-w-7xl",
  full: "max-w-none",
};

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
      {GROUPS.map((group) => (
        <div key={group.label}>
          <div className="px-3 mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            {group.label}
          </div>
          <div className="space-y-0.5">
            {group.items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={onNavigate}
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
          </div>
        </div>
      ))}
    </nav>
  );
}

function SidebarFooter({ email, onSignOut }: { email?: string | null; onSignOut: () => void }) {
  return (
    <div className="px-3 py-4 border-t border-border space-y-2">
      <Button asChild variant="ghost" size="sm" className="w-full justify-start text-muted-foreground">
        <Link to="/dashboard">
          <ArrowLeft className="h-4 w-4" />
          Back to app
        </Link>
      </Button>
      {email && <div className="px-3 pt-1 text-xs text-muted-foreground truncate">{email}</div>}
      <Button variant="outline" size="sm" className="w-full" onClick={onSignOut}>
        <LogOut className="h-4 w-4" />
        Sign out
      </Button>
    </div>
  );
}

export const AdminShell = ({
  title,
  description,
  actions,
  maxWidth = "6xl",
  children,
}: AdminShellProps) => {
  const { isAdmin, loading } = useUserRoles();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    document.title = `${title} · Admin`;
  }, [title]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/", { replace: true });
  };

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
    <div className="min-h-screen flex bg-background">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 flex-col border-r border-border bg-card">
        <div className="px-6 py-5 border-b border-border flex items-center gap-2">
          <Logo />
        </div>
        <div className="px-3 py-3 border-b border-border">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
            <Shield className="h-3.5 w-3.5" />
            Admin panel
          </div>
        </div>
        <NavList />
        <SidebarFooter email={user?.email} onSignOut={handleSignOut} />
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar */}
        <header className="lg:hidden border-b border-border bg-card">
          <div className="flex items-center justify-between px-4 py-3 gap-3">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" aria-label="Open admin menu">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-0 flex flex-col">
                <SheetTitle className="sr-only">Admin navigation</SheetTitle>
                <div className="px-6 py-5 border-b border-border">
                  <Logo />
                </div>
                <NavList onNavigate={() => setMobileOpen(false)} />
                <SidebarFooter email={user?.email} onSignOut={handleSignOut} />
              </SheetContent>
            </Sheet>
            <Logo />
            <div className="w-9" aria-hidden />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className={cn("container py-8 lg:py-10", widthClass[maxWidth])}>
            <div className="flex items-start justify-between gap-4 flex-wrap mb-6">
              <div className="min-w-0">
                <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">{title}</h1>
                {description && (
                  <p className="text-muted-foreground mt-1 text-sm lg:text-base">{description}</p>
                )}
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {actions}
                <NotificationBell />
              </div>
            </div>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export const AdminViewSiteLink = () => (
  <Button asChild variant="outline" size="sm">
    <a href="/" target="_blank" rel="noopener noreferrer">
      <ExternalLink className="h-4 w-4" />
      View site
    </a>
  </Button>
);
