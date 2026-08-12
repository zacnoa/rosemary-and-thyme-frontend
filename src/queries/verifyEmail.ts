import { API_URL } from "~/utils/apiUrl";

/**
 * Confirms an account's email via `POST /auth/verify-email` and logs the
 * user in immediately (the response sets the session cookie - see
 * AuthController.verifyEmail on the backend). Called from
 * routes/auth/verify-email.tsx with the token pulled off the emailed link's
 * `?token=` query param.
 *
 * @param token the raw verification token from the emailed link
 * @returns `ok` from the response, plus the parsed error body (`json`) when
 * the token is invalid/expired
 */
export const verifyEmail = async (token: string) => {
  const result = await fetch(`${API_URL}/auth/verify-email`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ token })
  });

  const json = result.ok ? undefined : await result.json();

  return { ok: result.ok, json };
};
