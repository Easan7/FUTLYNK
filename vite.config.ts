import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import os from "node:os";
import path from "node:path";
import { defineConfig } from "vite";

const plugins = [react(), tailwindcss()];
const isWsl = /microsoft/i.test(os.release()) || Boolean(process.env.WSL_DISTRO_NAME);

export default defineConfig({
  plugins,
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  envDir: path.resolve(import.meta.dirname),
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    port: 3000,
    strictPort: true,
    host: "127.0.0.1",
    hmr: {
      host: "127.0.0.1",
    },
    watch: isWsl
      ? {
          // WSL projects under /mnt/* can miss FS events without polling.
          usePolling: true,
          interval: 120,
        }
      : undefined,
    allowedHosts: [
      "localhost",
      "127.0.0.1",
    ],
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
