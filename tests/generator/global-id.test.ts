import { describe, it, expect } from "vitest";
import { deriveGlobalId } from "../../tools/snapshot-generator/src/matching/global-id.ts";
import { makeCandidate } from "./helpers.ts";

describe("deriveGlobalId", () => {
  it("uses usgs prefix when primary is usgs", () => {
    const primary = makeCandidate({ sourceId: "usgs", eventId: "us7000abc" });
    expect(deriveGlobalId(primary, [])).toBe("eq-us7000abc");
  });

  it("uses usgs prefix when usgs is in secondary", () => {
    const primary = makeCandidate({ sourceId: "emsc", eventId: "20260101_001" });
    const secondary = [makeCandidate({ sourceId: "usgs", eventId: "us7000xyz" })];
    expect(deriveGlobalId(primary, secondary)).toBe("eq-us7000xyz");
  });

  it("uses source-prefixed id for emsc-only events", () => {
    const primary = makeCandidate({ sourceId: "emsc", eventId: "20260101_001" });
    expect(deriveGlobalId(primary, [])).toBe("eq-emsc-20260101_001");
  });

  it("is stable across multiple calls", () => {
    const primary = makeCandidate({ sourceId: "usgs", eventId: "stable123" });
    const id1 = deriveGlobalId(primary, []);
    const id2 = deriveGlobalId(primary, []);
    expect(id1).toBe(id2);
  });

  it("produces different ids for different events", () => {
    const a = makeCandidate({ sourceId: "usgs", eventId: "aaa" });
    const b = makeCandidate({ sourceId: "usgs", eventId: "bbb" });
    expect(deriveGlobalId(a, [])).not.toBe(deriveGlobalId(b, []));
  });
});
