import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { Bell, Inbox } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

type Notification = {
  id: string;
  title: string;
  body: string | null;
  link: string | null;
  read_at: string | null;
  created_at: string;
};

export const RecentNotificationsCard = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from("notifications")
      .select("id,title,body,link,read_at,created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5);
    setItems((data ?? []) as Notification[]);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  const markRead = async (id: string) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, read_at: new Date().toISOString() } : i)),
    );
    await supabase
      .from("notifications")
      .update({ read_at: new Date().toISOString() })
      .eq("id", id);
  };

  const unread = items.filter((i) => !i.read_at).length;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary/10 grid place-items-center">
            <Bell className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-base">Notifications</CardTitle>
            <CardDescription>Your latest updates</CardDescription>
          </div>
          {unread > 0 && (
            <Badge variant="default" className="tabular-nums">
              {unread}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {loading ? (
          <Skeleton className="h-20 w-full" />
        ) : items.length === 0 ? (
          <div className="py-6 text-center text-sm text-muted-foreground space-y-2">
            <Inbox className="h-6 w-6 mx-auto opacity-60" />
            <div>You're all caught up.</div>
          </div>
        ) : (
          <ul className="divide-y divide-border -mx-2">
            {items.map((n) => {
              const Inner = (
                <div className="flex gap-2.5 px-2 py-2.5">
                  <div
                    className={cn(
                      "mt-1.5 h-2 w-2 rounded-full shrink-0",
                      n.read_at ? "bg-transparent" : "bg-primary",
                    )}
                    aria-hidden
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium truncate">{n.title}</div>
                    {n.body && (
                      <div className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                        {n.body}
                      </div>
                    )}
                    <div className="text-[11px] text-muted-foreground mt-0.5">
                      {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                    </div>
                  </div>
                </div>
              );
              const handleClick = () => markRead(n.id);
              return (
                <li key={n.id} className={cn(!n.read_at && "bg-muted/20")}>
                  {n.link ? (
                    <Link to={n.link} onClick={handleClick} className="block hover:bg-muted/40 rounded-md">
                      {Inner}
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={handleClick}
                      className="w-full text-left hover:bg-muted/40 rounded-md"
                    >
                      {Inner}
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};
