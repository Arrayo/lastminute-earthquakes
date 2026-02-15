import type { LatestManifest } from "../models/LatestManifest.ts";
import type { SnapshotIndex } from "../models/SnapshotIndex.ts";
import type { EventDetail } from "../models/EventDetail.ts";

export interface EarthquakeRepository {
  getLatestManifest(): Promise<LatestManifest>;
  getSnapshotIndex(path: string): Promise<SnapshotIndex>;
  getEventDetail(url: string): Promise<EventDetail>;
}
