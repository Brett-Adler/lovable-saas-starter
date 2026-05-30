import { brandIcons, type BrandSlug } from "@/lib/brand/icons";
import { cn } from "@/lib/utils";

interface BrandIconProps {
  slug: BrandSlug | string;
  /** Pixel size of the rendered SVG. Defaults to 20. */
  size?: number;
  /** If true, use the brand's official color. Otherwise inherits currentColor. */
  colored?: boolean;
  className?: string;
  /** Optional label override; defaults to brand's display name. */
  label?: string;
}

/**
 * Renders a known brand glyph. Unknown slugs fall back to a monogram tile.
 * Decorative by default — pair with a visible text label or external link.
 */
export const BrandIcon = ({ slug, size = 20, colored = false, className, label }: BrandIconProps) => {
  const def = (brandIcons as Record<string, typeof brandIcons[BrandSlug] | undefined>)[slug];
  const title = label ?? def?.label ?? String(slug);

  if (!def) {
    // Monogram fallback
    return (
      <span
        aria-label={`${title} logo`}
        className={cn(
          "inline-flex items-center justify-center rounded-md bg-muted text-muted-foreground font-semibold",
          className,
        )}
        style={{ width: size, height: size, fontSize: size * 0.5 }}
      >
        {title.slice(0, 1).toUpperCase()}
      </span>
    );
  }

  return (
    <svg
      role="img"
      aria-label={`${title} logo`}
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill={colored ? def.color : "currentColor"}
      className={cn("shrink-0", className)}
    >
      <title>{title}</title>
      <path d={def.path} />
    </svg>
  );
};
