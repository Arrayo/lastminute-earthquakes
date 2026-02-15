import { describe, it, expect } from "vitest";
import { parseEventDetail } from "../../src/domain/validation/parsers.ts";
import fixture from "../fixtures/event-detail.json";
import { mutableClone } from "../helpers/fixture.ts";

describe("EventDetail contract", () => {
  it("parses a valid fixture", () => {
    const result = parseEventDetail(fixture);
    expect(result.schemaVersion).toBe(2);
    expect(result.id).toBe("us7000test1");
    expect(result.magnitude).toBe(5.2);
    expect(result.impact.tsunami).toBe(false);
    expect(result.quality.status).toBe("reviewed");
  });

  it("rejects wrong schemaVersion", () => {
    const bad = mutableClone(fixture);
    bad.schemaVersion = 1;
    expect(() => parseEventDetail(bad)).toThrow();
  });

  it("rejects invalid alert level", () => {
    const bad = mutableClone(fixture);
    bad.impact.alert = "purple";
    expect(() => parseEventDetail(bad)).toThrow();
  });

  it("accepts null impact fields", () => {
    const data = mutableClone(fixture);
    data.impact.felt = null;
    data.impact.alert = null;
    data.impact.cdi = null;
    data.impact.mmi = null;
    const result = parseEventDetail(data);
    expect(result.impact.felt).toBeNull();
    expect(result.impact.alert).toBeNull();
  });

  it("rejects invalid quality status", () => {
    const bad = mutableClone(fixture);
    bad.quality.status = "unknown";
    expect(() => parseEventDetail(bad)).toThrow();
  });

  it("rejects invalid url", () => {
    const bad = mutableClone(fixture);
    bad.url = "not-a-url";
    expect(() => parseEventDetail(bad)).toThrow();
  });

  it("rejects negative stationCount", () => {
    const bad = mutableClone(fixture);
    bad.quality.stationCount = -1;
    expect(() => parseEventDetail(bad)).toThrow();
  });
});
