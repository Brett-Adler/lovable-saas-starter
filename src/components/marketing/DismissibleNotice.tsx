import { ReactNode, useEffect, useState } from "react";
import { X, AlertTriangle, Info, Sparkles, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type NoticeTone = "info" | "warning" | "preview";

interface Props {
  /** Stable id used as the storage key. */
  id: string;
  tone?: NoticeTone;
  title?: string;
  children?: ReactNode;
  /** Right-aligned inline content (links, "Read more", etc.). */
  actions?: ReactNode;
  /** Optional icon override. */
  icon?: ReactNode;
  /** Only render on Lovable preview / localhost hosts. */
  previewOnly?: boolean;
  /**
   * "banner"  — full-bleed, flush, top-of-page strip.
   * "card"    — inset rounded card (default).
   */
  variant?: "banner" | "card";
  /** When true, the close button persists dismissal forever. Default true. */
  persistDismissal?: boolean;
  className?: string;
}

const STORAGE_KEY = (id: string) => `notice-dismissed:${id}`;

const toneStyles: Record<
  NoticeTone,
  { bar: string; bg: string; border: string; text: string; chip: string; icon: ReactNode; role: "status" | "alert" }
> = {
  info: {
    bar: "bg-info",
    bg: "bg-info/10",
    border: "border-info/30 ring-1 ring-info/10",
    text: "text-info",
    chip: "bg-info/15 text-info",
    icon: <Info className="h-4 w-4" />,
    role: "status",
  },
  warning: {
    bar: "bg-warning",
    bg: "bg-warning/10",
    border: "border-warning/40 ring-1 ring-warning/10",
    text: "text-warning",
    chip: "bg-warning/15 text-warning",
    icon: <AlertTriangle className="h-4 w-4" />,
    role: "alert",
  },
  preview: {
    bar: "bg-preview",
    bg: "bg-preview/10",
    border: "border-preview/40 ring-1 ring-preview/10",
    text: "text-preview",
    chip: "bg-preview/15 text-preview",
    icon: <Sparkles className="h-4 w-4" />,
    role: "status",
  },
};

function isPreviewHost() {
  if (typeof window === "undefined") return false;
  const host = window.location.hostname;
  return (
    host === "localhost" ||
    host === "127.0.0.1" ||
    host.endsWith(".lovable.app") ||
    host.endsWith(".lovableproject.com")
  );
}

export function DismissibleNotice({
  id,
  tone = "preview",
  title,
  children,
  actions,
  icon,
  previewOnly = false,
  variant = "card",
  persistDismissal = true,
  className,
}: Props) {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (previewOnly && !isPreviewHost()) return;
    const key = STORAGE_KEY(id);
    if (localStorage.getItem(key) === "1") return;
    if (sessionStorage.getItem(key) === "1") return;
    setVisible(true);
  }, [id, previewOnly]);

  if (!visible) return null;

  const styles = toneStyles[tone];

  const dismiss = (forever: boolean) => {
    const key = STORAGE_KEY(id);
    if (forever) localStorage.setItem(key, "1");
    else sessionStorage.setItem(key, "1");
    setLeaving(true);
    window.setTimeout(() => setVisible(false), 180);
  };

  const containerBase =
    variant === "banner"
      ? "w-full border-b"
      : "rounded-xl border shadow-sm";

  return (
    <div
      role={styles.role}
      aria-live="polite"
      className={cn(
        "relative flex items-start gap-3 px-4 py-3 transition-opacity duration-150",
        containerBase,
        styles.bg,
        styles.border,
        leaving && "opacity-0",
        className,
      )}
    >
      {variant === "card" && (
        <span
          aria-hidden="true"
          className={cn("absolute left-0 top-3 bottom-3 w-1 rounded-r-full", styles.bar)}
        />
      )}
      <span
        aria-hidden="true"
        className={cn(
          "flex h-7 w-7 shrink-0 items-center justify-center rounded-md",
          styles.chip,
        )}
      >
        {icon ?? styles.icon}
      </span>
      <div className="flex-1 min-w-0 text-sm">
        {title && <div className={cn("font-semibold", styles.text)}>{title}</div>}
        {children && (
          <div className={cn("text-foreground/80", title && "mt-0.5")}>{children}</div>
        )}
      </div>
      {actions && (
        <div className="hidden sm:flex items-center gap-2 shrink-0 text-sm">{actions}</div>
      )}
      {persistDismissal && (
        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label="Notice options"
            className={cn(
              "shrink-0 rounded-md p-1 text-foreground/50 hover:text-foreground hover:bg-foreground/5 transition-colors",
            )}
          >
            <MoreHorizontal className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuItem onSelect={() => dismiss(false)}>
              Dismiss for now
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => dismiss(true)}>
              Don't show again
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
      <button
        type="button"
        aria-label="Dismiss notice"
        onClick={() => dismiss(persistDismissal)}
        className="shrink-0 rounded-md p-1 text-foreground/50 hover:text-foreground hover:bg-foreground/5 transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
