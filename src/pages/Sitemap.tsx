import { Link } from "react-router-dom";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { Badge } from "@/components/ui/badge";
import { publicNavGroups } from "@/lib/public-routes";

const Sitemap = () => (
  <MarketingLayout>
    <section className="container py-20 md:py-28">
      <div className="max-w-4xl mx-auto">
        <Badge variant="outline" className="mb-4">Sitemap</Badge>
        <h1 className="text-4xl md:text-5xl font-bold">Every page on this site</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          A complete index of every public page. Looking for the XML version?{" "}
          <a href="/sitemap.xml" className="text-primary">/sitemap.xml</a>.
        </p>
        <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">Home</h2>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:text-primary">Home</Link></li>
            </ul>
          </div>
          {publicNavGroups.map((g) => (
            <div key={g.title}>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">{g.title}</h2>
              <ul className="space-y-2">
                {g.links.map((l) => (
                  <li key={l.to}>
                    {l.to.startsWith("/#") ? (
                      <a href={l.to} className="hover:text-primary">{l.label}</a>
                    ) : (
                      <Link to={l.to} className="hover:text-primary">{l.label}</Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  </MarketingLayout>
);

export default Sitemap;
