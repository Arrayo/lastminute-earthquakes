import type { ManifestRepositoryPort } from "../../domain/ports/ManifestRepositoryPort.ts";
import type { SnapshotRepositoryPort } from "../../domain/ports/SnapshotRepositoryPort.ts";
import type { SnapshotIndex } from "../../domain/models/SnapshotIndex.ts";

export class LoadLatestSnapshotUseCase {
  readonly manifestRepository: ManifestRepositoryPort;
  readonly snapshotRepository: SnapshotRepositoryPort;

  constructor(
    manifestRepository: ManifestRepositoryPort,
    snapshotRepository: SnapshotRepositoryPort
  ) {
    this.manifestRepository = manifestRepository;
    this.snapshotRepository = snapshotRepository;
  }

  async execute(): Promise<SnapshotIndex> {
    const manifest = await this.manifestRepository.getLatestManifest();
    return this.snapshotRepository.getSnapshotIndex(manifest.snapshot);
  }
}
