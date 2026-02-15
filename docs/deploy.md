# Deployment Guide

## Hosting Options (No Credit Card Required)

### Cloudflare Pages (Recommended)

Cloudflare Pages offers unlimited bandwidth, 500 builds per month, and global CDN distribution on the free tier. It is the best option for a static site like this.

1. Push the repository to GitHub.
2. Go to [Cloudflare Pages](https://pages.cloudflare.com/) and create a new project.
3. Connect the GitHub repository.
4. Set the build configuration:
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Node.js version:** `20`
5. Add environment variables (optional):
   - `VITE_SITE_URL` — your production URL (e.g. `https://earthquakes.example.com`)
6. Deploy.

Cloudflare Pages automatically rebuilds on every push to the main branch. The snapshot generation workflow commits updated data to the repo, which triggers a new deployment automatically.

### GitHub Pages (Fallback)

GitHub Pages works but has limitations: 1 GB storage, 100 GB bandwidth per month, and 10 builds per hour. Suitable for low-traffic deployments.

1. In the repository settings, enable GitHub Pages from the `gh-pages` branch or use GitHub Actions.
2. Add a workflow or update the existing build to deploy `dist/` to GitHub Pages.
3. Set `VITE_SITE_URL` to `https://<username>.github.io/<repo>` in your build environment.
4. If deploying to a subpath, also set the Vite `base` option in `vite.config.ts`:

```ts
export default defineConfig({
  base: "/<repo>/",
  // ...rest of config
});
```

**Limitations to consider:**

- GitHub Pages does not support server-side redirects. SPA routing requires a `404.html` that mirrors `index.html`.
- The snapshot workflow commits every 5 minutes; combined with a Pages build on each push, you may hit the 10 builds/hour limit. Consider reducing snapshot frequency to every 10–15 minutes.

### Other Free Options

| Platform | Free Tier Highlights |
|---|---|
| Vercel | 100 GB bandwidth, 6000 build minutes/month |
| Netlify | 100 GB bandwidth, 300 build minutes/month |
| Render | Static sites free, 100 GB bandwidth |

All support the same build configuration: `npm run build` with `dist` as the output directory.

## Setting the Base URL for Canonical Tags

The base URL used for canonical tags, OpenGraph URLs, `sitemap.xml`, and `robots.txt` is controlled by the `VITE_SITE_URL` environment variable.

**Default:** `https://lastminute-earthquakes.com`

Set it in your hosting platform's environment variables:

```
VITE_SITE_URL=https://your-domain.com
```

This affects:

- `<link rel="canonical">` on every page
- `og:url` and `og:image` meta tags
- JSON-LD structured data
- `sitemap.xml` (generated at build time by a Vite plugin)
- `robots.txt` Sitemap directive

The sitemap and robots.txt are generated dynamically during `npm run build`, so the environment variable must be set at build time.

## Snapshot Generation

### How It Works

The snapshot generator is a Node.js CLI tool located at `tools/snapshot-generator/`. It fetches earthquake data from two sources:

- **USGS** — GeoJSON feed of recent earthquakes
- **EMSC / SeismicPortal** — FDSN WS-Event JSON endpoint

The tool normalizes events from both sources, matches duplicates using time/distance/magnitude thresholds, merges them into unified events with quality scores, and writes static JSON files:

```
public/data/
  latest.json                          → points to the current snapshot
  snapshots/{timestamp}/
    snapshot.json                      → index of all events
    events/{globalId}.json             → detail for each event
```

### Automated Generation (GitHub Actions)

The `.github/workflows/snapshots.yml` workflow runs every 5 minutes via cron and on manual dispatch. It:

1. Checks out the repo.
2. Skips if the last commit message contains `[snapshots]` (prevents infinite loops).
3. Installs dependencies and runs `npm run snapshots:generate`.
4. Commits and pushes changes under `public/data/` using a bot identity.

The commit triggers a new deployment on Cloudflare Pages or any other CI/CD-connected hosting.

### Manual Generation

```bash
npm run snapshots:generate
```

Options:

| Flag | Default | Description |
|---|---|---|
| `-w, --window-minutes` | `120` | Time window to fetch events for |
| `-m, --min-magnitude` | none | Minimum magnitude filter |
| `-o, --output-dir` | `public/data` | Output directory |

Environment variables for source URLs:

| Variable | Default |
|---|---|
| `USGS_FEED_URL` | `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson` |
| `EMSC_BASE_URL` | `https://www.seismicportal.eu/fdsnws/event/1/query` |

## Running Locally

### Prerequisites

- Node.js >= 20
- npm or pnpm

### Setup

```bash
git clone <repo-url>
cd last-minute-earthquakes
npm install
```

### Generate Initial Data

```bash
npm run snapshots:generate
```

### Start Development Server

```bash
npm start
```

The app runs at `http://localhost:5173` by default.

### Quality Gates

```bash
npm run typecheck    # TypeScript type checking
npm run lint         # ESLint
npm run test         # Vitest (60 tests)
npm run ci           # All of the above, sequentially
```

### Production Build

```bash
npm run build
npm run preview      # Preview the built site locally
```

The build output is in `dist/`. It includes dynamically generated `sitemap.xml` and `robots.txt` using the `VITE_SITE_URL` environment variable.
