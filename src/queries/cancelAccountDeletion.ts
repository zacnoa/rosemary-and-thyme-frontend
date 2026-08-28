import { API_URL } from "~/utils/apiUrl";

/**
 * Cancels a pending account deletion via `DELETE /user/delete` - the "undo"
 * for queries/requestAccountDeletion.ts, usable any time within the 30-day
 * grace period. No-ops (still `ok: true`) if none was pending.
 */
export const cancelAccountDeletion = async () => {
  const result = await fetch(`${API_URL}/user/delete`, {
    method: "DELETE",
    credentials: "include"
  });

  const json = result.ok ? undefined : await result.json();

  return { ok: result.ok, json };
};
