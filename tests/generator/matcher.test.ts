import { describe, it, expect } from "vitest";
import { matchAndMerge } from "../../tools/snapshot-generator/src/matching/matcher.ts";
import type { SourceMeta } from "../../tools/snapshot-generator/src/types.ts";
import { makeCandidate } from "./helpers.ts";

const metaMap: Record<string, SourceMeta> = {
  usgs: { id: "usgs", name: "USGS", url: "https://usgs.gov", attribution: "USGS" },
  emsc: { id: "emsc", name: "EMSC", url: "https://emsc.eu", attribution: "EMSC" },
};

describe("matchAndMerge", () => {
  it("returns empty array for no candidates", () => {
    expect(matchAndMerge([], metaMap)).toEqual([]);
  });

  it("creates single-source events for usgs-only", () => {
    const candidates = [
      makeCandidate({ sourceId: "usgs", eventId: "u1", magnitude: 3.0 }),
    ];
    const result = matchAndMerge(candidates, metaMap);
    expect(result).toHaveLength(1);
    expect(result[0].secondary).toHaveLength(0);
    expect(result[0].globalId).toBe("eq-u1");
  });

  it("creates single-source events for emsc-only", () => {
    const candidates = [
      makeCandidate({ sourceId: "emsc", eventId: "e1", magnitude: 3.0 }),
    ];
    const result = matchAndMerge(candidates, metaMap);
    expect(result).toHaveLength(1);
    expect(result[0].globalId).toBe("eq-emsc-e1");
  });

  it("matches usgs and emsc events within thresholds", () => {
    const t = "2026-02-15T12:00:00.000Z";
    const candidates = [
      makeCandidate({
        sourceId: "usgs",
        eventId: "u1",
        magnitude: 5.0,
        latitude: 35.0,
        longitude: -118.0,
        time: t,
      }),
      makeCandidate({
        sourceId: "emsc",
        eventId: "e1",
        magnitude: 5.1,
        latitude: 35.01,
        longitude: -118.01,
        time: t,
      }),
    ];

    const result = matchAndMerge(candidates, metaMap);
    expect(result).toHaveLength(1);
    expect(result[0].secondary).toHaveLength(1);
    expect(result[0].globalId).toBe("eq-u1");
  });

  it("does not match events outside time threshold", () => {
    const candidates = [
      makeCandidate({
        sourceId: "usgs",
        eventId: "u1",
        magnitude: 5.0,
        time: "2026-02-15T12:00:00.000Z",
      }),
      makeCandidate({
        sourceId: "emsc",
        eventId: "e1",
        magnitude: 5.0,
        time: "2026-02-15T12:01:00.000Z",
      }),
    ];

    const result = matchAndMerge(candidates, metaMap);
    expect(result).toHaveLength(2);
    expect(result.every((m) => m.secondary.length === 0)).toBe(true);
  });

  it("does not match events outside magnitude threshold", () => {
    const t = "2026-02-15T12:00:00.000Z";
    const candidates = [
      makeCandidate({
        sourceId: "usgs",
        eventId: "u1",
        magnitude: 5.0,
        latitude: 35.0,
        longitude: -118.0,
        time: t,
      }),
      makeCandidate({
        sourceId: "emsc",
        eventId: "e1",
        magnitude: 6.0,
        latitude: 35.0,
        longitude: -118.0,
        time: t,
      }),
    ];

    const result = matchAndMerge(candidates, metaMap);
    expect(result).toHaveLength(2);
  });

  it("does not match events outside distance threshold", () => {
    const t = "2026-02-15T12:00:00.000Z";
    const candidates = [
      makeCandidate({
        sourceId: "usgs",
        eventId: "u1",
        magnitude: 5.0,
        latitude: 35.0,
        longitude: -118.0,
        time: t,
      }),
      makeCandidate({
        sourceId: "emsc",
        eventId: "e1",
        magnitude: 5.0,
        latitude: 36.0,
        longitude: -120.0,
        time: t,
      }),
    ];

    const result = matchAndMerge(candidates, metaMap);
    expect(result).toHaveLength(2);
  });

  it("sorts output by time descending, then globalId ascending", () => {
    const candidates = [
      makeCandidate({
        sourceId: "usgs",
        eventId: "aaa",
        magnitude: 3.0,
        time: "2026-02-15T10:00:00.000Z",
      }),
      makeCandidate({
        sourceId: "usgs",
        eventId: "bbb",
        magnitude: 4.0,
        time: "2026-02-15T12:00:00.000Z",
      }),
      makeCandidate({
        sourceId: "usgs",
        eventId: "ccc",
        magnitude: 2.0,
        time: "2026-02-15T12:00:00.000Z",
      }),
    ];

    const result = matchAndMerge(candidates, metaMap);
    expect(result.map((m) => m.globalId)).toEqual([
      "eq-bbb",
      "eq-ccc",
      "eq-aaa",
    ]);
  });

  it("picks closest emsc match when multiple are within thresholds", () => {
    const t = "2026-02-15T12:00:00.000Z";
    const candidates = [
      makeCandidate({
        sourceId: "usgs",
        eventId: "u1",
        magnitude: 5.0,
        latitude: 35.0,
        longitude: -118.0,
        time: t,
      }),
      makeCandidate({
        sourceId: "emsc",
        eventId: "e-far",
        magnitude: 5.0,
        latitude: 35.5,
        longitude: -118.5,
        time: t,
      }),
      makeCandidate({
        sourceId: "emsc",
        eventId: "e-close",
        magnitude: 5.0,
        latitude: 35.001,
        longitude: -118.001,
        time: t,
      }),
    ];

    const result = matchAndMerge(candidates, metaMap);
    const matched = result.find((m) => m.secondary.length > 0);
    expect(matched).toBeDefined();
    expect(matched!.secondary[0].eventId).toBe("e-close");
  });

  it("uses primary source meta from metaMap", () => {
    const candidates = [
      makeCandidate({ sourceId: "usgs", eventId: "u1" }),
    ];
    const result = matchAndMerge(candidates, metaMap);
    expect(result[0].sourceMeta.name).toBe("USGS");
  });

  it("assigns quality scores to merged events", () => {
    const candidates = [
      makeCandidate({
        sourceId: "usgs",
        eventId: "u1",
        status: "reviewed",
        stationCount: 100,
        rms: 0.3,
        gapDistance: 50,
      }),
    ];
    const result = matchAndMerge(candidates, metaMap);
    expect(result[0].qualityLevel).toBe("high");
    expect(result[0].qualityScore).toBeGreaterThanOrEqual(70);
  });
});
