import { Link } from "react-router-dom";
import { ArrowRight, Bell } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge, type FeatureStatus } from "@/components/marketing/StatusBadge";
import { BrandIcon } from "@/components/marketing/BrandIcon";
import { VoteButton } from "@/components/marketing/VoteButton";
import { useRoadmapVotes } from "@/hooks/useRoadmapVotes";
import { brandIcons, type BrandSlug } from "@/lib/brand/icons";
import { roadmap, categoryLabels, type RoadmapCategory, type RoadmapEntry } from "@/data/roadmap";

const statusToBadge = (s: RoadmapEntry["status"]): FeatureStatus => (s === "planned" ? "soon" : s);

// Map roadmap entries that explicitly mention a real product to its brand glyph.
const entryBrand: Record<string, BrandSlug> = {
  "auth-google": "google",
  "auth-apple": "apple",
  stripe: "stripe",
  "auth-sms": "twilio",
  "marketing-email": "resend",
  saml: "okta",
  zapier: "zapier",
  slack: "slack",
  "live-chat": "lovable",
};

interface ItemProps {
  entry: RoadmapEntry;
  voteCount: number;
  voted: boolean;
  voteLoading: boolean;
  onToggleVote: ReturnType<typeof useRoadmapVotes>["toggleVote"];
}

const Item = ({ entry, voteCount, voted, voteLoading, onToggleVote }: ItemProps) => {
  const slug = entryBrand[entry.id];
  const brand = slug ? brandIcons[slug] : undefined;
  const isVotable = entry.status === "soon" || entry.status === "planned" || entry.status === "setup";
  return (
    <Card className="p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          {slug && (
            <span className="h-8 w-8 rounded-md bg-white border border-border flex items-center justify-center text-foreground shrink-0 shadow-sm">
              <BrandIcon slug={slug} size={18} colored />
            </span>
          )}
          <h3 className="font-semibold leading-snug">{entry.label}</h3>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {isVotable && (
            <VoteButton
              featureId={entry.id}
              count={voteCount}
              voted={voted}
              loading={voteLoading}
              onToggle={onToggleVote}
            />
          )}
          <StatusBadge status={statusToBadge(entry.status)} label={entry.status === "planned" ? "Planned" : undefined} />
        </div>
      </div>
      <p className="text-sm text-muted-foreground flex-1">{entry.summary}</p>
      <div className="flex flex-wrap items-center gap-2">
        {entry.href && entry.status === "shipped" && (
          <Button asChild variant="ghost" size="sm" className="-ml-3">
            <Link to={entry.href}>
              Open <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Link>
          </Button>
        )}
        {entry.href && entry.status === "setup" && (
          <Button asChild variant="outline" size="sm">
            <Link to={entry.href}>Configure</Link>
          </Button>
        )}
        {(entry.status === "soon" || entry.status === "planned") && entry.notifySource && (
          <Button asChild variant="ghost" size="sm" className="-ml-3">
            <Link to={`/roadmap#${entry.id}`}>
              <Bell className="h-3.5 w-3.5 mr-1.5" /> Notify me
            </Link>
          </Button>
        )}
        {brand && (
          <a
            href={brand.url}
            target="_blank"
            rel="noopener noreferrer external"
            className="text-xs text-muted-foreground hover:text-primary inline-flex items-center gap-1"
            aria-label={`${brand.label} website — opens in new tab`}
          >
            {brand.label} ↗
          </a>
        )}
      </div>
    </Card>
  );
};

export const RoadmapList = ({ filter }: { filter?: (e: RoadmapEntry) => boolean }) => {
  const entries = filter ? roadmap.filter(filter) : roadmap;
  const { counts, myVotes, loading, toggleVote } = useRoadmapVotes();

  const byCat = new Map<RoadmapCategory, RoadmapEntry[]>();
  entries.forEach((e) => {
    const arr = byCat.get(e.category) ?? [];
    arr.push(e);
    byCat.set(e.category, arr);
  });

  return (
    <div className="space-y-12">
      {Array.from(byCat.entries()).map(([cat, items]) => (
        <div key={cat}>
          <h2 className="text-xl font-semibold mb-4">{categoryLabels[cat]}</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {items.map((e) => (
              <div key={e.id} id={e.id}>
                <Item
                  entry={e}
                  voteCount={counts[e.id] ?? 0}
                  voted={myVotes.has(e.id)}
                  voteLoading={loading}
                  onToggleVote={toggleVote}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
