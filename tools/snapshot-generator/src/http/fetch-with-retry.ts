const MAX_ATTEMPTS = 3;
const BASE_DELAY_MS = 1000;

export async function fetchWithRetry(url: string): Promise<unknown> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    try {
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText} — ${url}`);
      }
      return (await res.json()) as unknown;
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      if (attempt < MAX_ATTEMPTS - 1) {
        const delay = BASE_DELAY_MS * Math.pow(2, attempt);
        await sleep(delay);
      }
    }
  }

  throw lastError ?? new Error(`Failed to fetch ${url}`);
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
