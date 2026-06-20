import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://choidz.github.io",
  integrations: [sitemap()],
  trailingSlash: "never",
});
