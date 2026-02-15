import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { SnapshotEventIndexItem } from "../../domain/models/SnapshotEventIndexItem.ts";
import {
  magnitudeColor,
  magnitudeRadius,
} from "../../domain/services/magnitudeColor.ts";
import {
  TILE_URL,
  TILE_ATTRIBUTION,
  MAP_DEFAULT_CENTER,
  MAP_DEFAULT_ZOOM,
} from "../../config/map.ts";

interface EarthquakeMapProps {
  events: SnapshotEventIndexItem[];
  onMarkerClick: (event: SnapshotEventIndexItem) => void;
  selectedEventId: string | null;
}

export function EarthquakeMap({
  events,
  onMarkerClick,
  selectedEventId,
}: EarthquakeMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.CircleMarker[]>([]);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: MAP_DEFAULT_CENTER,
      zoom: MAP_DEFAULT_ZOOM,
      zoomControl: true,
      attributionControl: true,
    });

    L.tileLayer(TILE_URL, { attribution: TILE_ATTRIBUTION }).addTo(map);
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    events.forEach((ev) => {
      const color = magnitudeColor(ev.magnitude);
      const radius = magnitudeRadius(ev.magnitude);
      const isSelected = ev.id === selectedEventId;

      const marker = L.circleMarker(
        [ev.coordinates.latitude, ev.coordinates.longitude],
        {
          radius,
          fillColor: color,
          color: isSelected ? "#ffffff" : color,
          weight: isSelected ? 3 : 1,
          opacity: 0.9,
          fillOpacity: 0.6,
        }
      );

      marker.bindTooltip(
        `M ${ev.magnitude.toFixed(1)} — ${ev.place}`,
        { direction: "top", offset: [0, -radius] }
      );

      marker.on("click", () => onMarkerClick(ev));
      marker.addTo(map);
      markersRef.current.push(marker);
    });
  }, [events, onMarkerClick, selectedEventId]);

  return (
    <div
      ref={containerRef}
      className="earthquake-map"
      role="application"
      aria-label="Earthquake map"
    />
  );
}
