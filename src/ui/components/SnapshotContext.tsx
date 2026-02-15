import { createContext, useContext } from "react";
import type { SnapshotIndex } from "../../domain/models/SnapshotIndex.ts";
import type { GetLatestSnapshot } from "../../application/usecases/GetLatestSnapshot.ts";
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
  getLatestSnapshot: GetLatestSnapshot;
  children: React.ReactNode;
}

export function SnapshotProvider({
  getLatestSnapshot,
  children,
}: SnapshotProviderProps) {
  const value = useSnapshot(getLatestSnapshot);

  return (
    <SnapshotContext.Provider value={value}>
      {children}
    </SnapshotContext.Provider>
  );
}
