import { describe, it, expect, vi, beforeEach } from "vitest";
import usgsFixture from "./fixtures/usgs-response.json";

vi.mock("../../tools/snapshot-generator/src/http/fetch-with-retry.ts", () => ({
  fetchWithRetry: vi.fn(),
}));

import { UsgsAdapter } from "../../tools/snapshot-generator/src/sources/usgs-adapter.ts";
import { fetchWithRetry } from "../../tools/snapshot-generator/src/http/fetch-with-retry.ts";

const mockedFetch = vi.mocked(fetchWithRetry);

describe("UsgsAdapter normalization", () => {
  const adapter = new UsgsAdapter("https://fake.usgs.gov/feed.geojson");

  beforeEach(() => {
    mockedFetch.mockReset();
  });

  it("normalizes earthquake features from fixture", async () => {
    mockedFetch.mockResolvedValueOnce(usgsFixture);
    const events = await adapter.fetch(new Date(), new Date());

    expect(events).toHaveLength(2);
  });

  it("filters out non-earthquake features", async () => {
    mockedFetch.mockResolvedValueOnce(usgsFixture);
    const events = await adapter.fetch(new Date(), new Date());

    const ids = events.map((e) => e.eventId);
    expect(ids).not.toContain("us7000abc2");
  });

  it("maps fields correctly for first earthquake", async () => {
    mockedFetch.mockResolvedValueOnce(usgsFixture);
    const events = await adapter.fetch(new Date(), new Date());
    const ev = events[0];

    expect(ev.sourceId).toBe("usgs");
    expect(ev.eventId).toBe("us7000abc1");
    expect(ev.magnitude).toBe(5.2);
    expect(ev.magnitudeType).toBe("mww");
    expect(ev.place).toBe("42km NW of Hualien City, Taiwan");
    expect(ev.latitude).toBe(24.2);
    expect(ev.longitude).toBe(121.4);
    expect(ev.depth).toBe(15.3);
    expect(ev.status).toBe("reviewed");
    expect(ev.tsunami).toBe(false);
    expect(ev.felt).toBe(120);
    expect(ev.alert).toBe("green");
    expect(ev.cdi).toBe(4.5);
    expect(ev.mmi).toBe(5.1);
    expect(ev.significance).toBe(416);
    expect(ev.stationCount).toBe(85);
    expect(ev.rms).toBe(0.42);
    expect(ev.gapDistance).toBe(45);
    expect(ev.url).toBe(
      "https://earthquake.usgs.gov/earthquakes/eventpage/us7000abc1"
    );
  });

  it("converts epoch ms to ISO timestamp", async () => {
    mockedFetch.mockResolvedValueOnce(usgsFixture);
    const events = await adapter.fetch(new Date(), new Date());
    expect(events[0].time).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
  });

  it("maps tsunami flag from number", async () => {
    mockedFetch.mockResolvedValueOnce(usgsFixture);
    const events = await adapter.fetch(new Date(), new Date());

    expect(events[0].tsunami).toBe(false);
    expect(events[1].tsunami).toBe(true);
  });

  it("defaults stationCount to 0 when nst is null", async () => {
    const fixture = structuredClone(usgsFixture);
    fixture.features[0].properties.nst = null;
    mockedFetch.mockResolvedValueOnce(fixture);
    const events = await adapter.fetch(new Date(), new Date());
    expect(events[0].stationCount).toBe(0);
  });

  it("returns empty array for missing features", async () => {
    mockedFetch.mockResolvedValueOnce({});
    const events = await adapter.fetch(new Date(), new Date());
    expect(events).toEqual([]);
  });
});
