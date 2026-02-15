import { Seo } from "../components/Seo.tsx";
import { useSnapshotContext } from "../components/SnapshotContext.tsx";

export function MapPage() {
  const { snapshot, loading, error } = useSnapshotContext();

  return (
    <section className="page page--map">
      <Seo
        title="Map"
        description="Interactive map showing recent seismic activity worldwide."
        path="/map"
      />

      <h1>Earthquake Map</h1>

      {loading && <p className="loading">Loading map data…</p>}

      {error && <p className="error">Error: {error}</p>}

      {snapshot && (
        <div className="map-placeholder">
          <p>
            Map visualization placeholder — {snapshot.count} earthquakes
            available.
          </p>
        </div>
      )}
    </section>
  );
}
