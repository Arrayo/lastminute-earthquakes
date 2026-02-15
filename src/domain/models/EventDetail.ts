import type { Coordinates } from "./Coordinates.ts";
import type { SourceSnapshot } from "./SourceSnapshot.ts";
import type { ImpactSummary } from "./ImpactSummary.ts";
import type { DataQuality } from "./DataQuality.ts";

export interface EventDetail {
  schemaVersion: 2;
  id: string;
  magnitude: number;
  magnitudeType: string;
  place: string;
  coordinates: Coordinates;
  time: string;
  updatedAt: string;
  source: SourceSnapshot;
  impact: ImpactSummary;
  quality: DataQuality;
  url: string;
}
