import { API_URL } from "~/utils/apiUrl";

/**
 * Provides the requestAccountDeletion function.
 */
export const requestAccountDeletion = async () => {
  const result = await fetch(`${API_URL}/user/delete`, {
    method: "POST",
    credentials: "include"
  });

  const json = result.ok ? undefined : await result.json();

  return { ok: result.ok, json };
};
