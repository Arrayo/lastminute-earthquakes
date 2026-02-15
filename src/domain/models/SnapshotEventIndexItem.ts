import type { Coordinates } from "./Coordinates.ts";

export interface SnapshotEventIndexItem {
  id: string;
  magnitude: number;
  place: string;
  coordinates: Coordinates;
  time: string;
  updatedAt: string;
  detailUrl: string | null;
}
