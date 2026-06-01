import { Helmet } from "react-helmet-async";
import { useSiteSeo, useSeoForPath } from "@/hooks/useSiteSeo";

interface PageSeoProps {
  /** Route path (e.g. "/pricing"). Used to look up per-route overrides and to build self-referential canonical/og:url. */
  path: string;
  /** Page-specific title (used when no DB override exists). Will be passed through site_seo.title_template. */
  title?: string;
  /** Page-specific description. */
  description?: string;
  /** Absolute og:image URL. */
  ogImage?: string;
  /** Force noindex (e.g. for auth/admin/dashboard pages). */
  noindex?: boolean;
  /** Extra JSON-LD payload to render. */
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}



function applyTemplate(template: string | null | undefined, value: string): string {
  if (!template || !template.includes("%s")) return value;
  return template.replace("%s", value);
}

function getDefaultBase(): string {
  const envBase = (import.meta.env.VITE_BASE_URL as string | undefined)?.trim();
  if (envBase) return envBase;
  if (typeof window !== "undefined" && window.location?.origin) return window.location.origin;
  return "";
}

export function PageSeo({ path, title, description, ogImage, noindex, jsonLd }: PageSeoProps) {
  const { data: siteSeo } = useSiteSeo();
  const pageOverride = useSeoForPath(path);

  const base = (siteSeo?.base_url || getDefaultBase()).replace(/\/$/, "");
  const isHome = path === "/";
  const isArticle = path.startsWith("/blog/") && path !== "/blog";

  const rawTitle = pageOverride?.title ?? title ?? siteSeo?.default_title ?? "";
  const finalTitle = pageOverride?.title
    ? pageOverride.title
    : isHome
      ? rawTitle
      : title
        ? applyTemplate(siteSeo?.title_template, title)
        : rawTitle;

  const finalDescription = pageOverride?.description ?? description ?? siteSeo?.default_description ?? "";
  const finalOgImage = pageOverride?.og_image_url ?? ogImage ?? siteSeo?.default_og_image_url ?? "";
  const canonical = pageOverride?.canonical_override || `${base}${path}`;
  const shouldNoindex = noindex || pageOverride?.noindex === true;
  const twitter = siteSeo?.twitter_handle ?? undefined;

  const extraSchemas: Record<string, unknown>[] = [];
  if (pageOverride?.json_ld) extraSchemas.push(pageOverride.json_ld);
  if (jsonLd) {
    if (Array.isArray(jsonLd)) extraSchemas.push(...jsonLd);
    else extraSchemas.push(jsonLd);
  }

  const brand = (siteSeo?.brand_assets ?? {}) as Record<string, string>;
  const themeColor = siteSeo?.theme_color ?? undefined;

  return (
    <Helmet>
      {finalTitle ? <title>{finalTitle}</title> : null}
      {finalDescription ? <meta name="description" content={finalDescription} /> : null}
      {pageOverride?.keywords ? <meta name="keywords" content={pageOverride.keywords} /> : null}
      <link rel="canonical" href={canonical} />
      {shouldNoindex ? <meta name="robots" content="noindex, nofollow" /> : <meta name="robots" content="index, follow" />}

      {/* Brand-kit overrides (when an admin has published a kit). Override links so
          Helmet replaces, rather than appends to, the defaults in index.html. */}
      {themeColor ? <meta name="theme-color" content={themeColor} /> : null}
      {themeColor ? <meta name="msapplication-TileColor" content={themeColor} /> : null}
      {brand["favicon.ico"] ? <link rel="icon" type="image/x-icon" href={brand["favicon.ico"]} /> : null}
      {brand["logo.svg"] ? <link rel="icon" type="image/svg+xml" href={brand["logo.svg"]} /> : null}
      {brand["favicon-32x32.png"] ? <link rel="icon" type="image/png" sizes="32x32" href={brand["favicon-32x32.png"]} /> : null}
      {brand["favicon-16x16.png"] ? <link rel="icon" type="image/png" sizes="16x16" href={brand["favicon-16x16.png"]} /> : null}
      {brand["apple-touch-icon.png"] ? <link rel="apple-touch-icon" sizes="180x180" href={brand["apple-touch-icon.png"]} /> : null}
      {brand["android-chrome-192x192.png"] ? <link rel="icon" type="image/png" sizes="192x192" href={brand["android-chrome-192x192.png"]} /> : null}
      {brand["android-chrome-512x512.png"] ? <link rel="icon" type="image/png" sizes="512x512" href={brand["android-chrome-512x512.png"]} /> : null}
      {brand["safari-pinned-tab.svg"] ? <link rel="mask-icon" href={brand["safari-pinned-tab.svg"]} color={themeColor ?? "#000000"} /> : null}
      {brand["browserconfig.xml"] ? <link rel="msapplication-config" href={brand["browserconfig.xml"]} /> : null}
      {brand["site.webmanifest"] ? <link rel="manifest" href={brand["site.webmanifest"]} /> : null}

      {/* Open Graph */}
      <meta property="og:type" content={isHome ? "website" : "article"} />
      <meta property="og:url" content={canonical} />
      {finalTitle ? <meta property="og:title" content={finalTitle} /> : null}
      {finalDescription ? <meta property="og:description" content={finalDescription} /> : null}
      {finalOgImage ? <meta property="og:image" content={finalOgImage} /> : null}
      {siteSeo?.site_name ? <meta property="og:site_name" content={siteSeo.site_name} /> : null}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      {finalTitle ? <meta name="twitter:title" content={finalTitle} /> : null}
      {finalDescription ? <meta name="twitter:description" content={finalDescription} /> : null}
      {finalOgImage ? <meta name="twitter:image" content={finalOgImage} /> : null}
      <meta name="twitter:url" content={canonical} />
      {twitter ? <meta name="twitter:creator" content={twitter} /> : null}

      {extraSchemas.map((schema, i) => (
        <script key={i} type="application/ld+json">{JSON.stringify(schema)}</script>
      ))}
    </Helmet>
  );
}
