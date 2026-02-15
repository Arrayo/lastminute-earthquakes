import type { CandidateEvent, SourceMeta } from "../types.ts";

export interface SourceAdapter {
  readonly meta: SourceMeta;
  fetch(windowStart: Date, windowEnd: Date): Promise<CandidateEvent[]>;
}
