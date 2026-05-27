import { describe, it, expect } from "vitest";
import { roadmap, categoryLabels } from "./roadmap";

const STATUSES = new Set(["shipped", "setup", "soon", "planned"]);

describe("roadmap data", () => {
  it("entries have valid status + known category + unique ids", () => {
    const seen = new Set<string>();
    for (const r of roadmap) {
      expect(STATUSES.has(r.status), `bad status on ${r.id}: ${r.status}`).toBe(true);
      expect(categoryLabels[r.category], `unknown category ${r.category} on ${r.id}`).toBeTruthy();
      expect(r.label, `label required for ${r.id}`).toBeTruthy();
      expect(r.summary, `summary required for ${r.id}`).toBeTruthy();
      expect(seen.has(r.id), `duplicate id ${r.id}`).toBe(false);
      seen.add(r.id);
    }
  });

  it("has at least one shipped and one coming-soon entry", () => {
    expect(roadmap.some((r) => r.status === "shipped")).toBe(true);
    expect(roadmap.some((r) => r.status === "soon")).toBe(true);
  });

  it("coming-soon entries have a notifySource so leads can be captured", () => {
    for (const r of roadmap.filter((x) => x.status === "soon")) {
      expect(r.notifySource, `${r.id} needs notifySource`).toMatch(/^coming_soon:/);
    }
  });

  it("chat/blog/status are promoted to shipped", () => {
    for (const id of ["live-chat", "blog"]) {
      const entry = roadmap.find((r) => r.id === id);
      expect(entry, `${id} missing`).toBeTruthy();
      expect(entry!.status).toBe("shipped");
    }
  });
});
