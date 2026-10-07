import { defineConfig } from "vite";

export default defineConfig({
  // Relative paths support GitHub Pages and other hosts mounted below a subdirectory.
  base: "./",
  build: {
    assetsInlineLimit: 0,
  },
});
