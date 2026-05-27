import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useSiteSeo } from "@/hooks/useSiteSeo";

interface LogoProps {
  className?: string;
  variant?: "full" | "mark";
  dark?: boolean;
}

export const Logo = ({ className, variant = "full", dark = false }: LogoProps) => {
  const { data: siteSeo } = useSiteSeo();
  const brand = siteSeo?.brand_assets ?? null;

  const fallback = variant === "mark" ? "/logo-mark.svg" : dark ? "/logo-dark.svg" : "/logo.svg";
  const override = brand
    ? variant === "mark"
      ? brand["logo-mark.png"] ?? brand["logo.svg"] ?? brand["logo.png"]
      : brand["logo.svg"] ?? brand["logo.png"]
    : undefined;
  const src = override ?? fallback;
  const alt = siteSeo?.site_name || "SaaS Starter";

  return (
    <Link to="/" className={cn("inline-flex items-center", className)} aria-label={`${alt} — Home`}>
      <img
        src={src}
        alt={alt}
        height={variant === "mark" ? 32 : 36}
        width={variant === "mark" ? 32 : 160}
        className={variant === "mark" ? "h-8 w-8 object-contain" : "h-9 w-auto object-contain"}
      />
    </Link>
  );
};
