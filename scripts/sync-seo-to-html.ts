// Runs before `vite dev` and `vite build` (predev/prebuild hooks).
// Fetches site_seo + seo_pages from Supabase and:
//  1. Rewrites the SEO block in index.html (idempotent via <!-- seo:start/end --> markers)
//  2. Writes public/llms.txt
//  3. Regenerates public/sitemap.xml (merges static route list with per-route noindex + lastmod from seo_pages)
//
// All Supabase calls are optional — if the fetch fails (offline, missing env), the script logs and
// leaves the existing files unchanged so dev still works.

import { readFileSync, writeFileSync, existsSync } from "fs";
import { resolve } from "path";

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || "";

// When unset, fall back to the project's published Lovable URL so sitemap <loc> entries are absolute.
const FALLBACK_BASE = (
  process.env.PUBLIC_SITE_URL ??
  process.env.VITE_PUBLIC_SITE_URL ??
  "https://lovable-saas-starter.lovable.app"
).replace(/\/$/, "");

// Static public-route allow-list. Keep in sync with src/App.tsx public routes.
const PUBLIC_ROUTES: Array<{
  path: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
  llmsLabel?: string;
  llmsDesc?: string;
}> = [
  { path: "/", changefreq: "weekly", priority: "1.0", llmsLabel: "Home", llmsDesc: "Product overview." },
  { path: "/pricing", changefreq: "monthly", priority: "0.9", llmsLabel: "Pricing", llmsDesc: "Plans and pricing." },
  { path: "/about", changefreq: "monthly", priority: "0.7", llmsLabel: "About", llmsDesc: "About the product." },
  { path: "/contact", changefreq: "monthly", priority: "0.7", llmsLabel: "Contact", llmsDesc: "Get in touch." },
  { path: "/demo", changefreq: "monthly", priority: "0.6", llmsLabel: "Demo", llmsDesc: "Book a demo." },
  { path: "/waitlist", changefreq: "monthly", priority: "0.6", llmsLabel: "Waitlist", llmsDesc: "Join the waitlist." },
  { path: "/newsletter", changefreq: "monthly", priority: "0.6", llmsLabel: "Newsletter", llmsDesc: "Subscribe to updates." },
  { path: "/docs", changefreq: "monthly", priority: "0.7", llmsLabel: "Docs", llmsDesc: "Setup and customization guide." },
  { path: "/readme", changefreq: "monthly", priority: "0.5", llmsLabel: "Readme", llmsDesc: "Project overview and roadmap." },
  { path: "/launch", changefreq: "monthly", priority: "0.6", llmsLabel: "Launch checklist", llmsDesc: "Pre-launch credential checklist." },
  { path: "/roadmap", changefreq: "monthly", priority: "0.5", llmsLabel: "Roadmap", llmsDesc: "Upcoming features." },
  { path: "/integrations", changefreq: "monthly", priority: "0.6", llmsLabel: "Integrations", llmsDesc: "Available integrations." },
  { path: "/compare", changefreq: "monthly", priority: "0.6", llmsLabel: "Compare", llmsDesc: "Compare with alternatives." },
  { path: "/customers", changefreq: "monthly", priority: "0.6", llmsLabel: "Customers", llmsDesc: "Customer stories." },
  { path: "/blog", changefreq: "weekly", priority: "0.7", llmsLabel: "Blog", llmsDesc: "Engineering and product notes." },
  { path: "/checkout/return", changefreq: "yearly", priority: "0.2" },
  { path: "/unsubscribe", changefreq: "yearly", priority: "0.2" },
  { path: "/newsletter/confirm", changefreq: "yearly", priority: "0.2" },
  { path: "/security", changefreq: "monthly", priority: "0.5", llmsLabel: "Security", llmsDesc: "Security posture and controls." },
  { path: "/status", changefreq: "weekly", priority: "0.4", llmsLabel: "Status", llmsDesc: "System health and incidents." },
  { path: "/use-template/lovable", changefreq: "monthly", priority: "0.6", llmsLabel: "Use on Lovable", llmsDesc: "Step-by-step remix guide." },
  { path: "/use-template/github", changefreq: "monthly", priority: "0.6", llmsLabel: "Use on GitHub", llmsDesc: "Local clone-and-sync guide." },
  { path: "/login", changefreq: "yearly", priority: "0.2" },
  { path: "/changelog", changefreq: "weekly", priority: "0.6", llmsLabel: "Changelog", llmsDesc: "Recent product updates." },
  { path: "/sitemap", changefreq: "monthly", priority: "0.3" },
  { path: "/privacy", changefreq: "yearly", priority: "0.3", llmsLabel: "Privacy Policy", llmsDesc: "Privacy practices." },
  { path: "/terms", changefreq: "yearly", priority: "0.3", llmsLabel: "Terms of Service", llmsDesc: "Terms of service." },
  { path: "/cookies", changefreq: "yearly", priority: "0.3", llmsLabel: "Cookie Policy", llmsDesc: "Cookie usage." },
  { path: "/accessibility", changefreq: "yearly", priority: "0.3", llmsLabel: "Accessibility", llmsDesc: "Accessibility statement." },
];

interface SiteSeo {
  site_name: string | null;
  default_title: string | null;
  default_description: string | null;
  default_og_image_url: string | null;
  twitter_handle: string | null;
  theme_color: string | null;
  base_url: string | null;
  organization_json_ld: Record<string, unknown> | null;
}

interface SeoPage {
  path: string;
  title: string | null;
  description: string | null;
  noindex: boolean;
  updated_at: string;
}

interface BlogPostSitemapRow {
  slug: string;
  updated_at: string;
  published_at: string | null;
}

async function fetchJson<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
    });
    if (!res.ok) {
      console.warn(`[sync-seo] ${path} → ${res.status}`);
      return null;
    }
    return (await res.json()) as T;
  } catch (e) {
    console.warn(`[sync-seo] fetch failed:`, (e as Error).message);
    return null;
  }
}

function escape(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function rewriteIndexHtml(seo: SiteSeo, base: string) {
  const indexPath = resolve("index.html");
  if (!existsSync(indexPath)) {
    console.warn("[sync-seo] index.html not found; skipping HTML rewrite");
    return;
  }
  const html = readFileSync(indexPath, "utf8");

  const title = seo.default_title || "";
  const description = seo.default_description || "";
  const ogImage = seo.default_og_image_url || `${base}/og-image.png`;
  const twitter = seo.twitter_handle || "";
  const themeColor = seo.theme_color || "#FF5C2A";
  const siteName = seo.site_name || "";
  const orgLd = seo.organization_json_ld && Object.keys(seo.organization_json_ld).length > 0
    ? seo.organization_json_ld
    : { "@context": "https://schema.org", "@type": "Organization", name: siteName, url: base };
  const websiteLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    url: base,
  };

  const block = [
    `<!-- seo:start (managed by scripts/sync-seo-to-html.ts) -->`,
    `<title>${escape(title)}</title>`,
    `<meta name="title" content="${escape(title)}" />`,
    `<meta name="description" content="${escape(description)}" />`,
    `<meta name="theme-color" content="${escape(themeColor)}" />`,
    // Canonical + per-route og:title / og:description / og:url / twitter:* are emitted
    // by react-helmet-async (see src/components/seo/PageSeo.tsx). Keeping only sitewide
    // identity tags here so social crawlers don't see homepage metadata on every route.
    `<meta property="og:type" content="website" />`,
    `<meta property="og:image" content="${escape(ogImage)}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    siteName ? `<meta property="og:site_name" content="${escape(siteName)}" />` : "",
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:image" content="${escape(ogImage)}" />`,
    twitter ? `<meta name="twitter:creator" content="${escape(twitter)}" />` : "",
    `<script type="application/ld+json">${JSON.stringify(orgLd)}</script>`,
    `<script type="application/ld+json">${JSON.stringify(websiteLd)}</script>`,
    `<!-- seo:end -->`,
  ]
    .filter(Boolean)
    .join("\n    ");

  const markerRegex = /<!-- seo:start[\s\S]*?<!-- seo:end -->/;
  let next: string;
  if (markerRegex.test(html)) {
    next = html.replace(markerRegex, block);
  } else {
    // First-time injection: insert before </head>
    next = html.replace(/<\/head>/i, `    ${block}\n  </head>`);
  }
  writeFileSync(indexPath, next);
  console.log(`[sync-seo] index.html rewritten`);
}

function writeLlmsTxt(seo: SiteSeo, pages: SeoPage[], base: string) {
  const siteName = seo.site_name || "Project";
  const summary = seo.default_description || "";
  const blocked = new Set(pages.filter((p) => p.noindex).map((p) => p.path));
  const indexable = PUBLIC_ROUTES.filter((r) => r.llmsLabel && !blocked.has(r.path));

  const lines = [
    `# ${siteName}`,
    "",
    summary ? `> ${summary}` : "",
    "",
    "## Pages",
    "",
    ...indexable.map((r) => `- [${r.llmsLabel}](${r.path}): ${r.llmsDesc ?? ""}`),
    "",
  ].filter((l, i, a) => !(l === "" && a[i - 1] === ""));

  writeFileSync(resolve("public/llms.txt"), lines.join("\n"));
  console.log(`[sync-seo] llms.txt written (${indexable.length} pages)`);
}

function writeSitemap(pages: SeoPage[], blogPosts: BlogPostSitemapRow[], base: string) {
  const blocked = new Set(pages.filter((p) => p.noindex).map((p) => p.path));
  const lastmodMap = new Map(pages.map((p) => [p.path, p.updated_at]));

  const blogEntries = blogPosts.map((post) => ({
    path: `/blog/${post.slug}`,
    lastmod: post.updated_at || post.published_at || undefined,
    changefreq: "monthly" as const,
    priority: "0.6",
  }));
  const entries = [...PUBLIC_ROUTES.filter((r) => !blocked.has(r.path)), ...blogEntries.filter((r) => !blocked.has(r.path))];

  const urls = entries.map((e) => {
    const lastmod = "lastmod" in e ? e.lastmod : lastmodMap.get(e.path);
    return [
      `  <url>`,
      `    <loc>${base}${e.path}</loc>`,
      lastmod ? `    <lastmod>${lastmod.split("T")[0]}</lastmod>` : null,
      e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
      e.priority ? `    <priority>${e.priority}</priority>` : null,
      `  </url>`,
    ]
      .filter(Boolean)
      .join("\n");
  });

  const xml = [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    ...urls,
    `</urlset>`,
  ].join("\n");

  writeFileSync(resolve("public/sitemap.xml"), xml);
  console.log(`[sync-seo] sitemap.xml written (${entries.length} entries)`);
}

async function main() {
  const seoRows = await fetchJson<SiteSeo[]>("site_seo?select=*&id=eq.1");
  const pagesRows = (await fetchJson<SeoPage[]>("seo_pages?select=path,title,description,noindex,updated_at")) ?? [];
  const blogPostRows =
    (await fetchJson<BlogPostSitemapRow[]>(
      `blog_posts?select=slug,updated_at,published_at&status=eq.published&published_at=not.is.null&published_at=lte.${encodeURIComponent(new Date().toISOString())}`,
    )) ?? [];

  const seo: SiteSeo = (seoRows && seoRows[0]) || {
    site_name: "Your App",
    default_title: "Your App",
    default_description: "",
    default_og_image_url: `${FALLBACK_BASE}/og-image.png`,
    twitter_handle: "",
    theme_color: "#FF5C2A",
    base_url: FALLBACK_BASE,
    organization_json_ld: null,
  };
  const base = (seo.base_url || FALLBACK_BASE).replace(/\/$/, "");

  rewriteIndexHtml(seo, base);
  writeLlmsTxt(seo, pagesRows, base);
  writeSitemap(pagesRows, blogPostRows, base);
}

main().catch((e) => {
  console.error("[sync-seo] fatal:", e);
  // Non-fatal — don't break dev
  process.exit(0);
});
