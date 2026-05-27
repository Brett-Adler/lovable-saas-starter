import { useEffect, useState } from "react";
import { X, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  /** Stable id used to remember dismissal across reloads */
  id: string;
  message: string;
  /** Optional secondary line */
  hint?: string;
  className?: string;
}

/**
 * Renders a small dismissible ribbon only on Lovable preview / lovable.app /
 * localhost hosts. Auto-hides on custom domains so it never ships to end users.
 */
export const TemplatePlaceholderRibbon = ({ id, message, hint, className }: Props) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const host = window.location.hostname;
    const isPreview =
      host === "localhost" ||
      host === "127.0.0.1" ||
      host.endsWith(".lovable.app") ||
      host.endsWith(".lovableproject.com");
    if (!isPreview) return;
    const dismissed = localStorage.getItem(`tpl-ribbon-dismissed:${id}`);
    if (dismissed === "1") return;
    setVisible(true);
  }, [id]);

  if (!visible) return null;

  return (
    <div
      className={cn(
        "flex items-start gap-2 rounded-md border border-warning/30 bg-warning/10 text-warning px-3 py-2 text-xs",
        className,
      )}
      role="note"
    >
      <AlertTriangle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
      <div className="flex-1">
        <span className="font-medium">{message}</span>
        {hint && <span className="block text-warning/80 mt-0.5">{hint}</span>}
      </div>
      <button
        type="button"
        aria-label="Dismiss"
        onClick={() => {
          localStorage.setItem(`tpl-ribbon-dismissed:${id}`, "1");
          setVisible(false);
        }}
        className="text-warning/70 hover:text-warning shrink-0"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
};
