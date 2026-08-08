import { defineConfig } from "@solidjs/start/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  server: {
    // Nitro preset for deploying to Cloudflare Pages (SSR via Pages Functions,
    // not a static export) - outputs to dist/ with a _worker.js, which is what
    // Cloudflare Pages expects as the build output directory.
    preset: "cloudflare-pages"
  },
  vite: {
    plugins: [tailwindcss()]
  },
  middleware: "./src/utils/cookiesMiddleware.ts"
});
