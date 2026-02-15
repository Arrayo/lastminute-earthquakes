import type { ImpactSummary } from "../../domain/models/ImpactSummary.ts";

interface ImpactBlockProps {
  impact: ImpactSummary;
}

export function ImpactBlock({ impact }: ImpactBlockProps) {
  const hasImpact =
    impact.tsunami ||
    impact.felt !== null ||
    impact.alert !== null ||
    impact.cdi !== null ||
    impact.mmi !== null;

  if (!hasImpact) return null;

  return (
    <div className="impact-block">
      <h3 className="drawer__section-title">Impact</h3>
      <dl className="impact-block__grid">
        {impact.tsunami && (
          <>
            <dt>Tsunami</dt>
            <dd className="impact-block__tsunami">Warning issued</dd>
          </>
        )}
        {impact.alert && (
          <>
            <dt>Alert</dt>
            <dd>
              <span className={`alert-indicator alert-indicator--${impact.alert}`}>
                {impact.alert.charAt(0).toUpperCase() + impact.alert.slice(1)}
              </span>
            </dd>
          </>
        )}
        {impact.felt !== null && (
          <>
            <dt>Felt reports</dt>
            <dd>{impact.felt.toLocaleString()}</dd>
          </>
        )}
        {impact.cdi !== null && (
          <>
            <dt>CDI</dt>
            <dd>{impact.cdi.toFixed(1)}</dd>
          </>
        )}
        {impact.mmi !== null && (
          <>
            <dt>MMI</dt>
            <dd>{impact.mmi.toFixed(1)}</dd>
          </>
        )}
        <dt>Significance</dt>
        <dd>{impact.significance}</dd>
      </dl>
    </div>
  );
}
