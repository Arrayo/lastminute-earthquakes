import { describe, it, expect } from "vitest";
import { parseEventDetail } from "../../src/domain/validation/parsers.ts";
import fixture from "../fixtures/event-detail.json";

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
    expect(() =>
      parseEventDetail({ ...fixture, schemaVersion: 1 })
    ).toThrow();
  });

  it("rejects invalid alert level", () => {
    const bad = structuredClone(fixture);
    bad.impact.alert = "purple";
    expect(() => parseEventDetail(bad)).toThrow();
  });

  it("accepts null impact fields", () => {
    const data = structuredClone(fixture);
    data.impact.felt = null;
    data.impact.alert = null;
    data.impact.cdi = null;
    data.impact.mmi = null;
    const result = parseEventDetail(data);
    expect(result.impact.felt).toBeNull();
    expect(result.impact.alert).toBeNull();
  });

  it("rejects invalid quality status", () => {
    const bad = structuredClone(fixture);
    bad.quality.status = "unknown";
    expect(() => parseEventDetail(bad)).toThrow();
  });

  it("rejects invalid url", () => {
    expect(() =>
      parseEventDetail({ ...fixture, url: "not-a-url" })
    ).toThrow();
  });

  it("rejects negative stationCount", () => {
    const bad = structuredClone(fixture);
    bad.quality.stationCount = -1;
    expect(() => parseEventDetail(bad)).toThrow();
  });
});
