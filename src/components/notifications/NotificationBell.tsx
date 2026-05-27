import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { Bell, CheckCheck, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

type Notification = {
  id: string;
  title: string;
  body: string | null;
  link: string | null;
  icon: string | null;
  read_at: string | null;
  created_at: string;
};

const PAGE_SIZE = 15;

export const NotificationBell = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data } = await supabase
      .from("notifications")
      .select("id,title,body,link,icon,read_at,created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(PAGE_SIZE);
    setItems((data ?? []) as Notification[]);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (!user) return;
    load();

    const channel = supabase
      .channel(`notifications:${user.id}:${Math.random().toString(36).slice(2)}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${user.id}`,
        },
        () => load(),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, load]);

  const unreadCount = items.filter((i) => !i.read_at).length;

  const markAllRead = async () => {
    if (!user || unreadCount === 0) return;
    const ids = items.filter((i) => !i.read_at).map((i) => i.id);
    setItems((prev) =>
      prev.map((i) => (i.read_at ? i : { ...i, read_at: new Date().toISOString() })),
    );
    await supabase
      .from("notifications")
      .update({ read_at: new Date().toISOString() })
      .in("id", ids);
  };

  const markOneRead = async (id: string) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id && !i.read_at ? { ...i, read_at: new Date().toISOString() } : i)),
    );
    await supabase
      .from("notifications")
      .update({ read_at: new Date().toISOString() })
      .eq("id", id);
  };

  if (!user) return null;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={`Notifications${unreadCount ? ` (${unreadCount} unread)` : ""}`}
          className="relative"
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span
              aria-hidden
              className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary ring-2 ring-background"
            />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[360px] p-0">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm">Notifications</span>
            {unreadCount > 0 && (
              <Badge variant="secondary" className="h-5 px-1.5 text-[10px]">
                {unreadCount} new
              </Badge>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs"
            onClick={markAllRead}
            disabled={unreadCount === 0}
          >
            <CheckCheck className="h-3.5 w-3.5" />
            Mark all read
          </Button>
        </div>

        <ScrollArea className="max-h-[420px]">
          {loading && items.length === 0 ? (
            <div className="px-4 py-10 text-center text-sm text-muted-foreground">
              Loading…
            </div>
          ) : items.length === 0 ? (
            <div className="px-4 py-10 text-center text-sm text-muted-foreground space-y-2">
              <Inbox className="h-6 w-6 mx-auto opacity-60" />
              <div>You're all caught up.</div>
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {items.map((n) => {
                const Inner = (
                  <div className="flex gap-3">
                    <div
                      className={cn(
                        "mt-1 h-2 w-2 rounded-full shrink-0",
                        n.read_at ? "bg-transparent" : "bg-primary",
                      )}
                      aria-hidden
                    />
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium truncate">{n.title}</div>
                      {n.body && (
                        <div className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                          {n.body}
                        </div>
                      )}
                      <div className="text-[11px] text-muted-foreground mt-1">
                        {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                      </div>
                    </div>
                  </div>
                );
                const handleClick = () => {
                  markOneRead(n.id);
                  setOpen(false);
                };
                return (
                  <li key={n.id} className={cn(!n.read_at && "bg-muted/30")}>
                    {n.link ? (
                      <Link
                        to={n.link}
                        onClick={handleClick}
                        className="block px-4 py-3 hover:bg-muted/60"
                      >
                        {Inner}
                      </Link>
                    ) : (
                      <button
                        type="button"
                        onClick={handleClick}
                        className="w-full text-left px-4 py-3 hover:bg-muted/60"
                      >
                        {Inner}
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};
