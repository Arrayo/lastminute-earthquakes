import type { CandidateEvent } from "../types.ts";

export type QualityLevel = "high" | "medium" | "low";

export interface QualityResult {
  level: QualityLevel;
  score: number;
}

export function assessCandidate(
  candidate: CandidateEvent,
  hasMultipleSources: boolean
): QualityResult {
  let score = 0;

  if (candidate.status === "reviewed") score += 40;
  else if (candidate.status === "automatic") score += 15;

  if (candidate.stationCount >= 100) score += 30;
  else if (candidate.stationCount >= 40) score += 20;
  else if (candidate.stationCount >= 10) score += 10;

  if (candidate.rms !== null && candidate.rms < 0.5) score += 15;
  else if (candidate.rms !== null && candidate.rms < 1.0) score += 8;

  if (candidate.gapDistance !== null && candidate.gapDistance < 90) score += 15;
  else if (candidate.gapDistance !== null && candidate.gapDistance < 180)
    score += 8;

  if (hasMultipleSources) score += 10;

  score = Math.min(score, 100);

  const level: QualityLevel =
    score >= 70 ? "high" : score >= 40 ? "medium" : "low";

  return { level, score };
}
