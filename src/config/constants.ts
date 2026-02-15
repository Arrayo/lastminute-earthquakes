export const APP_NAME = "Last Minute Earthquakes";
export const APP_DESCRIPTION =
  "Real-time earthquake data from the last minutes. Browse recent seismic activity worldwide with interactive maps and detailed information.";
export const APP_URL =
  (import.meta.env.VITE_SITE_URL as string | undefined) ??
  "https://lastminute-earthquakes.com";
export const APP_LOCALE = "en_US";
export const APP_TWITTER_HANDLE = "@lmearthquakes";

export const ROUTES = [
  { path: "/", label: "Home", changefreq: "hourly", priority: 1.0 },
  { path: "/map", label: "Map", changefreq: "hourly", priority: 0.9 },
  { path: "/sources", label: "Sources", changefreq: "monthly", priority: 0.6 },
  {
    path: "/methodology",
    label: "Methodology",
    changefreq: "monthly",
    priority: 0.5,
  },
] as const;
