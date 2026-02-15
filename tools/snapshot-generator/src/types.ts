export interface SourceMeta {
  id: string;
  name: string;
  url: string;
  attribution: string;
}

export interface CandidateEvent {
  sourceId: string;
  eventId: string;
  magnitude: number;
  magnitudeType: string;
  place: string;
  latitude: number;
  longitude: number;
  depth: number;
  time: string;
  url: string;
  status: string;
  tsunami: boolean;
  felt: number | null;
  alert: string | null;
  cdi: number | null;
  mmi: number | null;
  significance: number;
  stationCount: number;
  rms: number | null;
  gapDistance: number | null;
}

export interface MergedEvent {
  globalId: string;
  primary: CandidateEvent;
  secondary: CandidateEvent[];
  magnitude: number;
  magnitudeType: string;
  place: string;
  latitude: number;
  longitude: number;
  depth: number;
  time: string;
  updatedAt: string;
  url: string;
  sourceMeta: SourceMeta;
  status: string;
  tsunami: boolean;
  felt: number | null;
  alert: string | null;
  cdi: number | null;
  mmi: number | null;
  significance: number;
  stationCount: number;
  rms: number | null;
  gapDistance: number | null;
  qualityLevel: "high" | "medium" | "low";
  qualityScore: number;
}

export interface GeneratorConfig {
  windowMinutes: number;
  minMagnitude: number | null;
  outputDir: string;
  usgsUrl: string;
  emscBaseUrl: string;
}
