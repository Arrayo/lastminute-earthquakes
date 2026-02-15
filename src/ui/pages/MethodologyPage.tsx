import { Seo } from "../components/Seo.tsx";

export function MethodologyPage() {
  return (
    <section className="page page--methodology">
      <Seo
        title="Methodology"
        description="Learn how earthquake data is collected, processed, and presented in Last Minute Earthquakes."
        path="/methodology"
      />

      <h1>Methodology</h1>

      <h2>Data Collection</h2>
      <p>
        Earthquake data is periodically fetched from authoritative seismological
        agencies and written to static JSON snapshot files.
      </p>

      <h2>Snapshot Model</h2>
      <p>
        Each snapshot contains a timestamped collection of earthquake events
        including magnitude, location, depth, and source metadata. The UI loads
        the latest snapshot on page load and does not auto-refresh.
      </p>

      <h2>Update Frequency</h2>
      <p>
        Snapshots are regenerated at regular intervals by an external pipeline.
        Users see updated data by performing a full page reload.
      </p>
    </section>
  );
}
