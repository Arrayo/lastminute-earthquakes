import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "../layouts/MainLayout.tsx";
import { HomePage } from "../pages/HomePage.tsx";

const MapPage = lazy(() =>
  import("../pages/MapPage.tsx").then((m) => ({ default: m.MapPage }))
);
const SourcesPage = lazy(() =>
  import("../pages/SourcesPage.tsx").then((m) => ({ default: m.SourcesPage }))
);
const MethodologyPage = lazy(() =>
  import("../pages/MethodologyPage.tsx").then((m) => ({
    default: m.MethodologyPage,
  }))
);

function RouteLoader() {
  return <p className="loading">Loading…</p>;
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route
            path="map"
            element={
              <Suspense fallback={<RouteLoader />}>
                <MapPage />
              </Suspense>
            }
          />
          <Route
            path="sources"
            element={
              <Suspense fallback={<RouteLoader />}>
                <SourcesPage />
              </Suspense>
            }
          />
          <Route
            path="methodology"
            element={
              <Suspense fallback={<RouteLoader />}>
                <MethodologyPage />
              </Suspense>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
