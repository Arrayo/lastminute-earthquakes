import type { DataQuality } from "../../domain/models/DataQuality.ts";
import { assessQuality } from "../../domain/services/qualityScore.ts";
import type { QualityLevel } from "../../domain/services/qualityScore.ts";

const LEVEL_LABELS: Record<QualityLevel, string> = {
  high: "High",
  medium: "Medium",
  low: "Low",
};

interface QualityBadgeProps {
  quality: DataQuality;
}

export function QualityBadge({ quality }: QualityBadgeProps) {
  const { level, score } = assessQuality(quality);

  return (
    <span
      className={`quality-badge quality-badge--${level}`}
      title={`Quality score: ${score}/100`}
    >
      {LEVEL_LABELS[level]} ({score})
    </span>
  );
}
