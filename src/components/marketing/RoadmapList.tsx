import { Link } from "react-router-dom";
import { ArrowRight, Bell } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge, type FeatureStatus } from "@/components/marketing/StatusBadge";
import { roadmap, categoryLabels, type RoadmapCategory, type RoadmapEntry } from "@/data/roadmap";

const statusToBadge = (s: RoadmapEntry["status"]): FeatureStatus => (s === "planned" ? "soon" : s);

const Item = ({ entry }: { entry: RoadmapEntry }) => (
  <Card className="p-5 flex flex-col gap-3">
    <div className="flex items-start justify-between gap-3">
      <h3 className="font-semibold leading-snug">{entry.label}</h3>
      <StatusBadge status={statusToBadge(entry.status)} label={entry.status === "planned" ? "Planned" : undefined} />
    </div>
    <p className="text-sm text-muted-foreground flex-1">{entry.summary}</p>
    {entry.href && entry.status === "shipped" && (
      <Button asChild variant="ghost" size="sm" className="self-start -ml-3">
        <Link to={entry.href}>
          Open <ArrowRight className="h-3.5 w-3.5 ml-1" />
        </Link>
      </Button>
    )}
    {entry.href && entry.status === "setup" && (
      <Button asChild variant="outline" size="sm" className="self-start">
        <Link to={entry.href}>Configure</Link>
      </Button>
    )}
    {(entry.status === "soon" || entry.status === "planned") && entry.notifySource && (
      <Button asChild variant="outline" size="sm" className="self-start">
        <Link to={`/roadmap#${entry.id}`}>
          <Bell className="h-3.5 w-3.5 mr-1.5" /> Notify me
        </Link>
      </Button>
    )}
  </Card>
);

export const RoadmapList = ({ filter }: { filter?: (e: RoadmapEntry) => boolean }) => {
  const entries = filter ? roadmap.filter(filter) : roadmap;
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
                <Item entry={e} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
