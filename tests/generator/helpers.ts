import type { CandidateEvent } from "../../tools/snapshot-generator/src/types.ts";

export function makeCandidate(
  overrides: Partial<CandidateEvent> = {}
): CandidateEvent {
  return {
    sourceId: "usgs",
    eventId: "test001",
    magnitude: 4.5,
    magnitudeType: "mww",
    place: "Test Location",
    latitude: 35.0,
    longitude: -118.0,
    depth: 10.0,
    time: "2026-02-15T12:00:00.000Z",
    url: "https://example.com/event/test001",
    status: "automatic",
    tsunami: false,
    felt: null,
    alert: null,
    cdi: null,
    mmi: null,
    significance: 100,
    stationCount: 20,
    rms: null,
    gapDistance: null,
    ...overrides,
  };
}
