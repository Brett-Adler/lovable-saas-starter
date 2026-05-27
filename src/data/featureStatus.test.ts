import { describe, it, expect } from "vitest";
import { featureStatus, isShipped } from "./featureStatus";

const VALID = new Set(["shipped", "setup", "soon"]);

describe("featureStatus data", () => {
  it("has at least one entry", () => {
    expect(featureStatus.length).toBeGreaterThan(0);
  });

  it("every entry has unique id, label, and a valid status", () => {
    const seen = new Set<string>();
    for (const f of featureStatus) {
      expect(f.id, "id required").toBeTruthy();
      expect(f.label, `label required for ${f.id}`).toBeTruthy();
      expect(VALID.has(f.status), `bad status on ${f.id}`).toBe(true);
      expect(seen.has(f.id), `duplicate id ${f.id}`).toBe(false);
      seen.add(f.id);
    }
  });

  it("non-shipped entries have a setup/coming-soon note", () => {
    for (const f of featureStatus) {
      if (f.status !== "shipped") {
        expect(f.note, `${f.id} should have a note`).toBeTruthy();
      }
    }
  });

  it("keeps the recently shipped features live", () => {
    for (const id of ["live-chat", "blog", "status-page"]) {
      expect(isShipped(id), `${id} should be shipped`).toBe(true);
    }
  });
});
