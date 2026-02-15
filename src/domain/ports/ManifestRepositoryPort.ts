import type { LatestManifest } from "../models/LatestManifest.ts";

export interface ManifestRepositoryPort {
  getLatestManifest(): Promise<LatestManifest>;
}
