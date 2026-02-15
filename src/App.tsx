import { HelmetProvider } from "react-helmet-async";
import { AppRouter } from "./ui/routes/AppRouter.tsx";
import { SnapshotProvider } from "./ui/components/SnapshotContext.tsx";
import { GetLatestSnapshot } from "./application/usecases/GetLatestSnapshot.ts";
import { HttpEarthquakeRepository } from "./infrastructure/adapters/HttpEarthquakeRepository.ts";
import { HttpClient } from "./infrastructure/http/HttpClient.ts";
import "./styles.css";

const httpClient = new HttpClient();
const repository = new HttpEarthquakeRepository(httpClient);
const getLatestSnapshot = new GetLatestSnapshot(repository);

export default function App() {
  return (
    <HelmetProvider>
      <SnapshotProvider getLatestSnapshot={getLatestSnapshot}>
        <AppRouter />
      </SnapshotProvider>
    </HelmetProvider>
  );
}
