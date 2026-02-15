import { describe, it, expect } from "vitest";
import { haversineKm } from "../../tools/snapshot-generator/src/matching/haversine.ts";

describe("haversineKm", () => {
  it("returns 0 for identical points", () => {
    expect(haversineKm(0, 0, 0, 0)).toBe(0);
  });

  it("calculates known distance London to Paris", () => {
    const dist = haversineKm(51.5074, -0.1278, 48.8566, 2.3522);
    expect(dist).toBeGreaterThan(340);
    expect(dist).toBeLessThan(345);
  });

  it("calculates antipodal distance close to half circumference", () => {
    const dist = haversineKm(0, 0, 0, 180);
    expect(dist).toBeGreaterThan(20000);
    expect(dist).toBeLessThan(20100);
  });

  it("is symmetric", () => {
    const ab = haversineKm(34.0, -118.0, 36.0, -120.0);
    const ba = haversineKm(36.0, -120.0, 34.0, -118.0);
    expect(ab).toBeCloseTo(ba, 10);
  });
});
