import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { writeFileSync } from "fs";
import type { Plugin } from "vite";

const SITE_URL =
  process.env.VITE_SITE_URL ?? "https://lastminute-earthquakes.com";

const ROUTES = [
  { path: "/", changefreq: "hourly", priority: "1.0" },
  { path: "/map", changefreq: "hourly", priority: "0.9" },
  { path: "/sources", changefreq: "monthly", priority: "0.6" },
  { path: "/methodology", changefreq: "monthly", priority: "0.5" },
];

function generateSeoFiles(): Plugin {
  return {
    name: "generate-seo-files",
    closeBundle() {
      const sitemap = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        ...ROUTES.map(
          (r) =>
            `  <url>\n    <loc>${SITE_URL}${r.path}</loc>\n    <changefreq>${r.changefreq}</changefreq>\n    <priority>${r.priority}</priority>\n  </url>`
        ),
        "</urlset>",
        "",
      ].join("\n");

      const robots = [
        "User-agent: *",
        "Allow: /",
        "",
        `Sitemap: ${SITE_URL}/sitemap.xml`,
        "",
      ].join("\n");

      writeFileSync(resolve("dist", "sitemap.xml"), sitemap, "utf-8");
      writeFileSync(resolve("dist", "robots.txt"), robots, "utf-8");
    },
  };
}

export default defineConfig({
  plugins: [react(), generateSeoFiles()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  build: {
    sourcemap: true,
  },
});
