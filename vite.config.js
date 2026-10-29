import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";
import { getAllSystemApps, getRealStorageUsage } from "./src/server/systemBridge.js";

function systemBridgePlugin() {
  return {
    name: "freight-system-bridge",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = new URL(req.url, "http://localhost");

        if (url.pathname === "/api/system/apps") {
          const manager = url.searchParams.get("manager");
          const reload = url.searchParams.get("reload") === "true";
          const data = getAllSystemApps(reload);
          res.setHeader("Content-Type", "application/json");
          if (manager && data[manager]) {
            res.end(JSON.stringify(data[manager]));
          } else {
            res.end(JSON.stringify(data));
          }
          return;
        }

        if (url.pathname === "/api/system/storage") {
          const storage = getRealStorageUsage();
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(storage));
          return;
        }

        if (url.pathname === "/api/system/icon") {
          const iconPath = url.searchParams.get("path");
          if (iconPath && fs.existsSync(iconPath)) {
            const ext = iconPath.split(".").pop().toLowerCase();
            const mime =
              ext === "svg"
                ? "image/svg+xml"
                : ext === "jpg" || ext === "jpeg"
                ? "image/jpeg"
                : "image/png";
            res.setHeader("Content-Type", mime);
            res.setHeader("Cache-Control", "public, max-age=86400");
            fs.createReadStream(iconPath).pipe(res);
            return;
          }
          res.statusCode = 404;
          res.end("Icon not found");
          return;
        }

        next();
      });
    },
  };
}

const host = process.env.TAURI_DEV_HOST;

// https://vitejs.dev/config/
export default defineConfig(async () => ({
  plugins: [react(), systemBridgePlugin()],

  clearScreen: false,
  server: {
    port: 1420,
    strictPort: true,
    host: host || false,
    hmr: host
      ? {
          protocol: "ws",
          host,
          port: 1421,
        }
      : undefined,
    watch: {
      ignored: ["**/src-tauri/**"],
    },
  },
}));
