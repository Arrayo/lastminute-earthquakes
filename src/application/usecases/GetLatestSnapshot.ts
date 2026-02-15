import type { EarthquakeRepository } from "../../domain/ports/EarthquakeRepository.ts";
import type { SnapshotIndex } from "../../domain/models/SnapshotIndex.ts";

export class GetLatestSnapshot {
  readonly repository: EarthquakeRepository;

  constructor(repository: EarthquakeRepository) {
    this.repository = repository;
  }

  async execute(): Promise<SnapshotIndex> {
    const manifest = await this.repository.getLatestManifest();
    return this.repository.getSnapshotIndex(manifest.snapshot);
  }
}
