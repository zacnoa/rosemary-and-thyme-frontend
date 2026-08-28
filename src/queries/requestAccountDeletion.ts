import { API_URL } from "~/utils/apiUrl";

/**
 * Schedules the signed-in user's account for deletion 30 days from now, via
 * `POST /user/delete` - see AccountDeletionService on the backend. The
 * account stays fully usable during the grace period; the caller is
 * expected to do a full page reload afterward so queries/getUser.ts picks
 * up the new `deletionRequestedAt` value for the "cancel?" banner.
 */
export const requestAccountDeletion = async () => {
  const result = await fetch(`${API_URL}/user/delete`, {
    method: "POST",
    credentials: "include"
  });

  const json = result.ok ? undefined : await result.json();

  return { ok: result.ok, json };
};
