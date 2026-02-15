import type { SourceAdapter } from "./source-adapter.ts";
import type { CandidateEvent, SourceMeta } from "../types.ts";
import { fetchWithRetry } from "../http/fetch-with-retry.ts";

interface UsgsFeature {
  id: string;
  properties: {
    mag: number | null;
    place: string | null;
    time: number;
    url: string;
    status: string;
    tsunami: number;
    felt: number | null;
    alert: string | null;
    cdi: number | null;
    mmi: number | null;
    sig: number;
    nst: number | null;
    rms: number | null;
    gap: number | null;
    magType: string | null;
    type: string;
  };
  geometry: {
    coordinates: [number, number, number];
  };
}

interface UsgsResponse {
  features: UsgsFeature[];
}

export class UsgsAdapter implements SourceAdapter {
  readonly meta: SourceMeta = {
    id: "usgs",
    name: "USGS Earthquake Hazards Program",
    url: "https://earthquake.usgs.gov/",
    attribution: "U.S. Geological Survey",
  };

  constructor(private readonly feedUrl: string) {}

  async fetch(
    ...[_windowStart, _windowEnd]: [Date, Date]
  ): Promise<CandidateEvent[]> {
    void _windowStart;
    void _windowEnd;
    const data = (await fetchWithRetry(this.feedUrl)) as UsgsResponse;

    if (!data.features || !Array.isArray(data.features)) {
      return [];
    }

    return data.features
      .filter(
        (f) =>
          f.properties.type === "earthquake" && f.properties.mag !== null
      )
      .map((f): CandidateEvent => ({
        sourceId: "usgs",
        eventId: String(f.id),
        magnitude: f.properties.mag!,
        magnitudeType: f.properties.magType ?? "ml",
        place: f.properties.place ?? "Unknown",
        latitude: f.geometry.coordinates[1],
        longitude: f.geometry.coordinates[0],
        depth: f.geometry.coordinates[2],
        time: new Date(f.properties.time).toISOString(),
        url: f.properties.url,
        status: f.properties.status,
        tsunami: f.properties.tsunami === 1,
        felt: f.properties.felt,
        alert: f.properties.alert,
        cdi: f.properties.cdi,
        mmi: f.properties.mmi,
        significance: f.properties.sig,
        stationCount: f.properties.nst ?? 0,
        rms: f.properties.rms,
        gapDistance: f.properties.gap,
      }));
  }
}
