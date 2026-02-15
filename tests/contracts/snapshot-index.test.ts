import { describe, it, expect } from "vitest";
import { parseSnapshotIndex } from "../../src/domain/validation/parsers.ts";
import fixture from "../fixtures/snapshot-index.json";

describe("SnapshotIndex contract", () => {
  it("parses a valid fixture", () => {
    const result = parseSnapshotIndex(fixture);
    expect(result.schemaVersion).toBe(1);
    expect(result.count).toBe(2);
    expect(result.events).toHaveLength(2);
    expect(result.source.id).toBe("usgs");
  });

  it("validates event coordinates range", () => {
    const bad = structuredClone(fixture);
    bad.events[0].coordinates.latitude = 999;
    expect(() => parseSnapshotIndex(bad)).toThrow();
  });

  it("allows null bbox", () => {
    const result = parseSnapshotIndex({ ...fixture, bbox: null });
    expect(result.bbox).toBeNull();
  });

  it("rejects bbox with wrong length", () => {
    expect(() =>
      parseSnapshotIndex({ ...fixture, bbox: [1, 2, 3] })
    ).toThrow();
  });

  it("rejects missing source", () => {
    const { source: _, ...rest } = fixture;
    expect(() => parseSnapshotIndex(rest)).toThrow();
  });

  it("validates event time is ISO datetime", () => {
    const bad = structuredClone(fixture);
    bad.events[0].time = "yesterday";
    expect(() => parseSnapshotIndex(bad)).toThrow();
  });
});
