import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import type { LatestManifestOutput, SnapshotIndexOutput, EventDetailOutput } from "./serializer.ts";

const MAX_EVENT_BYTES = 80 * 1024;

export function writeSnapshot(
  outputDir: string,
  snapshotSubdir: string,
  manifest: LatestManifestOutput,
  index: SnapshotIndexOutput,
  details: Map<string, EventDetailOutput>
): void {
  const snapshotDir = join(outputDir, "snapshots", snapshotSubdir);
  const eventsDir = join(snapshotDir, "events");

  mkdirSync(eventsDir, { recursive: true });

  writeJson(join(snapshotDir, "snapshot.json"), index);

  for (const [globalId, detail] of details) {
    const json = JSON.stringify(detail, null, 2);

    if (Buffer.byteLength(json, "utf-8") > MAX_EVENT_BYTES) {
      const trimmed = {
        schemaVersion: detail.schemaVersion,
        id: detail.id,
        magnitude: detail.magnitude,
        magnitudeType: detail.magnitudeType,
        place: detail.place,
        coordinates: detail.coordinates,
        time: detail.time,
        updatedAt: detail.updatedAt,
        source: detail.source,
        impact: detail.impact,
        quality: detail.quality,
        url: detail.url,
      };
      writeJson(join(eventsDir, `${globalId}.json`), trimmed);
    } else {
      writeFileSync(join(eventsDir, `${globalId}.json`), json, "utf-8");
    }
  }

  writeJson(join(outputDir, "latest.json"), manifest);
}

function writeJson(filePath: string, data: unknown): void {
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n", "utf-8");
}
