import { supabase } from "@/integrations/supabase/client";
import type { GeneratedAsset, BrandSpec } from "./generate";
import { buildManifest, buildBrowserConfig } from "./generate";

const BUCKET = "brand-assets";

export type BrandAssetUrls = Record<string, string>;

export async function uploadBrandKit(
  assets: GeneratedAsset[],
  spec: BrandSpec,
  onProgress?: (done: number, total: number, label: string) => void,
): Promise<BrandAssetUrls> {
  const version = `v${Date.now()}`;
  const urls: BrandAssetUrls = {};
  const all = [...assets];

  // Synthesize manifest + browserconfig after PNGs are uploaded so they can reference the public URLs.
  const total = all.length + 2;
  for (let i = 0; i < all.length; i++) {
    const a = all[i];
    onProgress?.(i, total, `Uploading ${a.filename}`);
    const path = `${version}/${a.filename}`;
    const { error } = await supabase.storage.from(BUCKET).upload(path, a.blob, {
      contentType: a.contentType,
      upsert: true,
      cacheControl: "31536000",
    });
    if (error) throw new Error(`Upload failed for ${a.filename}: ${error.message}`);
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    urls[a.filename] = data.publicUrl;
  }

  // Manifest
  onProgress?.(all.length, total, "Uploading site.webmanifest");
  const manifestBlob = buildManifest(spec, urls);
  const manifestPath = `${version}/site.webmanifest`;
  const { error: mErr } = await supabase.storage.from(BUCKET).upload(manifestPath, manifestBlob, {
    contentType: "application/manifest+json",
    upsert: true,
    cacheControl: "31536000",
  });
  if (mErr) throw new Error(`Upload failed for manifest: ${mErr.message}`);
  urls["site.webmanifest"] = supabase.storage.from(BUCKET).getPublicUrl(manifestPath).data.publicUrl;

  // browserconfig.xml
  onProgress?.(all.length + 1, total, "Uploading browserconfig.xml");
  const bcBlob = buildBrowserConfig(spec.themeColor, urls["mstile-150x150.png"] ?? "");
  const bcPath = `${version}/browserconfig.xml`;
  const { error: bErr } = await supabase.storage.from(BUCKET).upload(bcPath, bcBlob, {
    contentType: "application/xml",
    upsert: true,
    cacheControl: "31536000",
  });
  if (bErr) throw new Error(`Upload failed for browserconfig: ${bErr.message}`);
  urls["browserconfig.xml"] = supabase.storage.from(BUCKET).getPublicUrl(bcPath).data.publicUrl;

  onProgress?.(total, total, "Done");
  return urls;
}

export async function publishBrandKit(urls: BrandAssetUrls, spec: BrandSpec): Promise<void> {
  const payload = {
    id: 1,
    site_name: spec.appName || null,
    theme_color: spec.themeColor || null,
    background_color: spec.backgroundColor || null,
    default_og_image_url: urls["og-image.png"] ?? null,
    brand_assets: urls,
  };
  const { error } = await supabase
    .from("site_seo" as never)
    .upsert(payload as never, { onConflict: "id" });
  if (error) throw new Error(`Saving brand kit failed: ${error.message}`);
}
