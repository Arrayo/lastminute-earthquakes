import { describe, it, expect } from "vitest";
import { assessCandidate } from "../../tools/snapshot-generator/src/quality/assess.ts";
import { makeCandidate } from "./helpers.ts";

describe("assessCandidate", () => {
  it("returns low for minimal automatic event", () => {
    const c = makeCandidate({
      status: "automatic",
      stationCount: 0,
      rms: null,
      gapDistance: null,
    });
    const { level, score } = assessCandidate(c, false);
    expect(level).toBe("low");
    expect(score).toBe(15);
  });

  it("returns high for reviewed event with many stations and good rms", () => {
    const c = makeCandidate({
      status: "reviewed",
      stationCount: 150,
      rms: 0.3,
      gapDistance: 50,
    });
    const { level, score } = assessCandidate(c, false);
    expect(level).toBe("high");
    expect(score).toBe(100);
  });

  it("adds 10 points for multi-source confirmation", () => {
    const c = makeCandidate({
      status: "automatic",
      stationCount: 0,
      rms: null,
      gapDistance: null,
    });
    const single = assessCandidate(c, false);
    const multi = assessCandidate(c, true);
    expect(multi.score - single.score).toBe(10);
  });

  it("caps score at 100", () => {
    const c = makeCandidate({
      status: "reviewed",
      stationCount: 200,
      rms: 0.1,
      gapDistance: 30,
    });
    const { score } = assessCandidate(c, true);
    expect(score).toBe(100);
  });

  it("returns medium for moderate event", () => {
    const c = makeCandidate({
      status: "reviewed",
      stationCount: 5,
      rms: 1.5,
      gapDistance: 200,
    });
    const { level, score } = assessCandidate(c, false);
    expect(level).toBe("medium");
    expect(score).toBe(40);
  });

  it("scores station tiers correctly", () => {
    const base = {
      status: "automatic" as const,
      rms: null,
      gapDistance: null,
    };

    const tier10 = assessCandidate(makeCandidate({ ...base, stationCount: 10 }), false);
    const tier40 = assessCandidate(makeCandidate({ ...base, stationCount: 40 }), false);
    const tier100 = assessCandidate(makeCandidate({ ...base, stationCount: 100 }), false);

    expect(tier10.score).toBe(25);
    expect(tier40.score).toBe(35);
    expect(tier100.score).toBe(45);
  });

  it("scores rms tiers correctly", () => {
    const base = {
      status: "automatic" as const,
      stationCount: 0,
      gapDistance: null,
    };

    const good = assessCandidate(makeCandidate({ ...base, rms: 0.3 }), false);
    const ok = assessCandidate(makeCandidate({ ...base, rms: 0.7 }), false);

    expect(good.score).toBe(30);
    expect(ok.score).toBe(23);
  });

  it("scores gap tiers correctly", () => {
    const base = {
      status: "automatic" as const,
      stationCount: 0,
      rms: null,
    };

    const tight = assessCandidate(makeCandidate({ ...base, gapDistance: 60 }), false);
    const mid = assessCandidate(makeCandidate({ ...base, gapDistance: 120 }), false);

    expect(tight.score).toBe(30);
    expect(mid.score).toBe(23);
  });
});
