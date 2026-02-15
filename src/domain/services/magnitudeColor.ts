export function magnitudeColor(magnitude: number): string {
  if (magnitude >= 7) return "#dc2626";
  if (magnitude >= 5) return "#f59e0b";
  if (magnitude >= 3) return "#22c55e";
  return "#38bdf8";
}

export function magnitudeRadius(magnitude: number): number {
  return Math.max(6, Math.min(magnitude * 4, 30));
}
