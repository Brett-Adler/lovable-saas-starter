import { describe, it, expect } from "vitest";
import { changelog } from "./changelog";

const ISO = /^\d{4}-\d{2}-\d{2}$/;
const VALID_TYPES = new Set(["added", "changed", "fixed", "removed", "security", "deprecated"]);

describe("changelog data", () => {
  it("every entry has valid ISO date, title, and changes", () => {
    expect(changelog.length).toBeGreaterThan(0);
    for (const e of changelog) {
      expect(ISO.test(e.date), `bad date ${e.date}`).toBe(true);
      expect(Number.isNaN(Date.parse(e.date))).toBe(false);
      expect(e.title, "title required").toBeTruthy();
      expect(e.changes.length, "at least one change").toBeGreaterThan(0);
      for (const c of e.changes) {
        expect(VALID_TYPES.has(c.type), `bad change type ${c.type}`).toBe(true);
        expect(c.text, "change text required").toBeTruthy();
      }
    }
  });

  it("is sorted newest first", () => {
    for (let i = 0; i < changelog.length - 1; i++) {
      expect(
        Date.parse(changelog[i].date) >= Date.parse(changelog[i + 1].date),
        `entry ${i} (${changelog[i].date}) should be >= ${changelog[i + 1].date}`,
      ).toBe(true);
    }
  });
});
