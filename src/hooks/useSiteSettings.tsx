import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface SiteSettings {
  social_twitter: string | null;
  social_github: string | null;
  social_linkedin: string | null;
  social_instagram: string | null;
  social_youtube: string | null;
  social_facebook: string | null;
  social_tiktok: string | null;
  contact_email: string | null;
}

export const useSiteSettings = () => {
  return useQuery({
    queryKey: ["site_settings"],
    staleTime: 5 * 60 * 1000,
    queryFn: async (): Promise<SiteSettings | null> => {
      const { data, error } = await supabase
        .from("site_settings")
        .select(
          "social_twitter, social_github, social_linkedin, social_instagram, social_youtube, social_facebook, social_tiktok, contact_email",
        )
        .eq("id", 1)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
};
