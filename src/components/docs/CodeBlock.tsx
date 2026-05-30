import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  code: string;
  label: string;
  className?: string;
}

export function CodeBlock({ code, label, className }: Props) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore — clipboard not available
    }
  };

  return (
    <div className={cn("group relative rounded-md border bg-muted/60", className)}>
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? `${label} copied` : `Copy ${label.toLowerCase()}`}
        className="absolute top-2 right-2 inline-flex items-center gap-1 rounded-md border bg-background/80 px-2 py-1 text-xs text-foreground/80 opacity-0 transition-opacity hover:text-foreground focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-primary focus:outline-none group-hover:opacity-100"
      >
        {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
        <span>{copied ? "Copied" : "Copy"}</span>
      </button>
      <pre
        tabIndex={0}
        aria-label={label}
        className="overflow-x-auto p-4 pr-20 text-sm font-mono text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md"
      >
        {code}
      </pre>
    </div>
  );
}
