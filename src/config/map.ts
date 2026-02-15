export const TILE_URL =
  import.meta.env.VITE_TILE_URL ??
  "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

export const TILE_ATTRIBUTION =
  import.meta.env.VITE_TILE_ATTRIBUTION ??
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

export const MAP_DEFAULT_CENTER: [number, number] = [20, 0];
export const MAP_DEFAULT_ZOOM = 2;
