import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft, Home, LifeBuoy, Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { PageSeo } from "@/components/seo/PageSeo";

const helpfulLinks = [
  { to: "/", label: "Home", description: "Back to the landing page" },
  { to: "/pricing", label: "Pricing", description: "Plans and what's included" },
  { to: "/contact", label: "Contact", description: "Talk to a human" },
  { to: "/login", label: "Sign in", description: "Access your account" },
];

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error("404: route not found:", location.pathname);
  }, [location.pathname]);

  return (
    <MarketingLayout>
      <section className="relative overflow-hidden">
        {/* Decorative mesh background */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{ background: "var(--gradient-mesh)" }}
        />
        {/* Floating blobs */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 -left-20 h-72 w-72 rounded-full opacity-30 blur-3xl"
          style={{ background: "var(--gradient-primary)" }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-24 -right-20 h-80 w-80 rounded-full opacity-25 blur-3xl"
          style={{ background: "var(--gradient-secondary)" }}
        />

        <div className="container mx-auto flex min-h-[80vh] max-w-4xl flex-col items-center justify-center px-4 py-20 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-4 py-1.5 text-sm font-medium text-muted-foreground shadow-sm backdrop-blur">
            <Sparkles className="h-4 w-4 text-accent" />
            Error 404 — Page not found
          </div>

          <h1
            className="mb-4 bg-clip-text text-7xl font-extrabold tracking-tight text-transparent sm:text-8xl md:text-9xl"
            style={{ backgroundImage: "var(--gradient-primary)", fontFamily: "Sora, Inter, sans-serif" }}
          >
            404
          </h1>

          <h2 className="mb-3 text-2xl font-bold sm:text-3xl">
            We can't find that page
          </h2>
          <p className="mb-2 max-w-xl text-base text-muted-foreground sm:text-lg">
            The link may be broken, or the page may have moved. Let's get you back on track.
          </p>
          <p className="mb-8 max-w-xl break-all rounded-lg bg-muted px-3 py-1.5 font-mono text-xs text-muted-foreground">
            {location.pathname}
          </p>

          <div className="mb-12 flex flex-col items-center gap-3 sm:flex-row">
            <Button size="lg" onClick={() => navigate(-1)} variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Go back
            </Button>
            <Button size="lg" asChild className="gap-2">
              <Link to="/">
                <Home className="h-4 w-4" />
                Take me home
              </Link>
            </Button>
            <Button size="lg" asChild variant="ghost" className="gap-2">
              <Link to="/contact">
                <LifeBuoy className="h-4 w-4" />
                Get help
              </Link>
            </Button>
          </div>

          {/* Helpful destinations */}
          <div className="w-full">
            <div className="mb-4 flex items-center justify-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              <Search className="h-4 w-4" />
              Popular destinations
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {helpfulLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="group rounded-xl border border-border bg-card/80 p-4 text-left shadow-sm backdrop-blur transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
                >
                  <div className="mb-1 font-semibold text-foreground group-hover:text-primary">
                    {link.label}
                  </div>
                  <div className="text-sm text-muted-foreground">{link.description}</div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
};

export default NotFound;
