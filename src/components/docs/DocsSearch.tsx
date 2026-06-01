import { useMemo, useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { docs, audienceById } from "@/data/docs";

interface Props {
  placeholder?: string;
}

export function DocsSearch({ placeholder = "Search docs..." }: Props) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const navigate = useNavigate();
  const rootRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return [];
    return docs
      .map((a) => {
        const hay = `${a.title} ${a.description} ${a.category} ${audienceById[a.audience].label}`.toLowerCase();
        const idx = hay.indexOf(needle);
        return { article: a, score: idx === -1 ? Infinity : idx };
      })
      .filter((r) => r.score !== Infinity)
      .sort((a, b) => a.score - b.score)
      .slice(0, 8)
      .map((r) => r.article);
  }, [q]);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  useEffect(() => setActive(0), [q]);

  const go = (i: number) => {
    const a = results[i];
    if (!a) return;
    navigate(`/docs/${a.audience}/${a.slug}`);
    setOpen(false);
    setQ("");
  };

  return (
    <div ref={rootRef} className="relative">
      <label className="sr-only" htmlFor="docs-search">Search documentation</label>
      <div className="relative">
        <Search aria-hidden="true" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          id="docs-search"
          type="search"
          value={q}
          placeholder={placeholder}
          onChange={(e) => { setQ(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") { e.preventDefault(); setActive((i) => Math.min(i + 1, results.length - 1)); }
            else if (e.key === "ArrowUp") { e.preventDefault(); setActive((i) => Math.max(i - 1, 0)); }
            else if (e.key === "Enter") { e.preventDefault(); go(active); }
            else if (e.key === "Escape") { setOpen(false); }
          }}
          className="w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        />
      </div>
      {open && q.trim() && (
        <div className="absolute z-20 mt-2 w-full rounded-md border border-border bg-popover shadow-lg overflow-hidden">
          {results.length === 0 ? (
            <p className="px-4 py-3 text-sm text-muted-foreground">No matches for "{q}".</p>
          ) : (
            <ul role="listbox">
              {results.map((a, i) => (
                <li key={`${a.audience}-${a.slug}`}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={i === active}
                    onMouseEnter={() => setActive(i)}
                    onClick={() => go(i)}
                    className={
                      "w-full text-left px-4 py-2.5 flex flex-col gap-0.5 transition-colors " +
                      (i === active ? "bg-accent" : "hover:bg-accent")
                    }
                  >
                    <span className="text-sm font-medium text-foreground">{a.title}</span>
                    <span className="text-xs text-muted-foreground">
                      {audienceById[a.audience].short} · {a.category}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
