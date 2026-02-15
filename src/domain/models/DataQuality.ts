export type ReviewStatus = "reviewed" | "automatic" | "deleted";

export interface DataQuality {
  status: ReviewStatus;
  gapDistance: number | null;
  rms: number | null;
  stationCount: number;
}
