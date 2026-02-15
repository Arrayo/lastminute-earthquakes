import { useCallback, useState } from "react";
import { Seo } from "../components/Seo.tsx";
import { useSnapshotContext } from "../components/SnapshotContext.tsx";
import { useUseCases } from "../components/UseCaseContext.tsx";
import { useEventDetail } from "../hooks/useEventDetail.ts";
import { EarthquakeMap } from "../components/EarthquakeMap.tsx";
import { EventDrawer } from "../components/EventDrawer.tsx";
import type { SnapshotEventIndexItem } from "../../domain/models/SnapshotEventIndexItem.ts";

export function MapPage() {
  const { snapshot, loading, error } = useSnapshotContext();
  const { loadEventDetail } = useUseCases();
  const {
    eventDetail,
    loading: detailLoading,
    error: detailError,
    load: loadDetail,
    reset: resetDetail,
  } = useEventDetail(loadEventDetail);

  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  const handleMarkerClick = useCallback(
    (ev: SnapshotEventIndexItem) => {
      setSelectedEventId(ev.id);
      if (ev.detailUrl) {
        loadDetail(ev.detailUrl);
      }
    },
    [loadDetail]
  );

  const handleDrawerClose = useCallback(() => {
    setSelectedEventId(null);
    resetDetail();
  }, [resetDetail]);

  return (
    <section className="page page--map">
      <Seo
        title="Map"
        description="Interactive map showing recent seismic activity worldwide."
        path="/map"
      />

      {loading && <p className="loading">Loading map data…</p>}

      {error && <p className="error">Error: {error}</p>}

      {snapshot && (
        <div className="map-layout">
          <EarthquakeMap
            events={snapshot.events}
            onMarkerClick={handleMarkerClick}
            selectedEventId={selectedEventId}
          />
          <EventDrawer
            detail={eventDetail}
            loading={detailLoading}
            error={detailError}
            onClose={handleDrawerClose}
          />
        </div>
      )}
    </section>
  );
}
