import { describe, it, expect } from "vitest";
import { parseSnapshotIndex } from "../../src/domain/validation/parsers.ts";
import fixture from "../fixtures/snapshot-index.json";
import { mutableClone } from "../helpers/fixture.ts";

describe("SnapshotIndex contract", () => {
  it("parses a valid fixture", () => {
    const result = parseSnapshotIndex(fixture);
    expect(result.schemaVersion).toBe(1);
    expect(result.count).toBe(2);
    expect(result.events).toHaveLength(2);
    expect(result.source.id).toBe("usgs");
  });

  it("validates event coordinates range", () => {
    const bad = mutableClone(fixture);
    bad.events[0].coordinates.latitude = 999;
    expect(() => parseSnapshotIndex(bad)).toThrow();
  });

  it("allows null bbox", () => {
    const data = mutableClone(fixture);
    data.bbox = null;
    const result = parseSnapshotIndex(data);
    expect(result.bbox).toBeNull();
  });

  it("rejects bbox with wrong length", () => {
    const data = mutableClone(fixture);
    data.bbox = [1, 2, 3];
    expect(() => parseSnapshotIndex(data)).toThrow();
  });

  it("rejects missing source", () => {
    const { source: _source, ...rest } = fixture;
    void _source;
    expect(() => parseSnapshotIndex(rest)).toThrow();
  });

  it("validates event time is ISO datetime", () => {
    const bad = mutableClone(fixture);
    bad.events[0].time = "yesterday";
    expect(() => parseSnapshotIndex(bad)).toThrow();
  });
});
