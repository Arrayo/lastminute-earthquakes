import type { GeneratorConfig } from "./types.ts";

const USGS_DEFAULT =
  "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson";

const EMSC_DEFAULT = "https://www.seismicportal.eu/fdsnws/event/1/query";

export function buildConfig(cliOpts: {
  windowMinutes?: number;
  minMagnitude?: number;
  outputDir?: string;
}): GeneratorConfig {
  return {
    windowMinutes:
      cliOpts.windowMinutes ??
      toNumber(process.env["SNAPSHOT_WINDOW_MINUTES"]) ??
      120,
    minMagnitude:
      cliOpts.minMagnitude ??
      toNumber(process.env["SNAPSHOT_MIN_MAGNITUDE"]) ??
      null,
    outputDir:
      cliOpts.outputDir ?? process.env["SNAPSHOT_OUTPUT_DIR"] ?? "public/data",
    usgsUrl: process.env["USGS_FEED_URL"] ?? USGS_DEFAULT,
    emscBaseUrl: process.env["EMSC_BASE_URL"] ?? EMSC_DEFAULT,
  };
}

function toNumber(val: string | undefined): number | null {
  if (val === undefined || val === "") return null;
  const n = Number(val);
  return Number.isFinite(n) ? n : null;
}
