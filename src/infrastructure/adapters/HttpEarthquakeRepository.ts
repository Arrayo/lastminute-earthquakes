import type { EarthquakeRepository } from "../../domain/ports/EarthquakeRepository.ts";
import type { LatestManifest } from "../../domain/models/LatestManifest.ts";
import type { SnapshotIndex } from "../../domain/models/SnapshotIndex.ts";
import type { EventDetail } from "../../domain/models/EventDetail.ts";
import type { HttpClient } from "../http/HttpClient.ts";
import {
  parseLatestManifest,
  parseSnapshotIndex,
  parseEventDetail,
} from "../../domain/validation/parsers.ts";

export class HttpEarthquakeRepository implements EarthquakeRepository {
  readonly httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  async getLatestManifest(): Promise<LatestManifest> {
    const raw = await this.httpClient.get<unknown>("/data/latest.json");
    return parseLatestManifest(raw);
  }

  async getSnapshotIndex(path: string): Promise<SnapshotIndex> {
    const raw = await this.httpClient.get<unknown>(path);
    return parseSnapshotIndex(raw);
  }

  async getEventDetail(url: string): Promise<EventDetail> {
    const raw = await this.httpClient.get<unknown>(url);
    return parseEventDetail(raw);
  }
}
