import { Link } from "react-router-dom";
import {
  ArrowRight,
  Sparkles,
  Settings,
  ShieldCheck,
  Heart,
  Rocket,
  Users,
  Globe,
  Zap,
  Star,
  PawPrint,
  Linkedin,
  Twitter,
  Github,
  Link as LinkIcon,
  type LucideIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ABOUT_GROUPS,
  type AboutPage,
  type AboutPerson,
  type AboutSection,
} from "@/hooks/useAboutContent";

const ICONS: Record<string, LucideIcon> = {
  Sparkles,
  Settings,
  ShieldCheck,
  Heart,
  Rocket,
  Users,
  Globe,
  Zap,
  Star,
};

const iconFor = (name: string | null): LucideIcon => {
  if (!name) return Sparkles;
  return ICONS[name] ?? Sparkles;
};

export const AboutHero = ({ page }: { page: AboutPage }) => (
  <section className="container py-20 md:py-28">
    <div className="max-w-3xl">
      {page.eyebrow && (
        <Badge variant="outline" className="mb-4">
          {page.eyebrow}
        </Badge>
      )}
      <h1 className="text-4xl md:text-6xl font-bold tracking-tight">{page.headline}</h1>
      {page.subhead && (
        <p className="mt-6 text-xl text-muted-foreground">{page.subhead}</p>
      )}
      {(page.primary_cta_label || page.secondary_cta_label) && (
        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          {page.primary_cta_label && page.primary_cta_href && (
            <Button asChild>
              <Link to={page.primary_cta_href}>
                {page.primary_cta_label}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          )}
          {page.secondary_cta_label && page.secondary_cta_href && (
            <Button asChild variant="outline">
              <Link to={page.secondary_cta_href}>{page.secondary_cta_label}</Link>
            </Button>
          )}
        </div>
      )}
    </div>
  </section>
);

export const AboutMissionVision = ({ page }: { page: AboutPage }) => (
  <section className="container py-12 md:py-16">
    <div className="grid md:grid-cols-2 gap-6">
      <Card>
        <CardContent className="pt-8">
          <Badge variant="secondary" className="mb-3">
            {page.mission_title || "Mission"}
          </Badge>
          <p className="text-lg">{page.mission_body}</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-8">
          <Badge variant="secondary" className="mb-3">
            {page.vision_title || "Vision"}
          </Badge>
          <p className="text-lg">{page.vision_body}</p>
        </CardContent>
      </Card>
    </div>
  </section>
);

export const AboutStory = ({ page }: { page: AboutPage }) => (
  <section className="container py-12 md:py-16">
    <div className="grid md:grid-cols-5 gap-10 items-start">
      <div className={page.story_image_url ? "md:col-span-3" : "md:col-span-5 max-w-3xl"}>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{page.story_title}</h2>
        <div className="mt-6 space-y-4 text-muted-foreground text-lg leading-relaxed whitespace-pre-line">
          {page.story_body}
        </div>
      </div>
      {page.story_image_url && (
        <div className="md:col-span-2">
          <img
            src={page.story_image_url}
            alt=""
            className="rounded-xl border border-border w-full h-auto object-cover"
            loading="lazy"
          />
        </div>
      )}
    </div>
  </section>
);

export const AboutValues = ({
  page,
  items,
}: {
  page: AboutPage;
  items: AboutSection[];
}) => (
  <section className="container py-12 md:py-16">
    <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{page.values_title}</h2>
    <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((v) => {
        const Icon = iconFor(v.icon);
        return (
          <Card key={v.id}>
            <CardContent className="pt-6">
              <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-lg">{v.title}</h3>
              {v.body && <p className="mt-2 text-muted-foreground text-sm">{v.body}</p>}
            </CardContent>
          </Card>
        );
      })}
    </div>
  </section>
);

export const AboutStats = ({
  page,
  items,
}: {
  page: AboutPage;
  items: AboutSection[];
}) => (
  <section className="container py-12 md:py-16">
    {page.stats_title && (
      <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-8">{page.stats_title}</h2>
    )}
    <div className="grid sm:grid-cols-3 gap-4">
      {items.map((s) => (
        <Card key={s.id}>
          <CardContent className="pt-8 pb-8 text-center">
            <div className="text-4xl md:text-5xl font-bold tracking-tight text-primary">
              {s.title}
            </div>
            {s.subtitle && (
              <div className="mt-2 text-sm text-muted-foreground">{s.subtitle}</div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  </section>
);

export const AboutTimeline = ({
  page,
  items,
}: {
  page: AboutPage;
  items: AboutSection[];
}) => (
  <section className="container py-12 md:py-16">
    <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{page.milestones_title}</h2>
    <ol className="mt-8 relative border-l border-border pl-6 space-y-8">
      {items.map((m) => (
        <li key={m.id} className="relative">
          <span className="absolute -left-[31px] top-1.5 h-3 w-3 rounded-full bg-primary ring-4 ring-background" />
          {m.subtitle && (
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {m.subtitle}
            </div>
          )}
          <h3 className="mt-1 font-semibold text-lg">{m.title}</h3>
          {m.body && <p className="mt-1 text-muted-foreground">{m.body}</p>}
        </li>
      ))}
    </ol>
  </section>
);

const SOCIAL_ICONS: Record<string, LucideIcon> = {
  linkedin: Linkedin,
  x: Twitter,
  twitter: Twitter,
  github: Github,
  website: LinkIcon,
};

const PersonCard = ({ person }: { person: AboutPerson }) => {
  const initials = person.name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const isPet = person.group_key === "pets";
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          <Avatar className="h-14 w-14">
            {person.photo_url && <AvatarImage src={person.photo_url} alt={person.name} />}
            <AvatarFallback>
              {isPet ? <PawPrint className="h-5 w-5" /> : initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="font-semibold truncate">{person.name}</div>
            {person.role && (
              <div className="text-sm text-muted-foreground truncate">{person.role}</div>
            )}
          </div>
        </div>
        {person.bio && <p className="mt-4 text-sm text-muted-foreground">{person.bio}</p>}
        {Object.keys(person.links ?? {}).length > 0 && (
          <div className="mt-4 flex gap-2">
            {Object.entries(person.links).map(([key, url]) => {
              const Icon = SOCIAL_ICONS[key] ?? LinkIcon;
              return (
                <a
                  key={key}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${person.name} on ${key}`}
                  className="h-8 w-8 inline-flex items-center justify-center rounded-md border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  <Icon className="h-4 w-4" />
                </a>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export const AboutTeam = ({
  page,
  people,
}: {
  page: AboutPage;
  people: AboutPerson[];
}) => {
  const knownKeys = new Set(ABOUT_GROUPS.map((g) => g.key));
  const customKeys = Array.from(new Set(people.map((p) => p.group_key))).filter(
    (k) => !knownKeys.has(k),
  );
  const groupOrder = [...ABOUT_GROUPS, ...customKeys.map((k) => ({ key: k, label: k }))];

  return (
    <section className="container py-12 md:py-16">
      <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{page.team_title}</h2>
      {page.team_subtitle && (
        <p className="mt-3 text-lg text-muted-foreground">{page.team_subtitle}</p>
      )}
      <div className="mt-10 space-y-12">
        {groupOrder.map((group) => {
          const members = people.filter((p) => p.group_key === group.key);
          if (members.length === 0) return null;
          return (
            <div key={group.key}>
              <div className="flex items-center gap-2 mb-4">
                {group.key === "pets" && <PawPrint className="h-4 w-4 text-primary" />}
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  {group.label}
                </h3>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {members.map((p) => (
                  <PersonCard key={p.id} person={p} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export const AboutPress = ({
  page,
  items,
}: {
  page: AboutPage;
  items: AboutSection[];
}) => (
  <section className="container py-12 md:py-16">
    <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground text-center">
      {page.press_title}
    </h2>
    <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
      {items.map((p) =>
        p.link_url ? (
          <a
            key={p.id}
            href={p.link_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-lg font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            {p.image_url ? (
              <img src={p.image_url} alt={p.title ?? ""} className="h-7 w-auto opacity-70 hover:opacity-100" />
            ) : (
              p.title
            )}
          </a>
        ) : (
          <span key={p.id} className="text-lg font-semibold text-muted-foreground">
            {p.title}
          </span>
        ),
      )}
    </div>
  </section>
);

export const AboutCta = ({ page }: { page: AboutPage }) => (
  <section className="container py-16 md:py-24">
    <div className="rounded-2xl border border-border bg-muted/30 p-10 md:p-14 text-center">
      <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{page.cta_title}</h2>
      {page.cta_body && (
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">{page.cta_body}</p>
      )}
      <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
        {page.cta_primary_label && page.cta_primary_href && (
          <Button asChild>
            <Link to={page.cta_primary_href}>
              {page.cta_primary_label}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        )}
        {page.cta_secondary_label && page.cta_secondary_href && (
          <Button asChild variant="outline">
            <Link to={page.cta_secondary_href}>{page.cta_secondary_label}</Link>
          </Button>
        )}
      </div>
    </div>
  </section>
);
