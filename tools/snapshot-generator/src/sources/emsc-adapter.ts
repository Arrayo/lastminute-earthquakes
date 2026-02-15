import type { SourceAdapter } from "./source-adapter.ts";
import type { CandidateEvent, SourceMeta } from "../types.ts";
import { fetchWithRetry } from "../http/fetch-with-retry.ts";

interface EmscFeature {
  id: string;
  properties: {
    source_id: string;
    source_catalog: string;
    time: string;
    flynn_region: string;
    lat: number;
    lon: number;
    depth: number;
    mag: number;
    magtype: string;
    unid: string;
  };
}

interface EmscResponse {
  features?: EmscFeature[];
}

export class EmscAdapter implements SourceAdapter {
  readonly meta: SourceMeta = {
    id: "emsc",
    name: "EMSC / SeismicPortal",
    url: "https://www.seismicportal.eu/",
    attribution: "European-Mediterranean Seismological Centre",
  };

  constructor(
    private readonly baseUrl: string,
    private readonly minMagnitude: number | null
  ) {}

  async fetch(windowStart: Date, windowEnd: Date): Promise<CandidateEvent[]> {
    const params = new URLSearchParams({
      format: "json",
      starttime: windowStart.toISOString(),
      endtime: windowEnd.toISOString(),
    });

    if (this.minMagnitude !== null) {
      params.set("minmagnitude", String(this.minMagnitude));
    }

    const url = `${this.baseUrl}?${params.toString()}`;
    const data = (await fetchWithRetry(url)) as EmscResponse;

    if (!data.features || !Array.isArray(data.features)) {
      return [];
    }

    return data.features.map((f): CandidateEvent => ({
      sourceId: "emsc",
      eventId: f.id,
      magnitude: f.properties.mag,
      magnitudeType: f.properties.magtype ?? "ml",
      place: f.properties.flynn_region ?? "Unknown",
      latitude: f.properties.lat,
      longitude: f.properties.lon,
      depth: Math.abs(f.properties.depth),
      time: new Date(f.properties.time).toISOString(),
      url: `https://www.seismicportal.eu/eventdetail.html?unid=${f.properties.unid}`,
      status: "automatic",
      tsunami: false,
      felt: null,
      alert: null,
      cdi: null,
      mmi: null,
      significance: 0,
      stationCount: 0,
      rms: null,
      gapDistance: null,
    }));
  }
}
