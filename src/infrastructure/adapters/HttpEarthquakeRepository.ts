import type { EarthquakeRepository } from "../../domain/ports/EarthquakeRepository.ts";
import type { LatestPointer } from "../../domain/models/LatestPointer.ts";
import type { Snapshot } from "../../domain/models/Snapshot.ts";
import type { HttpClient } from "../http/HttpClient.ts";

export class HttpEarthquakeRepository implements EarthquakeRepository {
  readonly httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  async getLatestPointer(): Promise<LatestPointer> {
    return this.httpClient.get<LatestPointer>("/data/latest.json");
  }

  async getSnapshot(path: string): Promise<Snapshot> {
    return this.httpClient.get<Snapshot>(path);
  }
}
