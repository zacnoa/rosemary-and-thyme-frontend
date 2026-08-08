import { API_URL } from "~/utils/apiUrl";

export const logoutUser = async () => {
  await fetch(`${API_URL}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
};
