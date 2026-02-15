import type { CandidateEvent, MergedEvent, SourceMeta } from "../types.ts";
import { haversineKm } from "./haversine.ts";
import { deriveGlobalId } from "./global-id.ts";
import { assessCandidate } from "../quality/assess.ts";

const TIME_THRESHOLD_MS = 16_000;
const DISTANCE_THRESHOLD_KM = 100;
const MAGNITUDE_THRESHOLD = 0.5;

interface SourceMetaMap {
  [sourceId: string]: SourceMeta;
}

export function matchAndMerge(
  candidates: CandidateEvent[],
  metaMap: SourceMetaMap
): MergedEvent[] {
  const usgs = candidates
    .filter((c) => c.sourceId === "usgs")
    .sort((a, b) => b.magnitude - a.magnitude);

  const emsc = candidates
    .filter((c) => c.sourceId === "emsc")
    .sort((a, b) => b.magnitude - a.magnitude);

  const matchedEmscIds = new Set<string>();
  const merged: MergedEvent[] = [];

  for (const u of usgs) {
    let bestMatch: CandidateEvent | null = null;
    let bestDist = Infinity;

    for (const e of emsc) {
      if (matchedEmscIds.has(e.eventId)) continue;

      const timeDiff = Math.abs(
        new Date(u.time).getTime() - new Date(e.time).getTime()
      );
      if (timeDiff > TIME_THRESHOLD_MS) continue;

      const magDiff = Math.abs(u.magnitude - e.magnitude);
      if (magDiff > MAGNITUDE_THRESHOLD) continue;

      const dist = haversineKm(u.latitude, u.longitude, e.latitude, e.longitude);
      if (dist > DISTANCE_THRESHOLD_KM) continue;

      if (dist < bestDist) {
        bestDist = dist;
        bestMatch = e;
      }
    }

    const secondary = bestMatch ? [bestMatch] : [];
    if (bestMatch) matchedEmscIds.add(bestMatch.eventId);

    merged.push(buildMerged(u, secondary, metaMap));
  }

  for (const e of emsc) {
    if (matchedEmscIds.has(e.eventId)) continue;
    merged.push(buildMerged(e, [], metaMap));
  }

  merged.sort((a, b) => {
    const timeCmp = b.time.localeCompare(a.time);
    return timeCmp !== 0 ? timeCmp : a.globalId.localeCompare(b.globalId);
  });

  return merged;
}

function buildMerged(
  primary: CandidateEvent,
  secondary: CandidateEvent[],
  metaMap: SourceMetaMap
): MergedEvent {
  const globalId = deriveGlobalId(primary, secondary);
  const now = new Date().toISOString();
  const { level, score } = assessCandidate(primary, secondary.length > 0);

  return {
    globalId,
    primary,
    secondary,
    magnitude: primary.magnitude,
    magnitudeType: primary.magnitudeType,
    place: primary.place,
    latitude: primary.latitude,
    longitude: primary.longitude,
    depth: primary.depth,
    time: primary.time,
    updatedAt: now,
    url: primary.url,
    sourceMeta: metaMap[primary.sourceId] ?? {
      id: primary.sourceId,
      name: primary.sourceId,
      url: "",
      attribution: "",
    },
    status: primary.status,
    tsunami: primary.tsunami,
    felt: primary.felt,
    alert: primary.alert,
    cdi: primary.cdi,
    mmi: primary.mmi,
    significance: primary.significance,
    stationCount: Math.max(
      primary.stationCount,
      ...secondary.map((s) => s.stationCount)
    ),
    rms: primary.rms,
    gapDistance: primary.gapDistance,
    qualityLevel: level,
    qualityScore: score,
  };
}
