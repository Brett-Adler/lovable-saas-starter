import { CheckCircle2, AlertCircle, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export type FeatureStatus = "shipped" | "setup" | "soon";

const styles: Record<FeatureStatus, { label: string; className: string; Icon: typeof CheckCircle2 }> = {
  shipped: {
    label: "Live",
    className: "border-success/30 bg-success/10 text-success",
    Icon: CheckCircle2,
  },
  setup: {
    label: "Needs setup",
    className: "border-warning/30 bg-warning/10 text-warning",
    Icon: AlertCircle,
  },
  soon: {
    label: "Coming soon",
    className: "border-muted-foreground/30 bg-muted text-muted-foreground",
    Icon: Clock,
  },
};

interface Props {
  status: FeatureStatus;
  /** Optional override for the badge text */
  label?: string;
  /** Tooltip explaining what setup is required */
  tooltip?: string;
  className?: string;
}

export const StatusBadge = ({ status, label, tooltip, className }: Props) => {
  const { label: defaultLabel, className: statusClass, Icon } = styles[status];
  const badge = (
    <Badge
      variant="outline"
      className={cn("gap-1 font-medium text-[10px] uppercase tracking-wide", statusClass, className)}
    >
      <Icon className="h-3 w-3" />
      {label ?? defaultLabel}
    </Badge>
  );
  if (!tooltip) return badge;
  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="inline-flex">{badge}</span>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs text-xs">{tooltip}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
