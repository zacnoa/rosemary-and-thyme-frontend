import { createMiddleware } from "@solidjs/start/middleware";
import { getCookie } from "vinxi/http";

/**
 * Runs on every server-side request (registered as `middleware` in app.config.ts).
 */
export default createMiddleware({
  onRequest: [
    (event) => {
      event.locals.sessionCookie = getCookie("session_cookie") ?? "";
    },
  ],
});
