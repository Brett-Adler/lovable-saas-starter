import { useNavigate } from "react-router-dom";
import { ChevronUp, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

interface Props {
  featureId: string;
  count: number;
  voted: boolean;
  loading?: boolean;
  onToggle: (id: string) => Promise<{ needsAuth?: boolean; error?: unknown; ok?: true }>;
}

export const VoteButton = ({ featureId, count, voted, loading, onToggle }: Props) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const handleClick = async () => {
    if (!user) {
      navigate(`/login?next=${encodeURIComponent("/roadmap")}`);
      return;
    }
    const res = await onToggle(featureId);
    if (res.error) {
      toast({
        title: "Couldn't record your vote",
        description: "Please try again in a moment.",
        variant: "destructive",
      });
    }
  };

  return (
    <Button
      type="button"
      variant={voted ? "default" : "outline"}
      size="sm"
      onClick={handleClick}
      disabled={loading}
      className={cn("h-8 gap-1.5 px-2.5 tabular-nums", voted && "shadow-sm")}
      aria-pressed={voted}
      aria-label={voted ? `Remove your vote for this feature (${count} votes)` : `Vote for this feature (${count} votes)`}
    >
      {loading ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : (
        <ChevronUp className="h-3.5 w-3.5" />
      )}
      <span className="text-xs font-semibold">{count}</span>
    </Button>
  );
};
