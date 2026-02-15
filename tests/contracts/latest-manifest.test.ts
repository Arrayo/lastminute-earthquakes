import { describe, it, expect } from "vitest";
import { parseLatestManifest } from "../../src/domain/validation/parsers.ts";
import fixture from "../fixtures/latest-manifest.json";

describe("LatestManifest contract", () => {
  it("parses a valid fixture", () => {
    const result = parseLatestManifest(fixture);
    expect(result.schemaVersion).toBe(1);
    expect(result.snapshot).toContain("/data/");
    expect(result.generatedAt).toBeTruthy();
  });

  it("rejects missing schemaVersion", () => {
    const { schemaVersion: _schemaVersion, ...rest } = fixture;
    void _schemaVersion;
    expect(() => parseLatestManifest(rest)).toThrow();
  });

  it("rejects empty snapshot path", () => {
    expect(() =>
      parseLatestManifest({ ...fixture, snapshot: "" })
    ).toThrow();
  });

  it("rejects invalid generatedAt", () => {
    expect(() =>
      parseLatestManifest({ ...fixture, generatedAt: "not-a-date" })
    ).toThrow();
  });
});
