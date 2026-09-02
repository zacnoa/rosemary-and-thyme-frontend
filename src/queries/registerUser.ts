import { API_URL } from "~/utils/apiUrl";

/**
 * Provides the registerUser function.
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
