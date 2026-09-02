import { API_URL } from "~/utils/apiUrl";

/**
 * Provides the cancelAccountDeletion function.
 */
export const cancelAccountDeletion = async () => {
  const result = await fetch(`${API_URL}/user/delete`, {
    method: "DELETE",
    credentials: "include"
  });

  const json = result.ok ? undefined : await result.json();

  return { ok: result.ok, json };
};
