import { API_URL } from "~/utils/apiUrl";

/**
 * Starts the "forgot password" flow via `POST /auth/password-reset/request`.
 * Always resolves `ok: true` regardless of whether the email is registered,
 * unverified, or a Google-only account - see PasswordResetService.requestReset
 * on the backend for why (avoids leaking which emails are registered or how
 * they sign in). Rate-limited server-side per email, not surfaced here as a
 * distinct error case.
 *
 * @param email the account's email to send a reset link to
 */
export const requestPasswordReset = async (email: string) => {
  const result = await fetch(`${API_URL}/auth/password-reset/request`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email })
  });

  return { ok: result.ok };
};
