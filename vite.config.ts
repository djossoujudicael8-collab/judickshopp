import path from "path";
const __dirname = import.meta.dirname;
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// Configuration Vite pour JUDICKSHOP
// Note : le plugin kimi-plugin-inspect-react a été retiré (spécifique à la plateforme Kimi)
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      // En développement local, redirige les appels API vers le serveur Node
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@contracts": path.resolve(__dirname, "./contracts"),
      "@db": path.resolve(__dirname, "./db"),
      db: path.resolve(__dirname, "./db"),
    },
  },
  envDir: path.resolve(__dirname),
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true,
  },
});
