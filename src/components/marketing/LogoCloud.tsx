import { BrandIcon } from "./BrandIcon";
import { brandIcons, type BrandSlug } from "@/lib/brand/icons";
import { cn } from "@/lib/utils";

export interface LogoCloudItem {
  slug: BrandSlug | string;
  /** Override label. */
  label?: string;
  /** Override URL. If omitted, uses the brand's canonical url. */
  href?: string;
}

interface LogoCloudProps {
  items: LogoCloudItem[];
  /** Caption above the row. */
  caption?: string;
  /** Show text label next to each icon. */
  showLabels?: boolean;
  /** Use brand colors instead of muted foreground. */
  colored?: boolean;
  className?: string;
  iconSize?: number;
}

export const LogoCloud = ({
  items,
  caption,
  showLabels = false,
  colored = false,
  className,
  iconSize = 28,
}: LogoCloudProps) => (
  <div className={cn("w-full", className)}>
    {caption && (
      <p className="text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-6">
        {caption}
      </p>
    )}
    <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-5">
      {items.map((item) => {
        const def = (brandIcons as Record<string, typeof brandIcons[BrandSlug] | undefined>)[item.slug];
        const href = item.href ?? def?.url;
        const label = item.label ?? def?.label ?? String(item.slug);
        const content = (
          <span
            className={cn(
              "inline-flex items-center gap-2 transition-opacity",
              colored ? "" : "text-muted-foreground hover:text-foreground",
              !colored && "opacity-70 hover:opacity-100",
            )}
          >
            <BrandIcon slug={item.slug} size={iconSize} colored={colored} label={label} />
            {showLabels && <span className="font-semibold text-sm">{label}</span>}
          </span>
        );
        return (
          <li key={String(item.slug)}>
            {href ? (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer external"
                aria-label={`${label} — opens in new tab`}
              >
                {content}
              </a>
            ) : (
              content
            )}
          </li>
        );
      })}
    </ul>
  </div>
);
