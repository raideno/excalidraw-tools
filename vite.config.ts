import path from "node:path";

import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

import { defineConfig } from "vite";

const BASE_PATH = "/excalidraw-tools/";
const GITHUB_REPOSITORY_URL = "https://github.com/raideno/excalidraw-tools";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    __GITHUB_REPOSITORY_URL__: JSON.stringify(GITHUB_REPOSITORY_URL),
    __BASE_PATH__: JSON.stringify(BASE_PATH),
  },
  base: BASE_PATH,
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
