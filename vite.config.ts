import { defineConfig, loadEnv } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => {
  // Load environment variables from .env files
  const env = loadEnv(mode, process.cwd(), "");

  return {
    // Dev server settings (important for Firebase Studio Preview)
    server: {
      host: true,
      port: 5174,
    },
    preview: {
      host: true,
      port: 4173,
    },

    // Path alias (so you can use "@/components/...")
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./"),
      },
    },
  };
});
