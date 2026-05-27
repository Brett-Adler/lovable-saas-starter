import { useEffect, useMemo, useRef, useState } from "react";
import { Download, Image as ImageIcon, Loader2, RefreshCw, Sparkles, Upload } from "lucide-react";
import JSZip from "jszip";
import { toast } from "sonner";
import { AdminShell } from "@/components/admin/AdminShell";
import { BrandPreview } from "@/components/admin/BrandPreview";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSiteSeo } from "@/hooks/useSiteSeo";
import { useQueryClient } from "@tanstack/react-query";
import { generateAll, loadSource, type BrandSpec, type GeneratedAsset } from "@/lib/brand/generate";
import { publishBrandKit, uploadBrandKit } from "@/lib/brand/upload";

interface SourceState {
  file: File;
  image: HTMLImageElement;
  previewUrl: string;
  svgSource?: string;
}

const DEFAULT_SPEC: BrandSpec = {
  themeColor: "#FF5C2A",
  backgroundColor: "#ffffff",
  appName: "",
  safeAreaPct: 12,
};

const AdminBrandPage = () => {
  const { data: siteSeo } = useSiteSeo();
  const qc = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);
  const [source, setSource] = useState<SourceState | null>(null);
  const [spec, setSpec] = useState<BrandSpec>(DEFAULT_SPEC);
  const [assets, setAssets] = useState<GeneratedAsset[]>([]);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<{ done: number; total: number; label: string } | null>(null);

  // Seed defaults from site_seo
  useEffect(() => {
    if (!siteSeo) return;
    setSpec((s) => ({
      ...s,
      appName: s.appName || siteSeo.site_name || "",
      themeColor: siteSeo.theme_color || s.themeColor,
      backgroundColor: siteSeo.background_color || s.backgroundColor,
    }));
  }, [siteSeo]);

  const existing = siteSeo?.brand_assets ?? {};
  const assetUrls = useMemo(() => {
    const map: Record<string, string> = {};
    for (const a of assets) map[a.filename] = URL.createObjectURL(a.blob);
    return map;
  }, [assets]);

  const handleFile = async (file: File) => {
    try {
      const { image, isSvg, rawText } = await loadSource(file);
      setSource({
        file,
        image,
        previewUrl: URL.createObjectURL(file),
        svgSource: isSvg ? rawText : undefined,
      });
      setAssets([]);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not read image");
    }
  };

  const onGenerate = async () => {
    if (!source) return;
    setBusy(true);
    setAssets([]);
    try {
      const result = await generateAll(source.image, spec, source.svgSource, (done, total, label) =>
        setProgress({ done, total, label }),
      );
      setAssets(result);
      toast.success(`Generated ${result.length} brand assets`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Generation failed");
    } finally {
      setBusy(false);
      setProgress(null);
    }
  };

  const onPublish = async () => {
    if (!assets.length) return;
    setBusy(true);
    try {
      const urls = await uploadBrandKit(assets, spec, (done, total, label) =>
        setProgress({ done, total, label }),
      );
      await publishBrandKit(urls, spec);
      await qc.invalidateQueries({ queryKey: ["site_seo"] });
      toast.success("Brand kit published — favicon, social cards, and PWA icons are live");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Publish failed");
    } finally {
      setBusy(false);
      setProgress(null);
    }
  };

  const onDownloadZip = async () => {
    if (!assets.length) return;
    const zip = new JSZip();
    for (const a of assets) zip.file(a.filename, a.blob);
    const blob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `brand-kit-${Date.now()}.zip`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const sourceTooSmall =
    source && Math.max(source.image.naturalWidth, source.image.naturalHeight) < 512 && !source.svgSource;
  const nonSquare =
    source &&
    !source.svgSource &&
    Math.abs(source.image.naturalWidth - source.image.naturalHeight) /
      Math.max(source.image.naturalWidth, source.image.naturalHeight) >
      0.1;

  return (
    <AdminShell
      title="Brand kit"
      description="Upload one logo and generate every favicon, app icon, social card, and PWA asset your site needs."
      maxWidth="7xl"
    >
      <Tabs defaultValue="generate" className="space-y-6">
        <TabsList>
          <TabsTrigger value="generate">Generate</TabsTrigger>
          <TabsTrigger value="preview" disabled={!source}>
            Preview
          </TabsTrigger>
          <TabsTrigger value="current">Current</TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-[1fr,1.4fr]">
            {/* Upload + style */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="h-4 w-4" /> Source logo
                  </CardTitle>
                  <CardDescription>
                    Upload one square PNG, JPG, or SVG. 512×512 or larger is recommended.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div
                    onClick={() => fileRef.current?.click()}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const f = e.dataTransfer.files?.[0];
                      if (f) handleFile(f);
                    }}
                    className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 hover:bg-muted/30 transition-colors"
                  >
                    {source ? (
                      <div className="flex flex-col items-center gap-3">
                        <div className="h-32 w-32 rounded-md border bg-[conic-gradient(at_top_left,_#f5f5f5_25%,_#ffffff_25%_50%,_#f5f5f5_50%_75%,_#ffffff_75%)] bg-[length:16px_16px] flex items-center justify-center overflow-hidden">
                          <img src={source.previewUrl} alt="Generated logo preview" className="max-h-28 max-w-28 object-contain" />
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {source.file.name} · {source.image.naturalWidth || "?"}×{source.image.naturalHeight || "?"}
                          {source.svgSource ? " · SVG" : ""}
                        </div>
                        <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); fileRef.current?.click(); }}>
                          <RefreshCw className="h-3 w-3 mr-1" /> Change
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2 py-6 text-muted-foreground">
                        <ImageIcon className="h-8 w-8" />
                        <div className="text-sm font-medium text-foreground">Click or drop a logo</div>
                        <div className="text-xs">PNG, JPG, or SVG · up to ~4 MB</div>
                      </div>
                    )}
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/png,image/jpeg,image/svg+xml,image/webp"
                      className="hidden"
                      onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                    />
                  </div>
                  {sourceTooSmall && (
                    <p className="text-xs text-amber-600 dark:text-amber-500">
                      Source is smaller than 512px — icons may look soft. Use a larger original if possible.
                    </p>
                  )}
                  {nonSquare && (
                    <p className="text-xs text-amber-600 dark:text-amber-500">
                      Source isn't square — it will be contained inside square icons with safe-area padding.
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Style</CardTitle>
                  <CardDescription>Used as backgrounds for iOS, Android, Windows, and social cards.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="appName">App name</Label>
                    <Input
                      id="appName"
                      value={spec.appName}
                      onChange={(e) => setSpec({ ...spec, appName: e.target.value })}
                      placeholder="Acme"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="theme">Theme color</Label>
                      <div className="flex gap-2 items-center">
                        <Input
                          id="theme"
                          type="color"
                          value={spec.themeColor}
                          onChange={(e) => setSpec({ ...spec, themeColor: e.target.value })}
                          className="h-10 w-14 p-1"
                        />
                        <Input
                          value={spec.themeColor}
                          onChange={(e) => setSpec({ ...spec, themeColor: e.target.value })}
                          className="font-mono text-sm"
                        />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="bg">Background</Label>
                      <div className="flex gap-2 items-center">
                        <Input
                          id="bg"
                          type="color"
                          value={spec.backgroundColor}
                          onChange={(e) => setSpec({ ...spec, backgroundColor: e.target.value })}
                          className="h-10 w-14 p-1"
                        />
                        <Input
                          value={spec.backgroundColor}
                          onChange={(e) => setSpec({ ...spec, backgroundColor: e.target.value })}
                          className="font-mono text-sm"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label>Icon padding · {spec.safeAreaPct}%</Label>
                    <Slider
                      min={0}
                      max={25}
                      step={1}
                      value={[spec.safeAreaPct]}
                      onValueChange={([v]) => setSpec({ ...spec, safeAreaPct: v })}
                    />
                    <p className="text-xs text-muted-foreground">
                      Extra space around the logo inside square icons. iOS/Android trim aggressively.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-2">
                <Button onClick={onGenerate} disabled={!source || busy} className="flex-1">
                  {busy && progress ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Sparkles className="h-4 w-4 mr-2" />}
                  Generate all assets
                </Button>
                <Button onClick={onPublish} disabled={!assets.length || busy} variant="default">
                  Publish
                </Button>
              </div>
              {progress && (
                <div className="space-y-1">
                  <Progress value={(progress.done / progress.total) * 100} />
                  <p className="text-xs text-muted-foreground">
                    {progress.label} · {progress.done}/{progress.total}
                  </p>
                </div>
              )}
            </div>

            {/* Generated assets grid */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Generated assets</CardTitle>
                  <CardDescription>
                    {assets.length
                      ? `${assets.length} files ready. Publish to apply across the site, or download as a zip.`
                      : "Upload a logo and click Generate."}
                  </CardDescription>
                </div>
                {assets.length > 0 && (
                  <Button variant="outline" size="sm" onClick={onDownloadZip}>
                    <Download className="h-3 w-3 mr-1" /> Download .zip
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                {assets.length === 0 ? (
                  <div className="text-center text-sm text-muted-foreground py-12">
                    Nothing yet — generated icons, social cards, and the PWA manifest will appear here.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {assets.map((a) => (
                      <div key={a.filename} className="border rounded-md overflow-hidden bg-card">
                        <div className="aspect-square bg-[conic-gradient(at_top_left,_#f5f5f5_25%,_#ffffff_25%_50%,_#f5f5f5_50%_75%,_#ffffff_75%)] bg-[length:12px_12px] flex items-center justify-center p-2">
                          {a.contentType.startsWith("image/") ? (
                            <img src={assetUrls[a.filename]} alt={`Brand asset: ${a.filename}`} className="max-h-full max-w-full object-contain" />
                          ) : (
                            <span className="text-xs text-muted-foreground">{a.filename}</span>
                          )}
                        </div>
                        <div className="p-2 text-xs">
                          <div className="font-medium truncate" title={a.filename}>{a.filename}</div>
                          <div className="text-muted-foreground">
                            {a.width}×{a.height} · {Math.round(a.blob.size / 1024)} KB
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="preview">
          {source ? (
            <BrandPreview
              logoUrl={source.previewUrl}
              ogUrl={assetUrls["og-image.png"]}
              appName={spec.appName}
              themeColor={spec.themeColor}
              backgroundColor={spec.backgroundColor}
            />
          ) : (
            <p className="text-sm text-muted-foreground">Upload a logo first to see previews.</p>
          )}
        </TabsContent>

        <TabsContent value="current">
          <Card>
            <CardHeader>
              <CardTitle>Currently published</CardTitle>
              <CardDescription>
                Files in the public <code>brand-assets</code> bucket referenced from the site.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {Object.keys(existing).length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No published brand kit yet — the site is using the default placeholders from <code>/public</code>.
                </p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {Object.entries(existing as Record<string, string>).map(([name, url]) => (
                    <a
                      key={name}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="border rounded-md overflow-hidden bg-card hover:border-primary/50 transition-colors"
                    >
                      <div className="aspect-square bg-[conic-gradient(at_top_left,_#f5f5f5_25%,_#ffffff_25%_50%,_#f5f5f5_50%_75%,_#ffffff_75%)] bg-[length:12px_12px] flex items-center justify-center p-2">
                        {/\.(png|jpe?g|svg|webp|ico)$/i.test(name) ? (
                          <img src={url} alt={`Brand asset: ${name}`} className="max-h-full max-w-full object-contain" />
                        ) : (
                          <span className="text-xs text-muted-foreground">{name}</span>
                        )}
                      </div>
                      <div className="p-2 text-xs truncate">{name}</div>
                    </a>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AdminShell>
  );
};

export default AdminBrandPage;
