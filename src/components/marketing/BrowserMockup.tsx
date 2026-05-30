import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface BrowserMockupProps {
  url?: string;
  children: ReactNode;
  className?: string;
}

/**
 * Decorative macOS-style window chrome. Children render inside. Always
 * aria-hidden — pair with surrounding copy that conveys meaning.
 */
export const BrowserMockup = ({ url = "app.yourdomain.com", children, className }: BrowserMockupProps) => (
  <Card
    aria-hidden
    className={cn("overflow-hidden border-border/60 shadow-2xl bg-card", className)}
  >
    <div className="flex items-center gap-1.5 px-4 py-3 border-b border-border/60 bg-muted/40">
      <span className="h-3 w-3 rounded-full bg-destructive/70" />
      <span className="h-3 w-3 rounded-full bg-warning/70" />
      <span className="h-3 w-3 rounded-full bg-success/70" />
      <div className="mx-auto text-xs text-muted-foreground font-mono truncate max-w-[60%]">{url}</div>
    </div>
    {children}
  </Card>
);
