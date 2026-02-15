import type { EarthquakeRepository } from "../../domain/ports/EarthquakeRepository.ts";
import type { Snapshot } from "../../domain/models/Snapshot.ts";

export class GetLatestSnapshot {
  readonly repository: EarthquakeRepository;

  constructor(repository: EarthquakeRepository) {
    this.repository = repository;
  }

  async execute(): Promise<Snapshot> {
    const pointer = await this.repository.getLatestPointer();
    return this.repository.getSnapshot(pointer.snapshot);
  }
}
