import type { SnapshotRepositoryPort } from "../../domain/ports/SnapshotRepositoryPort.ts";
import type { EventDetail } from "../../domain/models/EventDetail.ts";

export class LoadEventDetailUseCase {
  readonly snapshotRepository: SnapshotRepositoryPort;

  constructor(snapshotRepository: SnapshotRepositoryPort) {
    this.snapshotRepository = snapshotRepository;
  }

  async execute(detailPath: string): Promise<EventDetail> {
    return this.snapshotRepository.getEventDetail(detailPath);
  }
}
