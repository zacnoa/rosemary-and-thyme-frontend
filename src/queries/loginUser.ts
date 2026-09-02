import { API_URL } from "~/utils/apiUrl";

/**
 * Provides the loginUser function.
 */
export const loginUser = async (email: string, password: string) => {
  const result = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, password })
  });

  const json = result.ok ? undefined : await result.json();

  return { ok: result.ok, status: result.status, json };
};
