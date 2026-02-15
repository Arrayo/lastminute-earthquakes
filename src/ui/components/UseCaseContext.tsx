import { createContext, useContext } from "react";
import type { LoadLatestSnapshotUseCase } from "../../application/usecases/LoadLatestSnapshotUseCase.ts";
import type { LoadEventDetailUseCase } from "../../application/usecases/LoadEventDetailUseCase.ts";

interface UseCaseContextValue {
  loadLatestSnapshot: LoadLatestSnapshotUseCase;
  loadEventDetail: LoadEventDetailUseCase;
}

const UseCaseContext = createContext<UseCaseContextValue | null>(null);

export function useUseCases(): UseCaseContextValue {
  const ctx = useContext(UseCaseContext);
  if (!ctx) {
    throw new Error("useUseCases must be used within UseCaseProvider");
  }
  return ctx;
}

interface UseCaseProviderProps {
  loadLatestSnapshot: LoadLatestSnapshotUseCase;
  loadEventDetail: LoadEventDetailUseCase;
  children: React.ReactNode;
}

export function UseCaseProvider({
  loadLatestSnapshot,
  loadEventDetail,
  children,
}: UseCaseProviderProps) {
  return (
    <UseCaseContext.Provider value={{ loadLatestSnapshot, loadEventDetail }}>
      {children}
    </UseCaseContext.Provider>
  );
}
