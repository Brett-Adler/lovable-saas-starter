import { Card } from "@/components/ui/card";

interface BrandPreviewProps {
  logoUrl: string;
  ogUrl?: string;
  appName: string;
  themeColor: string;
  backgroundColor: string;
}

export function BrandPreview({ logoUrl, ogUrl, appName, themeColor, backgroundColor }: BrandPreviewProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Browser tab */}
      <Card className="overflow-hidden">
        <div className="px-3 py-2 text-xs font-medium text-muted-foreground border-b">Browser tab</div>
        <div className="bg-muted/50 p-4">
          <div className="inline-flex items-center gap-2 bg-background rounded-t-md border border-b-0 px-3 py-2 text-sm">
            <img src={logoUrl} alt="" className="h-4 w-4 object-contain" />
            <span className="truncate max-w-[200px]">{appName || "Untitled"}</span>
            <span className="text-muted-foreground">×</span>
          </div>
        </div>
      </Card>

      {/* iOS home screen */}
      <Card className="overflow-hidden">
        <div className="px-3 py-2 text-xs font-medium text-muted-foreground border-b">iOS home screen</div>
        <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-6 flex items-center gap-3">
          <div
            className="h-16 w-16 rounded-2xl shadow-lg overflow-hidden flex items-center justify-center"
            style={{ backgroundColor }}
          >
            <img src={logoUrl} alt="" className="h-12 w-12 object-contain" />
          </div>
          <span className="text-white text-sm font-medium drop-shadow">{appName || "App"}</span>
        </div>
      </Card>

      {/* Android adaptive */}
      <Card className="overflow-hidden">
        <div className="px-3 py-2 text-xs font-medium text-muted-foreground border-b">Android adaptive</div>
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-6 flex items-center gap-3">
          <div
            className="h-16 w-16 rounded-full shadow-lg overflow-hidden flex items-center justify-center"
            style={{ backgroundColor }}
          >
            <img src={logoUrl} alt="" className="h-10 w-10 object-contain" />
          </div>
          <span className="text-white text-sm font-medium drop-shadow">{appName || "App"}</span>
        </div>
      </Card>

      {/* Social card */}
      <Card className="overflow-hidden md:col-span-2">
        <div className="px-3 py-2 text-xs font-medium text-muted-foreground border-b">
          Social preview (Facebook, LinkedIn, Slack, iMessage)
        </div>
        <div className="bg-muted/50 p-4">
          <div className="max-w-md mx-auto bg-background border rounded-lg overflow-hidden shadow-sm">
            <div className="aspect-[1200/630] bg-muted">
              {ogUrl ? (
                <img src={ogUrl} alt="Open Graph preview" className="w-full h-full object-cover" />
              ) : (
                <div
                  className="w-full h-full flex flex-col items-center justify-center gap-3"
                  style={{ backgroundColor }}
                >
                  <img src={logoUrl} alt="" className="h-20 max-w-[60%] object-contain" />
                  <span className="font-semibold text-lg" style={{ color: themeColor }}>
                    {appName}
                  </span>
                </div>
              )}
            </div>
            <div className="p-3 text-sm">
              <div className="text-xs uppercase text-muted-foreground">yourdomain.com</div>
              <div className="font-medium truncate">{appName || "Your site"}</div>
              <div className="text-xs text-muted-foreground line-clamp-2">
                Share previews use the generated 1200×630 Open Graph image.
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
