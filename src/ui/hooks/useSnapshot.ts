import { useEffect, useState } from "react";
import type { SnapshotIndex } from "../../domain/models/SnapshotIndex.ts";
import type { GetLatestSnapshot } from "../../application/usecases/GetLatestSnapshot.ts";

interface UseSnapshotResult {
  snapshot: SnapshotIndex | null;
  loading: boolean;
  error: string | null;
}

export function useSnapshot(
  getLatestSnapshot: GetLatestSnapshot
): UseSnapshotResult {
  const [snapshot, setSnapshot] = useState<SnapshotIndex | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    getLatestSnapshot
      .execute()
      .then((data) => {
        if (!cancelled) {
          setSnapshot(data);
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Unknown error");
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [getLatestSnapshot]);

  return { snapshot, loading, error };
}
