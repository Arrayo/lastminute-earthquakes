import type { GeneratorConfig, CandidateEvent, SourceMeta } from "./types.ts";
import type { SourceAdapter } from "./sources/source-adapter.ts";
import { UsgsAdapter } from "./sources/usgs-adapter.ts";
import { EmscAdapter } from "./sources/emsc-adapter.ts";
import { matchAndMerge } from "./matching/matcher.ts";
import { serializeSnapshot } from "./output/serializer.ts";
import { writeSnapshot } from "./output/writer.ts";

export async function runPipeline(config: GeneratorConfig): Promise<void> {
  const now = new Date();
  const windowEnd = now;
  const windowStart = new Date(
    now.getTime() - config.windowMinutes * 60 * 1000
  );

  const adapters: SourceAdapter[] = [
    new UsgsAdapter(config.usgsUrl),
    new EmscAdapter(config.emscBaseUrl, config.minMagnitude),
  ];

  const metaMap: Record<string, SourceMeta> = {};
  for (const adapter of adapters) {
    metaMap[adapter.meta.id] = adapter.meta;
  }

  console.log(
    `Fetching events from ${windowStart.toISOString()} to ${windowEnd.toISOString()}`
  );

  const allCandidates: CandidateEvent[] = [];

  const results = await Promise.allSettled(
    adapters.map(async (adapter) => {
      console.log(`  Fetching from ${adapter.meta.name}…`);
      const events = await adapter.fetch(windowStart, windowEnd);
      console.log(`  ${adapter.meta.name}: ${events.length} events`);
      return events;
    })
  );

  for (const result of results) {
    if (result.status === "fulfilled") {
      allCandidates.push(...result.value);
    } else {
      console.error(`  Source failed: ${String(result.reason)}`);
    }
  }

  if (allCandidates.length === 0) {
    console.log("No events found. Writing empty snapshot.");
  }

  console.log(`Total candidates: ${allCandidates.length}`);

  const merged = matchAndMerge(allCandidates, metaMap);
  console.log(
    `Merged events: ${merged.length} (${merged.filter((m) => m.secondary.length > 0).length} multi-source)`
  );

  const generatedAt = now.toISOString();
  const ts = formatTimestamp(now);
  const snapshotRelPath = `/data/snapshots/${ts}/snapshot.json`;

  const { manifest, index, details } = serializeSnapshot(
    merged,
    generatedAt,
    snapshotRelPath
  );

  writeSnapshot(config.outputDir, ts, manifest, index, details);

  console.log(`Snapshot written to ${config.outputDir}/snapshots/${ts}/`);
  console.log(`latest.json updated → ${snapshotRelPath}`);
}

function formatTimestamp(date: Date): string {
  const y = date.getUTCFullYear();
  const mo = pad(date.getUTCMonth() + 1);
  const d = pad(date.getUTCDate());
  const h = pad(date.getUTCHours());
  const mi = pad(date.getUTCMinutes());
  const s = pad(date.getUTCSeconds());
  return `${y}${mo}${d}-${h}${mi}${s}`;
}

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}
