import { createMiddleware } from "@solidjs/start/middleware";
import { getCookie } from "vinxi/http";

/**
 * Runs on every server-side request (registered as `middleware` in
 * app.config.ts). Part of the BFF (Backend-for-Frontend) pattern this app
 * uses for auth: the browser's `session_cookie` is `httpOnly` (see
 * AuthController.createSessionCookie on the backend), so client-side JS can
 * never read it directly - only the browser itself sends it automatically,
 * and only to this SolidStart server (same origin as the page).
 *
 * The actual backend API lives on a *different* origin (API_URL), so when
 * this server makes its own server-to-server fetch calls to it (see
 * queries/getUser.ts, queries/getRecipe.ts), the browser's automatic cookie
 * forwarding doesn't apply - those are plain outgoing HTTP requests from
 * Node/the Cloudflare Worker, not the browser. This middleware is what makes
 * the cookie available to do that manually: it reads it once per request
 * and stashes it on `event.locals.sessionCookie`, which server-only query
 * functions then read and forward themselves via a `cookie:` header.
 */
export default createMiddleware({
  onRequest: [
    (event) => {
      event.locals.sessionCookie = getCookie("session_cookie") ?? "";
    },
  ],
});
