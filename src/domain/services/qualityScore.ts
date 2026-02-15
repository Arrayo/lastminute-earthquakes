import type { DataQuality } from "../models/DataQuality.ts";

export type QualityLevel = "high" | "medium" | "low";

export interface QualityAssessment {
  level: QualityLevel;
  score: number;
}

export function assessQuality(quality: DataQuality): QualityAssessment {
  let score = 0;

  if (quality.status === "reviewed") score += 40;
  else if (quality.status === "automatic") score += 15;

  if (quality.stationCount >= 100) score += 30;
  else if (quality.stationCount >= 40) score += 20;
  else if (quality.stationCount >= 10) score += 10;

  if (quality.rms !== null && quality.rms < 0.5) score += 15;
  else if (quality.rms !== null && quality.rms < 1.0) score += 8;

  if (quality.gapDistance !== null && quality.gapDistance < 90) score += 15;
  else if (quality.gapDistance !== null && quality.gapDistance < 180) score += 8;

  const level: QualityLevel =
    score >= 70 ? "high" : score >= 40 ? "medium" : "low";

  return { level, score };
}
