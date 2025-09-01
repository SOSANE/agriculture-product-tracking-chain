import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return {
    plugins: [react()],
    server: {
      proxy:
        process.env.PROXY === "true"
          ? {
              "/api": "http://localhost:5000",
              "/auth": "http://localhost:5000",
            }
          : undefined,
    },
  };
});
