import { Command } from "commander";
import { buildConfig } from "./config.ts";
import { runPipeline } from "./pipeline.ts";

const program = new Command();

program
  .name("snapshot-generator")
  .description("Fetch earthquake data and generate static snapshot files")
  .option(
    "-w, --window-minutes <number>",
    "Time window in minutes",
    parseIntOption
  )
  .option(
    "-m, --min-magnitude <number>",
    "Minimum magnitude filter",
    parseFloatOption
  )
  .option(
    "-o, --output-dir <path>",
    "Output directory for generated files"
  )
  .action(async (opts: { windowMinutes?: number; minMagnitude?: number; outputDir?: string }) => {
    const config = buildConfig(opts);

    console.log("Snapshot Generator");
    console.log(`  Window: ${config.windowMinutes} minutes`);
    console.log(
      `  Min magnitude: ${config.minMagnitude !== null ? config.minMagnitude : "none"}`
    );
    console.log(`  Output: ${config.outputDir}`);
    console.log("");

    try {
      await runPipeline(config);
      console.log("\nDone.");
    } catch (err) {
      console.error("\nFatal error:", err);
      process.exit(1);
    }
  });

program.parse();

function parseIntOption(value: string): number {
  const n = parseInt(value, 10);
  if (Number.isNaN(n)) throw new Error(`Invalid integer: ${value}`);
  return n;
}

function parseFloatOption(value: string): number {
  const n = parseFloat(value);
  if (Number.isNaN(n)) throw new Error(`Invalid number: ${value}`);
  return n;
}
