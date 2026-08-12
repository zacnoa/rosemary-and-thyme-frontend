import { API_URL } from "~/utils/apiUrl";

/**
 * Registers a new account via `POST /auth/register`. Runs client-side - see
 * queries/loginUser.ts for why that's fine here. Does not log the account
 * in (no session cookie is set by this endpoint - see AuthController on the
 * backend): the account stays unusable until the emailed verification link
 * is clicked, handled by queries/verifyEmail.ts.
 *
 * @param username the display name for the new account
 * @param email must be unique; receives the verification link
 * @param password plaintext password, hashed server-side before storage
 * @returns `ok` from the response, plus the parsed error body (`json`) when
 * registration failed (e.g. email already taken)
 */
export const registerUser = async (username: string, email: string, password: string) => {
  const result = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ username, email, password })
  });

  const json = result.ok ? undefined : await result.json();

  return { ok: result.ok, json };
};
