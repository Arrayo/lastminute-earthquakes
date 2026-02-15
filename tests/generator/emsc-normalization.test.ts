import { describe, it, expect, vi, beforeEach } from "vitest";
import emscFixture from "./fixtures/emsc-response.json";

vi.mock("../../tools/snapshot-generator/src/http/fetch-with-retry.ts", () => ({
  fetchWithRetry: vi.fn(),
}));

import { EmscAdapter } from "../../tools/snapshot-generator/src/sources/emsc-adapter.ts";
import { fetchWithRetry } from "../../tools/snapshot-generator/src/http/fetch-with-retry.ts";

const mockedFetch = vi.mocked(fetchWithRetry);

describe("EmscAdapter normalization", () => {
  const adapter = new EmscAdapter("https://fake.emsc.eu/query", null);

  beforeEach(() => {
    mockedFetch.mockReset();
  });

  it("normalizes all features from fixture", async () => {
    mockedFetch.mockResolvedValueOnce(emscFixture);
    const events = await adapter.fetch(new Date(), new Date());
    expect(events).toHaveLength(2);
  });

  it("maps fields correctly for first event", async () => {
    mockedFetch.mockResolvedValueOnce(emscFixture);
    const events = await adapter.fetch(new Date(), new Date());
    const ev = events[0];

    expect(ev.sourceId).toBe("emsc");
    expect(ev.eventId).toBe("20260215_0000254");
    expect(ev.magnitude).toBe(2.8);
    expect(ev.magnitudeType).toBe("m");
    expect(ev.place).toBe("HALMAHERA, INDONESIA");
    expect(ev.latitude).toBe(2.22);
    expect(ev.longitude).toBe(128.04);
    expect(ev.depth).toBe(6.0);
    expect(ev.status).toBe("automatic");
    expect(ev.tsunami).toBe(false);
    expect(ev.url).toContain("20260215_0000254");
  });

  it("converts negative depth to positive", async () => {
    mockedFetch.mockResolvedValueOnce(emscFixture);
    const events = await adapter.fetch(new Date(), new Date());
    expect(events[1].depth).toBe(55.8);
  });

  it("converts time to ISO format", async () => {
    mockedFetch.mockResolvedValueOnce(emscFixture);
    const events = await adapter.fetch(new Date(), new Date());
    expect(events[0].time).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
  });

  it("sets default values for unavailable fields", async () => {
    mockedFetch.mockResolvedValueOnce(emscFixture);
    const events = await adapter.fetch(new Date(), new Date());
    const ev = events[0];

    expect(ev.felt).toBeNull();
    expect(ev.alert).toBeNull();
    expect(ev.cdi).toBeNull();
    expect(ev.mmi).toBeNull();
    expect(ev.significance).toBe(0);
    expect(ev.stationCount).toBe(0);
    expect(ev.rms).toBeNull();
    expect(ev.gapDistance).toBeNull();
  });

  it("builds correct seismicportal url with unid", async () => {
    mockedFetch.mockResolvedValueOnce(emscFixture);
    const events = await adapter.fetch(new Date(), new Date());
    expect(events[0].url).toBe(
      "https://www.seismicportal.eu/eventdetail.html?unid=20260215_0000254"
    );
  });

  it("appends minmagnitude to url when configured", async () => {
    const adapterWithMin = new EmscAdapter("https://fake.emsc.eu/query", 3.0);
    mockedFetch.mockResolvedValueOnce(emscFixture);
    await adapterWithMin.fetch(new Date("2026-01-01"), new Date("2026-01-02"));

    const calledUrl = mockedFetch.mock.calls[0][0];
    expect(calledUrl).toContain("minmagnitude=3");
  });

  it("returns empty array for missing features", async () => {
    mockedFetch.mockResolvedValueOnce({});
    const events = await adapter.fetch(new Date(), new Date());
    expect(events).toEqual([]);
  });
});
