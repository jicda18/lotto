// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import node from "@astrojs/node";
import sitemap from "@astrojs/sitemap";
import ResultSiteMap from "./integrations/ResultSiteMap";

const site = "https://lotto.local";
const resultSitemap = `sitemap-results.xml`;

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
  site,
  adapter: node({
    mode: "standalone",
  }),

  integrations: [
    ResultSiteMap(resultSitemap),
    sitemap({
      customSitemaps: [`${site}/${resultSitemap}`],
    }),
  ],
});
