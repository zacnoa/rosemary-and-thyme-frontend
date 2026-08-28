import { API_URL } from "~/utils/apiUrl";

/**
 * Confirms a password reset via `POST /auth/password-reset/confirm` and logs
 * the user in immediately (the response sets the session cookie, after
 * revoking every other existing session for the account - see
 * AuthService.resetPassword on the backend). Called from
 * routes/auth/reset-password.tsx with the token pulled off the emailed
 * link's `?token=` query param.
 *
 * @param token the raw reset token from the emailed link
 * @param newPassword the new plaintext password to set
 * @returns `ok` from the response, plus the parsed error body (`json`) when
 * the token is invalid/expired
 */
export const confirmPasswordReset = async (token: string, newPassword: string) => {
  const result = await fetch(`${API_URL}/auth/password-reset/confirm`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ token, newPassword })
  });

  const json = result.ok ? undefined : await result.json();

  return { ok: result.ok, json };
};
