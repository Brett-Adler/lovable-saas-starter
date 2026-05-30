import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface AboutPage {
  id: number;
  eyebrow: string | null;
  headline: string | null;
  subhead: string | null;
  primary_cta_label: string | null;
  primary_cta_href: string | null;
  secondary_cta_label: string | null;
  secondary_cta_href: string | null;
  mission_title: string | null;
  mission_body: string | null;
  vision_title: string | null;
  vision_body: string | null;
  story_title: string | null;
  story_body: string | null;
  story_image_url: string | null;
  values_title: string | null;
  stats_title: string | null;
  milestones_title: string | null;
  team_title: string | null;
  team_subtitle: string | null;
  press_title: string | null;
  cta_title: string | null;
  cta_body: string | null;
  cta_primary_label: string | null;
  cta_primary_href: string | null;
  cta_secondary_label: string | null;
  cta_secondary_href: string | null;
  show_mission: boolean;
  show_story: boolean;
  show_values: boolean;
  show_stats: boolean;
  show_milestones: boolean;
  show_team: boolean;
  show_press: boolean;
  show_cta: boolean;
}

export type AboutSectionKind = "value" | "stat" | "milestone" | "press";

export interface AboutSection {
  id: string;
  kind: AboutSectionKind;
  title: string | null;
  subtitle: string | null;
  body: string | null;
  icon: string | null;
  image_url: string | null;
  link_url: string | null;
  meta: Record<string, unknown>;
  position: number;
  published: boolean;
}

export interface AboutPerson {
  id: string;
  name: string;
  role: string | null;
  group_key: string;
  bio: string | null;
  photo_url: string | null;
  links: Record<string, string>;
  position: number;
  published: boolean;
}

export const ABOUT_GROUPS: { key: string; label: string }[] = [
  { key: "leadership", label: "Leadership" },
  { key: "team", label: "Team" },
  { key: "board", label: "Board" },
  { key: "investors", label: "Investors" },
  { key: "advisors", label: "Advisors" },
  { key: "pets", label: "Pets" },
];

export const useAboutPage = () =>
  useQuery({
    queryKey: ["about_page"],
    staleTime: 60_000,
    queryFn: async (): Promise<AboutPage | null> => {
      const { data, error } = await supabase
        .from("about_page" as never)
        .select("*")
        .eq("id", 1)
        .maybeSingle();
      if (error) throw error;
      return (data as AboutPage | null) ?? null;
    },
  });

export const useAboutSections = (kind?: AboutSectionKind, includeUnpublished = false) =>
  useQuery({
    queryKey: ["about_sections", kind ?? "all", includeUnpublished],
    staleTime: 60_000,
    queryFn: async (): Promise<AboutSection[]> => {
      let q = supabase
        .from("about_sections" as never)
        .select("*")
        .order("kind", { ascending: true })
        .order("position", { ascending: true });
      if (kind) q = q.eq("kind", kind);
      if (!includeUnpublished) q = q.eq("published", true);
      const { data, error } = await q;
      if (error) throw error;
      return (data as AboutSection[]) ?? [];
    },
  });

export const useAboutPeople = (includeUnpublished = false) =>
  useQuery({
    queryKey: ["about_people", includeUnpublished],
    staleTime: 60_000,
    queryFn: async (): Promise<AboutPerson[]> => {
      let q = supabase
        .from("about_people" as never)
        .select("*")
        .order("group_key", { ascending: true })
        .order("position", { ascending: true });
      if (!includeUnpublished) q = q.eq("published", true);
      const { data, error } = await q;
      if (error) throw error;
      return (data as AboutPerson[]) ?? [];
    },
  });
