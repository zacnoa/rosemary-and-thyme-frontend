import { API_URL } from "~/utils/apiUrl";

/**
 * Provides the confirmPasswordReset function.
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
