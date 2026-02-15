export type AlertLevel = "green" | "yellow" | "orange" | "red";

export interface ImpactSummary {
  tsunami: boolean;
  felt: number | null;
  alert: AlertLevel | null;
  cdi: number | null;
  mmi: number | null;
  significance: number;
}
