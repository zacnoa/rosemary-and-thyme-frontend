import { createMiddleware } from "@solidjs/start/middleware";
import { getCookie } from "vinxi/http";

export default createMiddleware({
  onRequest: [
    (event) => {
      event.locals.sessionCookie = getCookie("session_cookie") ?? "";
    },
  ],
});
