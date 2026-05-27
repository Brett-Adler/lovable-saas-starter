import { useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { changelog, type ChangeType } from "@/data/changelog";
import { cn } from "@/lib/utils";

const TYPE_STYLES: Record<ChangeType, string> = {
  added: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  changed: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20",
  fixed: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  removed: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
  security: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
  deprecated: "bg-muted text-muted-foreground border-border",
};

const TYPE_LABEL: Record<ChangeType, string> = {
  added: "Added",
  changed: "Changed",
  fixed: "Fixed",
  removed: "Removed",
  security: "Security",
  deprecated: "Deprecated",
};

const formatDate = (iso: string) =>
  new Date(iso + "T00:00:00Z").toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });

const Changelog = () => {
  const sorted = [...changelog].sort((a, b) => (a.date < b.date ? 1 : -1));

  useEffect(() => {
    const prevTitle = document.title;
    document.title = "Changelog — Product updates";
    const meta = document.querySelector('meta[name="description"]');
    const prevDesc = meta?.getAttribute("content") ?? "";
    meta?.setAttribute(
      "content",
      "Notable product updates: new features, changes, fixes, and security improvements.",
    );
    return () => {
      document.title = prevTitle;
      meta?.setAttribute("content", prevDesc);
    };
  }, []);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Changelog",
    itemListElement: sorted.slice(0, 20).map((e, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: e.title,
      datePublished: e.date,
    })),
  };

  return (
    <MarketingLayout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="container py-20 md:py-28">
        <div className="max-w-3xl mx-auto">
          <Badge variant="outline" className="mb-4">Changelog</Badge>
          <h1 className="text-4xl md:text-5xl font-bold">What's new</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            New features, improvements, fixes, and security updates — in reverse chronological order.
          </p>

          <ol className="mt-14 relative border-l border-border space-y-12 pl-6">
            {sorted.map((entry) => (
              <li key={entry.date + entry.title} className="relative">
                <span
                  aria-hidden
                  className="absolute -left-[31px] top-1.5 h-3 w-3 rounded-full bg-primary ring-4 ring-background"
                />
                <div className="flex flex-wrap items-baseline gap-3">
                  <time
                    dateTime={entry.date}
                    className="text-sm font-medium text-muted-foreground tabular-nums"
                  >
                    {formatDate(entry.date)}
                  </time>
                  {entry.version && (
                    <Badge variant="secondary" className="font-mono text-[10px]">
                      {entry.version}
                    </Badge>
                  )}
                </div>
                <h2 className="mt-1 text-xl font-semibold">{entry.title}</h2>
                <ul className="mt-4 space-y-2">
                  {entry.changes.map((c, i) => (
                    <li key={i} className="flex gap-3">
                      <span
                        className={cn(
                          "shrink-0 inline-flex items-center h-5 px-2 rounded-md border text-[10px] font-medium uppercase tracking-wide",
                          TYPE_STYLES[c.type],
                        )}
                      >
                        {TYPE_LABEL[c.type]}
                      </span>
                      <span className="text-sm text-muted-foreground leading-5">{c.text}</span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </MarketingLayout>
  );
};

export default Changelog;
