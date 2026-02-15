import type { Earthquake } from "./Earthquake.ts";

export interface Snapshot {
  generatedAt: string;
  source: string;
  count: number;
  earthquakes: Earthquake[];
}
