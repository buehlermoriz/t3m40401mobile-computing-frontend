import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: "prompt",
      includeAssets: ["favicon.ico"],
      manifest: {
        name: "Kalenderio",
        short_name: "Kalenderio",
        display: "standalone",
        description: "Ihr Planungstool bei der Arbeit",
        theme_color: "#034875",
        start_url: "/",
        icons: [
          {
            src: "/icons/apple-touch-icon.png",
            sizes: "180x180",
            type: "image/png",
          },
          {
            src: "/icons/icon-57.png",
            sizes: "57x57",
            type: "image/png",
          },
          {
            src: "/icons/icon-60.png",
            sizes: "60x60",
            type: "image/png",
          },
          {
            src: "/icons/icon-114.png",
            sizes: "114x114",
            type: "image/png",
          },
          {
            src: "/icons/icon-120.png",
            sizes: "120x120",
            type: "image/png",
          },
          {
            src: "/icons/icon-180.png",
            sizes: "180x180",
            type: "image/png",
          },
          {
            src: "/icons/icon-1024.png",
            sizes: "1024x1024",
            type: "image/png",
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
