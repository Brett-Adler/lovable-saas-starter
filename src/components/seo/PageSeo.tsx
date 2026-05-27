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

const DEFAULT_BASE = "https://saas-starter-suite.lovable.app";

function applyTemplate(template: string | null | undefined, value: string): string {
  if (!template || !template.includes("%s")) return value;
  return template.replace("%s", value);
}

export function PageSeo({ path, title, description, ogImage, noindex, jsonLd }: PageSeoProps) {
  const { data: siteSeo } = useSiteSeo();
  const pageOverride = useSeoForPath(path);

  const base = (siteSeo?.base_url || DEFAULT_BASE).replace(/\/$/, "");
  const isHome = path === "/";

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

  return (
    <Helmet>
      {finalTitle ? <title>{finalTitle}</title> : null}
      {finalDescription ? <meta name="description" content={finalDescription} /> : null}
      {pageOverride?.keywords ? <meta name="keywords" content={pageOverride.keywords} /> : null}
      <link rel="canonical" href={canonical} />
      {shouldNoindex ? <meta name="robots" content="noindex, nofollow" /> : <meta name="robots" content="index, follow" />}

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
