import { API_URL } from "~/utils/apiUrl";

/**
 * Ends the current session via `POST /auth/logout`, which clears the
 * `session_cookie` via a `Set-Cookie` response header (see
 * AuthController.clearSessionCookie on the backend) - nothing to read from
 * the response here, so this resolves to nothing. Callers (e.g.
 * UserModule.tsx) follow this with a full `window.location.href` navigation
 * rather than a soft route change, so the next page load re-resolves
 * queries/getUser.ts and sees the logged-out state - see AuthProvider for why.
 */
export const logoutUser = async () => {
  await fetch(`${API_URL}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
};
