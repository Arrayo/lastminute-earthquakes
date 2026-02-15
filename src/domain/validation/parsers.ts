import type { LatestManifest } from "../models/LatestManifest.ts";
import type { SnapshotIndex } from "../models/SnapshotIndex.ts";
import type { EventDetail } from "../models/EventDetail.ts";
import {
  LatestManifestSchema,
  SnapshotIndexSchema,
  EventDetailSchema,
} from "./schemas.ts";

export function parseLatestManifest(data: unknown): LatestManifest {
  return LatestManifestSchema.parse(data) as LatestManifest;
}

export function parseSnapshotIndex(data: unknown): SnapshotIndex {
  return SnapshotIndexSchema.parse(data) as SnapshotIndex;
}

export function parseEventDetail(data: unknown): EventDetail {
  return EventDetailSchema.parse(data) as EventDetail;
}
