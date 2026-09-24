import { createMiddleware } from "@solidjs/start/middleware";
import { getCookie } from "@solidjs/start/http";
import { getRequestEvent } from "solid-js/web";

/** Runs on every server-side request (registered in vite.config.ts). */
export default createMiddleware([
  (event) => {
    // SolidStart decorates H3 middleware with its request context, so values
    // assigned here remain available to SSR queries through getRequestEvent().
    const requestEvent = getRequestEvent();
    if (requestEvent) {
      requestEvent.locals.sessionCookie = getCookie(event, "session_cookie") ?? "";
    }
  },
]);
