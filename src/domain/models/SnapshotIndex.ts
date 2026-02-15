import type { SourceSnapshot } from "./SourceSnapshot.ts";
import type { SnapshotEventIndexItem } from "./SnapshotEventIndexItem.ts";

export type BBox = [number, number, number, number, number, number];

export interface SnapshotIndex {
  schemaVersion: number;
  generatedAt: string;
  source: SourceSnapshot;
  bbox: BBox | null;
  count: number;
  events: SnapshotEventIndexItem[];
}
