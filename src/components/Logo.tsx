import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  variant?: "full" | "mark";
  dark?: boolean;
}

export const Logo = ({ className, variant = "full", dark = false }: LogoProps) => {
  const src = variant === "mark" ? "/logo-mark.svg" : dark ? "/logo-dark.svg" : "/logo.svg";
  return (
    <Link to="/" className={cn("inline-flex items-center", className)} aria-label="SaaS Starter — Home">
      <img
        src={src}
        alt="SaaS Starter"
        height={variant === "mark" ? 32 : 36}
        width={variant === "mark" ? 32 : 160}
        className={variant === "mark" ? "h-8 w-8" : "h-9 w-auto"}
      />
    </Link>
  );
};
