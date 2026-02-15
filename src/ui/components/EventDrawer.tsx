import { useEffect } from "react";
import type { EventDetail } from "../../domain/models/EventDetail.ts";
import { QualityBadge } from "./QualityBadge.tsx";
import { ImpactBlock } from "./ImpactBlock.tsx";
import { useFocusTrap } from "../hooks/useFocusTrap.ts";

interface EventDrawerProps {
  detail: EventDetail | null;
  loading: boolean;
  error: string | null;
  onClose: () => void;
}

export function EventDrawer({
  detail,
  loading,
  error,
  onClose,
}: EventDrawerProps) {
  const isOpen = loading || error !== null || detail !== null;
  const drawerRef = useFocusTrap<HTMLElement>(isOpen);

  useEffect(() => {
    if (!isOpen) return;

    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  return (
    <aside
      ref={drawerRef}
      className={`event-drawer${isOpen ? " event-drawer--open" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label="Event detail"
      aria-hidden={!isOpen}
    >
      <div className="event-drawer__header">
        <h2 className="event-drawer__title">Event Detail</h2>
        <button
          className="event-drawer__close"
          type="button"
          onClick={onClose}
          aria-label="Close detail panel"
        >
          ✕
        </button>
      </div>

      <div className="event-drawer__body">
        {loading && <p className="loading">Loading detail…</p>}

        {error && <p className="error">{error}</p>}

        {detail && (
          <>
            <div className="event-drawer__hero">
              <span className="event-drawer__magnitude">
                M {detail.magnitude.toFixed(1)}
              </span>
              <span className="event-drawer__mag-type">
                {detail.magnitudeType.toUpperCase()}
              </span>
            </div>

            <h3 className="event-drawer__place">{detail.place}</h3>

            <dl className="event-drawer__meta">
              <dt>Depth</dt>
              <dd>{detail.coordinates.depth} km</dd>
              <dt>Time (UTC)</dt>
              <dd>
                <time dateTime={detail.time}>
                  {new Date(detail.time).toUTCString()}
                </time>
              </dd>
              <dt>Updated</dt>
              <dd>
                <time dateTime={detail.updatedAt}>
                  {new Date(detail.updatedAt).toUTCString()}
                </time>
              </dd>
            </dl>

            <div className="event-drawer__section">
              <h3 className="drawer__section-title">Best Source</h3>
              <p className="event-drawer__source-name">{detail.source.name}</p>
              <p className="event-drawer__source-attr">
                {detail.source.attribution}
              </p>
            </div>

            <div className="event-drawer__section">
              <h3 className="drawer__section-title">Data Quality</h3>
              <QualityBadge quality={detail.quality} />
              <dl className="event-drawer__quality-details">
                <dt>Status</dt>
                <dd>{detail.quality.status}</dd>
                <dt>Stations</dt>
                <dd>{detail.quality.stationCount}</dd>
                {detail.quality.rms !== null && (
                  <>
                    <dt>RMS</dt>
                    <dd>{detail.quality.rms.toFixed(2)}</dd>
                  </>
                )}
                {detail.quality.gapDistance !== null && (
                  <>
                    <dt>Gap</dt>
                    <dd>{detail.quality.gapDistance.toFixed(1)}°</dd>
                  </>
                )}
              </dl>
            </div>

            <ImpactBlock impact={detail.impact} />

            <div className="event-drawer__section">
              <h3 className="drawer__section-title">Sources</h3>
              <ul className="event-drawer__sources-list">
                <li>
                  <a
                    href={detail.source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {detail.source.name}
                  </a>
                </li>
                <li>
                  <a
                    href={detail.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Event page
                  </a>
                </li>
              </ul>
            </div>
          </>
        )}
      </div>
    </aside>
  );
}
