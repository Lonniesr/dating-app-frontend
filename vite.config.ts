import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  plugins: [
    react(),

    visualizer({
  filename: "stats.html",
  open: true,
  gzipSize: true,
  brotliSize: true,
}),

    VitePWA({
      registerType: "autoUpdate",

      includeAssets: [
        "favicon.ico",
        "apple-touch-icon.png",
        "masked-icon.svg",
      ],

      manifest: {
        name: "LynQ Dating",
        short_name: "LynQ",
        description:
          "Invite-only location-based dating community.",

        theme_color: "#0f172a",
        background_color: "#0f172a",

        display: "standalone",
        orientation: "portrait",
        scope: "/",
        start_url: "/",

        icons: [
          {
            src: "/icons/icon-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/icons/icon-512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "/icons/icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },

      workbox: {
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,
      },
    }),
  ],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  build: {
    sourcemap: false,

    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (
              id.includes("react") ||
              id.includes("react-dom") ||
              id.includes("react-router")
            ) {
              return "react";
            }

            if (id.includes("@tanstack")) {
              return "query";
            }

            if (id.includes("firebase")) {
              return "firebase";
            }

            if (id.includes("socket.io")) {
              return "socket";
            }

            if (
              id.includes("chart.js") ||
              id.includes("react-chartjs-2") ||
              id.includes("recharts")
            ) {
              return "charts";
            }

            if (
              id.includes("framer-motion") ||
              id.includes("@react-spring")
            ) {
              return "animation";
            }

            

            return "vendor";
          }
        },
      },
    },
  },

  server: {
    proxy: {
      "/api": {
        target: "http://127.0.0.1:10000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});