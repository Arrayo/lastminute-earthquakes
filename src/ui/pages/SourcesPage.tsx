import { Seo } from "../components/Seo.tsx";

export function SourcesPage() {
  return (
    <section className="page page--sources">
      <Seo
        title="Sources"
        description="Data sources used to compile earthquake information, including USGS and other seismological agencies."
        path="/sources"
      />

      <h1>Data Sources</h1>

      <ul>
        <li>
          <a
            href="https://earthquake.usgs.gov/"
            target="_blank"
            rel="noopener noreferrer"
          >
            USGS Earthquake Hazards Program
          </a>
        </li>
        <li>
          <a
            href="https://www.emsc-csem.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            European-Mediterranean Seismological Centre (EMSC)
          </a>
        </li>
      </ul>

      <p>
        All data is aggregated from publicly available seismological feeds and
        processed into snapshot files for static delivery.
      </p>
    </section>
  );
}
