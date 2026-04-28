import { Link } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { NewsletterForm } from "@/components/marketing/NewsletterForm";

const groups = [
  {
    title: "Product",
    links: [
      { to: "/", label: "Features" },
      { to: "/pricing", label: "Pricing" },
      { to: "/demo", label: "Request demo" },
      { to: "/waitlist", label: "Join waitlist" },
    ],
  },
  {
    title: "Company",
    links: [
      { to: "/about", label: "About" },
      { to: "/contact", label: "Contact" },
      { to: "/newsletter", label: "Newsletter" },
    ],
  },
  {
    title: "Legal",
    links: [
      { to: "/privacy", label: "Privacy" },
      { to: "/terms", label: "Terms" },
    ],
  },
];

export const MarketingFooter = () => {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Logo />
            <p className="mt-4 text-sm text-muted-foreground max-w-xs">
              The complete SaaS starter. Auth, payments, emails, teams, and analytics — ready to ship.
            </p>
            <div className="mt-6 max-w-sm">
              <p className="text-sm font-semibold mb-2">Get product updates</p>
              <NewsletterForm source="footer" compact />
            </div>
          </div>
          {groups.map((g) => (
            <div key={g.title}>
              <h3 className="text-sm font-semibold mb-3">{g.title}</h3>
              <ul className="space-y-2">
                {g.links.map((l) => (
                  <li key={l.to}>
                    <Link to={l.to} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} SaaS Starter. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Built with <span className="text-gradient font-semibold">Lovable</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
