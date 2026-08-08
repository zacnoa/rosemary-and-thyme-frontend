// Backend base URL - set VITE_API_URL at build time (Cloudflare Pages env var
// for production, .env locally) since it's baked in by Vite at build time,
// not read at request time.
export const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080";
