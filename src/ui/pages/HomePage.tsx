import { Seo } from "../components/Seo.tsx";
import { JsonLd } from "../components/JsonLd.tsx";
import { useSnapshotContext } from "../components/SnapshotContext.tsx";
import { APP_DESCRIPTION } from "../../config/constants.ts";

function formatRelativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ${minutes % 60}m ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function HomePage() {
  const { snapshot, loading, error } = useSnapshotContext();

  return (
    <section className="page page--home">
      <Seo
        title="Home"
        description={APP_DESCRIPTION}
        path="/"
      />
      <JsonLd page="home" />

      <h1>Recent Earthquakes</h1>

      {loading && <p className="loading">Loading earthquake data…</p>}

      {error && <p className="error">Error: {error}</p>}

      {snapshot && (
        <div className="snapshot-summary">
          <p>
            <strong>{snapshot.count}</strong> earthquakes recorded. Snapshot
            generated at{" "}
            <time dateTime={snapshot.generatedAt}>{snapshot.generatedAt}</time>.
          </p>
          <p>Source: {snapshot.source.name}</p>

          <ul className="earthquake-list">
            {snapshot.events.map((ev) => (
              <li key={ev.id} className="earthquake-list__item">
                <strong>M {ev.magnitude.toFixed(1)}</strong> — {ev.place}
                <span className="earthquake-list__meta">
                  {ev.coordinates.depth.toFixed(1)} km deep ·{" "}
                  {ev.coordinates.latitude.toFixed(2)}°,{" "}
                  {ev.coordinates.longitude.toFixed(2)}°
                </span>
                <time className="earthquake-list__time" dateTime={ev.time}>
                  {formatRelativeTime(ev.time)}
                </time>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
