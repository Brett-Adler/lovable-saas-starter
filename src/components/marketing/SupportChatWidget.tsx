import { useEffect, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { MessageCircle, X, Send, Loader2, Sparkles, RefreshCw } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "support-chat:messages-v1";
const PROJECT_ID = import.meta.env.VITE_SUPABASE_PROJECT_ID;
const ENDPOINT = `https://${PROJECT_ID}.supabase.co/functions/v1/support-chat`;

const SUGGESTIONS = [
  "What's included out of the box?",
  "How does pricing work?",
  "Do you support SSO?",
  "Is there a self-hosted option?",
];

export const SupportChatWidget = () => {
  const [open, setOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [input, setInput] = useState("");

  const [initialMessages] = useState<UIMessage[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as UIMessage[]) : [];
    } catch {
      return [];
    }
  });

  const transport = useRef(new DefaultChatTransport({ api: ENDPOINT })).current;

  const { messages, sendMessage, status, setMessages, error } = useChat({
    id: "support-chat",
    messages: initialMessages,
    transport,
    onError: (err) => {
      const msg = err instanceof Error ? err.message : String(err);
      toast.error(msg.includes("limit") ? msg : "Chat error — please try again.");
    },
  });

  // Persist to localStorage on every update
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      // ignore quota
    }
  }, [messages]);

  // Autoscroll
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, status]);

  // Focus on open
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  const busy = status === "submitted" || status === "streaming";

  const submit = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || busy) return;
    setInput("");
    void sendMessage({ text: trimmed });
  };

  const onKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit(input);
    }
  };

  const reset = () => {
    setMessages([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  const renderText = (m: UIMessage) =>
    m.parts.map((p, i) => (p.type === "text" ? <span key={i}>{p.text}</span> : null));

  const renderMarkdown = (m: UIMessage) => {
    const text = m.parts.map((p) => (p.type === "text" ? p.text : "")).join("");
    return (
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: (props) => (
            <a {...props} className="underline underline-offset-2 hover:text-primary" target={props.href?.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" />
          ),
          code: ({ children }) => (
            <code className="rounded bg-muted px-1 py-0.5 text-[0.85em]">{children}</code>
          ),
          ul: (props) => <ul {...props} className="list-disc pl-5 space-y-1" />,
          ol: (props) => <ol {...props} className="list-decimal pl-5 space-y-1" />,
          p: (props) => <p {...props} className="mb-2 last:mb-0" />,
        }}
      >
        {text}
      </ReactMarkdown>
    );
  };

  return (
    <>
      {/* Launcher */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Open support chat"
          className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-primary text-primary-foreground shadow-glow shadow-lg px-4 py-3 text-sm font-medium hover:scale-105 transition-transform"
        >
          <MessageCircle className="h-4 w-4" />
          Ask AI
        </button>
      )}

      {/* Panel */}
      {open && (
        <div
          role="dialog"
          aria-label="AI support chat"
          className={cn(
            "fixed z-50 bg-card border border-border shadow-2xl flex flex-col",
            "inset-x-3 bottom-3 top-20 rounded-xl",
            "sm:inset-auto sm:bottom-5 sm:right-5 sm:top-auto sm:w-[380px] sm:h-[560px] sm:rounded-2xl",
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-semibold leading-tight">AI assistant</p>
                <p className="text-[11px] text-muted-foreground">Answers about this product</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {messages.length > 0 && (
                <Button variant="ghost" size="icon" onClick={reset} aria-label="New chat" className="h-8 w-8">
                  <RefreshCw className="h-3.5 w-3.5" />
                </Button>
              )}
              <Button variant="ghost" size="icon" onClick={() => setOpen(false)} aria-label="Close chat" className="h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
            {messages.length === 0 && (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Hi! I can answer questions about features, pricing, integrations, and setup. What would you like to know?
                </p>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => submit(s)}
                      className="text-xs px-3 py-1.5 rounded-full border border-border bg-muted/40 hover:bg-muted transition-colors text-left"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m) =>
              m.role === "user" ? (
                <div key={m.id} className="flex justify-end">
                  <div className="max-w-[85%] rounded-2xl rounded-br-sm bg-primary text-primary-foreground px-3.5 py-2 text-sm whitespace-pre-wrap break-words">
                    {renderText(m)}
                  </div>
                </div>
              ) : (
                <div key={m.id} className="flex">
                  <div className="max-w-[90%] text-sm text-foreground/90 leading-relaxed">
                    {renderMarkdown(m)}
                  </div>
                </div>
              ),
            )}

            {status === "submitted" && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Thinking…
              </div>
            )}

            {error && messages.length === 0 && (
              <p className="text-xs text-destructive">{error.message}</p>
            )}
          </div>

          {/* Composer */}
          <div className="border-t border-border p-3">
            <div className="relative">
              <Textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKey}
                placeholder="Ask anything…"
                rows={1}
                className="resize-none min-h-[44px] max-h-32 pr-11 text-sm"
                disabled={busy}
              />
              <Button
                size="icon"
                onClick={() => submit(input)}
                disabled={busy || !input.trim()}
                className="absolute right-1.5 bottom-1.5 h-8 w-8"
                aria-label="Send"
              >
                {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
              </Button>
            </div>
            <p className="text-[10px] text-muted-foreground mt-2 text-center">
              AI can make mistakes. Free preview — limited to 15 messages/day.
            </p>
          </div>
        </div>
      )}
    </>
  );
};
