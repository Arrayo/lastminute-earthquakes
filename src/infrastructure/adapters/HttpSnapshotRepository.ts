import type { SnapshotRepositoryPort } from "../../domain/ports/SnapshotRepositoryPort.ts";
import type { SnapshotIndex } from "../../domain/models/SnapshotIndex.ts";
import type { EventDetail } from "../../domain/models/EventDetail.ts";
import type { HttpClient } from "../http/HttpClient.ts";
import type { InMemoryCache } from "../cache/InMemoryCache.ts";
import {
  parseSnapshotIndex,
  parseEventDetail,
} from "../../domain/validation/parsers.ts";

export class HttpSnapshotRepository implements SnapshotRepositoryPort {
  readonly httpClient: HttpClient;
  readonly cache: InMemoryCache;

  constructor(httpClient: HttpClient, cache: InMemoryCache) {
    this.httpClient = httpClient;
    this.cache = cache;
  }

  async getSnapshotIndex(path: string): Promise<SnapshotIndex> {
    const cached = this.cache.get<SnapshotIndex>(path);
    if (cached) {
      return cached;
    }

    const raw = await this.httpClient.get<unknown>(path);
    const index = parseSnapshotIndex(raw);
    this.cache.set(path, index);
    return index;
  }

  async getEventDetail(path: string): Promise<EventDetail> {
    const cached = this.cache.get<EventDetail>(path);
    if (cached) {
      return cached;
    }

    const raw = await this.httpClient.get<unknown>(path);
    const detail = parseEventDetail(raw);
    this.cache.set(path, detail);
    return detail;
  }
}
