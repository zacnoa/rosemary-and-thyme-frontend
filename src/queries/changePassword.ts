import { API_URL } from "~/utils/apiUrl";

/**
 * Provides the changePassword function.
 */
export const changePassword = async (currentPassword: string, newPassword: string) => {
  const result = await fetch(`${API_URL}/user/password`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ currentPassword, newPassword })
  });

  const json = result.ok ? undefined : await result.json();

  return { ok: result.ok, status: result.status, json };
};
