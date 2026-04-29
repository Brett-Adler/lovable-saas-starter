import { useState } from "react";
import { Button } from "@/components/ui/button";
import { lovable } from "@/integrations/lovable";
import { toast } from "@/hooks/use-toast";

export const AppleButton = ({ label = "Continue with Apple" }: { label?: string }) => {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    const result = await lovable.auth.signInWithOAuth("apple", {
      redirect_uri: `${window.location.origin}/dashboard`,
    });
    if (result.redirected) return;
    if (result.error) {
      toast({
        title: "Sign-in failed",
        description: result.error.message ?? "Please try again.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }
    window.location.href = "/dashboard";
  };

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full h-11 justify-center gap-3"
      onClick={handleClick}
      disabled={loading}
    >
      <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
        <path d="M16.365 1.43c0 1.14-.42 2.22-1.16 3.04-.79.87-2.07 1.55-3.13 1.46-.13-1.11.42-2.27 1.13-3.02.81-.86 2.18-1.5 3.16-1.48zM20.5 17.27c-.55 1.27-.81 1.83-1.52 2.95-.99 1.55-2.39 3.48-4.12 3.5-1.54.01-1.93-1-4.02-.99-2.09.01-2.52 1.01-4.06.99-1.73-.02-3.06-1.77-4.05-3.32C-.07 16.83-.36 12.32 1.45 9.91c1.29-1.71 3.32-2.71 5.23-2.71 1.95 0 3.17 1.07 4.78 1.07 1.56 0 2.51-1.07 4.77-1.07 1.7 0 3.51.93 4.79 2.53-4.21 2.31-3.52 8.33-.52 9.54z"/>
      </svg>
      {loading ? "Connecting…" : label}
    </Button>
  );
};
