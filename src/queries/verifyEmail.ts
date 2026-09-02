import { API_URL } from "~/utils/apiUrl";

/**
 * Provides the verifyEmail function.
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
