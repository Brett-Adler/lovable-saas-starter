import { NavLink, Outlet } from "react-router-dom";
import { cn } from "@/lib/utils";

const areas = [
  { to: "/test", label: "Overview", end: true },
  { to: "/test/accessibility", label: "Accessibility" },
  { to: "/test/performance", label: "Performance" },
  { to: "/test/seo", label: "SEO" },
  { to: "/test/security", label: "Security" },
  { to: "/test/design", label: "Design" },
  { to: "/test/e2e", label: "Functional E2E" },
  { to: "/test/analytics", label: "Analytics" },
];

export function TestShell() {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-5xl px-4 py-5">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">
            QA dashboard · internal
          </p>
          <h1 className="text-2xl font-bold mt-1">Test Coverage & Launch Readiness</h1>
        </div>
        <nav className="mx-auto max-w-5xl px-4 pb-3 flex gap-1 flex-wrap">
          {areas.map((a) => (
            <NavLink
              key={a.to}
              to={a.to}
              end={a.end}
              className={({ isActive }) =>
                cn(
                  "px-3 py-1.5 rounded-md text-sm transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )
              }
            >
              {a.label}
            </NavLink>
          ))}
        </nav>
      </header>
      <Outlet />
    </div>
  );
}
