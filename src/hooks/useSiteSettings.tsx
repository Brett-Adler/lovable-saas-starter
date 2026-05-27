import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Public-readable fields only. `from_email` and `reply_to` are admin-only —
// use `useAdminSiteSettings` for those.
export interface SiteSettings {
  social_twitter: string | null;
  social_github: string | null;
  social_linkedin: string | null;
  social_instagram: string | null;
  social_youtube: string | null;
  social_facebook: string | null;
  social_tiktok: string | null;
  contact_email: string | null;
  mailing_address: string | null;
  company_legal_name: string | null;
}

export interface AdminSiteSettings extends SiteSettings {
  from_name: string | null;
  from_email: string | null;
  reply_to: string | null;
}

const PUBLIC_COLUMNS =
  "social_twitter, social_github, social_linkedin, social_instagram, social_youtube, social_facebook, social_tiktok, contact_email, mailing_address, company_legal_name";

const ADMIN_COLUMNS = `${PUBLIC_COLUMNS}, from_name, from_email, reply_to`;

export const useSiteSettings = () => {
  return useQuery({
    queryKey: ["site_settings"],
    staleTime: 5 * 60 * 1000,
    queryFn: async (): Promise<SiteSettings | null> => {
      const { data, error } = await supabase
        .from("site_settings")
        .select(PUBLIC_COLUMNS)
        .eq("id", 1)
        .maybeSingle();
      if (error) throw error;
      return data as SiteSettings | null;
    },
  });
};

export const useAdminSiteSettings = () => {
  return useQuery({
    queryKey: ["site_settings", "admin"],
    staleTime: 5 * 60 * 1000,
    queryFn: async (): Promise<AdminSiteSettings | null> => {
      const { data, error } = await supabase
        .from("site_settings")
        .select(ADMIN_COLUMNS)
        .eq("id", 1)
        .maybeSingle();
      if (error) throw error;
      return data as AdminSiteSettings | null;
    },
  });
};
