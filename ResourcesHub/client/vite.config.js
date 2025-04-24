import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
        configure: (proxy, _options) => {
          proxy.on("error", (err, _req, _res) => {
            console.log("proxy error", err);
            // Try fallback port when primary port fails
            proxy.web(_req, _res, {
              target: "http://localhost:3001",
            });
          });
          proxy.on("proxyReq", (proxyReq, req, _res) => {
            console.log("Sending Request:", req.method, req.url);
          });
          proxy.on("proxyRes", (proxyRes, req, _res) => {
            console.log(
              "Received Response from:",
              req.url,
              proxyRes.statusCode
            );
          });
        },
      },
    },
    cors: true,
  },
  assetsInclude: ["**/*.csv"], // Add this line to treat CSV files as assets
});
