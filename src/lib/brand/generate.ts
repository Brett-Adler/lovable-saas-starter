// Client-side brand-kit generator. Takes one source image (PNG/JPG/SVG) and
// produces every standard favicon, PWA icon, OG/Twitter card, and logo variant
// as PNG/SVG/ICO Blobs on a <canvas>. No network calls — pure rendering.

export type BrandSpec = {
  themeColor: string; // hex, e.g. "#FF5C2A"
  backgroundColor: string; // hex
  appName: string;
  safeAreaPct: number; // 0–25, padding inside square icons
};

export type GeneratedAsset = {
  filename: string;
  blob: Blob;
  width: number;
  height: number;
  contentType: string;
  category: "favicon" | "ios" | "android" | "windows" | "social" | "logo" | "manifest" | "splash";
  description: string;
};

const TRANSPARENT = "transparent";

/** Load arbitrary image (PNG/JPG/SVG/WebP) into an HTMLImageElement. */
export async function loadSource(file: File | Blob): Promise<{ image: HTMLImageElement; isSvg: boolean; rawText?: string }> {
  const isSvg = file.type === "image/svg+xml" || (file instanceof File && /\.svg$/i.test(file.name));
  let url: string;
  let rawText: string | undefined;
  if (isSvg) {
    rawText = await file.text();
    url = URL.createObjectURL(new Blob([rawText], { type: "image/svg+xml" }));
  } else {
    url = URL.createObjectURL(file);
  }
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(new Error(`Could not decode image: ${String(e)}`));
    img.src = url;
  });
  return { image, isSvg, rawText };
}

function makeCanvas(w: number, h: number): { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D } {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d", { alpha: true })!;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  return { canvas, ctx };
}

function fitContain(srcW: number, srcH: number, boxW: number, boxH: number) {
  const r = Math.min(boxW / srcW, boxH / srcH);
  const w = srcW * r;
  const h = srcH * r;
  return { w, h, x: (boxW - w) / 2, y: (boxH - h) / 2 };
}

async function canvasToBlob(canvas: HTMLCanvasElement, type = "image/png", quality?: number): Promise<Blob> {
  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("toBlob failed"))), type, quality),
  );
}

/** Square icon: optional background fill, source centered with safe-area padding. */
async function renderSquare(
  source: HTMLImageElement,
  size: number,
  bg: string | typeof TRANSPARENT,
  safeAreaPct: number,
  filename: string,
  category: GeneratedAsset["category"],
  description: string,
): Promise<GeneratedAsset> {
  const { canvas, ctx } = makeCanvas(size, size);
  if (bg !== TRANSPARENT) {
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, size, size);
  }
  const inner = size * (1 - (safeAreaPct / 100) * 2);
  const fit = fitContain(source.naturalWidth, source.naturalHeight, inner, inner);
  ctx.drawImage(source, (size - inner) / 2 + fit.x, (size - inner) / 2 + fit.y, fit.w, fit.h);
  const blob = await canvasToBlob(canvas, "image/png");
  return { filename, blob, width: size, height: size, contentType: "image/png", category, description };
}

/** Rectangular social card: themed background, centered logo (~40% height), app name below. */
async function renderSocialCard(
  source: HTMLImageElement,
  w: number,
  h: number,
  bg: string,
  themeColor: string,
  appName: string,
  filename: string,
  description: string,
): Promise<GeneratedAsset> {
  const { canvas, ctx } = makeCanvas(w, h);
  // Background with subtle radial accent in theme color
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);
  const grad = ctx.createRadialGradient(w * 0.7, h * 0.3, 0, w * 0.7, h * 0.3, Math.max(w, h) * 0.7);
  grad.addColorStop(0, hexWithAlpha(themeColor, 0.25));
  grad.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // Logo
  const logoH = h * 0.42;
  const fit = fitContain(source.naturalWidth, source.naturalHeight, w * 0.6, logoH);
  ctx.drawImage(source, (w - fit.w) / 2, h * 0.22, fit.w, fit.h);

  // App name
  if (appName) {
    ctx.fillStyle = textColorOn(bg);
    const fontSize = Math.round(h * 0.07);
    ctx.font = `600 ${fontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Inter, system-ui, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(appName, w / 2, h * 0.78);
  }

  const blob = await canvasToBlob(canvas, "image/png");
  return { filename, blob, width: w, height: h, contentType: "image/png", category: "social", description };
}

/** Splash 1024×1024 with centered mark. */
async function renderSplash(
  source: HTMLImageElement,
  bg: string,
  filename: string,
  description: string,
): Promise<GeneratedAsset> {
  return renderSquare(source, 1024, bg, 30, filename, "splash", description);
}

/** Build a multi-size PNG-embedded ICO from canvases at 16, 32, 48. */
async function buildIco(source: HTMLImageElement, safeAreaPct: number): Promise<Blob> {
  const sizes = [16, 32, 48];
  const pngs: Uint8Array[] = [];
  for (const s of sizes) {
    const asset = await renderSquare(source, s, TRANSPARENT, safeAreaPct, `f-${s}.png`, "favicon", "");
    pngs.push(new Uint8Array(await asset.blob.arrayBuffer()));
  }
  // ICONDIR (6) + ICONDIRENTRY (16) * n + image data
  const headerSize = 6 + 16 * sizes.length;
  const totalSize = headerSize + pngs.reduce((acc, p) => acc + p.byteLength, 0);
  const out = new Uint8Array(totalSize);
  const view = new DataView(out.buffer);
  // ICONDIR: reserved(2)=0, type(2)=1, count(2)=n
  view.setUint16(0, 0, true);
  view.setUint16(2, 1, true);
  view.setUint16(4, sizes.length, true);
  let offset = headerSize;
  for (let i = 0; i < sizes.length; i++) {
    const s = sizes[i];
    const png = pngs[i];
    const entryOff = 6 + i * 16;
    out[entryOff + 0] = s === 256 ? 0 : s; // width
    out[entryOff + 1] = s === 256 ? 0 : s; // height
    out[entryOff + 2] = 0; // colors
    out[entryOff + 3] = 0; // reserved
    view.setUint16(entryOff + 4, 1, true); // planes
    view.setUint16(entryOff + 6, 32, true); // bpp
    view.setUint32(entryOff + 8, png.byteLength, true);
    view.setUint32(entryOff + 12, offset, true);
    out.set(png, offset);
    offset += png.byteLength;
  }
  return new Blob([out], { type: "image/x-icon" });
}

function hexWithAlpha(hex: string, alpha: number): string {
  const h = hex.replace("#", "");
  const bigint = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r},${g},${b},${alpha})`;
}

function textColorOn(bg: string): string {
  const h = bg.replace("#", "");
  if (h.length < 6) return "#fff";
  const bigint = parseInt(h, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  const luma = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luma > 0.6 ? "#0a0a0a" : "#ffffff";
}

/** Generate every brand asset. Calls `onProgress(done, total, label)` as it goes. */
export async function generateAll(
  source: HTMLImageElement,
  spec: BrandSpec,
  svgSource: string | undefined,
  onProgress?: (done: number, total: number, label: string) => void,
): Promise<GeneratedAsset[]> {
  const results: GeneratedAsset[] = [];
  const safeArea = spec.safeAreaPct;
  const bg = spec.backgroundColor || "#ffffff";

  const tasks: Array<{ label: string; run: () => Promise<GeneratedAsset> }> = [
    { label: "favicon-16", run: () => renderSquare(source, 16, TRANSPARENT, safeArea, "favicon-16x16.png", "favicon", "Browser tab (small)") },
    { label: "favicon-32", run: () => renderSquare(source, 32, TRANSPARENT, safeArea, "favicon-32x32.png", "favicon", "Browser tab (retina)") },
    { label: "favicon-48", run: () => renderSquare(source, 48, TRANSPARENT, safeArea, "favicon-48x48.png", "favicon", "Bookmarks bar") },
    { label: "apple-touch-icon", run: () => renderSquare(source, 180, bg, safeArea, "apple-touch-icon.png", "ios", "iOS home screen (180×180)") },
    { label: "android-chrome-192", run: () => renderSquare(source, 192, TRANSPARENT, safeArea, "android-chrome-192x192.png", "android", "Android home screen") },
    { label: "android-chrome-512", run: () => renderSquare(source, 512, TRANSPARENT, safeArea, "android-chrome-512x512.png", "android", "Android home screen (XHDPI)") },
    { label: "maskable-512", run: () => renderSquare(source, 512, bg, 20, "maskable-icon-512x512.png", "android", "PWA maskable icon (Android adaptive)") },
    { label: "mstile-150", run: () => renderSquare(source, 150, bg, safeArea, "mstile-150x150.png", "windows", "Windows Start Menu tile") },
    { label: "logo-mark", run: () => renderSquare(source, 256, TRANSPARENT, 5, "logo-mark.png", "logo", "Square mark for navbar / sidebar") },
    { label: "og-image", run: () => renderSocialCard(source, 1200, 630, bg, spec.themeColor, spec.appName, "og-image.png", "Open Graph (Facebook, LinkedIn, Slack, iMessage)") },
    { label: "twitter-image", run: () => renderSocialCard(source, 1200, 600, bg, spec.themeColor, spec.appName, "twitter-image.png", "Twitter / X card") },
    { label: "og-square", run: () => renderSocialCard(source, 1200, 1200, bg, spec.themeColor, spec.appName, "og-square.png", "Square social (WhatsApp, Discord)") },
    { label: "splash-light", run: () => renderSplash(source, "#ffffff", "splash-light-1024.png", "Splash on light background") },
    { label: "splash-dark", run: () => renderSplash(source, "#0a0a0a", "splash-dark-1024.png", "Splash on dark background") },
  ];

  const total = tasks.length + 2; // +ico, +manifest (+svg optional)
  for (let i = 0; i < tasks.length; i++) {
    onProgress?.(i, total, tasks[i].label);
    results.push(await tasks[i].run());
  }

  onProgress?.(tasks.length, total, "favicon.ico");
  const icoBlob = await buildIco(source, safeArea);
  results.push({
    filename: "favicon.ico",
    blob: icoBlob,
    width: 48,
    height: 48,
    contentType: "image/x-icon",
    category: "favicon",
    description: "Multi-size .ico (16/32/48) for legacy browsers",
  });

  // Wide logo PNG (transparent) — render onto a 4:1 canvas for navbar use
  const wideW = 640;
  const wideH = 160;
  const { canvas: wideCanvas, ctx: wideCtx } = makeCanvas(wideW, wideH);
  const wideFit = fitContain(source.naturalWidth, source.naturalHeight, wideW, wideH);
  wideCtx.drawImage(source, wideFit.x, wideFit.y, wideFit.w, wideFit.h);
  const wideBlob = await canvasToBlob(wideCanvas, "image/png");
  results.push({
    filename: "logo.png",
    blob: wideBlob,
    width: wideW,
    height: wideH,
    contentType: "image/png",
    category: "logo",
    description: "Wide logo for header / footer / emails",
  });

  // Preserve original SVG when provided
  if (svgSource) {
    results.push({
      filename: "logo.svg",
      blob: new Blob([svgSource], { type: "image/svg+xml" }),
      width: source.naturalWidth || 0,
      height: source.naturalHeight || 0,
      contentType: "image/svg+xml",
      category: "logo",
      description: "Original vector logo (scales perfectly)",
    });
  }

  onProgress?.(total, total, "done");
  return results;
}

/** Build site.webmanifest JSON pointing at the generated icon URLs. */
export function buildManifest(spec: BrandSpec, urls: Record<string, string>): Blob {
  const manifest = {
    name: spec.appName,
    short_name: spec.appName.slice(0, 12),
    icons: [
      urls["android-chrome-192x192.png"] && {
        src: urls["android-chrome-192x192.png"],
        sizes: "192x192",
        type: "image/png",
      },
      urls["android-chrome-512x512.png"] && {
        src: urls["android-chrome-512x512.png"],
        sizes: "512x512",
        type: "image/png",
      },
      urls["maskable-icon-512x512.png"] && {
        src: urls["maskable-icon-512x512.png"],
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ].filter(Boolean),
    theme_color: spec.themeColor,
    background_color: spec.backgroundColor,
    display: "standalone",
    start_url: "/",
  };
  return new Blob([JSON.stringify(manifest, null, 2)], { type: "application/manifest+json" });
}

export function buildBrowserConfig(themeColor: string, mstileUrl: string): Blob {
  const xml = `<?xml version="1.0" encoding="utf-8"?>
<browserconfig>
  <msapplication>
    <tile>
      <square150x150logo src="${mstileUrl}"/>
      <TileColor>${themeColor}</TileColor>
    </tile>
  </msapplication>
</browserconfig>`;
  return new Blob([xml], { type: "application/xml" });
}
