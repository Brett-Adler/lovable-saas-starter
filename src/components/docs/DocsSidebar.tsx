import { NavLink } from "react-router-dom";
import { Audience, articlesByAudience, groupByCategory } from "@/data/docs";

interface Props {
  audience: Audience;
  activeSlug?: string;
}

export function DocsSidebar({ audience, activeSlug }: Props) {
  const groups = groupByCategory(articlesByAudience(audience));
  return (
    <nav aria-label="Docs navigation" className="text-sm">
      <div className="space-y-6">
        {groups.map(({ category, items }) => (
          <div key={category}>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              {category}
            </p>
            <ul className="space-y-0.5 border-l border-border">
              {items.map((a) => {
                const active = a.slug === activeSlug;
                return (
                  <li key={a.slug}>
                    <NavLink
                      to={`/docs/${audience}/${a.slug}`}
                      className={
                        "block -ml-px border-l-2 pl-3 py-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-r-sm " +
                        (active
                          ? "border-primary text-foreground font-medium"
                          : "border-transparent text-muted-foreground hover:text-foreground hover:border-foreground/30")
                      }
                    >
                      {a.title}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </nav>
  );
}
