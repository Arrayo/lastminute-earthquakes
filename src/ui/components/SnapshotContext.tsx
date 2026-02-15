import { createContext, useContext } from "react";
import type { SnapshotIndex } from "../../domain/models/SnapshotIndex.ts";
import type { LoadLatestSnapshotUseCase } from "../../application/usecases/LoadLatestSnapshotUseCase.ts";
import { useSnapshot } from "../hooks/useSnapshot.ts";

interface SnapshotContextValue {
  snapshot: SnapshotIndex | null;
  loading: boolean;
  error: string | null;
}

const SnapshotContext = createContext<SnapshotContextValue>({
  snapshot: null,
  loading: true,
  error: null,
});

export function useSnapshotContext(): SnapshotContextValue {
  return useContext(SnapshotContext);
}

interface SnapshotProviderProps {
  loadLatestSnapshot: LoadLatestSnapshotUseCase;
  children: React.ReactNode;
}

export function SnapshotProvider({
  loadLatestSnapshot,
  children,
}: SnapshotProviderProps) {
  const value = useSnapshot(loadLatestSnapshot);

  return (
    <SnapshotContext.Provider value={value}>
      {children}
    </SnapshotContext.Provider>
  );
}
