import { query } from "@solidjs/router";
import { getRequestEvent } from "solid-js/web";
import { User } from "~/components/auth/context/authContext";
import { API_URL } from "~/utils/apiUrl";

/**
 * Provides the getUser function.
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
    //user not logged in, normal bahaviour not an error
    return null;
  }

  if (!response.ok) {
    console.error("Auth check failed:", response.status);
    return null
  }

  const json = await response.json();
  return json as User;
}, "user");
