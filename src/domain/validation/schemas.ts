import { z } from "zod";

export const CoordinatesSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  depth: z.number(),
});

export const SourceSnapshotSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  url: z.string().url(),
  attribution: z.string(),
});

export const DataQualitySchema = z.object({
  status: z.enum(["reviewed", "automatic", "deleted"]),
  gapDistance: z.number().nullable(),
  rms: z.number().nullable(),
  stationCount: z.number().int().min(0),
});

export const ImpactSummarySchema = z.object({
  tsunami: z.boolean(),
  felt: z.number().int().nullable(),
  alert: z.enum(["green", "yellow", "orange", "red"]).nullable(),
  cdi: z.number().nullable(),
  mmi: z.number().nullable(),
  significance: z.number().int().min(0),
});

export const SnapshotEventIndexItemSchema = z.object({
  id: z.string().min(1),
  magnitude: z.number(),
  place: z.string(),
  coordinates: CoordinatesSchema,
  time: z.string().datetime(),
  updatedAt: z.string().datetime(),
  detailUrl: z.string().nullable(),
});

export const BBoxSchema = z.tuple([
  z.number(),
  z.number(),
  z.number(),
  z.number(),
  z.number(),
  z.number(),
]);

export const LatestManifestSchema = z.object({
  schemaVersion: z.number().int().positive(),
  generatedAt: z.string().datetime(),
  snapshot: z.string().min(1),
});

export const SnapshotIndexSchema = z.object({
  schemaVersion: z.number().int().positive(),
  generatedAt: z.string().datetime(),
  source: SourceSnapshotSchema,
  bbox: BBoxSchema.nullable(),
  count: z.number().int().min(0),
  events: z.array(SnapshotEventIndexItemSchema),
});

export const EventDetailSchema = z.object({
  schemaVersion: z.literal(2),
  id: z.string().min(1),
  magnitude: z.number(),
  magnitudeType: z.string().min(1),
  place: z.string(),
  coordinates: CoordinatesSchema,
  time: z.string().datetime(),
  updatedAt: z.string().datetime(),
  source: SourceSnapshotSchema,
  impact: ImpactSummarySchema,
  quality: DataQualitySchema,
  url: z.string().url(),
});
