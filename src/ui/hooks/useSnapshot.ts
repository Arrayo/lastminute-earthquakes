import { useEffect, useState } from "react";
import type { SnapshotIndex } from "../../domain/models/SnapshotIndex.ts";
import type { LoadLatestSnapshotUseCase } from "../../application/usecases/LoadLatestSnapshotUseCase.ts";

interface UseSnapshotResult {
  snapshot: SnapshotIndex | null;
  loading: boolean;
  error: string | null;
}

export function useSnapshot(
  loadLatestSnapshot: LoadLatestSnapshotUseCase
): UseSnapshotResult {
  const [snapshot, setSnapshot] = useState<SnapshotIndex | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    loadLatestSnapshot
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
  }, [loadLatestSnapshot]);

  return { snapshot, loading, error };
}
