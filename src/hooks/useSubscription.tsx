import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getStripeEnvironment } from "@/lib/stripe";
import { useAuth } from "@/hooks/useAuth";

export interface SubscriptionRecord {
  id: string;
  status: string;
  price_id: string | null;
  product_id: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  stripe_customer_id: string | null;
}

function computeIsActive(sub: SubscriptionRecord | null): boolean {
  if (!sub) return false;
  const end = sub.current_period_end ? new Date(sub.current_period_end).getTime() : null;
  const future = end === null || end > Date.now();
  if (["active", "trialing", "past_due"].includes(sub.status) && future) return true;
  if (sub.status === "canceled" && end && end > Date.now()) return true;
  return false;
}

export function useSubscription() {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<SubscriptionRecord | null>(null);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    if (!user) {
      setSubscription(null);
      setLoading(false);
      return;
    }
    const { data } = await supabase
      .from("subscriptions")
      .select("id,status,price_id,product_id,current_period_end,cancel_at_period_end,stripe_customer_id")
      .eq("user_id", user.id)
      .eq("environment", getStripeEnvironment())
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    setSubscription((data as SubscriptionRecord | null) ?? null);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel(`subscriptions:${user.id}:${Math.random().toString(36).slice(2)}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "subscriptions", filter: `user_id=eq.${user.id}` },
        () => refetch(),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, refetch]);

  return { subscription, isActive: computeIsActive(subscription), loading, refetch };
}
