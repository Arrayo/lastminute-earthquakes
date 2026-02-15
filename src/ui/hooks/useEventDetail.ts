import { useCallback, useEffect, useState } from "react";
import type { EventDetail } from "../../domain/models/EventDetail.ts";
import type { LoadEventDetailUseCase } from "../../application/usecases/LoadEventDetailUseCase.ts";

interface UseEventDetailResult {
  eventDetail: EventDetail | null;
  loading: boolean;
  error: string | null;
  load: (path: string) => void;
  reset: () => void;
}

export function useEventDetail(
  loadEventDetailUseCase: LoadEventDetailUseCase
): UseEventDetailResult {
  const [detailPath, setDetailPath] = useState<string | null>(null);
  const [eventDetail, setEventDetail] = useState<EventDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback((path: string) => {
    setDetailPath(path);
    setEventDetail(null);
    setLoading(true);
    setError(null);
  }, []);

  const reset = useCallback(() => {
    setDetailPath(null);
    setEventDetail(null);
    setLoading(false);
    setError(null);
  }, []);

  useEffect(() => {
    if (!detailPath) return;

    let cancelled = false;

    loadEventDetailUseCase
      .execute(detailPath)
      .then((data) => {
        if (!cancelled) {
          setEventDetail(data);
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
  }, [detailPath, loadEventDetailUseCase]);

  return { eventDetail, loading, error, load, reset };
}
