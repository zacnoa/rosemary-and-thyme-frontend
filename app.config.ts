import { defineConfig } from "@solidjs/start/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  server: {
    // Nitro preset for Cloudflare's unified Workers (+ static assets) deploy
    // model - the dashboard's "Deployment command" field expects a plain
    // `wrangler deploy`, which reads the generated wrangler.jsonc, rather than
    // the classic `wrangler pages deploy <dir>` the cloudflare-pages preset targets.
    preset: "cloudflare-module"
  },
  vite: {
    plugins: [tailwindcss()]
  },
  middleware: "./src/utils/cookiesMiddleware.ts"
});
