import { HelmetProvider } from "react-helmet-async";
import { AppRouter } from "./ui/routes/AppRouter.tsx";
import { SnapshotProvider } from "./ui/components/SnapshotContext.tsx";
import { UseCaseProvider } from "./ui/components/UseCaseContext.tsx";
import { LoadLatestSnapshotUseCase } from "./application/usecases/LoadLatestSnapshotUseCase.ts";
import { LoadEventDetailUseCase } from "./application/usecases/LoadEventDetailUseCase.ts";
import { HttpManifestRepository } from "./infrastructure/adapters/HttpManifestRepository.ts";
import { HttpSnapshotRepository } from "./infrastructure/adapters/HttpSnapshotRepository.ts";
import { HttpClient } from "./infrastructure/http/HttpClient.ts";
import { InMemoryCache } from "./infrastructure/cache/InMemoryCache.ts";
import "./styles.css";

const httpClient = new HttpClient();
const cache = new InMemoryCache();
const manifestRepo = new HttpManifestRepository(httpClient, cache);
const snapshotRepo = new HttpSnapshotRepository(httpClient, cache);
const loadLatestSnapshot = new LoadLatestSnapshotUseCase(manifestRepo, snapshotRepo);
const loadEventDetail = new LoadEventDetailUseCase(snapshotRepo);

export default function App() {
  return (
    <HelmetProvider>
      <UseCaseProvider
        loadLatestSnapshot={loadLatestSnapshot}
        loadEventDetail={loadEventDetail}
      >
        <SnapshotProvider loadLatestSnapshot={loadLatestSnapshot}>
          <AppRouter />
        </SnapshotProvider>
      </UseCaseProvider>
    </HelmetProvider>
  );
}
