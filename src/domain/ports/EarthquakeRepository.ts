import type { LatestPointer } from "../models/LatestPointer.ts";
import type { Snapshot } from "../models/Snapshot.ts";

export interface EarthquakeRepository {
  getLatestPointer(): Promise<LatestPointer>;
  getSnapshot(path: string): Promise<Snapshot>;
}
