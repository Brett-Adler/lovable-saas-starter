import { Link } from "react-router-dom";
import { Twitter, Github, Linkedin, Instagram, Youtube, Facebook } from "lucide-react";
import { Logo } from "@/components/Logo";
import { NewsletterForm } from "@/components/marketing/NewsletterForm";
import { publicNavGroups } from "@/lib/public-routes";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const TikTokIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
    <path d="M19.6 6.7a5.4 5.4 0 0 1-3.2-1.1V15a5.6 5.6 0 1 1-5.6-5.6c.3 0 .6 0 .9.1v2.8a2.8 2.8 0 1 0 1.9 2.7V2h2.7a5.4 5.4 0 0 0 3.3 4.7v0Z" />
  </svg>
);

const socialLinks = (s: ReturnType<typeof useSiteSettings>["data"]) => [
  { url: s?.social_twitter, Icon: Twitter, label: "Twitter / X" },
  { url: s?.social_github, Icon: Github, label: "GitHub" },
  { url: s?.social_linkedin, Icon: Linkedin, label: "LinkedIn" },
  { url: s?.social_instagram, Icon: Instagram, label: "Instagram" },
  { url: s?.social_youtube, Icon: Youtube, label: "YouTube" },
  { url: s?.social_facebook, Icon: Facebook, label: "Facebook" },
  { url: s?.social_tiktok, Icon: TikTokIcon, label: "TikTok" },
];

export const MarketingFooter = () => {
  const { data: settings } = useSiteSettings();
  const socials = socialLinks(settings).filter((s) => s.url);

  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-6">
          <div className="lg:col-span-2">
            <Logo />
            <p className="mt-4 text-sm text-muted-foreground max-w-xs">
              The complete SaaS starter. Auth, payments, emails, teams, and analytics — ready to ship.
            </p>
            <div className="mt-6 max-w-sm">
              <p className="text-sm font-semibold mb-2">Get product updates</p>
              <NewsletterForm source="footer" compact />
            </div>
            {socials.length > 0 && (
              <div className="mt-6 flex items-center gap-3">
                {socials.map(({ url, Icon, label }) => (
                  <a
                    key={label}
                    href={url!}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="h-9 w-9 inline-flex items-center justify-center rounded-md border border-border text-muted-foreground hover:text-foreground hover:bg-accent/40 transition-colors"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            )}
          </div>
          {publicNavGroups.map((g) => (
            <div key={g.title}>
              <h3 className="text-sm font-semibold mb-3">{g.title}</h3>
              <ul className="space-y-2">
                {g.links.map((l) =>
                  l.to.startsWith("/#") ? (
                    <li key={l.to}>
                      <a href={l.to} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                        {l.label}
                      </a>
                    </li>
                  ) : (
                    <li key={l.to}>
                      <Link to={l.to} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                        {l.label}
                      </Link>
                    </li>
                  ),
                )}
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
