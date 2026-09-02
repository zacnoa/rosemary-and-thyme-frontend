import { UUID } from "~/model/types/UUID";
import { API_URL } from "~/utils/apiUrl";

/**
 * Provides the setRecipePrivate function.
 */
export const setRecipePrivate = async (id: UUID, isPrivate: boolean): Promise<boolean> => {
  const result = await fetch(`${API_URL}/recipe/${id}/private`, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ isPrivate }),
  });

  return result.ok;
};
