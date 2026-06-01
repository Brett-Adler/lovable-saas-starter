// Single source of truth for public site navigation.
// Used by the footer, the human sitemap page, and the home explore strip.

export interface PublicRoute {
  to: string;
  label: string;
}

export interface PublicGroup {
  title: string;
  links: PublicRoute[];
}

export const publicNavGroups: PublicGroup[] = [
  {
    title: "Product",
    links: [
      { to: "/features", label: "Features" },
      { to: "/pricing", label: "Pricing" },
      { to: "/integrations", label: "Integrations" },
      { to: "/compare", label: "Compare" },
      { to: "/demo", label: "Request demo" },
    ],
  },
  {
    title: "Company",
    links: [
      { to: "/about", label: "About" },
      { to: "/customers", label: "Customers" },
      { to: "/blog", label: "Blog" },
      { to: "/contact", label: "Contact" },
      { to: "/newsletter", label: "Newsletter" },
    ],
  },
  {
    title: "Resources",
    links: [
      { to: "/docs", label: "Docs" },
      { to: "/launch", label: "Launch checklist" },
      { to: "/roadmap", label: "Roadmap" },
      { to: "/changelog", label: "Changelog" },
      { to: "/readme", label: "Setup guide" },
      { to: "/use-template/lovable", label: "Use on Lovable" },
      { to: "/use-template/github", label: "Use on GitHub" },
      { to: "/status", label: "System status" },
      { to: "/security", label: "Security" },
      { to: "/sitemap", label: "Sitemap" },
    ],
  },
  {
    title: "Legal",
    links: [
      { to: "/privacy", label: "Privacy Policy" },
      { to: "/terms", label: "Terms of Service" },
      { to: "/cookies", label: "Cookie Policy" },
      { to: "/accessibility", label: "Accessibility" },
    ],
  },
  {
    title: "Account",
    links: [
      { to: "/login", label: "Log in" },
      { to: "/signup", label: "Sign up" },
      { to: "/waitlist", label: "Join waitlist" },
    ],
  },
];
