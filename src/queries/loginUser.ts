import { API_URL } from "~/utils/apiUrl";

/**
 * Logs in via `POST /auth/login`, called directly from the browser (unlike
 * queries/getUser.ts and queries/getRecipe.ts, which run server-side).
 * That's fine here: this always runs in response to a user action already
 * happening client-side (the login form submitting), so there's no need to
 * forward the session cookie manually the way the BFF-style server queries
 * do - `credentials: "include"` is enough for the browser to store the
 * `Set-Cookie` response itself. Requires the backend's CORS config to allow
 * the frontend's origin with credentials (see SecurityConfig on the
 * backend), since this is a cross-origin request.
 *
 * @param email the account's email
 * @param password the account's plaintext password
 * @returns `ok`/`status` from the response, plus the parsed error body
 * (`json`) when the login failed - `json` is `undefined` on success since
 * the endpoint returns an empty body and sets the cookie via a header instead
 */
export const loginUser = async (email: string, password: string) => {
  const result = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, password })
  });

  const json = result.ok ? undefined : await result.json();

  return { ok: result.ok, status: result.status, json };
};
