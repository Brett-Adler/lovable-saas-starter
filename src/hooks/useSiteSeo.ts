import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface SiteSeo {
  id: number;
  site_name: string | null;
  default_title: string | null;
  title_template: string | null;
  default_description: string | null;
  default_og_image_url: string | null;
  twitter_handle: string | null;
  theme_color: string | null;
  base_url: string | null;
  organization_json_ld: Record<string, unknown> | null;
}

export interface SeoPage {
  path: string;
  title: string | null;
  description: string | null;
  og_image_url: string | null;
  keywords: string | null;
  noindex: boolean;
  canonical_override: string | null;
  json_ld: Record<string, unknown> | null;
  updated_at: string;
}

export const useSiteSeo = () => {
  return useQuery({
    queryKey: ["site_seo"],
    staleTime: 5 * 60 * 1000,
    queryFn: async (): Promise<SiteSeo | null> => {
      const { data, error } = await supabase
        .from("site_seo" as never)
        .select("*")
        .eq("id", 1)
        .maybeSingle();
      if (error) throw error;
      return (data as SiteSeo | null) ?? null;
    },
  });
};

export const useSeoPages = () => {
  return useQuery({
    queryKey: ["seo_pages"],
    staleTime: 5 * 60 * 1000,
    queryFn: async (): Promise<SeoPage[]> => {
      const { data, error } = await supabase
        .from("seo_pages" as never)
        .select("*")
        .order("path", { ascending: true });
      if (error) throw error;
      return (data as SeoPage[]) ?? [];
    },
  });
};

export const useSeoForPath = (path: string) => {
  const { data: pages } = useSeoPages();
  return pages?.find((p) => p.path === path) ?? null;
};
