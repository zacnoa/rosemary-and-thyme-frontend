import { API_URL } from "~/utils/apiUrl";

/**
 * Re-sends a verification email via `POST /auth/verify-email/resend`.
 * Always resolves `ok: true` regardless of whether the email is registered
 * or already verified - see EmailVerificationService.resend on the backend
 * for why (avoids leaking which emails are registered). Rate-limited
 * server-side per email, not surfaced here as a distinct error case.
 *
 * @param email the account's email to resend a verification link to
 */
export const resendVerificationEmail = async (email: string) => {
  const result = await fetch(`${API_URL}/auth/verify-email/resend`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email })
  });

  return { ok: result.ok };
};
