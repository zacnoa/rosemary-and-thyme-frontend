/**
 * Backend base URL - set `VITE_API_URL` at build time (Cloudflare Pages env
 * var for production, `.env` locally) since Vite bakes `import.meta.env.*`
 * into the bundle at build time, not read at request time. Used by every
 * `queries/*` function (both the client-side ones firing straight from the
 * browser, and the `"use server"` ones running on this app's own SSR
 * server - see utils/cookiesMiddleware.ts for why those need to forward the
 * session cookie manually).
 */
export const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080";
