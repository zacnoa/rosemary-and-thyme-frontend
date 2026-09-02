import { API_URL } from "~/utils/apiUrl";

/**
 * Provides the requestPasswordReset function.
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
