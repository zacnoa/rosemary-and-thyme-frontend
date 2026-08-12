import { query } from "@solidjs/router";
import { getRequestEvent } from "solid-js/web";
import { User } from "~/components/auth/context/authContext";
import { API_URL } from "~/utils/apiUrl";

/**
 * Resolves the current user from the session cookie, server-side only
 * (`"use server"`). Called once per page load from app.tsx's root and fed
 * into AuthProvider.
 *
 * BFF pattern: the browser can't read/send `session_cookie` itself to a
 * cross-origin backend, so this reads it off `event.locals.sessionCookie`
 * (populated per-request by utils/cookiesMiddleware.ts) and forwards it
 * itself as a `cookie:` header on the outgoing server-to-server request.
 *
 * @returns the user, or `null` for both "not logged in" (401/403 - a normal,
 * expected state, not an error) and any unexpected failure (logged instead
 * of thrown, since a broken auth check shouldn't crash the whole page)
 */
export const getUser = query(async () => {
  "use server";
  const event = getRequestEvent();
  const cookie = event?.locals.sessionCookie ?? "";

  const response = await fetch(`${API_URL}/user/aboutme`, {
    method: "GET",
    headers: { "Content-Type": "application/json", cookie: `session_cookie=${cookie}` },
  });

  if (response.status === 401 || response.status === 403) {
    // korisnik nije prijavljen — normalno stanje, ne greška
    return null;
  }

  if (!response.ok) {
    console.error("Auth check failed:", response.status);
    return null
  }

  const json = await response.json();
  return json as User;
}, "user");
