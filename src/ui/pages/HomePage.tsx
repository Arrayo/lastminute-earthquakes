import { Seo } from "../components/Seo.tsx";
import { JsonLd } from "../components/JsonLd.tsx";
import { useSnapshotContext } from "../components/SnapshotContext.tsx";
import { APP_DESCRIPTION } from "../../config/constants.ts";

export function HomePage() {
  const { snapshot, loading, error } = useSnapshotContext();

  return (
    <section className="page page--home">
      <Seo
        title="Home"
        description={APP_DESCRIPTION}
        path="/"
      />
      <JsonLd />

      <h1>Recent Earthquakes</h1>

      {loading && <p className="loading">Loading earthquake data…</p>}

      {error && <p className="error">Error: {error}</p>}

      {snapshot && (
        <div className="snapshot-summary">
          <p>
            <strong>{snapshot.count}</strong> earthquakes recorded.
            Snapshot generated at{" "}
            <time dateTime={snapshot.generatedAt}>{snapshot.generatedAt}</time>.
          </p>
          <p>Source: {snapshot.source}</p>

          <ul className="earthquake-list">
            {snapshot.earthquakes.map((eq) => (
              <li key={eq.id} className="earthquake-list__item">
                <strong>M {eq.magnitude.toFixed(1)}</strong> — {eq.place}
                <span className="earthquake-list__depth">
                  {eq.depth} km deep
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
