import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";

dotenv.config();

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api/crypto": {
        target: "https://openapi.coinstats.app",
        changeOrigin: true,
        rewrite: (path) =>
          path.replace(/^\/api\/crypto/, "/public/v1/coins?limit=5"),
        headers: {
          "X-API-KEY": process.env.VITE_COINSTATS_API_KEY,
        },
      },
    },
  },
});
