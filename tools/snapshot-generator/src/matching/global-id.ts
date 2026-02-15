import type { CandidateEvent } from "../types.ts";

export function deriveGlobalId(
  primary: CandidateEvent,
  secondary: CandidateEvent[]
): string {
  const usgs =
    primary.sourceId === "usgs"
      ? primary
      : secondary.find((c) => c.sourceId === "usgs");

  if (usgs) {
    return `eq-${usgs.eventId}`;
  }

  return `eq-${primary.sourceId}-${primary.eventId}`;
}
