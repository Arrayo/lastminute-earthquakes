import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "../layouts/MainLayout.tsx";
import { HomePage } from "../pages/HomePage.tsx";
import { MapPage } from "../pages/MapPage.tsx";
import { SourcesPage } from "../pages/SourcesPage.tsx";
import { MethodologyPage } from "../pages/MethodologyPage.tsx";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="map" element={<MapPage />} />
          <Route path="sources" element={<SourcesPage />} />
          <Route path="methodology" element={<MethodologyPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
