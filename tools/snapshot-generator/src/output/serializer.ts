import type { MergedEvent } from "../types.ts";

export interface LatestManifestOutput {
  schemaVersion: number;
  generatedAt: string;
  snapshot: string;
}

export interface SnapshotEventItem {
  id: string;
  magnitude: number;
  place: string;
  coordinates: { latitude: number; longitude: number; depth: number };
  time: string;
  updatedAt: string;
  detailUrl: string | null;
}

export interface SnapshotIndexOutput {
  schemaVersion: number;
  generatedAt: string;
  source: { id: string; name: string; url: string; attribution: string };
  bbox: [number, number, number, number, number, number] | null;
  count: number;
  events: SnapshotEventItem[];
}

export interface EventDetailOutput {
  schemaVersion: 2;
  id: string;
  magnitude: number;
  magnitudeType: string;
  place: string;
  coordinates: { latitude: number; longitude: number; depth: number };
  time: string;
  updatedAt: string;
  source: { id: string; name: string; url: string; attribution: string };
  impact: {
    tsunami: boolean;
    felt: number | null;
    alert: string | null;
    cdi: number | null;
    mmi: number | null;
    significance: number;
  };
  quality: {
    status: string;
    gapDistance: number | null;
    rms: number | null;
    stationCount: number;
  };
  url: string;
}

export function serializeSnapshot(
  events: MergedEvent[],
  generatedAt: string,
  snapshotRelPath: string
): {
  manifest: LatestManifestOutput;
  index: SnapshotIndexOutput;
  details: Map<string, EventDetailOutput>;
} {
  const primarySource =
    events.length > 0
      ? events[0].sourceMeta
      : { id: "unknown", name: "Unknown", url: "", attribution: "" };

  const bbox = computeBBox(events);

  const eventsDir = snapshotRelPath.replace(/\/snapshot\.json$/, "/events");

  const indexEvents: SnapshotEventItem[] = events.map((ev) => ({
    id: ev.globalId,
    magnitude: ev.magnitude,
    place: ev.place,
    coordinates: {
      latitude: ev.latitude,
      longitude: ev.longitude,
      depth: ev.depth,
    },
    time: ev.time,
    updatedAt: ev.updatedAt,
    detailUrl: `${eventsDir}/${ev.globalId}.json`,
  }));

  const details = new Map<string, EventDetailOutput>();
  for (const ev of events) {
    details.set(ev.globalId, {
      schemaVersion: 2,
      id: ev.globalId,
      magnitude: ev.magnitude,
      magnitudeType: ev.magnitudeType,
      place: ev.place,
      coordinates: {
        latitude: ev.latitude,
        longitude: ev.longitude,
        depth: ev.depth,
      },
      time: ev.time,
      updatedAt: ev.updatedAt,
      source: ev.sourceMeta,
      impact: {
        tsunami: ev.tsunami,
        felt: ev.felt,
        alert: ev.alert,
        cdi: ev.cdi,
        mmi: ev.mmi,
        significance: ev.significance,
      },
      quality: {
        status: ev.status,
        gapDistance: ev.gapDistance,
        rms: ev.rms,
        stationCount: ev.stationCount,
      },
      url: ev.url,
    });
  }

  return {
    manifest: {
      schemaVersion: 1,
      generatedAt,
      snapshot: snapshotRelPath,
    },
    index: {
      schemaVersion: 1,
      generatedAt,
      source: primarySource,
      bbox,
      count: events.length,
      events: indexEvents,
    },
    details,
  };
}

function computeBBox(
  events: MergedEvent[]
): [number, number, number, number, number, number] | null {
  if (events.length === 0) return null;

  let minLon = Infinity;
  let minLat = Infinity;
  let minDepth = Infinity;
  let maxLon = -Infinity;
  let maxLat = -Infinity;
  let maxDepth = -Infinity;

  for (const ev of events) {
    if (ev.longitude < minLon) minLon = ev.longitude;
    if (ev.latitude < minLat) minLat = ev.latitude;
    if (ev.depth < minDepth) minDepth = ev.depth;
    if (ev.longitude > maxLon) maxLon = ev.longitude;
    if (ev.latitude > maxLat) maxLat = ev.latitude;
    if (ev.depth > maxDepth) maxDepth = ev.depth;
  }

  return [minLon, minLat, minDepth, maxLon, maxLat, maxDepth];
}
