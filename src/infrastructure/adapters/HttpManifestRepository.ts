import type { ManifestRepositoryPort } from "../../domain/ports/ManifestRepositoryPort.ts";
import type { LatestManifest } from "../../domain/models/LatestManifest.ts";
import type { HttpClient } from "../http/HttpClient.ts";
import type { InMemoryCache } from "../cache/InMemoryCache.ts";
import { parseLatestManifest } from "../../domain/validation/parsers.ts";

const CACHE_KEY = "latest-manifest";

export class HttpManifestRepository implements ManifestRepositoryPort {
  readonly httpClient: HttpClient;
  readonly cache: InMemoryCache;

  constructor(httpClient: HttpClient, cache: InMemoryCache) {
    this.httpClient = httpClient;
    this.cache = cache;
  }

  async getLatestManifest(): Promise<LatestManifest> {
    const cached = this.cache.get<LatestManifest>(CACHE_KEY);
    if (cached) {
      return cached;
    }

    const raw = await this.httpClient.get<unknown>("/data/latest.json");
    const manifest = parseLatestManifest(raw);
    this.cache.set(CACHE_KEY, manifest);
    return manifest;
  }
}
