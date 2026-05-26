import { Link, NavLink } from "react-router-dom";
import { Menu } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";

const links = [
  { to: "/", label: "Home" },
  { to: "/#features", label: "Features" },
  { to: "/pricing", label: "Pricing" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export const MarketingHeader = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur-lg">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <Logo />
          <nav className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === "/"}
                className={({ isActive }) =>
                  cn(
                    "px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    isActive && !l.to.includes("#")
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/40"
                  )
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="ghost" asChild className="hidden sm:inline-flex">
            <Link to="/login">Log in</Link>
          </Button>
          <Button asChild className="hidden sm:inline-flex shadow-glow">
            <Link to="/signup">Start free</Link>
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" aria-label="Menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px]">
              <div className="flex flex-col gap-1 mt-8">
                {links.map((l) => (
                  <NavLink
                    key={l.to}
                    to={l.to}
                    end={l.to === "/"}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        "px-3 py-3 text-base font-medium rounded-md",
                        isActive ? "bg-accent/40 text-foreground" : "text-muted-foreground"
                      )
                    }
                  >
                    {l.label}
                  </NavLink>
                ))}
                <div className="border-t border-border my-3" />
                <Button variant="outline" asChild>
                  <Link to="/login" onClick={() => setOpen(false)}>Log in</Link>
                </Button>
                <Button asChild className="mt-2">
                  <Link to="/signup" onClick={() => setOpen(false)}>Start free</Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};
