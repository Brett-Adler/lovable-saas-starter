import { Link } from "react-router-dom";
import { Pencil } from "lucide-react";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { PageSeo } from "@/components/seo/PageSeo";
import {
  useAboutPage,
  useAboutSections,
  useAboutPeople,
} from "@/hooks/useAboutContent";
import { useUserRoles } from "@/hooks/useUserRole";
import {
  AboutHero,
  AboutMissionVision,
  AboutStory,
  AboutValues,
  AboutStats,
  AboutTimeline,
  AboutTeam,
  AboutPress,
  AboutCta,
} from "@/components/about/AboutSections";

const About = () => {
  const { data: page, isLoading } = useAboutPage();
  const { data: sections = [] } = useAboutSections();
  const { data: people = [] } = useAboutPeople();
  const { isAdmin } = useUserRoles();

  const values = sections.filter((s) => s.kind === "value");
  const stats = sections.filter((s) => s.kind === "stat");
  const milestones = sections.filter((s) => s.kind === "milestone");
  const press = sections.filter((s) => s.kind === "press");

  return (
    <MarketingLayout>
      <PageSeo
        path="/about"
        title={page?.headline ?? "About"}
        description={page?.subhead ?? "The story behind the product and the team building it."}
      />

      {isAdmin && (
        <div className="container pt-6">
          <Link
            to="/admin/about"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
          >
            <Pencil className="h-3 w-3" />
            Edit this page
          </Link>
        </div>
      )}

      {isLoading || !page ? (
        <section className="container py-20">
          <div className="h-8 w-32 rounded bg-muted animate-pulse" />
          <div className="mt-6 h-14 w-3/4 rounded bg-muted animate-pulse" />
          <div className="mt-4 h-6 w-2/3 rounded bg-muted animate-pulse" />
        </section>
      ) : (
        <>
          <AboutHero page={page} />
          {page.show_mission && (page.mission_body || page.vision_body) && (
            <AboutMissionVision page={page} />
          )}
          {page.show_story && page.story_body && <AboutStory page={page} />}
          {page.show_values && values.length > 0 && (
            <AboutValues page={page} items={values} />
          )}
          {page.show_stats && stats.length > 0 && <AboutStats page={page} items={stats} />}
          {page.show_milestones && milestones.length > 0 && (
            <AboutTimeline page={page} items={milestones} />
          )}
          {page.show_team && people.length > 0 && <AboutTeam page={page} people={people} />}
          {page.show_press && press.length > 0 && <AboutPress page={page} items={press} />}
          {page.show_cta && page.cta_title && <AboutCta page={page} />}
        </>
      )}
    </MarketingLayout>
  );
};

export default About;
