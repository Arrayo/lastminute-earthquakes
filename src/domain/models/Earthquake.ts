export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface Earthquake {
  id: string;
  magnitude: number;
  place: string;
  coordinates: Coordinates;
  depth: number;
  time: number;
  url: string;
}
