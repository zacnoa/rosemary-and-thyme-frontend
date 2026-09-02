import { API_URL } from "~/utils/apiUrl";

/**
 * Provides the logoutUser function.
 */
export const logoutUser = async () => {
  await fetch(`${API_URL}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
};
