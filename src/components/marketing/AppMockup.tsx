import { cn } from "@/lib/utils";

type Variant = "dashboard" | "analytics" | "inbox" | "billing" | "team" | "roadmap";

interface AppMockupProps {
  variant?: Variant;
  className?: string;
}

const Bar = ({ h, className }: { h: number; className?: string }) => (
  <div className={cn("w-full rounded-sm", className)} style={{ height: `${h}%` }} />
);

const Avatar = ({ i }: { i: number }) => (
  <div
    className="h-7 w-7 rounded-full"
    style={{
      background: `conic-gradient(from ${i * 47}deg, hsl(var(--primary)/0.6), hsl(var(--accent)/0.6), hsl(var(--primary)/0.3))`,
    }}
  />
);

const Sidebar = () => (
  <div className="hidden md:flex w-44 shrink-0 flex-col gap-1 p-3 border-r border-border/60 bg-muted/20">
    <div className="h-7 mb-2 rounded bg-foreground/10" />
    {["Overview", "Analytics", "Billing", "Team", "Settings"].map((l, i) => (
      <div
        key={l}
        className={cn(
          "h-7 rounded px-2 flex items-center text-[11px]",
          i === 0 ? "bg-primary/15 text-primary font-medium" : "text-muted-foreground",
        )}
      >
        <span className="h-2 w-2 rounded-sm bg-current/50 mr-2 opacity-60" />
        {l}
      </div>
    ))}
  </div>
);

const StatCard = ({ label, value, delta }: { label: string; value: string; delta: string }) => (
  <div className="rounded-lg border border-border/60 bg-background p-3">
    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
    <div className="mt-1 text-lg font-bold">{value}</div>
    <div className="text-[10px] text-success">{delta}</div>
  </div>
);

const Dashboard = () => (
  <div className="flex h-full">
    <Sidebar />
    <div className="flex-1 p-4 space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <StatCard label="MRR" value="$24.8k" delta="+12.4%" />
        <StatCard label="Active" value="1,284" delta="+3.1%" />
        <StatCard label="Churn" value="1.8%" delta="-0.4%" />
      </div>
      <div className="rounded-lg border border-border/60 bg-background p-4">
        <div className="flex items-end gap-1.5 h-32">
          {[40, 55, 48, 62, 70, 65, 78, 82, 76, 88, 92, 85].map((h, i) => (
            <Bar key={i} h={h} className="bg-gradient-to-t from-primary/40 to-primary" />
          ))}
        </div>
      </div>
      <div className="rounded-lg border border-border/60 bg-background divide-y divide-border/60">
        {["Acme Inc", "Globex", "Initech"].map((c, i) => (
          <div key={c} className="flex items-center gap-3 px-3 py-2 text-xs">
            <Avatar i={i} />
            <span className="font-medium flex-1">{c}</span>
            <span className="text-muted-foreground">Pro · ${(48 + i * 13)}/mo</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const Analytics = () => (
  <div className="flex h-full">
    <Sidebar />
    <div className="flex-1 p-4 space-y-4">
      <div className="rounded-lg border border-border/60 bg-background p-4">
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-3">Signups · last 30 days</div>
        <svg viewBox="0 0 300 80" className="w-full h-24">
          <defs>
            <linearGradient id="appmockup-grad" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.5" />
              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M0,60 C30,55 50,40 80,35 C110,30 140,50 170,42 C200,34 230,18 260,20 L300,18 L300,80 L0,80 Z"
            fill="url(#appmockup-grad)"
          />
          <path
            d="M0,60 C30,55 50,40 80,35 C110,30 140,50 170,42 C200,34 230,18 260,20 L300,18"
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="2"
          />
        </svg>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <StatCard label="Visits" value="48.2k" delta="+8.2%" />
        <StatCard label="Conv." value="4.6%" delta="+0.7%" />
      </div>
    </div>
  </div>
);

const Inbox = () => (
  <div className="flex h-full">
    <Sidebar />
    <div className="flex-1 p-4">
      <div className="rounded-lg border border-border/60 bg-background divide-y divide-border/60">
        {[
          ["New signup", "maya@loop.app", "2m"],
          ["Payment succeeded", "Globex · $99", "14m"],
          ["Trial ended", "Initech", "1h"],
          ["Invite accepted", "priya@drift.dev", "3h"],
        ].map(([t, s, time], i) => (
          <div key={i} className="flex items-center gap-3 px-3 py-3 text-xs">
            <Avatar i={i} />
            <div className="flex-1 min-w-0">
              <div className="font-medium truncate">{t}</div>
              <div className="text-muted-foreground truncate">{s}</div>
            </div>
            <span className="text-muted-foreground">{time}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const Billing = () => (
  <div className="flex h-full">
    <Sidebar />
    <div className="flex-1 p-4 space-y-3">
      <div className="grid grid-cols-3 gap-3">
        <StatCard label="MRR" value="$24.8k" delta="+12.4%" />
        <StatCard label="ARR" value="$298k" delta="+18%" />
        <StatCard label="LTV" value="$1.2k" delta="+5%" />
      </div>
      <div className="rounded-lg border border-border/60 bg-background overflow-hidden">
        <div className="px-3 py-2 text-[10px] uppercase tracking-wider text-muted-foreground bg-muted/40">Recent invoices</div>
        <div className="divide-y divide-border/60">
          {[["Pro · monthly", "$49.00"], ["Team · yearly", "$490.00"], ["Pro · monthly", "$49.00"]].map(([p, a], i) => (
            <div key={i} className="flex items-center px-3 py-2 text-xs">
              <span className="flex-1">{p}</span>
              <span className="font-medium tabular-nums">{a}</span>
              <span className="ml-3 px-2 py-0.5 rounded-full bg-success/15 text-success text-[10px]">paid</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const Team = () => (
  <div className="flex h-full">
    <Sidebar />
    <div className="flex-1 p-4">
      <div className="rounded-lg border border-border/60 bg-background divide-y divide-border/60">
        {[
          ["Maya R.", "Owner"],
          ["James K.", "Admin"],
          ["Priya S.", "Member"],
          ["Ari N.", "Member"],
        ].map(([n, r], i) => (
          <div key={i} className="flex items-center gap-3 px-3 py-2 text-xs">
            <Avatar i={i} />
            <span className="font-medium flex-1">{n}</span>
            <span className="text-muted-foreground">{r}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const Roadmap = () => (
  <div className="flex h-full">
    <Sidebar />
    <div className="flex-1 p-4 space-y-3">
      {[
        ["Shipped", "Stripe subscriptions", "success"],
        ["Shipped", "Teams & roles", "success"],
        ["Setup", "Marketing broadcasts", "warning"],
        ["Soon", "Slack notifications", "muted"],
      ].map(([s, t, tone], i) => (
        <div key={i} className="flex items-center gap-3 rounded-lg border border-border/60 bg-background p-3 text-xs">
          <span
            className={cn(
              "px-2 py-0.5 rounded-full text-[10px] font-medium",
              tone === "success" && "bg-success/15 text-success",
              tone === "warning" && "bg-warning/15 text-warning",
              tone === "muted" && "bg-muted text-muted-foreground",
            )}
          >
            {s}
          </span>
          <span className="font-medium flex-1">{t}</span>
        </div>
      ))}
    </div>
  </div>
);

const variants = {
  dashboard: Dashboard,
  analytics: Analytics,
  inbox: Inbox,
  billing: Billing,
  team: Team,
  roadmap: Roadmap,
};

/**
 * Generic, hand-drawn-feeling app mockup built from divs + SVG. Decorative
 * placeholder — not real product UI. Use inside a <BrowserMockup>.
 */
export const AppMockup = ({ variant = "dashboard", className }: AppMockupProps) => {
  const V = variants[variant];
  return (
    <div
      aria-hidden
      className={cn(
        "w-full bg-background text-foreground select-none pointer-events-none",
        "min-h-[280px] md:min-h-[360px]",
        className,
      )}
    >
      <V />
    </div>
  );
};
