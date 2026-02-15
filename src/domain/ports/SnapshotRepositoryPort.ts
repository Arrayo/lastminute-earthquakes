import type { SnapshotIndex } from "../models/SnapshotIndex.ts";
import type { EventDetail } from "../models/EventDetail.ts";

export interface SnapshotRepositoryPort {
  getSnapshotIndex(path: string): Promise<SnapshotIndex>;
  getEventDetail(path: string): Promise<EventDetail>;
}
