import { API_URL } from "~/utils/apiUrl";

/**
 * Changes the signed-in user's password via `PUT /user/password` (current +
 * new password, no email round trip). On success the backend revokes every
 * other session for the account and sets a fresh session cookie for this
 * one - see AuthService.changePassword on the backend.
 *
 * @param currentPassword checked against the stored password server-side
 * @param newPassword the new plaintext password to set
 * @returns `ok`/`status` from the response, plus the parsed error body
 * (`json`) when the change failed - `status === 422` specifically means this
 * is a Google-only account with no password to change (see
 * GoogleAccountException on the backend)
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
